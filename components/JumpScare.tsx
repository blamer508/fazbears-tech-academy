
import React, { useEffect, useRef } from 'react';

interface JumpScareProps {
  onComplete: () => void;
  scareIndex: number;
}

const JumpScare: React.FC<JumpScareProps> = ({ onComplete }) => {
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
        src="https://archive.org/download/fnaf-1-jumpscare-sound/FNaF%201%20Jumpscare%20Sound.mp3"
        preload="auto"
      />

      {/* Strobe Effect Layer */}
      <div className="absolute inset-0 z-[510] animate-[strobe_0.08s_infinite] pointer-events-none"></div>

      {/* Glitchy Text Overlay */}
      <div className="relative z-[530] text-center px-4">
        <h1 className="text-white text-7xl md:text-9xl font-black italic tracking-tighter uppercase glitch-text animate-[shake_0.05s_infinite] drop-shadow-[0_0_50px_rgba(255,0,0,1)]">
          CRITICAL ERROR
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
