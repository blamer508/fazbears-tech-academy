import { useEffect, useRef, type FC } from 'react';

interface JumpScareProps {
  onComplete: () => void;
  scareIndex: number;
  gameVersion?: 1 | 2 | 3;
}

const JumpScare: FC<JumpScareProps> = ({ onComplete, gameVersion = 1 }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = 1.0;
          await audioRef.current.play();
        } catch (err) {
          console.warn("Audio playback failed:", err);
        }
      }
    };

    playAudio();

    const timer = setTimeout(() => {
      onComplete();
    }, 1800); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[500] bg-black overflow-hidden flex items-center justify-center">
      <audio 
        ref={audioRef}
        src={gameVersion === 3 ? "https://archive.org/download/fnaf-sounds/Jumpscare_FNaF3.mp3" : "https://archive.org/download/fnaf-1-jumpscare-sound/FNaF%201%20Jumpscare%20Sound.mp3"}
        preload="auto"
      />

      {/* Strobe Effect Layer */}
      <div className="absolute inset-0 z-[510] animate-[strobe_0.08s_infinite] pointer-events-none"></div>

      {/* Springtrap Jumpscare Visual */}
      {gameVersion === 3 && (
        <div className="absolute inset-0 z-[520] flex items-center justify-center animate-[shake_0.05s_infinite]">
           <div className="relative w-[600px] h-[600px] flex flex-col items-center justify-center scale-[1.5]">
              {/* Head */}
              <div className="relative w-64 h-72 bg-green-800 border-[8px] border-black rounded-3xl overflow-hidden z-20 shadow-[0_0_100px_rgba(34,197,94,0.5)]">
                 <div className="absolute top-1/4 left-0 right-0 flex justify-around px-8">
                    <div className="w-16 h-16 bg-zinc-950 border-4 border-black rounded-full flex items-center justify-center">
                       <div className="w-6 h-6 bg-white shadow-[0_0_20px_white] rounded-full"></div>
                    </div>
                    <div className="w-16 h-16 bg-zinc-950 border-4 border-black rounded-full flex items-center justify-center">
                       <div className="w-6 h-6 bg-white shadow-[0_0_20px_white] rounded-full"></div>
                    </div>
                 </div>
                 <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-40 h-20 bg-zinc-900 border-4 border-black rounded-xl flex flex-col justify-between p-2">
                    <div className="flex justify-between h-6">
                       {[...Array(6)].map((_, i) => <div key={i} className="w-4 h-full bg-yellow-100/80 border border-black"></div>)}
                    </div>
                    <div className="flex justify-between h-6">
                       {[...Array(6)].map((_, i) => <div key={i} className="w-4 h-full bg-yellow-100/80 border border-black"></div>)}
                    </div>
                 </div>
              </div>
              {/* Broken Ears */}
              <div className="absolute -top-10 left-1/4 w-12 h-40 bg-green-900 border-4 border-black rounded-t-full rotate-[-20deg] -z-10"></div>
              <div className="absolute -top-5 right-1/4 w-12 h-20 bg-green-900 border-4 border-black rounded-t-full rotate-[30deg] -z-10"></div>
           </div>
        </div>
      )}

      {/* Glitchy Text Overlay */}
      <div className="relative z-[530] text-center px-4">
        <h1 className="text-white text-7xl md:text-9xl font-black italic tracking-tighter uppercase glitch-text animate-[shake_0.05s_infinite] drop-shadow-[0_0_50px_rgba(255,0,0,1)]">
          {gameVersion === 3 ? "SYSTEM COLLAPSE" : "CRITICAL ERROR"}
        </h1>
      </div>

      <style>{`
        @keyframes strobe {
          0% { background: rgba(255, 0, 0, 0.4); }
          50% { background: rgba(0, 0, 0, 1); }
          100% { background: rgba(255, 255, 255, 0.1); }
        }
        @keyframes shake {
          0% { transform: translate(0,0) scale(1); }
          25% { transform: translate(-20px, 20px) scale(1.1); }
          50% { transform: translate(20px, -20px) scale(1.05); }
          75% { transform: translate(-20px, -20px) scale(1.2); }
          100% { transform: translate(0,0) scale(1); }
        }
      `}</style>
    </div>
  );
};

export default JumpScare;
