
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { CharacterDesign } from '../types';

interface CutsceneProps {
  onComplete: () => void;
  night?: number;
  customDesign?: CharacterDesign | null;
  isEnding?: boolean;
  username?: string | null;
}

const Cutscene: React.FC<CutsceneProps> = ({ onComplete, night = 1, customDesign, isEnding, username }) => {
  const [text, setText] = useState("");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [showPortraits, setShowPortraits] = useState(false);
  const [isImpact, setIsImpact] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSlamming, setIsSlamming] = useState(false);
  const [isDrinking, setIsDrinking] = useState(false);
  const [liquidLevel, setLiquidLevel] = useState(80);
  const [isTyping, setIsTyping] = useState(false);
  const [showID, setShowID] = useState(false);
  const [showTV, setShowTV] = useState(false);
  const [policeMode, setPoliceMode] = useState(false);
  const [gameWin, setGameWin] = useState(false);
  const [doorSmashed, setDoorSmashed] = useState(false);

  const slamSfx = useRef(new Audio('https://archive.org/download/fnaf-sounds/Metal_Clang.mp3'));
  const runSfx = useRef(new Audio('https://archive.org/download/fnaf-sounds/Footsteps.mp3'));
  const slurpSfx = useRef(new Audio('https://archive.org/download/fnaf-sounds/Slurp.mp3'));
  const blipSfx = useRef(new Audio('https://archive.org/download/fnaf-sounds/Blip.mp3'));
  const doorLockSfx = useRef(new Audio('https://archive.org/download/fnaf-sounds/Door_Slam.mp3'));
  const glassShatterSfx = useRef(new Audio('https://archive.org/download/fnaf-sounds/Glass_Break.mp3'));
  const sirenSfx = useRef(new Audio('https://archive.org/download/fnaf-sounds/Siren.mp3'));

  const dialogues = useMemo(() => {
    const displayName = username || "TECHNICIAN";
    const technicianLabel = customDesign?.gender === 'female' ? "TECHNICIAN (F)" : customDesign?.gender === 'other' ? "TECHNICIAN (X)" : "TECHNICIAN";

    if (isEnding) {
      return [
        { speaker: "LOCATION", msg: "SECURITY OFFICE - FINAL BREACH", side: 'center' },
        { speaker: "PURPLE_GUY", msg: "DONE PLAYING GAMES. NOW YOU DIE.", side: 'right' },
        { speaker: "LOCATION", msg: "*CRACK* *SHATTER* *SMASH*", side: 'center' },
        { speaker: "PURPLE_GUY", msg: "I have you now... wait... what is that noise?", side: 'right' },
        { speaker: "LOCATION", msg: "POLICE SIRENS APPROACHING", side: 'center' },
        { speaker: "WILLIAM AFTON", msg: "NO! NOT LIKE THIS!", side: 'right' },
        { speaker: "LOCATION", msg: "WILLIAM AFTON TAKEN INTO CUSTODY", side: 'center' },
        { speaker: displayName, msg: "oh, so that's what W.A. stands for, if i'd known sooner, i wouldn't do this job", side: 'left' },
        { speaker: "NEWS", msg: "the kidnapper and murderer of the children is finally captured", side: 'center' }
      ];
    }
    const introDialogues = [
      { speaker: "LOCATION", msg: "FAZBEAR'S RETRO SHAKES & DINER - 11:45 PM", side: 'center' },
      { speaker: displayName, msg: "(Slurp... slurp...) Man, this chocolate shake is the only thing keeping me sane after that server crash.", side: 'left' },
      { speaker: "???", msg: `You look like a ${customDesign?.gender === 'female' ? 'girl' : customDesign?.gender === 'other' ? 'person' : 'kid'} who knows their way around a motherboard.`, side: 'right' },
      { speaker: displayName, msg: "(!?) Who are you? I'm just here for the dairy! Don't come any closer!", side: 'left' },
      { speaker: "PURPLE_GUY", msg: "Relax. I noticed you fixed the arcade machine in the corner with a paperclip and a piece of gum.", side: 'right' },
      { speaker: "PURPLE_GUY", msg: "We're looking for a... specialized technician for the graveyard shift. High pay. Low... social interaction.", side: 'right' },
      { speaker: displayName, msg: "Night shift? Tech maintenance? I guess my rent is overdue. When do I start?", side: 'left' },
      { speaker: "PURPLE_GUY", msg: "Right now. Welcome to the team. Don't forget your flashlight.", side: 'right' }
    ];

    const night2Dialogues = [
      { speaker: "LOCATION", msg: "FAZBEAR'S ENTERTAINMENT OFFICE - NIGHT 2", side: 'center' },
      { speaker: displayName, msg: "Well... this is my second shift. I barely survived the first one.", side: 'left' },
      { speaker: displayName, msg: "(Adjusts flashlight) But why is that purple man acting so strange lately?", side: 'left' },
      { speaker: displayName, msg: "He keeps looking at the storage room and smiling... I better get to work before the power cuts out again.", side: 'left' }
    ];

    const night3Dialogues = [
      { speaker: "LOCATION", msg: "SERVICE CORRIDOR B - NIGHT 3", side: 'center' },
      { speaker: displayName, msg: "Is it just me, or does this place smell like... iron? And copper?", side: 'left' },
      { speaker: displayName, msg: "Wait... what is he carrying? That sack looks heavy...", side: 'left' },
      { speaker: displayName, msg: "Is that... blood? D-dripping from the bottom??", side: 'left' },
      { speaker: displayName, msg: "Hey! Boss! What's in the bag? Do you need a hand?", side: 'left' },
      { speaker: displayName, msg: "He just ignored me... I'm going to check if he's okay.", side: 'left' },
      { speaker: "LOCATION", msg: "SYSTEM ERROR: DOOR_BREACH_V3", side: 'center' },
      { speaker: "PURPLE_GUY", msg: "STAY OUT. GO BACK TO YOUR MONITOR.", side: 'right' }
    ];

    const night4Dialogues = [
      { speaker: "LOCATION", msg: "ADMINISTRATION WING - NIGHT 4", side: 'center' },
      { speaker: displayName, msg: "He's not at the desk... this is my chance to see what he's hiding.", side: 'left' },
      { speaker: displayName, msg: "(Sneaks into the office) It's so cold in here. Why is there a nameplate on the floor?", side: 'left' },
      { speaker: "LOCATION", msg: "INSPECTION: NAMEPLATE_SCAN", side: 'center' },
      { speaker: displayName, msg: "'W.A.'... That's all it says. Who is W.A.? Is that his real name?", side: 'left' },
      { speaker: "LOCATION", msg: "AUDIO DETECTED: INTERCEPTED_CALL", side: 'center' },
      { speaker: "PURPLE_GUY", msg: "(Muffled phone) ...Yes, the current technician is too curious. They're next tomorrow night. Prepare the suit.", side: 'right' },
      { speaker: displayName, msg: "(!!!) Next? Suits? I need to get out of here before he finds me!", side: 'left' },
      { speaker: "LOCATION", msg: "RUN_PROTOCOL_INITIATED", side: 'center' }
    ];

    const night5Dialogues = [
      { speaker: "LOCATION", msg: "SECURITY OFFICE - NIGHT 5 - 12:00 AM", side: 'center' },
      { speaker: displayName, msg: "HE'S RIGHT BEHIND ME! I HAVE TO REACH THE OFFICE!", side: 'left' },
      { speaker: "LOCATION", msg: "DOOR_PROTOCOL: LOCKING_INITIATED", side: 'center' },
      { speaker: "PURPLE_GUY", msg: `You can't hide in there forever, little ${customDesign?.gender === 'female' ? 'bird' : 'moth'}.`, side: 'right' },
      { speaker: displayName, msg: "The electronic locks will hold as long as the system is processing! I just need to keep answering these hardware queries!", side: 'left' },
      { speaker: "PURPLE_GUY", msg: "I'll break that door down before you finish your first question.", side: 'right' },
      { speaker: "LOCATION", msg: "SYSTEM STATUS: DOOR_INTEGRITY_FAILING", side: 'center' }
    ];

    if (night === 2) return night2Dialogues;
    if (night === 3) return night3Dialogues;
    if (night === 4) return night4Dialogues;
    if (night === 5) return night5Dialogues;
    return introDialogues;
  }, [night, isEnding]);

  useEffect(() => {
    let isMounted = true;
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && !isEnding) onComplete();
    };
    const updatePos = (clientX: number, clientY: number) => {
      if (isMounted) {
        setMousePos({ 
          x: (clientX / window.innerWidth - 0.5) * 40, 
          y: (clientY / window.innerHeight - 0.5) * 40 
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePos(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePos(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchstart', handleTouchMove, { passive: false });

    const timeline = async () => {
      if (!isMounted) return;
      await new Promise(r => setTimeout(r, 800));
      if (!isMounted) return;

      setIsImpact(true);
      setTimeout(() => { if (isMounted) setIsImpact(false); }, 150);
      setShowPortraits(true);
      
      for (let i = 0; i < dialogues.length; i++) {
        if (!isMounted) break;
        setDialogueIndex(i);
        setIsTyping(true);
        
        const currentMsg = dialogues[i].msg;
        const isEmotional = currentMsg.toUpperCase() === currentMsg || currentMsg.includes('!');

        if (isEnding) {
           if (i === 2) {
              setDoorSmashed(true);
              glassShatterSfx.current.play().catch(() => {});
              setIsImpact(true);
              setIsSlamming(true);
              setTimeout(() => setIsSlamming(false), 500);
              await new Promise(r => setTimeout(r, 1000));
           }
           if (i === 4) {
              setPoliceMode(true);
              sirenSfx.current.play().catch(() => {});
           }
           if (i === 7) {
              setShowID(true);
           }
           if (i === 8) {
              setShowTV(true);
           }
        }

        if (night === 1 && i === 1) {
          setIsDrinking(true);
          setLiquidLevel(15);
          slurpSfx.current.play().catch(() => {});
          await new Promise(r => setTimeout(r, 1200));
          setIsDrinking(false);
        }

        if (night === 3 && i === 6) {
           setIsSlamming(true);
           slamSfx.current.play().catch(() => {});
           setIsImpact(true);
           setTimeout(() => { if (isMounted) setIsImpact(false); }, 300);
           await new Promise(r => setTimeout(r, 1000));
        }

        if (night === 4 && i === 8) {
           runSfx.current.play().catch(() => {});
           setIsImpact(true);
           await new Promise(r => setTimeout(r, 500));
        }

        if (night === 5 && i === 2) {
           doorLockSfx.current.play().catch(() => {});
           setIsImpact(true);
           setIsSlamming(true);
           setTimeout(() => { if (isMounted) setIsSlamming(false); }, 500);
           await new Promise(r => setTimeout(r, 800));
        }

        for (let j = 0; j <= currentMsg.length; j++) {
          if (!isMounted) break;
          setText(currentMsg.substring(0, j));
          if (j % 3 === 0 && currentMsg[j] !== ' ') {
            const clone = blipSfx.current.cloneNode() as HTMLAudioElement;
            clone.volume = 0.08;
            clone.play().catch(() => {});
          }
          await new Promise(r => setTimeout(r, isEmotional ? 20 : 35));
        }
        setIsTyping(false);
        await new Promise(r => setTimeout(r, 2500));
      }

      if (isEnding && isMounted) {
         setGameWin(true);
         await new Promise(r => setTimeout(r, 5000));
      }
      if (isMounted) onComplete();
    };

    timeline();

    return () => {
      isMounted = false;
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      sirenSfx.current.pause();
    };
  }, [dialogues, onComplete, night, isEnding]);

  const currentSpeaker = dialogues[dialogueIndex]?.speaker || "SYSTEM";
  const currentSide = dialogues[dialogueIndex]?.side || "center";
  const isCurrentEmotional = dialogues[dialogueIndex]?.msg.includes('!') || dialogues[dialogueIndex]?.msg === dialogues[dialogueIndex]?.msg.toUpperCase();

  const CustomAvatar = ({ isActive, emotional }: { isActive: boolean, emotional: boolean }) => {
    if (!customDesign) return null;
    const { bodyType, primaryColor, secondaryColor, eyeType, hairColor } = customDesign;

    return (
      <div className={`relative w-[300px] h-[400px] flex flex-col items-center justify-end transition-all duration-500 pb-0 
        ${!isActive ? 'grayscale opacity-30 scale-90 brightness-50' : 'scale-100'} 
        ${isActive && emotional && isTyping ? 'animate-emotional-shake' : 'animate-breathing'}
        ${isActive && isDrinking ? 'rotate-[-8deg] translate-x-4 translate-y-3' : ''}`}>
        
        <div className={`relative z-20 flex flex-col items-center transition-transform duration-300 ${isActive && isDrinking ? 'rotate-[-12deg] translate-x-2 translate-y-2' : ''}`}>
          <div 
            className={`absolute -top-[55px] w-44 h-36 border-[3px] border-black z-40 transition-transform ${isActive && isTyping ? 'animate-talk-bob' : ''}`}
            style={{ backgroundColor: hairColor, clipPath: 'polygon(0% 100%, 0% 80%, 10% 40%, 30% 10%, 50% 30%, 65% 5%, 85% 25%, 100% 15%, 100% 100%)' }}
          ></div>
          
          <div className={`relative w-32 h-36 bg-[#fce4d6] border-[4px] border-black ${bodyType === 'sprite' || bodyType === 'block' ? 'rounded-xl' : 'rounded-full'} overflow-hidden z-20 shadow-xl`}>
             <div className={`absolute inset-0 ${bodyType === 'sprite' ? 'bg-[#6b30a1]' : ''}`}></div>
             <div className="absolute top-12 left-0 right-0 h-10 flex gap-4 items-center justify-center z-10">
                {eyeType === 'dot' ? (
                  <>
                    <div className="w-10 h-7 bg-[#1a0f30] border-[3px] border-orange-500 rounded-lg overflow-hidden flex items-center justify-center">
                       <div className="w-2 h-2 bg-white rounded-full animate-blink"></div>
                    </div>
                    <div className="w-10 h-7 bg-[#1a0f30] border-[3px] border-orange-500 rounded-lg overflow-hidden flex items-center justify-center">
                       <div className="w-2 h-2 bg-white rounded-full animate-blink"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 bg-white shadow-[0_0_20px_white] rounded-sm animate-pulse"></div>
                    <div className="w-8 h-8 bg-white shadow-[0_0_20px_white] rounded-sm animate-pulse"></div>
                  </>
                )}
             </div>
             <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/40 rounded-b-full transition-all duration-75 z-10 ${isActive && isTyping ? 'h-8' : (isActive && isDrinking ? 'h-10 bg-black/90 scale-x-75' : 'h-4')}`}></div>
          </div>
        </div>
        
        <div className="relative flex flex-col items-center -mt-6">
           <div 
             className={`border-[4px] border-black relative z-10 overflow-hidden shadow-2xl transition-transform ${isActive && isTyping ? 'animate-talk-body' : ''} ${bodyType === 'sprunki' ? 'w-24 h-32 rounded-[40px]' : bodyType === 'chess' ? 'w-24 h-32 rounded-t-full' : bodyType === 'block' ? 'w-32 h-32 rounded-sm' : 'w-24 h-32 rounded-lg'}`}
             style={{ backgroundColor: bodyType === 'sprite' ? '#6b30a1' : primaryColor }}
           >
              {bodyType === 'sprite' && <div className="absolute top-4 right-4 w-4 h-4 bg-yellow-500 rounded-full border-2 border-black animate-pulse"></div>}
           </div>
           
           {(bodyType === 'normal' || bodyType === 'sprite' || bodyType === 'sprunki') && (
             <>
               <div className={`absolute top-4 -left-10 w-6 h-28 border-[3px] border-black rounded-full origin-top transition-all ${isActive && isDrinking ? 'rotate-[-50deg] translate-x-4 translate-y-2' : isActive && isTyping ? 'animate-hand-wave' : 'rotate-[20deg]'}`} style={{ backgroundColor: bodyType === 'sprite' ? '#6b30a1' : primaryColor }}></div>
               <div className={`absolute top-4 -right-10 w-6 h-28 border-[3px] border-black rounded-full origin-top transition-all ${isActive && isDrinking ? 'rotate-[30deg] translate-x-[-8px]' : 'rotate-[-20deg]'}`} style={{ backgroundColor: bodyType === 'sprite' ? '#6b30a1' : primaryColor }}></div>
             </>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 bg-black z-[3000] flex flex-col items-center justify-center font-['VT323'] select-none overflow-hidden transition-all duration-1000 ${isSlamming ? 'animate-slam-shake' : ''}`}>
      
      <div 
        className="absolute inset-0 z-0 transition-transform duration-1000 ease-out"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.1)` }}
      >
        <div className="absolute inset-0 bg-[#05050a]">
            {night === 1 ? (
              <>
                <div className="absolute inset-0 diner-grid-bg opacity-30"></div>
                <div className="absolute bottom-[10%] left-0 w-64 h-[500px] bg-zinc-950 opacity-40 rounded-tr-[120px] border-r-4 border-black"></div>
                <div className="absolute bottom-[10%] right-0 w-64 h-[500px] bg-zinc-950 opacity-40 rounded-tl-[120px] border-l-4 border-black"></div>
              </>
            ) : (
              <div className="absolute inset-0 corridor-gradient opacity-40"></div>
            )}
            <div className={`absolute inset-0 transition-colors duration-200 ${policeMode ? 'animate-police-lights' : 'bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]'}`}></div>
            <div className="absolute inset-0 noise-overlay opacity-[0.03]"></div>
        </div>
      </div>

      {isImpact && <div className="absolute inset-0 bg-red-900/40 z-[4000] animate-out fade-out duration-300"></div>}

      {!isEnding && (
        <div className="absolute top-8 right-12 z-50">
           <button onClick={onComplete} className="group flex flex-col items-end gap-1">
              <span className="text-zinc-500 text-sm tracking-[0.4em] uppercase group-hover:text-white transition-colors">SKIP_TRANSCRIPT [ESC]</span>
              <div className="w-24 h-0.5 bg-zinc-800 overflow-hidden">
                 <div className="h-full bg-white/40 animate-marquee-progress"></div>
              </div>
           </button>
        </div>
      )}

      <div className="relative w-full max-w-6xl h-[650px] bg-black/60 border-[20px] border-zinc-900 overflow-hidden flex items-end shadow-[0_0_150px_black]">
        
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-zinc-950 z-10 border-t-4 border-black"></div>

        {showPortraits && (
          <div className="absolute inset-0 z-20 pointer-events-none flex items-end justify-between px-20 pb-4">
            
            <div className={`transition-all duration-700 transform origin-bottom
              ${currentSide === 'left' ? 'translate-x-0 opacity-100' : '-translate-x-40 opacity-0 blur-md scale-95'}
              ${night === 1 ? 'mb-10' : 'mb-6'}`}>
              <CustomAvatar isActive={currentSide === 'left'} emotional={isCurrentEmotional} />
            </div>

            <div className={`transition-all duration-1000 transform origin-bottom flex flex-col items-center justify-end mb-6
              ${currentSide === 'right' ? 'translate-x-0 opacity-100' : 'translate-x-40 opacity-0 blur-md scale-95'}`}>
               <div className={`relative w-[400px] h-[500px] flex flex-col items-center justify-end
                ${currentSide === 'right' && isCurrentEmotional && isTyping ? 'animate-emotional-shake' : 'animate-breathing'}
                ${policeMode && dialogueIndex >= 6 ? 'opacity-0 scale-50 transition-all duration-2000 blur-2xl' : ''}`}>
                  <div className={`w-48 h-64 bg-purple-950 border-4 border-black rounded-full relative overflow-hidden transition-transform ${isTyping && currentSide === 'right' ? 'animate-talk-bob' : ''}`}>
                     <div className="absolute top-1/3 left-1/4 w-8 h-2 bg-white shadow-[0_0_20px_white] animate-pulse"></div>
                     <div className="absolute top-1/3 right-1/4 w-8 h-2 bg-white shadow-[0_0_20px_white] animate-pulse"></div>
                     <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/60 rounded-full transition-all ${isTyping && currentSide === 'right' ? 'h-8 bg-black' : 'h-2'}`}></div>
                  </div>
                  <div className={`w-64 h-[250px] bg-purple-900 border-4 border-black rounded-t-[100px] -mt-8 transition-transform ${isTyping && currentSide === 'right' ? 'animate-talk-body' : ''}`}></div>
               </div>
            </div>
          </div>
        )}

        {showID && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-20 animate-in zoom-in duration-500">
             <div className="w-[500px] h-[300px] bg-zinc-100 border-8 border-zinc-900 rounded-xl shadow-[0_30px_100px_black] rotate-[-2deg] p-8 flex gap-8">
                <div className="w-1/3 h-full border-4 border-zinc-900 bg-purple-950 flex flex-col items-center justify-center relative overflow-hidden">
                   <div className="w-16 h-20 bg-purple-900 border-2 border-black rounded-full mt-4"></div>
                   <div className="w-24 h-20 bg-purple-800 border-2 border-black rounded-t-full"></div>
                </div>
                <div className="flex-1 space-y-4 pt-4 font-sans text-black">
                   <div className="border-b-4 border-zinc-900 pb-2">
                      <h3 className="text-3xl font-black uppercase tracking-tighter">Fazbear_Entertainment</h3>
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Technician ID Badge</p>
                   </div>
                   <div className="space-y-2">
                      <p className="text-xs font-bold uppercase text-zinc-500">Subject Name:</p>
                      <p className="text-4xl font-black uppercase tracking-tighter text-purple-900 drop-shadow-sm">William Afton</p>
                      <p className="text-[10px] font-mono text-zinc-400 mt-4 leading-none">DOB: 06/18/1944 <br/> CLEARANCE: LEVEL_5_OVERRIDE</p>
                   </div>
                </div>
             </div>
          </div>
        )}

        {showTV && (
          <div className="absolute inset-0 z-[60] bg-black/95 flex items-center justify-center p-12 animate-in fade-in duration-1000">
             <div className="relative w-full max-w-4xl aspect-video bg-zinc-900 border-[20px] border-zinc-800 shadow-[0_0_100px_black] overflow-hidden rounded-[80px] crt">
                <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>
                <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col">
                   <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-8">
                      <div className="w-32 h-10 bg-red-600 text-white font-black text-2xl flex items-center justify-center uppercase italic animate-pulse">BREAKING</div>
                      <h2 className="text-white text-6xl font-black uppercase italic tracking-tighter drop-shadow-lg leading-tight">
                         THE KIDNAPPER AND MURDERER OF THE CHILDREN IS FINALLY CAPTURED
                      </h2>
                      <p className="text-zinc-500 text-xl font-mono uppercase tracking-[0.2em]">Suspect Identified as Co-Founder William Afton</p>
                   </div>
                   <div className="h-16 bg-zinc-950 border-t-4 border-zinc-800 flex items-center px-10 overflow-hidden">
                      <div className="marquee w-full text-white text-2xl font-black uppercase tracking-widest">
                         <span>+++ WILLIAM AFTON APPREHENDED BY POLICE +++ MULTIPLE COLD CASES RESOLVED +++ DINER SHUT DOWN INDEFINITELY +++</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {gameWin && (
           <div className="absolute inset-0 z-[100] bg-zinc-950 flex flex-col items-center justify-center animate-in zoom-in duration-1000">
              <h1 className="text-9xl font-black italic text-white tracking-tighter uppercase drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]">YOU WIN</h1>
              <button onClick={() => window.location.reload()} className="mt-12 px-12 py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Back to Reality</button>
           </div>
        )}

        {night === 1 && !isEnding && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 z-40 flex flex-col items-center justify-end">
            <div className={`absolute bottom-32 left-1/4 translate-x-[125px] flex flex-col items-center transition-all duration-300 ${isDrinking ? 'scale-y-105 translate-y-[-5px]' : ''}`}>
               <div className={`w-1.5 h-20 bg-pink-500 border border-black origin-bottom transition-all duration-300 ${isDrinking ? 'rotate-[-38deg] h-[105px] translate-x-[-5px]' : 'rotate-[-12deg]'}`}></div>
               <div className="w-16 h-28 bg-white/20 border-2 border-white/40 clip-path-glass relative overflow-hidden backdrop-blur-md">
                  <div className="absolute bottom-0 left-0 right-0 bg-[#3d2514] transition-all duration-1000" style={{ height: `${liquidLevel}%` }}></div>
               </div>
            </div>
            <div className="relative w-[1100px] h-32">
               <div className="absolute bottom-0 w-full h-8 bg-zinc-800 border-x-4 border-b-4 border-black rounded-b-xl shadow-2xl"></div>
            </div>
          </div>
        )}

        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] z-50"></div>
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_200px_rgba(0,0,0,0.9)] z-40"></div>
      </div>

      {!gameWin && (
        <div className="relative w-full max-w-6xl h-48 bg-black/95 border-x-[8px] border-b-[8px] border-t-2 border-zinc-800 p-6 shadow-[0_40px_100px_black] z-30 overflow-hidden animate-dialogue-entrance">
           {currentSide !== 'center' && (
             <div className={`absolute -top-4 left-12 transition-all duration-500 transform ${currentSide === 'left' ? 'bg-zinc-100 text-black' : (currentSpeaker === 'WILLIAM AFTON' || currentSide === 'right' ? 'bg-purple-900 text-white' : 'bg-red-900 text-white')} px-8 py-1 text-lg italic tracking-widest border-2 border-zinc-800 skew-x-[-15deg] font-black uppercase shadow-xl`}>
                {currentSpeaker}
             </div>
           )}
           <div className={`text-white text-2xl leading-snug pt-4 font-mono ${currentSide === 'center' ? 'text-center italic text-zinc-400' : ''}`}>
             {text}
             <span className="inline-block w-2 h-6 bg-white/20 ml-3 animate-blink align-middle"></span>
           </div>
        </div>
      )}

      <style>{`
        @keyframes police-lights {
           0%, 100% { background-color: rgba(220, 38, 38, 0.2); }
           50% { background-color: rgba(37, 99, 235, 0.2); }
        }
        .animate-police-lights { animation: police-lights 0.4s infinite; }
        .marquee { white-space: nowrap; overflow: hidden; position: relative; }
        .marquee span { display: inline-block; padding-left: 100%; animation: marquee 30s linear infinite; }
        @keyframes marquee { 0% { transform: translate(0, 0); } 100% { transform: translate(-100%, 0); } }
        .diner-grid-bg { background-size: 80px 80px; background-image: linear-gradient(to right, #2a2a3a 1px, transparent 1px), linear-gradient(to bottom, #2a2a3a 1px, transparent 1px); }
        .corridor-gradient { background: linear-gradient(90deg, #1a0f1a, #05050a, #1a0f1a); }
        .clip-path-glass { clip-path: polygon(0 0, 100% 0, 85% 100%, 15% 100%); }
        @keyframes slam-shake { 0%, 100% { transform: translate(0,0); } 10%, 30%, 50%, 70%, 90% { transform: translate(-15px, 15px); } 20%, 40%, 60%, 80% { transform: translate(15px, -15px); } }
        .animate-slam-shake { animation: slam-shake 0.4s linear; }
        @keyframes talk-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .animate-talk-bob { animation: talk-bob 0.15s ease-in-out infinite; }
        @keyframes talk-body { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        .animate-talk-body { animation: talk-body 0.2s ease-in-out infinite; }
        @keyframes breathing { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        .animate-breathing { animation: breathing 3s ease-in-out infinite; }
        @keyframes emotional-shake { 0%, 100% { transform: translate(0,0) scale(1); } 10% { transform: translate(-2px, 2px); } 20% { transform: translate(2px, -2px) scale(1.05); } 30% { transform: translate(-4px, 0px); } 40% { transform: translate(4px, 2px); } 50% { transform: scale(1.1); } }
        .animate-emotional-shake { animation: emotional-shake 0.1s linear infinite; }
        @keyframes hand-wave { 0%, 100% { transform: rotate(20deg); } 50% { transform: rotate(45deg); } }
        .animate-hand-wave { animation: hand-wave 0.3s ease-in-out infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .animate-blink { animation: blink 0.8s infinite; }
        @keyframes dialogue-entrance { 0% { transform: translateY(100%); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
        .animate-dialogue-entrance { animation: dialogue-entrance 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
        @keyframes marquee-progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-marquee-progress { animation: marquee-progress 2s linear infinite; }
      `}</style>
    </div>
  );
};

export default Cutscene;
