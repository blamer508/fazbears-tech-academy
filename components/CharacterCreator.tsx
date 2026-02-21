
import React, { useState } from 'react';
import { CharacterDesign, BodyType } from '../types';

interface CharacterCreatorProps {
  onComplete: (design: CharacterDesign) => void;
}

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onComplete }) => {
  const [design, setDesign] = useState<CharacterDesign>({
    bodyType: 'block',
    primaryColor: '#2c4c6b',
    secondaryColor: '#1a2e41',
    eyeType: 'dot',
    hairColor: '#3d2514',
    gender: 'male'
  });

  const bodyTypes: { id: BodyType; label: string }[] = [
    { id: 'normal', label: 'Standard' },
    { id: 'chess', label: 'Chess Piece' },
    { id: 'sprunki', label: 'Sprunki' },
    { id: 'sprite', label: 'Minigame Sprite' },
    { id: 'block', label: 'Solid Block' }
  ];

  const colors = [
    '#2c4c6b', '#6b30a1', '#8b0000', '#006400', '#ffd700', '#ffffff', '#1a1a1a', '#ff69b4'
  ];

  const hairColors = [
    '#3d2514', '#111111', '#c0c0c0', '#ffd700', '#8b4513', '#ff4500'
  ];

  const Preview = () => {
    const { bodyType, primaryColor, secondaryColor, eyeType, hairColor } = design;

    return (
      <div className="relative w-[280px] h-[350px] flex flex-col items-center justify-end pb-4">
        {/* Head */}
        <div className="relative z-20 flex flex-col items-center">
          <div 
            className="absolute -top-[55px] w-44 h-36 border-[3px] border-black z-40"
            style={{ backgroundColor: hairColor, clipPath: 'polygon(0% 100%, 0% 80%, 10% 40%, 30% 10%, 50% 30%, 65% 5%, 85% 25%, 100% 15%, 100% 100%)' }}
          ></div>
          
          <div className={`relative w-32 h-36 bg-[#fce4d6] border-[4px] border-black ${bodyType === 'sprite' || bodyType === 'block' ? 'rounded-xl' : 'rounded-full'} overflow-hidden z-20 shadow-xl`}>
             <div className={`absolute inset-0 ${bodyType === 'sprite' ? 'bg-[#6b30a1]' : ''}`}></div>
             <div className="absolute top-12 left-0 right-0 h-10 flex gap-4 items-center justify-center z-10">
                {eyeType === 'dot' ? (
                  <>
                    <div className="w-10 h-7 bg-[#1a0f30] border-[3px] border-orange-500 rounded-lg"></div>
                    <div className="w-10 h-7 bg-[#1a0f30] border-[3px] border-orange-500 rounded-lg"></div>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 bg-white shadow-[0_0_20px_white] rounded-sm"></div>
                    <div className="w-8 h-8 bg-white shadow-[0_0_20px_white] rounded-sm"></div>
                  </>
                )}
             </div>
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/40 rounded-full z-10"></div>
          </div>
        </div>
        
        {/* Body based on selection */}
        <div className="relative flex flex-col items-center -mt-6">
          {bodyType === 'sprunki' && (
            <div className="relative w-20 h-40 flex flex-col items-center">
              <div className="w-24 h-32 border-[4px] border-black rounded-[40px] relative z-10" style={{ backgroundColor: primaryColor }}></div>
              <div className="absolute top-4 -left-10 w-4 h-28 border-[3px] border-black rounded-full origin-top rotate-[20deg]" style={{ backgroundColor: primaryColor }}></div>
              <div className="absolute top-4 -right-10 w-4 h-28 border-[3px] border-black rounded-full origin-top -rotate-[20deg]" style={{ backgroundColor: primaryColor }}></div>
            </div>
          )}

          {bodyType === 'chess' && (
            <div className="relative w-24 h-40 flex flex-col items-center mt-4">
              <div className="w-24 h-24 border-[3px] border-black rounded-t-full relative z-10" style={{ backgroundColor: primaryColor }}></div>
              <div className="w-32 h-10 border-[3px] border-black rounded-full -mt-2 z-0" style={{ backgroundColor: secondaryColor }}></div>
            </div>
          )}

          {bodyType === 'block' && (
            <div className="relative w-32 h-32 mt-4">
              <div className="w-full h-full border-[6px] border-black rounded-sm shadow-2xl" style={{ backgroundColor: primaryColor }}>
                <div className="absolute inset-0 bg-white/5 border-t border-l border-white/20"></div>
                <div className="absolute bottom-4 right-4 w-4 h-4 bg-black/20 rounded-full"></div>
              </div>
            </div>
          )}

          {(bodyType === 'normal' || bodyType === 'sprite') && (
            <div className="relative w-20 h-40 flex flex-col items-center">
              <div className="w-24 h-32 border-[4px] border-black rounded-lg relative z-10" style={{ backgroundColor: bodyType === 'sprite' ? '#6b30a1' : primaryColor }}></div>
              <div className="absolute top-4 -left-10 w-6 h-28 border-[3px] border-black rounded-full origin-top" style={{ backgroundColor: bodyType === 'sprite' ? '#6b30a1' : primaryColor }}></div>
              <div className="absolute top-4 -right-10 w-6 h-28 border-[3px] border-black rounded-full origin-top" style={{ backgroundColor: bodyType === 'sprite' ? '#6b30a1' : primaryColor }}></div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black z-[2000] flex flex-col items-center justify-center font-['VT323'] p-10 overflow-y-auto">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,150,0.1)_0%,transparent_80%)]"></div>
      
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Preview Section */}
        <div className="bg-zinc-900/50 border-4 border-zinc-800 p-12 flex items-center justify-center aspect-square shadow-[0_0_50px_black] relative">
           <div className="absolute top-4 left-4 text-zinc-600 uppercase tracking-widest text-xs">Live_Construction_Feed</div>
           <Preview />
           <div className="absolute bottom-4 right-4 text-zinc-600 uppercase tracking-widest text-xs">Model_V.3.0.2</div>
        </div>

        {/* Controls Section */}
        <div className="space-y-8 bg-zinc-950/80 border-4 border-zinc-800 p-10 shadow-2xl">
          <header className="border-b-2 border-zinc-800 pb-4 mb-8">
            <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter">Avatar Configuration</h1>
            <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs mt-2">Personalize your technician chassis</p>
          </header>

          <div className="space-y-6">
            {/* Body Type */}
            <div>
              <label className="text-zinc-500 block text-xs uppercase mb-3 font-bold tracking-widest">Structural Build</label>
              <div className="grid grid-cols-2 gap-2">
                {bodyTypes.map(bt => (
                  <button
                    key={bt.id}
                    onClick={() => setDesign({ ...design, bodyType: bt.id })}
                    className={`px-4 py-3 text-sm font-bold uppercase transition-all border-2 ${design.bodyType === bt.id ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-500'}`}
                  >
                    {bt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="text-zinc-500 block text-xs uppercase mb-3 font-bold tracking-widest">Primary Coating</label>
              <div className="flex flex-wrap gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setDesign({ ...design, primaryColor: c })}
                    className={`w-10 h-10 border-2 transition-all ${design.primaryColor === c ? 'border-white scale-110 shadow-[0_0_15px_white]' : 'border-zinc-800'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-zinc-500 block text-xs uppercase mb-3 font-bold tracking-widest">Secondary Base</label>
              <div className="flex flex-wrap gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setDesign({ ...design, secondaryColor: c })}
                    className={`w-10 h-10 border-2 transition-all ${design.secondaryColor === c ? 'border-white scale-110 shadow-[0_0_15px_white]' : 'border-zinc-800'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-zinc-500 block text-xs uppercase mb-3 font-bold tracking-widest">Hair Pigment</label>
              <div className="flex flex-wrap gap-2">
                {hairColors.map(c => (
                  <button
                    key={c}
                    onClick={() => setDesign({ ...design, hairColor: c })}
                    className={`w-10 h-10 border-2 transition-all ${design.hairColor === c ? 'border-white scale-110 shadow-[0_0_15px_white]' : 'border-zinc-800'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Eyes */}
            <div>
              <label className="text-zinc-500 block text-xs uppercase mb-3 font-bold tracking-widest">Optic Sensors</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setDesign({ ...design, eyeType: 'dot' })}
                  className={`flex-1 py-3 font-bold uppercase border-2 ${design.eyeType === 'dot' ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setDesign({ ...design, eyeType: 'glow' })}
                  className={`flex-1 py-3 font-bold uppercase border-2 ${design.eyeType === 'glow' ? 'bg-purple-900 text-white border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-zinc-900 text-zinc-500 border-zinc-800'}`}
                >
                  Glow_Minigame
                </button>
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="text-zinc-500 block text-xs uppercase mb-3 font-bold tracking-widest">Technician Gender</label>
              <div className="flex gap-2">
                {(['male', 'female', 'other'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setDesign({ ...design, gender: g })}
                    className={`flex-1 py-3 font-bold uppercase border-2 transition-all ${design.gender === g ? 'bg-white text-black border-white' : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-500'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={() => onComplete(design)}
            className="w-full mt-10 py-6 bg-red-700 hover:bg-red-600 text-white font-black text-3xl uppercase tracking-widest transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(185,28,28,0.3)]"
          >
            Finalize Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreator;
