import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";

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
  };

  const saveData = async () => {
    await fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 2));
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
    await fs.writeFile(REQUESTS_FILE, JSON.stringify(requests, null, 2));
  };

  await loadData();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    
    socket.emit("init_comments", comments);

    socket.on("register_user", async (profile: UserProfile) => {
      users[profile.username] = profile;
      await saveData();
      socket.join(`user_${profile.username}`);
      console.log(`User registered: ${profile.username}`);
    });

    socket.on("search_users", (query: string) => {
      const results = Object.values(users).filter(u => 
        u.username.toLowerCase().includes(query.toLowerCase())
      );
      socket.emit("search_results", results);
    });

    socket.on("send_comment", async (comment: Comment) => {
      comments.push(comment);
      if (comments.length > 200) comments = comments.slice(-200);
      await saveData();
      io.emit("new_comment", comment);
    });

    socket.on("send_friend_request", async (request: FriendRequest) => {
      // Check if already exists
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

    socket.on("disconnect", () => {
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

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  return { app, httpServer };
}

export const serverPromise = startServer();
export default async (req: any, res: any) => {
  const { app } = await serverPromise;
  return app(req, res);
};
