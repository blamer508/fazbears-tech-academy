import { useState, useEffect, useRef, type FC, type Dispatch, type SetStateAction } from 'react';
import { type Question, type Difficulty } from '@/types';

interface QuizProps {
  currentQuestions: Question[];
  currentQuestionIndex: number;
  onAnswer: (isCorrect: boolean) => void;
  difficulty: Difficulty;
  power: number;
  setPower: Dispatch<SetStateAction<number>>;
  threatLevel: number;
  setThreatLevel: Dispatch<SetStateAction<number>>;
  onFailure: (type: 'POWER' | 'THREAT' | 'WRONG' | 'TIMER') => void;
  onPause: () => void;
  night: number;
  isEndless?: boolean;
  streak?: number;
  gameVersion?: 1 | 2;
}

const Quiz: FC<QuizProps> = ({ 
  currentQuestions, currentQuestionIndex, onAnswer, difficulty, power, setPower, threatLevel, setThreatLevel, onFailure, onPause, night, isEndless, streak = 0, gameVersion = 1
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isFlickering, setIsFlickering] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  
  const crowbarSfxRef = useRef(new Audio('https://archive.org/download/fnaf-sounds/Metal_Clang.mp3'));
  const blipSfxRef = useRef(new Audio('https://archive.org/download/fnaf-sounds/Blip.mp3'));
  
  const question = currentQuestions && currentQuestions.length > 0 
    ? currentQuestions[currentQuestionIndex % currentQuestions.length] 
    : null;
  const totalQuestions = currentQuestions ? currentQuestions.length : 0;
  const progressPercent = isEndless ? 0 : (totalQuestions > 0 ? (currentQuestionIndex / totalQuestions) * 100 : 0);

  // Mouse and Touch tracking for flashlight effect
  useEffect(() => {
    const updatePos = (clientX: number, clientY: number) => {
      setMousePos({
        x: (clientX / window.innerWidth) * 100,
        y: (clientY / window.innerHeight) * 100
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePos(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePos(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchstart', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
    };
  }, []);

  // Visual Distortions for high streaks
  useEffect(() => {
    if (isEndless && streak > 10) {
      const glitchInterval = setInterval(() => {
        if (Math.random() > 0.95) {
          setIsGlitching(true);
          setTimeout(() => setIsGlitching(false), 150);
        }
      }, 1500);
      return () => clearInterval(glitchInterval);
    }
  }, [isEndless, streak]);

  // Flashlight flickering logic
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.92) {
        setIsFlickering(true);
        setTimeout(() => setIsFlickering(false), 50 + Math.random() * 150);
      }
    }, 2000);
    return () => clearInterval(flickerInterval);
  }, []);

  // Handle Timer Initialization
  useEffect(() => {
    let baseTime = 60;
    
    if (isEndless) {
      baseTime = 60;
    } else if (night >= 5) {
      // Nights 5, 6, 7, 8 specific limits
      if (difficulty === 'Easy') baseTime = 60;
      else if (difficulty === 'Medium') baseTime = 20;
      else if (difficulty === 'Hard') baseTime = 10;
    } else if (difficulty === 'Easy') {
      baseTime = 999; // No limit for Easy mode
    } else if (difficulty === 'Medium') {
      baseTime = 30;
    } else if (difficulty === 'Hard') {
      baseTime = 15;
    }

    const penalty = isEndless ? Math.floor(streak / 10) : 0;
    setTimeLeft(Math.max(difficulty === 'Hard' ? 5 : 10, baseTime - penalty));
    setSelectedOption(null); 
  }, [currentQuestionIndex, difficulty, night, isEndless, streak]);

  const shouldRunTimer = (isEndless || difficulty !== 'Easy' || night >= 5) && night !== 7;

  // Lockdown Timer Logic
  useEffect(() => {
    if (!selectedOption && question && shouldRunTimer) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onFailure('TIMER');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [night, isEndless, difficulty, selectedOption, onFailure, question]);

  // Power Drain and Threat Increase Logic
  useEffect(() => {
    if (difficulty === 'Easy') return; // No drain or threat in Easy mode

    const drainInterval = setInterval(() => {
      const drainRate = difficulty === 'Medium' ? 0.5 : 1.2;
      const threatRate = difficulty === 'Medium' ? 1.5 : 3.0;
      
      setPower(prev => {
        const next = prev - drainRate;
        if (next <= 0) {
          clearInterval(drainInterval);
          onFailure('POWER');
          return 0;
        }
        return next;
      });

      setThreatLevel(prev => {
        const next = prev + threatRate;
        if (next >= 100) {
          clearInterval(drainInterval);
          onFailure('THREAT');
          return 100;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(drainInterval);
  }, [difficulty, setPower, setThreatLevel, onFailure]);

  const handleOptionClick = (option: string) => {
    if (selectedOption || !question) return;
    setSelectedOption(option);
    const isCorrect = option === question.correctAnswer;
    
    if (isCorrect) {
      setPower(prev => Math.min(100, prev + (isEndless ? 2 : 5)));
      setThreatLevel(prev => Math.max(0, prev - (isEndless ? 5 : 10)));
      
      const clone = blipSfxRef.current.cloneNode() as HTMLAudioElement;
      clone.volume = 0.3;
      clone.play().catch(() => {});

      setTimeout(() => {
        onAnswer(true);
        setSelectedOption(null);
      }, 600);
    } else {
      crowbarSfxRef.current.play().catch(() => {});
      setTimeout(() => onAnswer(false), 400);
    }
  };

  const isDoorNight = night === 6 || night === 8;
  const accentColor = gameVersion === 1 ? 'text-red-600' : 'text-blue-600';
  const accentBg = gameVersion === 1 ? 'bg-red-600' : 'bg-blue-600';
  const accentBorder = gameVersion === 1 ? 'border-red-600' : 'border-blue-600';

  if (!question) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center space-y-4 font-mono">
        <div className={`w-12 h-12 border-4 ${accentBorder} border-t-transparent rounded-full animate-spin`}></div>
        <p className={`${accentColor} text-xs uppercase tracking-[0.5em] animate-pulse`}>Initializing_System_Log...</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-screen flex flex-col items-center justify-center p-8 bg-black overflow-hidden font-mono select-none transition-colors duration-500 ${isGlitching ? 'bg-purple-900/20' : ''}`}>
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
         {isDoorNight ? (
            <div className="absolute inset-0 bg-zinc-950 flex items-center justify-center">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
               {/* The Door */}
               <div className="relative w-64 h-96 bg-zinc-900 border-8 border-zinc-800 rounded-t-xl shadow-[0_0_100px_black] overflow-hidden">
                  <div className="absolute top-1/2 left-4 w-4 h-4 bg-zinc-700 rounded-full"></div>
               {/* Antagonist Silhouette */}
               <div className={`absolute inset-0 ${gameVersion === 1 ? 'bg-purple-950/20' : 'bg-zinc-900/20'} flex flex-col items-center justify-end pb-10 animate-pulse`}>
                  <div className={`w-24 h-32 ${gameVersion === 1 ? 'bg-purple-950 rounded-full' : 'bg-zinc-800 rounded-2xl'} border-2 border-black mb-[-20px]`}></div>
                  <div className={`w-32 h-40 ${gameVersion === 1 ? 'bg-purple-900 rounded-t-full' : 'bg-zinc-700 rounded-t-3xl'} border-2 border-black`}></div>
               </div>
                  {/* Cracks on door based on progress */}
                  {progressPercent > 20 && <div className="absolute top-10 left-10 w-20 h-1 bg-zinc-800 rotate-45"></div>}
                  {progressPercent > 40 && <div className="absolute top-40 right-10 w-32 h-1 bg-zinc-800 -rotate-12"></div>}
                  {progressPercent > 60 && <div className="absolute bottom-20 left-5 w-40 h-1 bg-zinc-800 rotate-6"></div>}
                  {progressPercent > 80 && <div className="absolute inset-0 bg-red-900/10 animate-pulse"></div>}
               </div>
               {/* Room elements */}
               <div className="absolute bottom-0 left-0 right-0 h-20 bg-zinc-950 border-t-4 border-black"></div>
               <div className={`absolute top-10 left-10 ${accentColor} animate-pulse font-mono text-xl`}>DOOR_INTEGRITY: {Math.max(0, 100 - Math.floor(progressPercent))}%</div>
            </div>
         ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1a1a2e_0%,#05050a_100%)]"></div>
         )}
         <div className="absolute inset-0 noise-overlay opacity-[0.03]"></div>
      </div>

      {/* Flashlight Overlay Layer */}
      <div 
        className={`absolute inset-0 pointer-events-none z-50 transition-opacity duration-75 ${isFlickering ? 'opacity-20' : 'opacity-100'}`}
        style={{
          background: `radial-gradient(circle 350px at ${mousePos.x}% ${mousePos.y}%, transparent 0%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.95) 100%)`
        }}
      ></div>

      {/* HUD Bar */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-[60]">
        <div className="flex gap-8 items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase">{gameVersion === 1 ? 'SYSTM_ENRGY' : 'CORE_STABILITY'}</span>
              <span className={`text-2xl font-black ${power < 20 ? 'text-red-500 animate-pulse' : (gameVersion === 1 ? 'text-green-500' : 'text-blue-500')}`}>{Math.floor(power)}%</span>
            </div>
            <div className="w-64 h-2 bg-zinc-950 border border-zinc-800 relative overflow-hidden">
              <div className={`h-full transition-all duration-300 ${power < 20 ? 'bg-red-600' : (gameVersion === 1 ? 'bg-green-600' : 'bg-blue-600')}`} style={{ width: `${power}%` }}></div>
            </div>
          </div>
          
          {!isEndless && (
            <div className="space-y-1">
               <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase block text-right">{gameVersion === 1 ? 'DATA_SYNC_PROGRS' : 'RESEARCH_SYNC_PROGRS'}</span>
               <div className="w-48 h-2 bg-zinc-950 border border-zinc-800 relative overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
               </div>
            </div>
          )}
        </div>

        {/* Timer UI - Only visible when active */}
        {shouldRunTimer ? (
          <div className="text-center">
            <div className="text-zinc-500 text-[10px] tracking-[0.4em] mb-1">{isEndless ? 'BREACH_STABILITY' : 'LOCKDOWN_TIMER'}</div>
            <div className={`text-5xl font-black italic transition-colors ${timeLeft < 5 ? 'text-red-600 animate-pulse' : (gameVersion === 1 ? 'text-white' : 'text-blue-400')}`}>
              {timeLeft > 900 ? '--:--' : `00:${timeLeft.toString().padStart(2, '0')}`}
            </div>
          </div>
        ) : (
          <div className="w-32"></div> // Spacer to maintain layout
        )}

        <div className="flex flex-col items-end gap-2">
          <button 
            onClick={onPause}
            className="w-10 h-10 border-2 border-zinc-800 bg-black flex items-center justify-center hover:bg-zinc-800 hover:border-white transition-all text-zinc-600 hover:text-white mb-2"
          >
            <i className="fa-solid fa-pause"></i>
          </button>
          <div className="text-right space-y-1">
            <span className="text-zinc-500 text-xs font-bold tracking-widest uppercase">Threat_Proximity</span>
            <div className="flex gap-1 justify-end">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`w-3 h-6 border ${threatLevel > i * 10 ? `${accentBg} ${accentBorder} animate-pulse` : 'bg-zinc-900 border-zinc-800'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Quiz Area */}
      <div className={`relative z-20 w-full max-w-4xl bg-zinc-950/30 border-4 border-zinc-900/50 p-12 shadow-[0_0_150px_rgba(0,0,0,1)] transform rotate-[-0.5deg] ${isGlitching ? 'animate-[shake_0.2s_infinite]' : ''}`}>
        <div className="mb-10">
          <span className="text-zinc-700 text-[10px] tracking-[0.5em] font-bold uppercase block mb-2">
            {isEndless ? `EN-DL-ESS_BREACH_LOG_${streak}` : `Night_${night}_Sector_${question.category}`}
          </span>
          <h2 className={`text-3xl md:text-4xl font-black text-white italic leading-tight tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] ${isGlitching ? 'glitch-text' : ''}`}>
            {question.question}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option, idx) => {
            const isCorrect = option === question.correctAnswer;
            const isSelected = selectedOption === option;
            let bgColor = 'bg-zinc-900/20 border-zinc-800/40 text-zinc-500 hover:border-zinc-500 hover:text-white';
            
            if (isSelected) {
              bgColor = isCorrect ? 'bg-green-900/40 border-green-500 text-green-400' : 'bg-red-900/40 border-red-500 text-red-400';
            }

            return (
              <button
                key={idx}
                disabled={!!selectedOption}
                onClick={() => handleOptionClick(option)}
                className={`group relative p-6 border-2 transition-all text-left uppercase font-bold text-sm tracking-widest flex items-center justify-between ${bgColor}`}
              >
                <span>{option}</span>
                {isSelected && (
                  <i className={`fa-solid ${isCorrect ? 'fa-check' : 'fa-xmark'} animate-in zoom-in`}></i>
                )}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0% { transform: translate(0,0); }
          25% { transform: translate(-2px, 2px); }
          50% { transform: translate(2px, -2px); }
          75% { transform: translate(-2px, -2px); }
          100% { transform: translate(0,0); }
        }
      `}</style>
    </div>
  );
};

export default Quiz;
