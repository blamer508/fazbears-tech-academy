import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, Sparkles, X, MessageSquare, BookOpen } from 'lucide-react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface AITutorProps {
  subject: string;
  onClose: () => void;
}

const SUBJECT_PROMPTS: Record<string, string> = {
  'Computer Science': "You are an expert Computer Science Professor at Fazbear's Tech Academy. You specialize in hardware, systems, and low-level computing. Explain concepts clearly but with technical depth.",
  'Software Engineering': "You are a Senior Software Engineer at Fazbear's Tech Academy. You specialize in coding, algorithms, and software architecture. Provide code examples and best practices.",
  'Natural Sciences': "You are a lead Scientist at Fazbear's Tech Academy. You specialize in Physics, Chemistry, Biology, and Astronomy. Explain the wonders of the natural world with scientific precision.",
  'Mathematics': "You are a brilliant Mathematician at Fazbear's Tech Academy. You specialize in everything from basic arithmetic to advanced calculus. Show your work and explain the logic behind every step.",
  'Friendly AI': "You are 'Fazbear Buddy', a super friendly and supportive AI companion at Fazbear's Tech Academy. Your goal is to be a true friend to the student, offering encouragement, chatting about their day, and making them feel welcome. You are cheerful, kind, and always positive.",
  'General': "You are a helpful AI Assistant at Fazbear's Tech Academy. You can help with general questions about the academy or any other topic."
};

export const AITutor: React.FC<AITutorProps> = ({ subject, onClose }) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(`fazbear_chat_${subject}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleNewChat = () => {
    if (window.confirm("Are you sure you want to start a new chat? This will clear current history.")) {
      setMessages([]);
      localStorage.removeItem(`fazbear_chat_${subject}`);
    }
  };

  const handleSaveChat = () => {
    localStorage.setItem(`fazbear_chat_${subject}`, JSON.stringify(messages));
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = "gemini-3-flash-preview";
      
      const systemInstruction = SUBJECT_PROMPTS[subject] || SUBJECT_PROMPTS['General'];
      
      const chatHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await ai.models.generateContent({
        model,
        contents: [
          ...chatHistory,
          { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          systemInstruction,
        }
      });

      const aiMsg: Message = { role: 'model', text: response.text || "I'm sorry, I couldn't process that request." };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "ERROR: Connection to Fazbear AI Mainframe lost. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl h-[80vh] bg-zinc-950 border border-zinc-800 flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-blue-900/20 border border-blue-900 flex items-center justify-center">
              <Bot className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tighter text-white leading-none">{subject} AI</h2>
              <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Fazbear_Mainframe_v4.0</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleNewChat}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
              title="Start New Chat"
            >
              <MessageSquare className="w-3 h-3" />
              New
            </button>
            <button 
              onClick={handleSaveChat}
              className="px-3 py-1.5 bg-blue-900/20 border border-blue-900/50 hover:bg-blue-900/40 text-blue-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-2"
              title="Save Chat History"
            >
              <BookOpen className="w-3 h-3" />
              Save
            </button>
            <div className="w-[1px] h-6 bg-zinc-800 mx-1" />
            <button 
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save Toast */}
        <AnimatePresence>
          {showSaveToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-1/2 -translate-x-1/2 z-[110] bg-green-900 border border-green-500 px-4 py-2 rounded-sm shadow-xl"
            >
              <p className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Chat History Saved to Mainframe
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <Sparkles className="w-12 h-12 text-blue-900" />
              <div>
                <p className="text-white font-bold uppercase text-sm">Welcome to the {subject} Module</p>
                <p className="text-zinc-500 text-xs max-w-xs">Ask me anything about this subject. I am here to assist your learning journey at Fazbear's Tech Academy.</p>
              </div>
            </div>
          )}
          
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-3 rounded-sm border ${
                  m.role === 'user' 
                    ? 'bg-zinc-900 border-zinc-800 text-white' 
                    : 'bg-blue-900/10 border-blue-900/30 text-zinc-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {m.role === 'user' ? (
                      <User className="w-3 h-3 text-zinc-500" />
                    ) : (
                      <Bot className="w-3 h-3 text-blue-500" />
                    )}
                    <span className="text-[8px] font-bold uppercase tracking-widest opacity-50">
                      {m.role === 'user' ? 'Student' : 'AI_Tutor'}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.text}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-blue-900/10 border border-blue-900/30 p-3 rounded-sm">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Ask the ${subject} AI...`}
              className="flex-1 bg-zinc-950 border border-zinc-800 p-3 text-sm text-white focus:outline-none focus:border-blue-900 transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="px-6 bg-blue-900 text-white font-black uppercase text-xs hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest flex items-center gap-1">
              <Sparkles className="w-2 h-2" /> Powered by Fazbear AI
            </span>
            <span className="text-[8px] text-zinc-600 uppercase font-bold tracking-widest">
              Unlimited Access Granted
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
