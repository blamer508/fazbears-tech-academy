import { useState, useEffect, type FC } from 'react';
import { type CharacterDesign } from '@/types';

interface CharacterCreatorProps {
  onComplete: (design: CharacterDesign) => void;
}

const CharacterCreator: FC<CharacterCreatorProps> = ({ onComplete }) => {
  const [design, setDesign] = useState<CharacterDesign>({
    bodyType: 'block',
    primaryColor: '#7393B3',
    secondaryColor: '#7393B3',
    eyeType: 'cool',
    hairColor: '#3d2514',
    gender: 'male',
    clothingType: 'normal',
    hairStyle: 'short',
    hasGlasses: true
  });

  useEffect(() => {
    onComplete(design);
  }, [onComplete, design]);

  const Preview = () => {
    const { bodyType, primaryColor, secondaryColor, eyeType, hairColor, clothingType, hairStyle, hasGlasses } = design;

    return (
      <div className="relative w-[280px] h-[350px] flex flex-col items-center justify-end pb-4">
        {/* Head */}
        <div className="relative z-20 flex flex-col items-center">
          {/* Hair Styles - Short Hair Only */}
          <div 
            className="absolute -top-[45px] w-52 h-64 z-40 pointer-events-none"
            style={{ 
              backgroundColor: hairColor, 
              clipPath: 'polygon(10% 60%, 0% 40%, 10% 20%, 30% 5%, 50% 15%, 65% 2%, 85% 12%, 100% 7%, 100% 40%, 90% 60%)',
              border: '3px solid black'
            }}
          >
          </div>
          
          <div className={`relative w-32 h-36 bg-[#fce4d6] border-[4px] border-black rounded-xl overflow-hidden z-20 shadow-xl`}>
             <div className="absolute top-12 left-0 right-0 h-12 flex gap-4 items-center justify-center z-10">
                {/* Cool Eyes with Orange Outline (Sunglasses) */}
                <div className="relative w-12 h-5 bg-black rounded-sm overflow-hidden border-2 border-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)]">
                   <div className="absolute inset-0 border-2 border-white/20"></div>
                </div>
                <div className="relative w-12 h-5 bg-black rounded-sm overflow-hidden border-2 border-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)]">
                   <div className="absolute inset-0 border-2 border-white/20"></div>
                </div>
                {/* Glasses Frame Bridge */}
                <div className="absolute top-1/2 -translate-y-1/2 w-full h-1 bg-orange-600 z-20"></div>
             </div>
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                {/* Smile */}
                <div className="w-12 h-6 border-b-4 border-black rounded-full"></div>
                <div className="w-16 h-2 bg-black/10 rounded-full mt-1"></div>
             </div>
          </div>
        </div>
        
        {/* Body - Uniform Only */}
        <div className="relative flex flex-col items-center -mt-6">
          <div className="relative w-32 h-32 mt-4">
            <div className="w-full h-full border-[6px] border-black shadow-2xl relative overflow-hidden rounded-sm" 
              style={{ backgroundColor: primaryColor }}>
              <div className="absolute inset-0 bg-white/5 border-t border-l border-white/20"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black z-[2000] flex flex-col items-center justify-center font-['VT323'] p-10 overflow-y-auto">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,50,150,0.1)_0%,transparent_80%)]"></div>
      
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-10">
        
        <header className="text-center">
          <h1 className="text-5xl font-black italic text-white uppercase tracking-tighter">Technician Profile</h1>
          <p className="text-zinc-500 uppercase tracking-[0.3em] text-sm mt-2">Standard Issue Configuration: Blamer_508</p>
        </header>

        {/* Preview Section */}
        <div className="bg-zinc-900/50 border-4 border-zinc-800 p-12 flex flex-col items-center justify-center aspect-square shadow-[0_0_50px_black] relative w-full max-w-md">
           <div className="absolute top-4 left-4 text-zinc-600 uppercase tracking-widest text-xs">Unit_Status: Active</div>
           <Preview />
           <div className="absolute bottom-4 right-4 text-zinc-600 uppercase tracking-widest text-xs">Model_V.4.0.0</div>
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="bg-zinc-950/80 border-2 border-zinc-800 p-4 text-zinc-400 text-xs uppercase tracking-widest text-center">
            All customization modules have been locked by administrative override.
          </div>
          
          <button 
            onClick={() => onComplete(design)}
            className="w-full py-4 bg-blue-700 hover:bg-blue-600 text-white font-black text-2xl uppercase tracking-widest transition-all transform hover:scale-[1.02] active:scale-95 shadow-[0_10px_30px_rgba(29,78,216,0.3)]"
          >
            Finalize Technician
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreator;
