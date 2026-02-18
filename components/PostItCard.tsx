
import React, { useState, useMemo } from 'react';
import { Mantra } from '../types';

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
  const displayMantra = mantra.backText;

  // Split mantra for creative text layouts
  const words = useMemo(() => displayMantra.split(' '), [displayMantra]);

  // Determine which luxury item to show based on the index
  const itemType = mantra.index % 4;

  const renderLuxuryItem = () => {
    switch (itemType) {
      case 0: // LADY DIOR STYLE (Grey-blue quilted)
        return (
          <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-1000">
            <div className="relative transition-all duration-700 hover:scale-105 drop-shadow-[0_45px_70px_rgba(0,0,0,0.7)]">
              <svg width="260" height="280" viewBox="0 0 260 280">
                <defs>
                  <linearGradient id="diorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#95adb9" />
                    <stop offset="50%" stopColor="#7a91a0" />
                    <stop offset="100%" stopColor="#5c7280" />
                  </linearGradient>
                  <pattern id="cannagePattern" x="0" y="0" width="34" height="34" patternUnits="userSpaceOnUse">
                    <path d="M17 0 L34 17 L17 34 L0 17 Z" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
                    <circle cx="17" cy="17" r="10" fill="rgba(0,0,0,0.03)" />
                  </pattern>
                </defs>
                {/* Handles */}
                <path d="M75 80 C75 0 185 0 185 80" fill="none" stroke="#708694" strokeWidth="24" strokeLinecap="round" />
                <path d="M75 80 C75 10 185 10 185 80" fill="none" stroke="#9bb0bd" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
                {/* Body */}
                <rect x="40" y="80" width="180" height="160" rx="4" fill="url(#diorGrad)" />
                <rect x="40" y="80" width="180" height="160" rx="4" fill="url(#cannagePattern)" />
                {/* Hardware */}
                <circle cx="75" cy="80" r="10" fill="#e5c100" />
                <circle cx="185" cy="80" r="10" fill="#e5c100" />
                {/* Charms - Customized with letters from the mantra */}
                <g transform="translate(185, 125)">
                   <circle cx="0" cy="0" r="18" fill="#f1c40f" />
                   <text y="5" textAnchor="middle" fill="#5c4b00" fontSize="14" fontWeight="900" style={{fontFamily: 'serif'}}>{words[0]?.[0] || 'D'}</text>
                   <circle cx="18" cy="28" r="15" fill="#d4af37" />
                   <text x="18" y="33" textAnchor="middle" fill="#5c4b00" fontSize="11" fontWeight="900" style={{fontFamily: 'serif'}}>{words[1]?.[0] || 'I'}</text>
                </g>
              </svg>
              {/* PRINTED MANTRA ON THE QUILTING */}
              <div className="absolute top-[140px] left-1/2 -translate-x-1/2 w-36 text-center pointer-events-none">
                <p className="text-[12px] font-black uppercase text-white tracking-[0.1em] leading-none drop-shadow-md" style={{fontFamily: 'serif'}}>
                  {displayMantra}
                </p>
              </div>
            </div>
            <span className="text-[9px] font-black text-white/30 mt-8 tracking-[0.5em] uppercase">Maison Ironic Bag</span>
          </div>
        );

      case 1: // HERMES BIRKIN STYLE (Orange)
        return (
          <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-1000">
            <div className="relative transition-all duration-700 hover:rotate-1 drop-shadow-[0_45px_70px_rgba(0,0,0,0.7)]">
              <svg width="300" height="260" viewBox="0 0 300 260">
                <defs>
                  <linearGradient id="hermesLeather" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ff7f11" />
                    <stop offset="100%" stopColor="#e65100" />
                  </linearGradient>
                </defs>
                {/* Signature Handles */}
                <path d="M100 70 C100 -10 200 -10 200 70" fill="none" stroke="#d84315" strokeWidth="16" strokeLinecap="round" />
                {/* Iconic Body */}
                <path d="M40 70 L260 70 L280 230 C280 245 265 255 250 255 L50 255 C35 255 20 245 20 230 Z" fill="url(#hermesLeather)" />
                {/* Horizontal Flap Strap */}
                <rect x="40" y="95" width="220" height="18" fill="#bf360c" />
                {/* Silver Plate Lock Mechanism */}
                <rect x="135" y="95" width="30" height="40" rx="1" fill="#eceff1" />
                <rect x="145" y="110" width="10" height="15" fill="#90a4ae" />
                {/* Clochette Charm */}
                <path d="M180 110 L195 140 L165 140 Z" fill="#d84315" />
                <line x1="150" y1="110" x2="180" y2="110" stroke="#bf360c" strokeWidth="1" />
              </svg>
              {/* BRANDED HEAT STAMP MANTRA */}
              <div className="absolute top-[145px] left-1/2 -translate-x-1/2 w-52 text-center pointer-events-none">
                <p className="text-[10px] font-bold text-black/40 tracking-[0.3em] uppercase mb-1">HERMÈS PARIS</p>
                <p className="text-[13px] font-black text-black/60 tracking-tight leading-none italic" style={{fontFamily: 'Caveat, cursive'}}>
                   "{displayMantra}"
                </p>
                <p className="text-[7px] text-black/30 mt-2 font-bold uppercase tracking-widest">MADE IN THE VOID</p>
              </div>
            </div>
            <span className="text-[9px] font-black text-white/30 mt-8 tracking-[0.5em] uppercase">The Birkin Truth</span>
          </div>
        );

      case 2: // TWILLY SCARF STYLE (Orange/Red/Patterned Ribbon)
        return (
          <div className="relative flex flex-col items-center animate-in fade-in slide-in-from-top-12 duration-1000">
            <div className="relative transition-all duration-700 hover:scale-105 drop-shadow-[0_30px_50px_rgba(255,61,0,0.4)]">
              <svg width="150" height="360" viewBox="0 0 150 360">
                <defs>
                   <linearGradient id="twillyGrad" x1="0" y1="0" x2="1" y2="1">
                     <stop offset="0%" stopColor="#ff3d00" />
                     <stop offset="30%" stopColor="#ff9100" />
                     <stop offset="70%" stopColor="#e65100" />
                     <stop offset="100%" stopColor="#ff3d00" />
                   </linearGradient>
                </defs>
                {/* Ribbon Shape */}
                <path d="M55 0 L95 0 L115 320 L75 360 L35 320 Z" fill="url(#twillyGrad)" />
                {/* Scarf Patterning - Faithful to Hermès motifs */}
                <rect x="55" y="40" width="40" height="40" fill="#ffffff" opacity="0.15" />
                <path d="M55 100 L95 140 M95 100 L55 140" stroke="white" strokeWidth="1" opacity="0.2" />
                <circle cx="75" cy="200" r="25" fill="#f9a825" opacity="0.3" />
              </svg>
              {/* MANTRA INTEGRATED INTO PATTERN */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 h-[280px] w-12 flex flex-col items-center justify-between pointer-events-none py-6">
                <p className="[writing-mode:vertical-lr] text-[12px] font-black text-white uppercase tracking-[0.4em] rotate-180 drop-shadow-md">
                  {displayMantra}
                </p>
                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-50"></div>
                <p className="[writing-mode:vertical-lr] text-[12px] font-black text-white uppercase tracking-[0.4em] rotate-180 drop-shadow-md">
                  AUTHENTIC VOID
                </p>
              </div>
            </div>
            <span className="text-[9px] font-black text-white/30 mt-8 tracking-[0.5em] uppercase">The Silk Twilly</span>
          </div>
        );

      case 3: // GUCCI TOTE STYLE (Beige Monogram + Web Stripe)
        return (
          <div className="relative flex flex-col items-center animate-in fade-in zoom-in duration-1000">
            <div className="relative transition-all duration-700 hover:rotate-[-1deg] drop-shadow-[0_45px_70px_rgba(0,0,0,0.7)]">
              <svg width="300" height="230" viewBox="0 0 300 230">
                <defs>
                   <pattern id="monogramPattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M5 5 Q10 0 15 5 Q20 10 15 15 Q10 20 5 15 Z" fill="none" stroke="#8d6e63" strokeWidth="0.5" opacity="0.5" />
                      <circle cx="22" cy="22" r="2" fill="#8d6e63" opacity="0.3" />
                   </pattern>
                </defs>
                {/* Tote Body */}
                <path d="M45 35 L255 35 L285 200 C285 220 265 230 245 230 L55 230 C35 230 15 220 15 200 Z" fill="#d7ccc8" />
                <path d="M45 35 L255 35 L285 200 C285 220 265 230 245 230 L55 230 C35 230 15 220 15 200 Z" fill="url(#monogramPattern)" />
                {/* Iconic Web Stripe */}
                <rect x="130" y="35" width="40" height="195" fill="#2e7d32" />
                <rect x="143" y="35" width="14" height="195" fill="#c62828" />
                {/* Leather Handles */}
                <path d="M75 45 L75 25 C75 5 225 5 225 25 L225 45" fill="none" stroke="#4e342e" strokeWidth="12" strokeLinecap="square" />
                <rect x="65" y="35" width="20" height="15" fill="#5d4037" />
                <rect x="215" y="35" width="20" height="15" fill="#5d4037" />
              </svg>
              {/* DESIGNER LABEL WITH MANTRA */}
              <div className="absolute top-[105px] left-1/2 -translate-x-1/2 w-48 pointer-events-none">
                 <div className="bg-white px-5 py-4 border-[4px] border-black shadow-[12px_12px_0px_rgba(0,0,0,0.3)]">
                    <p className="text-[11px] font-black uppercase text-black text-center leading-[1.1] tracking-tighter">
                       {displayMantra}
                    </p>
                    <div className="w-full h-[2px] bg-black mt-2"></div>
                    <p className="text-[6px] text-black/50 text-center mt-1 font-bold">GUCCI-IRONIC</p>
                 </div>
              </div>
            </div>
            <span className="text-[9px] font-black text-white/30 mt-8 tracking-[0.5em] uppercase">Monogram Legacy</span>
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
        className={`relative w-full h-full transition-transform duration-[1000ms] transform-style-3d cubic-bezier(0.4, 0, 0.2, 1) ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* Front Side: Minimal Teaser Card */}
        <div className={`absolute inset-0 backface-hidden squircle p-14 flex flex-col justify-between shadow-2xl ${mantra.colorTheme.bg}`}>
          <div className="flex justify-between items-start">
            <span className={`text-xl font-black opacity-30 ${textColor}`}>{formattedIndex}</span>
            <div className={`px-3 py-1 rounded-full border border-current opacity-30 ${textColor}`}>
               <span className="text-[9px] font-black tracking-widest uppercase">Luxe 2025</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center flex-grow text-center">
             <div className={`w-32 h-32 rounded-full border-4 border-current opacity-10 mb-8 flex items-center justify-center ${textColor}`}>
                <span className="text-4xl font-black">{formattedIndex.slice(-2)}</span>
             </div>
             <p className={`text-[11px] font-black uppercase tracking-[0.6em] ${textColor} opacity-40 mb-2`}>
               The Collection
             </p>
             <h3 className={`text-2xl font-black uppercase tracking-tighter ${textColor}`}>
               Press to Unveil
             </h3>
          </div>

          <div className="flex justify-between items-center">
            <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${textColor} opacity-60`}>
              Open Archive
            </p>
            <div className={`${textColor} animate-bounce`}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Back Side: The Faithful Luxury Showroom with Integrated Mantra */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 squircle p-10 flex flex-col shadow-2xl bg-[#080808] border border-white/10 overflow-hidden`}>
          
          {/* Subtle Studio Lighting */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08)_0%,_transparent_70%)]"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          </div>

          {/* Luxury Gallery Display */}
          <div className="flex-grow flex justify-center items-center relative py-12">
            {renderLuxuryItem()}
          </div>

          {/* Vestiary Footer */}
          <div className="mt-auto flex justify-between items-end border-t border-white/10 pt-8 z-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.5em] mb-2">Original Creation</span>
              <div className="flex items-center gap-3">
                <span className="text-xl font-black text-white tracking-tighter">AUTHENTICATED-MOD</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
              </div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
              className="px-8 py-3.5 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all active:scale-95 shadow-2xl"
            >
              Close Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItCard;
