
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { AppStatus, QuizState, Difficulty, Question, CharacterDesign, Comment, PrivateMessage, FriendRequest } from './types';
import { QUESTIONS } from './constants';
import Quiz from './components/Quiz';
import JumpScare from './components/JumpScare';
import SecurityFeed from './components/SecurityFeed';
import Cutscene from './components/Cutscene';
import CharacterCreator from './components/CharacterCreator';

const VERSION = "v1.3.2-STABLE";

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.START);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [selectedAvatar, setSelectedAvatar] = useState('https://picsum.photos/seed/freddy/200/200');
  const [isLoginError, setIsLoginError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const statusAvatarRef = useRef<HTMLInputElement>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Easy');
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{username: string, avatarUrl: string | null}[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [privateMessages, setPrivateMessages] = useState<PrivateMessage[]>([]);
  const [newPrivateMessage, setNewPrivateMessage] = useState('');
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    socketRef.current = io();

    socketRef.current.on('init_comments', (initialComments: Comment[]) => {
      setComments(initialComments);
    });

    socketRef.current.on('new_comment', (comment: Comment) => {
      setComments(prev => [...prev, comment]);
    });

    socketRef.current.on('search_results', (results: {username: string, avatarUrl: string | null}[]) => {
      setSearchResults(results);
    });

    socketRef.current.on('new_friend_request', (request: FriendRequest) => {
      setFriendRequests(prev => [...prev, request]);
    });

    socketRef.current.on('friend_request_accepted', (friend: string) => {
      setFriends(prev => [...new Set([...prev, friend])]);
    });

    socketRef.current.on('new_private_message', (msg: PrivateMessage) => {
      setPrivateMessages(prev => [...prev, msg]);
    });

    socketRef.current.on('init_private_messages', (msgs: PrivateMessage[]) => {
      setPrivateMessages(msgs);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isCommentsOpen) {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments, isCommentsOpen]);

  useEffect(() => {
    if (currentUser && socketRef.current) {
      socketRef.current.emit('register_user', { username: currentUser, avatarUrl: userAvatar });
    }
  }, [currentUser, userAvatar]);

  const handleSendComment = () => {
    if (!newComment.trim() || !currentUser || !socketRef.current) return;

    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      username: currentUser,
      avatarUrl: userAvatar,
      text: newComment,
      timestamp: Date.now(),
      replyTo: replyingTo?.id
    };

    socketRef.current.emit('send_comment', comment);
    setNewComment('');
    setReplyingTo(null);
  };

  const handleSearchUsers = (query: string) => {
    setSearchQuery(query);
    if (query.length > 1) {
      socketRef.current?.emit('search_users', query);
    } else {
      setSearchResults([]);
    }
  };

  const handleSendFriendRequest = (to: string) => {
    if (!currentUser || !socketRef.current) return;
    socketRef.current.emit('send_friend_request', { from: currentUser, to, status: 'pending' });
  };

  const handleRespondFriendRequest = (from: string, status: 'accepted' | 'rejected') => {
    if (!currentUser || !socketRef.current) return;
    socketRef.current.emit('respond_friend_request', { from, to: currentUser, status });
    setFriendRequests(prev => prev.filter(r => r.from !== from));
  };

  const handleStartChat = (friend: string) => {
    setActiveChat(friend);
    socketRef.current?.emit('get_private_messages', { user1: currentUser, user2: friend });
  };

  const handleSendPrivateMessage = () => {
    if (!newPrivateMessage.trim() || !currentUser || !activeChat || !socketRef.current) return;
    const msg: PrivateMessage = {
      id: Math.random().toString(36).substr(2, 9),
      from: currentUser,
      to: activeChat,
      text: newPrivateMessage,
      timestamp: Date.now()
    };
    socketRef.current.emit('send_private_message', msg);
    setNewPrivateMessage('');
  };

  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentNight, setCurrentNight] = useState<number>(1);
  const [maxUnlockedNight, setMaxUnlockedNight] = useState<number>(1);
  const [power, setPower] = useState(100);
  const [threatLevel, setThreatLevel] = useState(0);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);
  const [characterDesign, setCharacterDesign] = useState<CharacterDesign | null>(null);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [isEndlessFlag, setIsEndlessFlag] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMob = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMob);
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const [highScores, setHighScores] = useState<Record<Difficulty, number>>(() => {
    const saved = localStorage.getItem('fazbear_endless_records');
    return saved ? JSON.parse(saved) : { Easy: 0, Medium: 0, Hard: 0 };
  });
  
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    score: 0,
    isGameOver: false,
    isScaring: false,
    scareIndex: 0,
  });

  const ambientAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (status === AppStatus.QUIZ || status === AppStatus.ENDLESS) {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.volume = 0.4;
        ambientAudioRef.current.play().catch(() => {});
      }
    } else {
      if (ambientAudioRef.current) ambientAudioRef.current.pause();
    }
  }, [status]);

  const handlePasscodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 3);
    setPasscodeInput(val);
    if (val === '508') {
      setMaxUnlockedNight(5);
    }
  };

  const handleLogin = () => {
    const isDev = (loginUsername === 'blamer_508' && loginPassword === 'blamer_508') || 
                  (loginUsername === 'ellieblockman' && loginPassword === 'ellieblockman');
    
    const savedData = localStorage.getItem(`fazbear_user_${loginUsername}`);

    if (isDev) {
      setCurrentUser(loginUsername);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setUserAvatar(parsed.avatarUrl || 'https://picsum.photos/seed/dev/200/200');
        setHighScores(parsed.highScores || { Easy: 0, Medium: 0, Hard: 0 });
      } else {
        const initialDevData = {
          password: loginPassword,
          avatarUrl: 'https://picsum.photos/seed/dev/200/200',
          maxUnlockedNight: 5,
          highScores: { Easy: 0, Medium: 0, Hard: 0 }
        };
        localStorage.setItem(`fazbear_user_${loginUsername}`, JSON.stringify(initialDevData));
        setUserAvatar(initialDevData.avatarUrl);
        setHighScores(initialDevData.highScores);
      }
      setMaxUnlockedNight(5);
      setStatus(AppStatus.START);
      return;
    }

    if (!loginUsername || !loginPassword) {
      setIsLoginError(true);
      return;
    }
    
    if (authMode === 'login') {
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.password === loginPassword) {
          setCurrentUser(loginUsername);
          setUserAvatar(parsed.avatarUrl || null);
          setMaxUnlockedNight(parsed.maxUnlockedNight || 1);
          setHighScores(parsed.highScores || { Easy: 0, Medium: 0, Hard: 0 });
          setStatus(AppStatus.START);
        } else {
          setIsLoginError(true);
        }
      } else {
        setIsLoginError(true);
      }
    } else {
      // Sign-up mode
      if (savedData) {
        // User already exists
        setIsLoginError(true);
      } else {
        // Check if username is taken (even if password doesn't match)
        const allKeys = Object.keys(localStorage);
        const userExists = allKeys.some(key => key === `fazbear_user_${loginUsername}`);
        if (userExists) {
          setIsLoginError(true);
          return;
        }

        const userData = {
          password: loginPassword,
          avatarUrl: selectedAvatar,
          maxUnlockedNight: 1,
          highScores: { Easy: 0, Medium: 0, Hard: 0 }
        };
        localStorage.setItem(`fazbear_user_${loginUsername}`, JSON.stringify(userData));
        setCurrentUser(loginUsername);
        setUserAvatar(selectedAvatar);
        setMaxUnlockedNight(1);
        setHighScores({ Easy: 0, Medium: 0, Hard: 0 });
        setStatus(AppStatus.START);
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      const savedData = localStorage.getItem(`fazbear_user_${currentUser}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        const data = {
          ...parsed,
          maxUnlockedNight: (currentUser === 'blamer_508' || currentUser === 'ellieblockman') ? 5 : maxUnlockedNight,
          highScores,
          avatarUrl: userAvatar
        };
        localStorage.setItem(`fazbear_user_${currentUser}`, JSON.stringify(data));
      }
    }
  }, [maxUnlockedNight, highScores, currentUser, userAvatar]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>, isStatusUpdate: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (isStatusUpdate) {
          setUserAvatar(base64);
        } else {
          setSelectedAvatar(base64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const startNewNight = useCallback((night: number, isEndless: boolean = false) => {
    let nightQuestions: Question[] = [];
    
    if (isEndless) {
       nightQuestions = [...QUESTIONS].sort(() => Math.random() - 0.5);
    } else {
       nightQuestions = QUESTIONS.filter(q => {
          if (night === 5) return true;
          if (night <= 2) return q.difficulty === 'Easy';
          if (night <= 4) return q.difficulty === 'Medium';
          return q.difficulty === 'Hard';
        }).sort(() => Math.random() - 0.5).slice(0, 5);
    }

    setActiveQuestions(nightQuestions);
    setPower(100);
    setThreatLevel(0);
    setState({
      currentQuestionIndex: 0,
      score: 0,
      isGameOver: false,
      isScaring: false,
      scareIndex: isEndless ? 4 : (night === 5 ? 4 : Math.min(night - 1, 3))
    });
    
    setStatus(AppStatus.NIGHT_START);
    
    setTimeout(() => {
      setStatus(isEndless ? AppStatus.ENDLESS : AppStatus.QUIZ);
    }, 2500);
  }, []);

  const handleStartShift = useCallback((targetNight?: number, isEndless: boolean = false) => {
    const nightToStart = isEndless ? 5 : (targetNight || currentNight);
    setIsEndlessFlag(isEndless);
    setCurrentNight(isEndless ? 5 : nightToStart);

    if (!characterDesign) {
      setStatus(AppStatus.DESIGN);
    } else {
      // Always show cutscene before starting any night
      setStatus(AppStatus.NIGHT_CUTSCENE);
    }
  }, [characterDesign, currentNight]);

  const handleDesignComplete = useCallback((design: CharacterDesign) => {
    setCharacterDesign(design);
    if (isEndlessFlag || currentNight >= 2) {
      setStatus(AppStatus.NIGHT_CUTSCENE);
    } else {
      setStatus(AppStatus.INTRO);
    }
  }, [isEndlessFlag, currentNight]);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (!isCorrect) {
      if (status === AppStatus.ENDLESS) {
        const currentBest = highScores[selectedDifficulty];
        if (state.score > currentBest) {
           const newScores = { ...highScores, [selectedDifficulty]: state.score };
           setHighScores(newScores);
           localStorage.setItem('fazbear_endless_records', JSON.stringify(newScores));
        }
      }
      setState(prev => ({ ...prev, isScaring: true }));
      return;
    }

    const nextIndex = state.currentQuestionIndex + 1;
    const isEndless = status === AppStatus.ENDLESS;

    if (!isEndless && nextIndex >= activeQuestions.length) {
      if (currentNight === 5) {
        setStatus(AppStatus.ENDING_CUTSCENE);
      } else {
        setStatus(AppStatus.RESULTS);
      }
    } else {
      setState(prev => ({
        ...prev,
        currentQuestionIndex: isEndless ? (nextIndex % activeQuestions.length) : nextIndex,
        score: prev.score + 1
      }));
    }
  }, [state.currentQuestionIndex, activeQuestions.length, currentNight, status, state.score, highScores, selectedDifficulty]);

  const onJumpscareComplete = useCallback(() => {
    setStatus(AppStatus.DEAD);
    setState(prev => ({ ...prev, isScaring: false }));
  }, []);

  const handleContinueFromResults = useCallback(() => {
    const nextNight = currentNight + 1;
    if (nextNight <= 5) {
      if (nextNight > maxUnlockedNight) {
        setMaxUnlockedNight(nextNight);
      }
      // Use handleStartShift to ensure cutscenes and other logic are triggered
      handleStartShift(nextNight);
    } else {
      setStatus(AppStatus.START);
    }
  }, [currentNight, maxUnlockedNight, handleStartShift]);

  useEffect(() => {
    if (status === AppStatus.RESULTS) {
      const timer = setTimeout(() => {
        handleContinueFromResults();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status, handleContinueFromResults]);

  const handleCutsceneComplete = useCallback(() => {
    if (status === AppStatus.ENDING_CUTSCENE) {
       setStatus(AppStatus.START);
       return;
    }
    setHasSeenIntro(true);
    startNewNight(currentNight, isEndlessFlag);
  }, [currentNight, startNewNight, status, isEndlessFlag]);

  if (isMobile && isPortrait) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center p-12 text-center space-y-6">
        <i className="fa-solid fa-rotate text-6xl text-red-600 animate-spin-slow"></i>
        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Rotate Device</h2>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Fazbear Tech Academy requires landscape orientation for optimal system synchronization.</p>
        <style>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        `}</style>
      </div>
    );
  }

  if (state.isScaring) {
    return <JumpScare scareIndex={state.scareIndex} onComplete={onJumpscareComplete} />;
  }

  const isEndlessUnlocked = maxUnlockedNight >= 5 || passcodeInput === '508';

  return (
    <div className="min-h-screen w-full relative bg-black text-white selection:bg-red-900 overflow-hidden font-['Orbitron']">
      <audio ref={ambientAudioRef} loop src="https://archive.org/download/fnaf-sounds/Ambience_Industrial.mp3" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-[10000] noise-overlay"></div>

      {status === AppStatus.LOGIN && (
        <div className="flex flex-col items-center justify-center h-screen p-4 text-center space-y-6 animate-in fade-in zoom-in duration-1000 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase glitch-text drop-shadow-[0_0_30px_rgba(255,0,0,0.4)] leading-tight">
              {authMode === 'login' ? 'System Login' : 'System Sign-In'}
            </h1>
            <p className="text-zinc-500 font-mono text-[10px] tracking-[0.4em] uppercase">Credential Verification Required</p>
          </div>

          <div className="w-full max-w-md space-y-4 bg-zinc-950/50 p-8 border-2 border-zinc-900 relative z-10">
            <div className="flex border-b border-zinc-800 mb-4">
               <button 
                 onClick={() => { setAuthMode('login'); setIsLoginError(false); }}
                 className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'login' ? 'text-red-600 border-b-2 border-red-600' : 'text-zinc-600'}`}
               >
                 Log-In
               </button>
               <button 
                 onClick={() => { setAuthMode('signup'); setIsLoginError(false); }}
                 className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'signup' ? 'text-red-600 border-b-2 border-red-600' : 'text-zinc-600'}`}
               >
                 Sign-In
               </button>
            </div>

            {authMode === 'signup' && (
              <div className="space-y-2 text-left">
                 <label className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Select Avatar</label>
                 <div className="flex gap-2 items-center overflow-x-auto pb-2 custom-scrollbar">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-12 h-12 border-2 border-dashed border-zinc-700 flex items-center justify-center text-zinc-600 hover:border-white hover:text-white transition-all flex-shrink-0"
                    >
                      <i className="fa-solid fa-plus"></i>
                      <input 
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleAvatarUpload(e)}
                      />
                    </button>
                    {['freddy', 'bonnie', 'chica', 'foxy', 'golden'].map(seed => (
                      <button 
                        key={seed}
                        onClick={() => setSelectedAvatar(`https://picsum.photos/seed/${seed}/200/200`)}
                        className={`w-12 h-12 border-2 flex-shrink-0 transition-all ${selectedAvatar.includes(seed) ? 'border-red-600 scale-110' : 'border-zinc-800 opacity-50'}`}
                      >
                        <img src={`https://picsum.photos/seed/${seed}/200/200`} alt={seed} className="w-full h-full object-cover" />
                      </button>
                    ))}
                    {selectedAvatar.startsWith('data:image') && (
                      <div className="w-12 h-12 border-2 border-red-600 scale-110 flex-shrink-0">
                        <img src={selectedAvatar} alt="Custom" className="w-full h-full object-cover" />
                      </div>
                    )}
                 </div>
              </div>
            )}

            <div className="space-y-1 text-left">
              <label className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Username</label>
              <input 
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white font-mono outline-none focus:border-red-600 transition-colors"
                placeholder="Enter Username..."
              />
            </div>
            <div className="space-y-1 text-left">
              <label className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">Password</label>
              <input 
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white font-mono outline-none focus:border-red-600 transition-colors"
                placeholder="Enter Password..."
              />
            </div>
            {isLoginError && (
              <p className="text-red-600 text-[10px] font-bold uppercase animate-pulse">
                {authMode === 'login' ? 'Invalid Credentials Detected' : 'Username Taken or Invalid Data'}
              </p>
            )}
            <button 
              onClick={handleLogin}
              className="w-full py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all"
            >
              {authMode === 'login' ? 'Access Terminal' : 'Create Account'}
            </button>
          </div>
          
          <button 
            onClick={() => setStatus(AppStatus.START)}
            className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest hover:text-white transition-colors"
          >
            Continue as Guest
          </button>
        </div>
      )}

      {status === AppStatus.START && (
        <div className="flex flex-col items-center justify-center h-screen p-4 text-center space-y-4 animate-in fade-in zoom-in duration-1000 relative overflow-hidden">
           
           {/* Top Branding Bar */}
           <div className="absolute top-4 left-6 right-6 flex justify-between items-center pointer-events-none">
              <div className="flex items-center gap-2">
                 <i className="fa-solid fa-microchip text-red-600 text-xs animate-pulse"></i>
                 <span className="text-[9px] text-zinc-500 font-bold tracking-[0.4em] uppercase">blamerblockmanstudios</span>
              </div>
              <div className="flex items-center gap-4">
                 <span className="text-[9px] text-zinc-700 font-mono uppercase">Developer: blamer_508</span>
                 <span className="text-[9px] text-red-700 font-black tracking-widest bg-red-950/20 px-2 py-1 border border-red-900/40">{VERSION}</span>
              </div>
           </div>

           <div className="absolute inset-0 z-0 opacity-10">
              <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-red-900 rounded-full blur-[100px] animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-900 rounded-full blur-[100px] animate-pulse delay-700"></div>
           </div>

           <div className="space-y-2 relative z-10">
              <div className="inline-block px-3 py-0.5 bg-zinc-950 border border-zinc-800 rounded-full mb-1">
                 <span className="text-[8px] text-zinc-500 uppercase tracking-[0.5em] font-black">Authorized_Access_Only</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase glitch-text drop-shadow-[0_0_30px_rgba(255,0,0,0.4)] leading-tight">
                fazbear's tech academy
              </h1>
              <div className="flex items-center justify-center gap-3">
                <p className="text-zinc-600 font-mono text-[10px] tracking-[0.4em] uppercase animate-pulse">Shift {currentNight}</p>
                <div className="flex items-center gap-2 bg-zinc-950/50 border border-zinc-900 px-2 py-0.5 rounded">
                   <span className="text-[8px] text-zinc-700 font-bold uppercase tracking-widest">DEV_CODE:</span>
                   <input 
                     type="password" 
                     value={passcodeInput}
                     onChange={handlePasscodeChange}
                     placeholder="???"
                     className="bg-transparent text-red-600 font-mono text-[10px] outline-none w-8 placeholder:text-zinc-800 text-center"
                   />
                </div>
              </div>
              <div className="h-4 flex items-center justify-center gap-6 mt-1">
                <span className="text-blue-500 text-[9px] font-bold tracking-[0.5em] uppercase">
                  RECORD: {highScores[selectedDifficulty]}
                </span>
              </div>
           </div>

           <div className="space-y-3 relative z-10 w-full max-w-xl">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] text-zinc-500 uppercase tracking-[0.4em] font-bold">Select_Target_Log</span>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => {
                    const isLocked = n > maxUnlockedNight;
                    return (
                      <button
                        key={n}
                        disabled={isLocked}
                        onClick={() => handleStartShift(n)}
                        className={`w-9 h-9 border-2 flex items-center justify-center transition-all relative overflow-hidden group
                          ${isLocked ? 'border-zinc-900 text-zinc-800 cursor-not-allowed bg-zinc-950' : 
                            (currentNight === n ? 'border-red-600 text-white bg-red-900/20 shadow-[0_0_10px_rgba(220,38,38,0.5)]' : 'border-zinc-700 text-zinc-500 hover:border-white hover:text-white hover:bg-zinc-800')}`}
                      >
                        {isLocked ? <i className="fa-solid fa-lock text-[8px]"></i> : <span className="font-black text-sm italic">{n}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 w-full">
                {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map((d) => (
                  <button 
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`py-2 border-2 transition-all uppercase font-black italic tracking-widest text-[9px] relative overflow-hidden group ${selectedDifficulty === d ? 'border-red-700 bg-red-900/20 text-white shadow-[0_0_20px_rgba(185,28,28,0.4)]' : 'border-zinc-900 text-zinc-700 hover:border-zinc-700'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
           </div>

           <div className="flex flex-col md:flex-row gap-3 relative z-10">
             <button onClick={() => handleStartShift()} className="px-8 py-3 bg-white text-black font-black text-lg uppercase tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
               Start Shift {currentNight}
             </button>
             <button disabled={!isEndlessUnlocked} onClick={() => handleStartShift(99, true)} className={`px-8 py-3 border-2 font-black text-lg uppercase tracking-[0.2em] transition-all transform hover:scale-105 active:scale-95 ${isEndlessUnlocked ? 'border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white shadow-[0_10px_30px_rgba(37,99,235,0.1)]' : 'border-zinc-900 text-zinc-800 bg-zinc-950/50 opacity-50 cursor-not-allowed'}`}>
               Endless Mode
             </button>
           </div>

           <div className="flex flex-col items-center gap-4 relative z-10">
             {!currentUser ? (
               <div className="flex gap-4">
                  <button 
                    onClick={() => { setAuthMode('login'); setStatus(AppStatus.LOGIN); }}
                    className="px-10 py-2 border-2 border-zinc-800 bg-zinc-950/50 text-zinc-500 font-black uppercase text-[11px] tracking-[0.3em] hover:border-red-600 hover:text-white transition-all"
                  >
                    Log-In
                  </button>
                  <button 
                    onClick={() => { setAuthMode('signup'); setStatus(AppStatus.LOGIN); }}
                    className="px-10 py-2 border-2 border-zinc-800 bg-zinc-950/50 text-zinc-500 font-black uppercase text-[11px] tracking-[0.3em] hover:border-red-600 hover:text-white transition-all"
                  >
                    Sign-In
                  </button>
               </div>
             ) : (
               (currentUser === 'blamer_508' || currentUser === 'ellieblockman') && (
                 <div className="flex flex-col items-center gap-1">
                    <div className="h-[1px] w-24 bg-red-900/50"></div>
                    <p className="text-red-600 font-black uppercase italic tracking-[0.5em] text-[10px] animate-pulse drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
                      welcome back master
                    </p>
                    <div className="h-[1px] w-24 bg-red-900/50"></div>
                 </div>
               )
             )}
           </div>

           {/* Corporate Footer */}
           <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-1 pointer-events-none">
              <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
              <p className="text-[8px] text-zinc-700 font-mono uppercase">
                Developer: blamer_508 // Co-developer: ellieblockman
              </p>
              <p className="text-[7px] text-zinc-800 font-mono">
                © blamerblockmanstudios. FAZBEAR ENTERTAINMENT PARTNERSHIP.
              </p>
           </div>

           {/* System Login Status Widget */}
           <div className="absolute bottom-4 right-6 flex flex-col items-end gap-3 z-50">
              {/* Real-time Comment Section */}
              <div className={`flex flex-col w-64 transition-all duration-500 ${isCommentsOpen ? 'h-80 opacity-100' : 'h-0 opacity-0 pointer-events-none'}`}>
                 <div className="flex-1 bg-zinc-950/95 border-2 border-zinc-900 rounded-t-lg flex flex-col overflow-hidden backdrop-blur-xl shadow-2xl">
                    <div className="bg-zinc-900/50 p-2 border-b border-zinc-800 flex justify-between items-center">
                       <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">Academy_Terminal_Chat</span>
                       <button onClick={() => setIsCommentsOpen(false)} className="text-zinc-700 hover:text-white transition-colors">
                          <i className="fa-solid fa-xmark text-xs"></i>
                       </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                       {comments.length === 0 ? (
                         <p className="text-[8px] text-zinc-800 text-center mt-10 uppercase italic">No logs detected in terminal...</p>
                       ) : (
                         comments.map(c => (
                           <div key={c.id} className="flex flex-col gap-1">
                              {c.replyTo && (
                                <div className="ml-4 border-l-2 border-zinc-800 pl-2 mb-1">
                                   <span className="text-[6px] text-zinc-600 uppercase font-bold">Replying to {comments.find(pc => pc.id === c.replyTo)?.username || 'unknown'}</span>
                                </div>
                              )}
                              <div className="flex gap-2 group">
                                 <div className="w-6 h-6 rounded-sm bg-zinc-900 border border-zinc-800 flex-shrink-0 overflow-hidden">
                                    {c.avatarUrl ? (
                                      <img src={c.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                      <i className="fa-solid fa-user text-[10px] text-zinc-700 flex items-center justify-center h-full"></i>
                                    )}
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                       <span className={`text-[8px] font-black uppercase truncate ${c.username === 'blamer_508' || c.username === 'ellieblockman' ? 'text-red-600' : 'text-zinc-400'}`}>
                                          {c.username}
                                       </span>
                                       <div className="flex items-center gap-2">
                                          <button 
                                            onClick={() => setReplyingTo(c)}
                                            className="text-[6px] text-zinc-600 hover:text-white uppercase font-bold transition-colors"
                                          >
                                            Reply
                                          </button>
                                          <span className="text-[6px] text-zinc-700 font-mono">
                                             {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                       </div>
                                    </div>
                                    <p className="text-[9px] text-zinc-300 leading-tight break-words font-mono bg-zinc-900/30 p-1 rounded-sm mt-0.5 border border-transparent group-hover:border-zinc-800 transition-colors">
                                       {c.text}
                                    </p>
                                 </div>
                              </div>
                           </div>
                         ))
                       )}
                       <div ref={commentsEndRef} />
                    </div>
                    {currentUser ? (
                      <div className="p-2 bg-zinc-900/30 border-t border-zinc-800 flex flex-col gap-2">
                         {replyingTo && (
                           <div className="flex justify-between items-center bg-zinc-950 p-1 border border-zinc-800">
                              <span className="text-[7px] text-zinc-500 uppercase">Replying to {replyingTo.username}</span>
                              <button onClick={() => setReplyingTo(null)} className="text-zinc-700 hover:text-white"><i className="fa-solid fa-xmark text-[8px]"></i></button>
                           </div>
                         )}
                         <div className="flex gap-2">
                            <input 
                              type="text"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                              placeholder="Type log entry..."
                              className="flex-1 bg-zinc-950 border border-zinc-800 p-1.5 text-[9px] text-white font-mono outline-none focus:border-red-900 transition-colors"
                            />
                            <button 
                              onClick={handleSendComment}
                              className="bg-zinc-800 hover:bg-red-900 text-white px-2 rounded-sm transition-colors"
                            >
                               <i className="fa-solid fa-paper-plane text-[8px]"></i>
                            </button>
                         </div>
                      </div>
                    ) : (
                      <div className="p-2 bg-zinc-900/50 border-t border-zinc-800 text-center">
                         <p className="text-[7px] text-zinc-600 uppercase font-bold tracking-widest">Login required to post logs</p>
                      </div>
                    )}
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 <button 
                   onClick={() => setIsSocialOpen(!isSocialOpen)}
                   className={`w-10 h-10 flex items-center justify-center rounded-sm border-2 transition-all shadow-xl ${isSocialOpen ? 'bg-blue-900 border-blue-600 text-white' : 'bg-zinc-950 border-zinc-900 text-zinc-600 hover:border-zinc-700'}`}
                 >
                    <i className="fa-solid fa-user-group text-sm"></i>
                    {friendRequests.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center border border-black">
                         <span className="text-[6px] font-black">{friendRequests.length}</span>
                      </div>
                    )}
                 </button>

                 <button 
                   onClick={() => setIsCommentsOpen(!isCommentsOpen)}
                   className={`w-10 h-10 flex items-center justify-center rounded-sm border-2 transition-all shadow-xl ${isCommentsOpen ? 'bg-red-900 border-red-600 text-white' : 'bg-zinc-950 border-zinc-900 text-zinc-600 hover:border-zinc-700'}`}
                 >
                    <i className="fa-solid fa-comments text-sm"></i>
                    {comments.length > 0 && !isCommentsOpen && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full flex items-center justify-center border border-black">
                         <span className="text-[6px] font-black">{comments.length > 9 ? '9+' : comments.length}</span>
                      </div>
                    )}
                 </button>

                 <div className="flex items-center gap-3 bg-zinc-950/90 border border-zinc-900 px-4 py-2 rounded-sm shadow-2xl backdrop-blur-md">
                 <div className="flex flex-col items-end">
                    <span className="text-[8px] text-zinc-600 uppercase font-black tracking-[0.3em]">System_Status</span>
                    <span className="text-[11px] text-white font-black uppercase tracking-tighter drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]">
                       {currentUser || 'GUEST_USER'}
                    </span>
                 </div>
                 <button 
                    onClick={() => statusAvatarRef.current?.click()}
                    className="w-10 h-10 bg-zinc-900 border border-zinc-800 flex items-center justify-center relative overflow-hidden group/avatar cursor-pointer"
                 >
                    <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
                    {userAvatar ? (
                      <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <i className="fa-solid fa-user-shield text-zinc-500 text-sm"></i>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                       <i className="fa-solid fa-camera text-[10px] text-white"></i>
                    </div>
                    <input 
                      ref={statusAvatarRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleAvatarUpload(e, true)}
                    />
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></div>
                 </button>
              </div>
              {currentUser && (
                <button 
                  onClick={() => { setCurrentUser(null); setUserAvatar(null); setMaxUnlockedNight(1); setHighScores({ Easy: 0, Medium: 0, Hard: 0 }); }}
                  className="group flex items-center gap-2 px-2 py-1 hover:bg-red-950/30 transition-all rounded"
                >
                  <span className="text-[8px] text-zinc-700 group-hover:text-red-600 uppercase font-bold tracking-widest transition-colors">Logout_Terminal</span>
                  <i className="fa-solid fa-right-from-bracket text-[8px] text-zinc-800 group-hover:text-red-700"></i>
                </button>
              )}
           </div>
           </div>
        </div>
      )}

      {/* Social / Friends Modal */}
      {isSocialOpen && (
        <div className="fixed inset-0 z-[3000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
           <div className="w-full max-w-4xl h-[600px] bg-zinc-950 border-4 border-zinc-900 flex flex-col overflow-hidden shadow-[0_0_100px_black]">
              <div className="bg-zinc-900/50 p-4 border-b border-zinc-800 flex justify-between items-center">
                 <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Academy_Social_Network</h2>
                 <button onClick={() => setIsSocialOpen(false)} className="text-zinc-600 hover:text-white transition-colors">
                    <i className="fa-solid fa-xmark text-xl"></i>
                 </button>
              </div>
              
              <div className="flex-1 flex overflow-hidden">
                 {/* Sidebar: Friends List & Requests */}
                 <div className="w-64 border-r border-zinc-900 flex flex-col bg-zinc-950/50">
                    <div className="p-4 space-y-6">
                       <div className="space-y-2">
                          <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Friend_Requests</h3>
                          {friendRequests.length === 0 ? (
                            <p className="text-[8px] text-zinc-800 italic">No pending requests</p>
                          ) : (
                            friendRequests.map(r => (
                              <div key={r.from} className="bg-zinc-900 p-2 border border-zinc-800 flex flex-col gap-2">
                                 <span className="text-[10px] text-white font-bold">{r.from}</span>
                                 <div className="flex gap-2">
                                    <button onClick={() => handleRespondFriendRequest(r.from, 'accepted')} className="flex-1 bg-green-900/20 text-green-500 text-[8px] py-1 uppercase font-bold border border-green-900/50 hover:bg-green-900/40 transition-all">Accept</button>
                                    <button onClick={() => handleRespondFriendRequest(r.from, 'rejected')} className="flex-1 bg-red-900/20 text-red-500 text-[8px] py-1 uppercase font-bold border border-red-900/50 hover:bg-red-900/40 transition-all">Deny</button>
                                 </div>
                              </div>
                            ))
                          )}
                       </div>
                       
                       <div className="space-y-2">
                          <h3 className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">Active_Friends</h3>
                          {friends.length === 0 ? (
                            <p className="text-[8px] text-zinc-800 italic">No friends added yet</p>
                          ) : (
                            friends.map(f => (
                              <button 
                                key={f}
                                onClick={() => handleStartChat(f)}
                                className={`w-full text-left p-2 border transition-all ${activeChat === f ? 'bg-blue-900/20 border-blue-600 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'}`}
                              >
                                 <span className="text-[10px] font-bold uppercase">{f}</span>
                              </button>
                            ))
                          )}
                       </div>
                    </div>
                 </div>

                 {/* Main Content: Search or Chat */}
                 <div className="flex-1 flex flex-col bg-zinc-950">
                    {!activeChat ? (
                      <div className="flex-1 flex flex-col p-8 space-y-8">
                         <div className="space-y-4">
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Search_Personnel</h2>
                            <div className="relative">
                               <input 
                                 type="text"
                                 value={searchQuery}
                                 onChange={(e) => handleSearchUsers(e.target.value)}
                                 placeholder="Enter username to search..."
                                 className="w-full bg-zinc-900 border-2 border-zinc-800 p-4 text-white font-mono outline-none focus:border-blue-900 transition-colors"
                               />
                               <i className="fa-solid fa-magnifying-glass absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700"></i>
                            </div>
                         </div>

                         <div className="flex-1 overflow-y-auto space-y-4">
                            {searchResults.length === 0 ? (
                              searchQuery.length > 1 ? (
                                <p className="text-zinc-800 uppercase font-bold tracking-widest text-center mt-20">No matching personnel found</p>
                              ) : (
                                <div className="flex flex-col items-center justify-center h-full opacity-20">
                                   <i className="fa-solid fa-user-plus text-6xl mb-4"></i>
                                   <p className="text-xs uppercase font-bold tracking-widest">Search for friends to begin secure comms</p>
                                </div>
                              )
                            ) : (
                              searchResults.filter(u => u.username !== currentUser).map(u => (
                                <div key={u.username} className="bg-zinc-900/50 border border-zinc-800 p-4 flex items-center justify-between group hover:border-blue-900 transition-all">
                                   <div className="flex items-center gap-4">
                                      <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-sm overflow-hidden">
                                         {u.avatarUrl ? (
                                           <img src={u.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                         ) : (
                                           <i className="fa-solid fa-user text-zinc-800 flex items-center justify-center h-full"></i>
                                         )}
                                      </div>
                                      <span className="text-xl font-black uppercase text-white tracking-tighter">{u.username}</span>
                                   </div>
                                   {friends.includes(u.username) ? (
                                     <button onClick={() => handleStartChat(u.username)} className="px-6 py-2 bg-blue-900/20 text-blue-500 border border-blue-900 font-bold uppercase text-xs hover:bg-blue-900/40 transition-all">Message</button>
                                   ) : (
                                     <button onClick={() => handleSendFriendRequest(u.username)} className="px-6 py-2 bg-zinc-800 text-zinc-400 border border-zinc-700 font-bold uppercase text-xs hover:bg-white hover:text-black transition-all">Add Friend</button>
                                   )}
                                </div>
                              ))
                            )}
                         </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col overflow-hidden">
                         <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/20">
                            <div className="flex items-center gap-3">
                               <button onClick={() => setActiveChat(null)} className="text-zinc-600 hover:text-white"><i className="fa-solid fa-arrow-left"></i></button>
                               <span className="text-lg font-black uppercase tracking-tighter text-white">Chat_With: {activeChat}</span>
                            </div>
                         </div>
                         <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {privateMessages.length === 0 ? (
                              <p className="text-zinc-800 text-center uppercase font-bold tracking-widest mt-20 italic">No message history detected</p>
                            ) : (
                              privateMessages.map(m => (
                                <div key={m.id} className={`flex flex-col ${m.from === currentUser ? 'items-end' : 'items-start'}`}>
                                   <div className={`max-w-[80%] p-3 rounded-sm border font-mono text-[11px] ${m.from === currentUser ? 'bg-blue-900/20 border-blue-900/50 text-blue-100' : 'bg-zinc-900 border-zinc-800 text-zinc-300'}`}>
                                      {m.text}
                                   </div>
                                   <span className="text-[7px] text-zinc-700 mt-1 uppercase font-bold">{new Date(m.timestamp).toLocaleTimeString()}</span>
                                </div>
                              ))
                            )}
                         </div>
                         <div className="p-4 border-t border-zinc-900 bg-zinc-900/30 flex gap-4">
                            <input 
                              type="text"
                              value={newPrivateMessage}
                              onChange={(e) => setNewPrivateMessage(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSendPrivateMessage()}
                              placeholder="Type secure message..."
                              className="flex-1 bg-zinc-950 border border-zinc-800 p-4 text-xs text-white font-mono outline-none focus:border-blue-900 transition-colors"
                            />
                            <button 
                              onClick={handleSendPrivateMessage}
                              className="bg-blue-900 hover:bg-blue-600 text-white px-8 font-black uppercase tracking-widest transition-all"
                            >
                               Send
                            </button>
                         </div>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}

      {status === AppStatus.DESIGN && <CharacterCreator onComplete={handleDesignComplete} />}
      {(status === AppStatus.INTRO || status === AppStatus.NIGHT_CUTSCENE || status === AppStatus.ENDING_CUTSCENE) && (
        <Cutscene night={status === AppStatus.INTRO ? 1 : status === AppStatus.ENDING_CUTSCENE ? 6 : currentNight} onComplete={handleCutsceneComplete} customDesign={characterDesign} isEnding={status === AppStatus.ENDING_CUTSCENE} username={currentUser} />
      )}
      {status === AppStatus.NIGHT_START && (
        <div className="h-screen flex items-center justify-center bg-black">
           <h1 className="text-6xl font-black italic text-white tracking-tighter uppercase animate-night-entry">{isEndlessFlag ? 'ENDLESS' : `Night ${currentNight}`}</h1>
        </div>
      )}
      {(status === AppStatus.QUIZ || status === AppStatus.ENDLESS) && (
        <>
          <SecurityFeed />
          <Quiz currentQuestions={activeQuestions} currentQuestionIndex={state.currentQuestionIndex} onAnswer={handleAnswer} difficulty={selectedDifficulty} power={power} setPower={setPower} threatLevel={threatLevel} setThreatLevel={setThreatLevel} onFailure={() => handleAnswer(false)} onPause={() => setStatus(AppStatus.PAUSED)} night={currentNight} isEndless={status === AppStatus.ENDLESS} streak={state.score} />
        </>
      )}
      {status === AppStatus.RESULTS && (
        <div className="h-screen bg-zinc-950 flex flex-col items-center justify-center space-y-12">
           <h2 className="text-9xl font-black italic text-white tracking-tighter uppercase drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">6 AM</h2>
           <button onClick={handleContinueFromResults} className="px-20 py-6 bg-white text-black hover:bg-green-600 hover:text-white transition-all text-2xl font-black uppercase">Continue</button>
        </div>
      )}
      {status === AppStatus.DEAD && (
        <div className="h-screen bg-black flex flex-col items-center justify-center space-y-12 p-12">
           <h2 className="text-5xl font-black italic text-red-600 uppercase glitch-text text-center">Shift Aborted</h2>
           <button onClick={() => setStatus(AppStatus.START)} className="px-20 py-6 border-4 border-white text-white hover:bg-white hover:text-black transition-all text-2xl font-black uppercase">Try Again</button>
        </div>
      )}
      {status === AppStatus.PAUSED && (
        <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-12">
           <h2 className="text-6xl md:text-8xl font-black italic uppercase text-white">System Paused</h2>
           <div className="flex flex-col md:flex-row gap-6">
              <button onClick={() => setStatus(isEndlessFlag ? AppStatus.ENDLESS : AppStatus.QUIZ)} className="px-12 py-4 border-4 border-white text-white hover:bg-white hover:text-black transition-all font-black uppercase text-xl">Resume</button>
              <button onClick={() => setStatus(AppStatus.START)} className="px-12 py-4 border-4 border-zinc-800 text-zinc-600 hover:border-red-600 hover:text-red-600 transition-all font-black uppercase text-xl">Abort</button>
           </div>
        </div>
      )}
      <style>{`
        .noise-overlay { background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk8RryAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAA1JREFUGNNjYBgF6AAAAtAAAfeY740AAAAASUVORK5CYII='); animation: noise 0.2s infinite; }
        @keyframes night-entry { 0% { transform: scale(0.5); opacity: 0; filter: blur(20px); } 50% { transform: scale(1.1); opacity: 1; filter: blur(0px); } 100% { transform: scale(1); opacity: 1; } }
        .animate-night-entry { animation: night-entry 2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
      `}</style>
    </div>
  );
};

export default App;
