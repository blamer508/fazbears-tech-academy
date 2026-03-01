import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { GoogleGenAI } from "@google/genai";

interface Comment {
  id: string;
  username: string;
  avatarUrl: string | null;
  text: string;
  timestamp: number;
  replyTo?: string;
}

interface UserProfile {
  username: string;
  avatarUrl: string | null;
  description?: string;
  password?: string;
  maxUnlockedNight?: number;
  highScores?: Record<string, number>;
}

interface PrivateMessage {
  id: string;
  from: string;
  to: string;
  text: string;
  timestamp: number;
}

interface FriendRequest {
  from: string;
  to: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const STORAGE_DIR = path.join(process.cwd(), "storage");
const COMMENTS_FILE = path.join(STORAGE_DIR, "comments.json");
const USERS_FILE = path.join(STORAGE_DIR, "users.json");
const MESSAGES_FILE = path.join(STORAGE_DIR, "messages.json");
const REQUESTS_FILE = path.join(STORAGE_DIR, "requests.json");
const BANS_FILE = path.join(STORAGE_DIR, "bans.json");

const BAD_WORDS = ["fuck", "shit", "ass", "bitch", "cunt", "dick", "pussy", "nigger", "faggot"];
const DEVS = ["blamer_508", "ellieblockman"];

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Ensure storage directory exists
  try {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  } catch (e) {}

  let comments: Comment[] = [];
  let users: Record<string, UserProfile> = {};
  let messages: PrivateMessage[] = [];
  let requests: FriendRequest[] = [];
  let userViolations: Record<string, number> = {};
  let bannedUsers: Record<string, number> = {}; // username -> expiration timestamp

  const loadData = async () => {
    try {
      const cData = await fs.readFile(COMMENTS_FILE, "utf-8");
      comments = JSON.parse(cData);
    } catch (e) {}
    try {
      const uData = await fs.readFile(USERS_FILE, "utf-8");
      users = JSON.parse(uData);
    } catch (e) {}
    try {
      const mData = await fs.readFile(MESSAGES_FILE, "utf-8");
      messages = JSON.parse(mData);
    } catch (e) {}
    try {
      const rData = await fs.readFile(REQUESTS_FILE, "utf-8");
      requests = JSON.parse(rData);
    } catch (e) {}
    try {
      const bData = await fs.readFile(BANS_FILE, "utf-8");
      const bans = JSON.parse(bData);
      bannedUsers = bans.banned || {};
      userViolations = bans.violations || {};
    } catch (e) {}
  };

  const saveData = async () => {
    if (process.env.VERCEL) return; // Skip saving on Vercel
    try {
      await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2));
      await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
      await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
      await fs.writeFile(REQUESTS_FILE, JSON.stringify(requests, null, 2));
      await fs.writeFile(BANS_FILE, JSON.stringify({ 
        banned: bannedUsers,
        violations: userViolations
      }, null, 2));
    } catch (e) {
      console.error("Failed to save data:", e);
    }
  };

  const isBanned = (username: string) => {
    if (!bannedUsers[username]) return false;
    if (Date.now() > bannedUsers[username]) {
      delete bannedUsers[username];
      userViolations[username] = 0; // Reset violations after ban expires
      saveData();
      return false;
    }
    return true;
  };

  const censorText = (text: string, username: string) => {
    let censored = text;
    let foundBadWord = false;
    
    BAD_WORDS.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      if (regex.test(censored)) {
        foundBadWord = true;
        censored = censored.replace(regex, "****");
      }
    });

    if (foundBadWord && !DEVS.includes(username)) {
      userViolations[username] = (userViolations[username] || 0) + 1;
      if (userViolations[username] >= 10) {
        const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
        bannedUsers[username] = Date.now() + ONE_WEEK;
      }
      saveData(); // Persist the new violation/ban
    }

    return censored;
  };

  await loadData();

  const socketToUser = new Map<string, string | null>();

  io.on("connection", (socket) => {
    socketToUser.set(socket.id, null);
    
    console.log("User connected:", socket.id);
    
    socket.emit("init_comments", comments);

    socket.on("register_user", async (profile: UserProfile) => {
      socketToUser.set(socket.id, profile.username);
      if (users[profile.username]) {
        // Merge data, prioritizing server data but allowing client to update if server is fresh
        users[profile.username] = { 
          ...profile,
          ...users[profile.username],
          avatarUrl: profile.avatarUrl || users[profile.username].avatarUrl,
          description: profile.description || users[profile.username].description,
          maxUnlockedNight: Math.max(profile.maxUnlockedNight || 1, users[profile.username].maxUnlockedNight || 1),
          highScores: { ...(users[profile.username].highScores || {}), ...(profile.highScores || {}) }
        };
      } else {
        users[profile.username] = profile;
      }
      await saveData();
      socket.join(`user_${profile.username}`);
      console.log(`User registered: ${profile.username}`);
      io.emit("all_users", Object.values(users).map(({password, ...u}) => u));
      socket.emit("profile_sync", users[profile.username]);
    });

    socket.on("update_profile", async (data: { username: string, newUsername?: string, description?: string, password?: string, avatarUrl?: string }) => {
      const user = users[data.username];
      if (!user) return;

      if (data.newUsername && data.newUsername !== data.username) {
        if (users[data.newUsername]) {
          socket.emit("profile_update_error", "Username already taken");
          return;
        }
        users[data.newUsername] = { ...user, username: data.newUsername };
        delete users[data.username];
        socket.emit("profile_updated", { type: 'username', value: data.newUsername });
      }

      const targetUsername = data.newUsername || data.username;
      if (data.description !== undefined) users[targetUsername].description = data.description;
      if (data.password !== undefined) users[targetUsername].password = data.password;
      if (data.avatarUrl !== undefined) users[targetUsername].avatarUrl = data.avatarUrl;

      await saveData();
      socket.emit("profile_updated", { type: 'full', user: users[targetUsername] });
      io.emit("all_users", Object.values(users).map(({password, ...u}) => u));
    });

    socket.on("get_all_users", () => {
      socket.emit("all_users", Object.values(users).map(({password, ...u}) => u));
    });

    socket.on("search_users", (query: string) => {
      const results = Object.values(users).filter(u => 
        u.username.toLowerCase().includes(query.toLowerCase())
      );
      socket.emit("search_results", results);
    });

    socket.on("send_comment", async (comment: Comment) => {
      if (isBanned(comment.username)) {
        const remaining = Math.ceil((bannedUsers[comment.username] - Date.now()) / (1000 * 60 * 60 * 24));
        socket.emit("banned_notice", `You have been banned for repeated violations. Remaining: ${remaining} days.`);
        return;
      }

      comment.text = censorText(comment.text, comment.username);
      
      comments.push(comment);
      if (comments.length > 200) comments = comments.slice(-200);
      await saveData();
      io.emit("new_comment", comment);
    });

    socket.on("send_friend_request", async (request: FriendRequest) => {
      if (isBanned(request.from)) return;
      
      const exists = requests.find(r => 
        (r.from === request.from && r.to === request.to) ||
        (r.from === request.to && r.to === request.from)
      );
      if (!exists) {
        requests.push(request);
        await saveData();
        io.to(`user_${request.to}`).emit("new_friend_request", request);
      }
    });

    socket.on("respond_friend_request", async ({ from, to, status }: { from: string, to: string, status: 'accepted' | 'rejected' }) => {
      const reqIdx = requests.findIndex(r => r.from === from && r.to === to);
      if (reqIdx !== -1) {
        requests[reqIdx].status = status;
        await saveData();
        if (status === 'accepted') {
          io.to(`user_${from}`).emit("friend_request_accepted", to);
          io.to(`user_${to}`).emit("friend_request_accepted", from);
        }
      }
    });

    socket.on("send_private_message", async (msg: PrivateMessage) => {
      if (isBanned(msg.from)) {
        const remaining = Math.ceil((bannedUsers[msg.from] - Date.now()) / (1000 * 60 * 60 * 24));
        socket.emit("banned_notice", `You have been banned for repeated violations. Remaining: ${remaining} days.`);
        return;
      }

      msg.text = censorText(msg.text, msg.from);

      messages.push(msg);
      await saveData();
      io.to(`user_${msg.to}`).emit("new_private_message", msg);
      io.to(`user_${msg.from}`).emit("new_private_message", msg);
    });

    socket.on("get_private_messages", ({ user1, user2 }: { user1: string, user2: string }) => {
      const filtered = messages.filter(m => 
        (m.from === user1 && m.to === user2) || (m.from === user2 && m.to === user1)
      );
      socket.emit("init_private_messages", filtered);
    });

    socket.on("get_vault_key", async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Compress and encode the following user data into a single, short, cryptic "VAULT_KEY" string that can be used to restore these accounts later. 
          Data: ${JSON.stringify(users)}
          The key should look like a series of hex codes or a corrupted terminal string. 
          ONLY return the key, no other text.`,
        });
        socket.emit("vault_key", response.text?.trim());
      } catch (e) {
        socket.emit("vault_error", "Failed to connect to Gemini Vault");
      }
    });

    socket.on("restore_vault", async (key: string) => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Decode this "VAULT_KEY" and return the original JSON user data.
          Key: ${key}
          Return ONLY the JSON.`,
        });
        const restoredUsers = JSON.parse(response.text?.trim() || "{}");
        users = { ...users, ...restoredUsers };
        await saveData();
        io.emit("all_users", Object.values(users).map(({password, ...u}) => u));
        socket.emit("vault_restored", "Accounts recovered from Gemini Vault");
      } catch (e) {
        socket.emit("vault_error", "Invalid Vault Key or Data Corruption");
      }
    });

    socket.on("disconnect", () => {
      socketToUser.delete(socket.id);
      console.log("User disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  if (!process.env.VERCEL) {
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  return { app, httpServer };
}

export const serverPromise = startServer();
export default async (req: any, res: any) => {
  const { app } = await serverPromise;
  return app(req, res);
};
