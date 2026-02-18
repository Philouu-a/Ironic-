import React, { useState, useMemo } from 'react';
import { Mantra } from '../types.ts';

interface PostItCardProps {
  mantra: Mantra;
}

const PostItCard: React.FC<PostItCardProps> = ({ mantra }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const formattedIndex = `#${String(mantra.index - 1).padStart(3, '0')}`;
  const textColor = mantra.colorTheme.text;
  const ironicMantra = mantra.backText;

  // Split mantra for creative text layouts
  const words = useMemo(() => ironicMantra.split(' '), [ironicMantra]);

  // Determine which luxury item to show based on the index
  const itemType = mantra.index % 4;

  const renderLuxuryItem = () => {
    switch (itemType) {
      case 0: // LADY DIOR STYLE (Grey-blue quilted)
        return (
          <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-1000">
            <div className="relative transition-all duration-700 hover:scale-105 drop-shadow-[0_45px_70px_rgba(0,0,0,0.8)]">
              <svg width="260" height="280" viewBox="0 0 260 280">
                <defs>
                  <linearGradient id="diorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#95adb9" />
                    <stop offset="50%" stopColor="#7a91a0" />
                    <stop offset="100%" stopColor="#5c7280" />
                  </linearGradient>
                  <pattern id="cannagePattern" x="0" y="0" width="34" height="34" patternUnits="userSpaceOnUse">
                    <path d="M17 0 L34 17 L17 34 L0 17 Z" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                    <circle cx="17" cy="17" r="10" fill="rgba(0,0,0,0.03)" />
                  </pattern>
                </defs>
                <path d="M75 80 C75 0 185 0 185 80" fill="none" stroke="#708694" strokeWidth="24" strokeLinecap="round" />
                <path d="M75 80 C75 10 185 10 185 80" fill="none" stroke="#9bb0bd" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
                <rect x="40" y="80" width="180" height="160" rx="4" fill="url(#diorGrad)" />
                <rect x="40" y="80" width="180" height="160" rx="4" fill="url(#cannagePattern)" />
                <circle cx="75" cy="80" r="10" fill="#e5c100" />
                <circle cx="185" cy="80" r="10" fill="#e5c100" />
                <g transform="translate(185, 125)">
                   <circle cx="0" cy="0" r="18" fill="#f1c40f" />
                   <text y="5" textAnchor="middle" fill="#5c4b00" fontSize="14" fontWeight="900" style={{fontFamily: 'serif'}}>{words[0]?.[0] || 'D'}</text>
                </g>
              </svg>
              {/* THE MANTRA PRINTED ON THE QUILTING */}
              <div className="absolute top-[140px] left-1/2 -translate-x-1/2 w-36 text-center pointer-events-none">
                <p className="text-[11px] font-black uppercase text-white tracking-[0.08em] leading-tight drop-shadow-md" style={{fontFamily: 'serif'}}>
                  {ironicMantra}
                </p>
              </div>
            </div>
            <span className="text-[9px] font-black text-white/30 mt-8 tracking-[0.5em] uppercase">Maison Ironic Bag</span>
          </div>
        );

      case 1: // HERMES BIRKIN STYLE (Orange)
        return (
          <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-1000">
            <div className="relative transition-all duration-700 hover:rotate-1 drop-shadow-[0_45px_70px_rgba(0,0,0,0.8)]">
              <svg width="300" height="260" viewBox="0 0 300 260">
                <defs>
                  <linearGradient id="hermesLeather" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ff7f11" />
                    <stop offset="100%" stopColor="#e65100" />
                  </linearGradient>
                </defs>
                <path d="M100 70 C100 -10 200 -10 200 70" fill="none" stroke="#d84315" strokeWidth="16" strokeLinecap="round" />
                <path d="M40 70 L260 70 L280 230 C280 245 265 255 250 255 L50 255 C35 255 20 245 20 230 Z" fill="url(#hermesLeather)" />
                <rect x="40" y="95" width="220" height="18" fill="#bf360c" />
                <rect x="135" y="95" width="30" height="40" rx="1" fill="#eceff1" />
                <rect x="145" y="110" width="10" height="15" fill="#90a4ae" />
              </svg>
              {/* HEAT STAMPED MANTRA */}
              <div className="absolute top-[145px] left-1/2 -translate-x-1/2 w-52 text-center pointer-events-none">
                <p className="text-[9px] font-bold text-black/30 tracking-[0.4em] uppercase mb-1">HERMÈS PARIS</p>
                <p className="text-[13px] font-black text-black/60 tracking-tight leading-none italic" style={{fontFamily: 'Caveat, cursive'}}>
                   "{ironicMantra}"
                </p>
                <p className="text-[6px] text-black/20 mt-2 font-bold uppercase tracking-widest">MADE IN THE VOID</p>
              </div>
            </div>
            <span className="text-[9px] font-black text-white/30 mt-8 tracking-[0.5em] uppercase">Legacy Birkin</span>
          </div>
        );

      case 2: // TWILLY SCARF STYLE
        return (
          <div className="relative flex flex-col items-center animate-in fade-in slide-in-from-top-12 duration-1000">
            <div className="relative transition-all duration-700 hover:scale-105 drop-shadow-[0_30px_50px_rgba(255,61,0,0.5)]">
              <svg width="150" height="360" viewBox="0 0 150 360">
                <linearGradient id="twillyGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ff3d00" />
                  <stop offset="30%" stopColor="#ff9100" />
                  <stop offset="70%" stopColor="#e65100" />
                  <stop offset="100%" stopColor="#ff3d00" />
                </linearGradient>
                <path d="M55 0 L95 0 L115 320 L75 360 L35 320 Z" fill="url(#twillyGrad)" />
                <rect x="55" y="40" width="40" height="40" fill="#ffffff" opacity="0.15" />
                <circle cx="75" cy="200" r="25" fill="#f9a825" opacity="0.3" />
              </svg>
              {/* MANTRA IN THE SILK PATTERN */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 h-[280px] w-12 flex flex-col items-center justify-between pointer-events-none py-6">
                <p className="[writing-mode:vertical-lr] text-[12px] font-black text-white uppercase tracking-[0.4em] rotate-180 drop-shadow-md">
                  {ironicMantra}
                </p>
                <p className="[writing-mode:vertical-lr] text-[10px] font-black text-white/50 uppercase tracking-[0.2em] rotate-180">
                  PARIS • SATIRE
                </p>
              </div>
            </div>
            <span className="text-[9px] font-black text-white/30 mt-8 tracking-[0.5em] uppercase">Silk Truth Twilly</span>
          </div>
        );

      case 3: // GUCCI TOTE STYLE
        return (
          <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-1000">
            <div className="relative transition-all duration-700 hover:rotate-[-1deg] drop-shadow-[0_45px_70px_rgba(0,0,0,0.8)]">
              <svg width="300" height="230" viewBox="0 0 300 230">
                <pattern id="gucciPatt" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                   <text x="5" y="15" fill="#8d6e63" fontSize="8" fontWeight="bold" opacity="0.3">GG</text>
                </pattern>
                <path d="M45 35 L255 35 L285 200 C285 220 265 230 245 230 L55 230 C35 230 15 220 15 200 Z" fill="#d7ccc8" />
                <path d="M45 35 L255 35 L285 200 C285 220 265 230 245 230 L55 230 C35 230 15 220 15 200 Z" fill="url(#gucciPatt)" />
                <rect x="130" y="35" width="40" height="195" fill="#2e7d32" />
                <rect x="143" y="35" width="14" height="195" fill="#c62828" />
                <path d="M75 45 L75 25 C75 5 225 5 225 25 L225 45" fill="none" stroke="#4e342e" strokeWidth="12" />
              </svg>
              {/* STITCHED LABEL WITH MANTRA */}
              <div className="absolute top-[105px] left-1/2 -translate-x-1/2 w-48 pointer-events-none">
                 <div className="bg-white px-5 py-5 border-[4px] border-black shadow-[15px_15px_0px_rgba(0,0,0,0.4)]">
                    <p className="text-[11px] font-black uppercase text-black text-center leading-[1.2] tracking-tighter">
                       {ironicMantra}
                    </p>
                    <div className="w-full h-[2px] bg-black mt-3"></div>
                    <p className="text-[6px] text-black/50 text-center mt-1.5 font-black uppercase tracking-[0.3em]">GUCCI IRONIC</p>
                 </div>
              </div>
            </div>
            <span className="text-[9px] font-black text-white/30 mt-8 tracking-[0.5em] uppercase">Monogram Vault</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="flex-shrink-0 w-[420px] h-[600px] mx-6 perspective-1000 cursor-pointer group"
      onClick={handleFlip}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-[1100ms] transform-style-3d cubic-bezier(0.3, 1, 0.4, 1) ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Side: Sleek Teaser Card */}
        <div className={`absolute inset-0 backface-hidden squircle p-14 flex flex-col justify-between shadow-2xl border border-white/5 ${mantra.colorTheme.bg}`}>
          <div className="flex justify-between items-start">
            <span className={`text-xl font-black opacity-30 ${textColor}`}>{formattedIndex}</span>
            <div className={`px-4 py-1.5 rounded-full border-2 border-current opacity-20 ${textColor}`}>
               <span className="text-[10px] font-black tracking-[0.2em] uppercase">Spring '25</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center flex-grow text-center">
             <div className={`w-36 h-36 rounded-full border-[6px] border-current opacity-5 mb-10 flex items-center justify-center ${textColor}`}>
                <span className="text-5xl font-black">{formattedIndex.slice(-2)}</span>
             </div>
             <p className={`text-[12px] font-black uppercase tracking-[0.6em] ${textColor} opacity-40 mb-3`}>
               The Showroom
             </p>
             <h3 className={`text-3xl font-black uppercase tracking-tighter ${textColor} leading-none`}>
               Unveil Piece
             </h3>
          </div>

          <div className="flex justify-between items-center">
            <p className={`text-[10px] font-black uppercase tracking-[0.5em] ${textColor} opacity-60`}>
              Open Archive
            </p>
            <div className={`${textColor} animate-bounce-slow`}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square">
                <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Back Side: The Showroom with Mantra on the Product */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 squircle p-10 flex flex-col shadow-2xl bg-[#050505] border border-white/10 overflow-hidden`}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_20%,_rgba(255,255,255,0.05)_0%,_transparent_60%)]"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent"></div>
          </div>

          <div className="flex-grow flex justify-center items-center relative py-12">
            {renderLuxuryItem()}
          </div>

          <div className="mt-auto flex justify-between items-end border-t border-white/5 pt-10 z-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em] mb-3">Branded Archive</span>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-white tracking-tighter">IRONIC-LUXE</span>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981]"></div>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
              className="px-10 py-4 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] hover:bg-neutral-200 transition-all active:scale-90 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItCard;