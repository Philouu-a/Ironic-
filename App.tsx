import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

// --- TYPES ---
interface ColorTheme {
  bg: string;
  text: string;
}

interface Mantra {
  id: string;
  backText: string;
  author: string;
  index: number;
  colorTheme: ColorTheme;
}

// --- CONSTANTS ---
const COLOR_THEMES: ColorTheme[] = [
  { bg: 'bg-[#FF1A3D]', text: 'text-white' },
  { bg: 'bg-[#00FF73]', text: 'text-black' },
  { bg: 'bg-[#0070FF]', text: 'text-white' },
  { bg: 'bg-[#FFFF00]', text: 'text-black' },
  { bg: 'bg-[#9D00FF]', text: 'text-white' },
  { bg: 'bg-[#FF8800]', text: 'text-black' },
];

const INITIAL_MANTRAS = [
  { text: "YOUR COFFEE WON'T MAKE YOU HAPPY, BUT YOUR PURCHASE MIGHT.", author: "CAPITALISM" },
  { text: "WORK UNTIL YOUR IDOLS BECOME YOUR RIVALS OR YOU BURN OUT.", author: "HUSTLE" },
  { text: "MANIFESTING A LIFE I DON'T NEED TO ESCAPE FROM (LIES).", author: "INSTAGRAM" },
  { text: "DOING NOTHING IS ACTUALLY VERY TIME CONSUMING.", author: "PROCASTINATION" },
  { text: "STAY HUMBLE, BUT LET THEM KNOW YOU'RE BETTER.", author: "EGO" },
  { text: "SPOILER ALERT: THE UNIVERSE DOESN'T CARE.", author: "NIHILISM" },
];

// --- COMPONENTS ---

const PostItCard: React.FC<{ mantra: Mantra }> = ({ mantra }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const formattedIndex = `#${String(mantra.index).padStart(3, '0')}`;
  
  const itemType = mantra.index % 4;

  const renderLuxuryItem = () => {
    switch (itemType) {
      case 0: // DIOR STYLE
        return (
          <div className="relative flex flex-col items-center group">
            <svg width="240" height="240" viewBox="0 0 260 280" className="drop-shadow-2xl transition-transform duration-700 group-hover:scale-105">
              <rect x="40" y="80" width="180" height="160" rx="8" fill="#7a91a0" />
              <path d="M75 80 C75 0 185 0 185 80" fill="none" stroke="#5c7280" strokeWidth="20" />
              <text x="130" y="170" textAnchor="middle" fill="white" fontSize="10" fontWeight="900" className="opacity-40 uppercase tracking-widest">{mantra.author}</text>
            </svg>
            <div className="absolute top-[130px] w-32 text-center pointer-events-none px-2">
              <p className="text-[10px] font-black uppercase text-white tracking-tight leading-tight">{mantra.backText}</p>
            </div>
          </div>
        );
      case 1: // HERMES STYLE
        return (
          <div className="relative flex flex-col items-center group">
            <svg width="240" height="240" viewBox="0 0 300 260" className="drop-shadow-2xl transition-transform duration-700 group-hover:-rotate-2">
              <path d="M40 70 L260 70 L280 250 L20 250 Z" fill="#ff7f11" />
              <path d="M100 70 C100 -10 200 -10 200 70" fill="none" stroke="#d84315" strokeWidth="12" />
              <rect x="135" y="70" width="30" height="40" fill="#eceff1" />
            </svg>
            <div className="absolute top-[130px] w-48 text-center pointer-events-none italic">
               <p className="text-[12px] font-black text-black/60 tracking-tight" style={{fontFamily: 'Caveat'}}>{mantra.backText}</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white/5 p-8 rounded-full border border-white/10 animate-pulse">
            <p className="text-[14px] font-black text-center uppercase tracking-tighter">{mantra.backText}</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-shrink-0 w-[380px] h-[540px] mx-6 perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`relative w-full h-full transition-transform duration-[1100ms] transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* FRONT */}
        <div className={`absolute inset-0 backface-hidden squircle p-12 flex flex-col justify-between shadow-2xl ${mantra.colorTheme.bg}`}>
          <span className={`text-2xl font-black opacity-20 ${mantra.colorTheme.text}`}>{formattedIndex}</span>
          <div className="text-center">
            <h3 className={`text-4xl font-black uppercase tracking-tighter ${mantra.colorTheme.text}`}>Archive Item</h3>
            <p className={`mt-4 text-[10px] font-black uppercase tracking-[0.4em] ${mantra.colorTheme.text} opacity-50`}>Touch to Unveil</p>
          </div>
          <div className={`w-full h-1 opacity-20 ${mantra.colorTheme.bg === 'bg-[#FFFF00]' ? 'bg-black' : 'bg-white'}`}></div>
        </div>
        {/* BACK */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 squircle p-10 flex flex-col justify-center items-center shadow-2xl bg-[#0a0a0a] border border-white/10 overflow-hidden text-white">
          <div className="absolute top-8 left-8 text-[10px] font-black opacity-20 tracking-widest uppercase">{mantra.author} // 2025</div>
          {renderLuxuryItem()}
          <button className="mt-12 px-8 py-3 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest">Close</button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchAI = async () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    try {
      const ai = new GoogleGenAI({ apiKey });
      const resp = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Generate 6 ironic, high-fashion, sassy motivational mantras. JSON format: {mantras: [{backText, author}]}",
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(resp.text).mantras;
    } catch (e) { return null; }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const local = INITIAL_MANTRAS.map((m, i) => ({
        id: `l-${i}`,
        backText: m.text,
        author: m.author,
        index: i + 1,
        colorTheme: COLOR_THEMES[i % COLOR_THEMES.length]
      }));
      setMantras(local);

      const aiData = await fetchAI();
      if (aiData) {
        const enriched = aiData.map((m: any, i: number) => ({
          id: `ai-${i}`,
          backText: m.backText,
          author: m.author,
          index: local.length + i + 1,
          colorTheme: COLOR_THEMES[(local.length + i) % COLOR_THEMES.length]
        }));
        setMantras(prev => [...prev, ...enriched]);
      }
      setLoading(false);
    };
    init();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <header className="fixed top-0 left-0 w-full p-12 z-50 flex justify-between items-end">
        <div className="text-4xl font-black tracking-tighter leading-none">IRONIC.<br/><span className="text-[10px] tracking-[0.8em] opacity-30">ARCHIVE</span></div>
        <div className="text-[9px] font-black tracking-[0.3em] uppercase opacity-20 hidden md:block">Collection Automne / Hiver 2025</div>
      </header>

      <div ref={scrollRef} className="w-full h-full flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory px-[15vw] py-20">
        <div className="flex items-center min-w-max">
          {mantras.map(m => <PostItCard key={m.id} mantra={m} />)}
          {loading && <div className="px-20 text-[10px] font-black uppercase opacity-20 animate-pulse">Fetching AI Mantras...</div>}
        </div>
      </div>

      <footer className="fixed bottom-12 left-0 w-full px-12 flex justify-between items-center opacity-20 pointer-events-none">
        <p className="text-[9px] font-black tracking-[0.5em] uppercase">© 2025 IRONIC SYNDICATE</p>
        <p className="text-[9px] font-black tracking-[0.5em] uppercase">Scroll to Explore</p>
      </footer>
    </div>
  );
};

export default App;