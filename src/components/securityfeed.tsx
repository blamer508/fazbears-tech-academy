import { useEffect, useRef, useState, type FC } from 'react';

const SecurityFeed: FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(false);

  useEffect(() => {
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch (err) {
        setHasPermission(false);
      }
    }
    startCamera();

    // Psychological 'Movement Detected' randomly
    const warningInterval = setInterval(() => {
      if (Math.random() > 0.8) {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 2000);
      }
    }, 10000);

    return () => {
      clearInterval(warningInterval);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed bottom-24 right-6 w-48 h-32 border-2 border-zinc-800 bg-black overflow-hidden z-20 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      {hasPermission ? (
        <div className="relative w-full h-full">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover grayscale brightness-50 contrast-150 sepia-[.30] hue-rotate-[100deg]"
          />
          <div className="absolute top-2 left-2 flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${showWarning ? 'bg-red-500 scale-150' : 'bg-red-800'} animate-pulse`}></div>
            <span className={`text-[8px] font-mono font-bold ${showWarning ? 'text-red-500' : 'text-red-900'}`}>{showWarning ? 'MOVEMENT DETECTED' : 'REC'}</span>
          </div>
          <div className="absolute bottom-2 right-2 text-[8px] font-mono text-green-500 opacity-70">CAM_01 - OFFICE</div>
          {/* Static Scanlines */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_2px]"></div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-800 p-2 text-center">
          <i className="fa-solid fa-video-slash mb-2"></i>
          <span className="text-[8px] font-mono uppercase">SIGNAL LOST</span>
        </div>
      )}
    </div>
  );
};

export default SecurityFeed;
