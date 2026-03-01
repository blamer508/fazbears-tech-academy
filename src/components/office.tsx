
import { useState, useEffect, useRef, type FC, type Dispatch, type SetStateAction } from 'react';
import { ANIMATRONICS } from '@/constants';

interface OfficeProps {
  power: number;
  setPower: Dispatch<SetStateAction<number>>;
  onPowerOut: () => void;
  onWin: () => void;
  difficulty: string;
}

const CAMERAS = [
  { id: '1A', name: 'Show Stage', desc: 'Main stage area. Static is high.' },
  { id: '1B', name: 'Dining Area', desc: 'Tables and chairs. Dark.' },
  { id: '2A', name: 'West Hall', desc: 'Leading to your left door.' },
  { id: '2B', name: 'West Closet', desc: 'Storage for cleaning supplies.' },
  { id: '3', name: 'Supply Closet', desc: 'Maintenance area.' },
  { id: '4A', name: 'East Hall', desc: 'Leading to your right door.' },
  { id: '4B', name: 'East Corner', desc: 'Blind spot near your office.' },
  { id: '5', name: 'Backstage', desc: 'Spare parts and masks.' },
];

const Office: FC<OfficeProps> = ({ power, setPower, onPowerOut, onWin, difficulty }) => {
  const [leftDoorOpen, setLeftDoorOpen] = useState(true);
  const [rightDoorOpen, setRightDoorOpen] = useState(true);
  const [monitorOpen, setMonitorOpen] = useState(false);
  const [currentCam, setCurrentCam] = useState(CAMERAS[0]);
  const [time, setTime] = useState(0); 
  const [threatPos, setThreatPos] = useState<string>('1A');
  const [activeThreat, setActiveThreat] = useState(ANIMATRONICS[0]);
  const [isSwitching, setIsSwitching] = useState(false);
  
  const moveSoundRef = useRef(new Audio('https://archive.org/download/fnaf-sounds/Footsteps.mp3'));

  // Time progression
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setTime(prev => {
        if (prev >= 5) {
          clearInterval(timeInterval);
          onWin();
          return 6;
        }
        return prev + 1;
      });
    }, 45000);
    return () => clearInterval(timeInterval);
  }, [onWin]);

  // Animatronic Logic: Moves every 10-15 seconds
  useEffect(() => {
    const aiInterval = setInterval(() => {
      setThreatPos(prev => {
        const paths: Record<string, string[]> = {
          '1A': ['1B', '5'],
          '1B': ['2A', '3', '4A'],
          '2A': ['2B', 'OFFICE_L'],
          '2B': ['2A'],
          '3': ['1B'],
          '4A': ['4B', 'OFFICE_R'],
          '4B': ['4A'],
          '5': ['1A'],
          'OFFICE_L': ['1A'], 
          'OFFICE_R': ['1A'],
        };
        const nextOptions = paths[prev] || ['1A'];
        const next = nextOptions[Math.floor(Math.random() * nextOptions.length)];
        
        // Randomly change which animatronic is active on movement
        if (Math.random() > 0.7) {
          setActiveThreat(ANIMATRONICS[Math.floor(Math.random() * ANIMATRONICS.length)]);
        }

        if (next.startsWith('OFFICE')) {
           moveSoundRef.current.play().catch(() => {});
        }
        return next;
      });
    }, difficulty === 'Hard' ? 8000 : 15000);
    return () => clearInterval(aiInterval);
  }, [difficulty]);

  // Check for jumpscare if threat is at office and door is open
  useEffect(() => {
    if (threatPos === 'OFFICE_L' && leftDoorOpen) {
      const timer = setTimeout(onPowerOut, 4000);
      return () => clearTimeout(timer);
    }
    if (threatPos === 'OFFICE_R' && rightDoorOpen) {
      const timer = setTimeout(onPowerOut, 4000);
      return () => clearTimeout(timer);
    }
  }, [threatPos, leftDoorOpen, rightDoorOpen, onPowerOut]);

  // Power Drain logic
  useEffect(() => {
    const usage = 1 + (!leftDoorOpen ? 2 : 0) + (!rightDoorOpen ? 2 : 0) + (monitorOpen ? 1 : 0);
    const drainInterval = setInterval(() => {
      setPower(prev => {
        const next = prev - (usage * (difficulty === 'Hard' ? 0.05 : 0.03));
        if (next <= 0) {
          clearInterval(drainInterval);
          onPowerOut();
          return 0;
        }
        return next;
      });
    }, 100);
    return () => clearInterval(drainInterval);
  }, [leftDoorOpen, rightDoorOpen, monitorOpen, setPower, onPowerOut, difficulty]);

  const switchCam = (cam: typeof CAMERAS[0]) => {
    setIsSwitching(true);
    setCurrentCam(cam);
    setTimeout(() => setIsSwitching(false), 300);
    const beep = new Audio('https://archive.org/download/fnaf-sounds/Blip.mp3');
    beep.volume = 0.2;
    beep.play().catch(() => {});
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-950 overflow-hidden font-mono">
      {/* Main Office View */}
      <div className="relative w-full max-w-6xl aspect-video border-8 border-zinc-900 bg-zinc-950 flex justify-between items-center p-12 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,1)]">
        
        {/* Left Side: Door + Buttons */}
        <div className="flex flex-col items-center gap-6">
          <div className="p-4 bg-zinc-900 border-2 border-zinc-800 rounded-lg flex flex-col gap-4">
             <button 
                onClick={() => setLeftDoorOpen(!leftDoorOpen)}
                className={`w-16 h-16 rounded flex items-center justify-center transition-all ${leftDoorOpen ? 'bg-zinc-800 text-zinc-600' : 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]'}`}
             >
               <i className={`fa-solid ${leftDoorOpen ? 'fa-door-open' : 'fa-door-closed'} text-2xl`}></i>
             </button>
             <div className={`w-16 h-4 rounded-full ${threatPos === 'OFFICE_L' ? 'bg-red-500 animate-pulse shadow-[0_0_10px_red]' : 'bg-zinc-800'}`}></div>
          </div>
          <div className={`w-40 h-[400px] border-x-8 border-t-8 transition-all duration-300 ${leftDoorOpen ? 'bg-zinc-900/10 border-zinc-800 translate-y-[-100%]' : 'bg-zinc-800 border-zinc-700 translate-y-0'}`}></div>
        </div>

        {/* Center: Desk & Controls */}
        <div className="flex-1 flex flex-col items-center justify-center gap-12">
          <div className="text-center group cursor-default">
             <div className="text-[10px] text-zinc-600 tracking-[0.5em] uppercase mb-2">Facility Time</div>
             <h3 className="text-8xl font-black text-white italic drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">{time === 0 ? '12' : time} AM</h3>
             <div className="h-1 w-full bg-gradient-to-r from-transparent via-red-900 to-transparent mt-2"></div>
          </div>

          <div className="relative w-96 h-48 bg-zinc-900 rounded-xl border-4 border-zinc-800 shadow-2xl flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-blue-900/5 animate-pulse"></div>
             <div className="text-center space-y-2">
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Main Terminal</p>
                <div className="flex justify-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
                   <div className={`w-2 h-2 rounded-full ${threatPos.startsWith('OFFICE') ? 'bg-red-500 animate-ping' : 'bg-zinc-800'}`}></div>
                </div>
                {threatPos.startsWith('OFFICE') && (
                  <p className="text-red-600 text-xs font-black animate-pulse uppercase">Prox Alert: Door Breach Imminent</p>
                )}
             </div>
          </div>

          <button 
            onMouseEnter={() => {
               const sfx = new Audio('https://archive.org/download/fnaf-sounds/Monitor%20Up.mp3');
               sfx.volume = 0.3;
               sfx.play().catch(() => {});
            }}
            onClick={() => setMonitorOpen(!monitorOpen)}
            className="group relative px-20 py-8 bg-zinc-900 border-x-4 border-t-4 border-zinc-800 hover:bg-zinc-800 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <span className="text-zinc-500 font-black text-xl tracking-[0.3em] uppercase group-hover:text-white transition-colors">Monitor</span>
            <div className="mt-2 flex justify-center gap-1">
               <div className="w-8 h-1 bg-blue-600"></div>
            </div>
          </button>
        </div>

        {/* Right Side: Door + Buttons */}
        <div className="flex flex-col items-center gap-6">
          <div className="p-4 bg-zinc-900 border-2 border-zinc-800 rounded-lg flex flex-col gap-4">
             <button 
                onClick={() => setRightDoorOpen(!rightDoorOpen)}
                className={`w-16 h-16 rounded flex items-center justify-center transition-all ${rightDoorOpen ? 'bg-zinc-800 text-zinc-600' : 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]'}`}
             >
               <i className={`fa-solid ${rightDoorOpen ? 'fa-door-open' : 'fa-door-closed'} text-2xl`}></i>
             </button>
             <div className={`w-16 h-4 rounded-full ${threatPos === 'OFFICE_R' ? 'bg-red-500 animate-pulse shadow-[0_0_10px_red]' : 'bg-zinc-800'}`}></div>
          </div>
          <div className={`w-40 h-[400px] border-x-8 border-t-8 transition-all duration-300 ${rightDoorOpen ? 'bg-zinc-900/10 border-zinc-800 translate-y-[-100%]' : 'bg-zinc-800 border-zinc-700 translate-y-0'}`}></div>
        </div>
      </div>

      {/* Monitor Overlay */}
      {monitorOpen && (
        <div className="fixed inset-4 bg-zinc-950 z-50 border-[12px] border-zinc-900 shadow-[0_0_200px_rgba(0,0,0,1)] flex flex-col animate-in zoom-in duration-200">
          
          {/* Top Info Bar */}
          <div className="h-12 bg-zinc-900 flex items-center justify-between px-6 border-b-2 border-zinc-800">
             <div className="flex items-center gap-4">
                <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
                <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Live Feed - CAM {currentCam.id}</span>
             </div>
             <div className={`text-[10px] uppercase font-bold transition-colors ${threatPos === currentCam.id ? 'text-red-500' : 'text-zinc-500'}`}>
                Status: {threatPos === currentCam.id ? 'THREAT_IN_VIEW' : 'NOMINAL'}
             </div>
             <button onClick={() => setMonitorOpen(false)} className="text-red-900 hover:text-red-600 transition-colors"><i className="fa-solid fa-xmark text-xl"></i></button>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Viewport */}
            <div className="flex-1 relative bg-black overflow-hidden border-r-4 border-zinc-900">
               {/* Feed Content */}
               <div className={`absolute inset-0 transition-opacity duration-300 ${isSwitching ? 'opacity-0' : 'opacity-100'}`}>
                  <div className="absolute inset-0 bg-green-900/5 mix-blend-color pointer-events-none"></div>
                  
                  {/* Dynamic Scene Content */}
                  <div className="w-full h-full flex items-center justify-center flex-col text-center p-20 relative">
                     <i className={`fa-solid fa-camera-retro text-9xl transition-all duration-1000 ${threatPos === currentCam.id ? 'text-zinc-950 blur-sm scale-110' : 'text-zinc-900'}`}></i>
                     
                     <div className="mt-8">
                        <h4 className="text-white text-4xl font-black uppercase mb-4 tracking-tighter italic">{currentCam.name}</h4>
                        <p className="text-zinc-600 max-w-md font-mono text-sm uppercase">{currentCam.desc}</p>
                     </div>
                     
                     {/* Animatronic Silhouette */}
                     {threatPos === currentCam.id && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                           <div className={`w-96 h-96 ${activeThreat.color} opacity-20 blur-3xl animate-pulse rounded-full`}></div>
                           <div className="relative animate-[shake_0.5s_infinite]">
                              <i className={`fa-solid fa-robot text-[12rem] ${activeThreat.color.replace('bg-', 'text-')} opacity-60 filter drop-shadow-[0_0_20px_black]`}></i>
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-12">
                                 <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white] animate-ping"></div>
                                 <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white] animate-ping"></div>
                              </div>
                           </div>
                           <div className="absolute top-1/4 right-1/4 transform rotate-12 bg-red-600/10 text-red-600 px-6 py-2 border border-red-600 font-black tracking-[0.5em] animate-pulse">
                              {activeThreat.name.toUpperCase()} DETECTED
                           </div>
                        </div>
                     )}
                  </div>

                  {/* UI Overlays */}
                  <div className="absolute top-10 left-10 text-white font-black text-xl italic opacity-50">CAM {currentCam.id}</div>
                  <div className="absolute bottom-10 left-10 text-zinc-500 text-xs">{new Date().toLocaleDateString()} - SECURITY_SYS_v0.9</div>
               </div>

               {/* Static Overlay - No more Giphy */}
               <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px]"></div>
            </div>

            {/* Sidebar Controls & Minimap */}
            <div className="w-96 bg-zinc-950 p-6 flex flex-col">
               <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                  {CAMERAS.map(cam => (
                    <button 
                      key={cam.id}
                      onClick={() => switchCam(cam)}
                      className={`w-full text-left p-4 border-2 transition-all flex justify-between items-center group ${currentCam.id === cam.id ? 'border-green-600 bg-green-900/10 text-green-500' : 'border-zinc-800 text-zinc-600 hover:border-zinc-600'}`}
                    >
                      <span className="font-bold text-sm tracking-widest">CAM {cam.id}</span>
                      <div className={`w-2 h-2 rounded-full ${threatPos === cam.id ? 'bg-red-500 animate-ping shadow-[0_0_10px_red]' : 'bg-zinc-800'}`}></div>
                    </button>
                  ))}
               </div>

               {/* Minimap View - Now with Animatronic Radar */}
               <div className="mt-8 border-4 border-zinc-800 bg-zinc-900 aspect-square relative p-4 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,100,0,0.1)_0%,transparent_70%)]"></div>
                  <div className="relative w-full h-full border-2 border-zinc-700/50">
                     {/* Map Grid */}
                     <div className="grid grid-cols-3 grid-rows-3 gap-2 w-full h-full p-2">
                        {CAMERAS.map(cam => (
                           <div 
                              key={cam.id} 
                              className={`border relative flex items-center justify-center text-[8px] font-bold transition-all ${currentCam.id === cam.id ? 'border-green-500 bg-green-500/20 text-green-500' : 'border-zinc-800/50 text-zinc-800'}`}
                           >
                              {cam.id}
                              {/* The Red Dot: SHOWS WHERE THEY ARE */}
                              {threatPos === cam.id && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                   <div className="w-2 h-2 bg-red-600 rounded-full animate-ping shadow-[0_0_10px_red]"></div>
                                </div>
                              )}
                           </div>
                        ))}
                        {/* Office Node */}
                        <div className="col-start-2 row-start-3 border-2 border-blue-600 bg-blue-900/20 flex items-center justify-center text-[6px] text-blue-400 font-bold relative">
                           OFFICE
                           {(threatPos === 'OFFICE_L' || threatPos === 'OFFICE_R') && (
                              <div className="absolute -top-1 -left-1 -right-1 -bottom-1 border-2 border-red-600 animate-pulse"></div>
                           )}
                        </div>
                     </div>
                  </div>
                  <div className="absolute top-2 right-2 text-[8px] text-zinc-600 font-black uppercase">RADAR_LINK_STABLE</div>
               </div>
               
               <div className="mt-4 p-4 bg-zinc-900 border border-zinc-800">
                  <p className="text-zinc-600 text-[9px] leading-tight uppercase font-bold mb-2">Intelligence Log:</p>
                  <p className="text-zinc-500 text-[9px] italic">
                     {threatPos.startsWith('OFFICE') 
                        ? 'CRITICAL: Entity is directly outside your station!' 
                        : `Target ${activeThreat.name} last detected in ${CAMERAS.find(c => c.id === threatPos)?.name || 'Transit'}.`}
                  </p>
               </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Interaction Hints */}
      <div className="fixed top-6 right-6 text-zinc-700 text-[10px] font-bold uppercase tracking-widest text-right pointer-events-none">
         System Load: NOMINAL<br/>
         Entities Logged: {ANIMATRONICS.length}<br/>
         Current Threat: {activeThreat.name.toUpperCase()}
      </div>
    </div>
  );
};

export default Office;
