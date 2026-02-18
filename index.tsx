
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- TYPES & INTERFACES ---
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

// --- CONSTANTES ---
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

// --- COMPOSANT POST-IT ---

const PostItCard: React.FC<{ mantra: Mantra }> = ({ mantra }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const formattedIndex = `#${String(mantra.index).padStart(3, '0')}`;
  const itemType = mantra.index % 3;

  const renderLuxuryItem = () => {
    switch (itemType) {
      case 0: // Style SAC DE LUXE
        return (
          <div className="relative flex flex-col items-center group scale-110">
            <svg width="240" height="240" viewBox="0 0 260 280" className="drop-shadow-2xl">
              <rect x="40" y="80" width="180" height="160" rx="10" fill="#222" />
              <path d="M75 80 C75 0 185 0 185 80" fill="none" stroke="#444" strokeWidth="15" />
              <rect x="50" y="90" width="160" height="140" fill="rgba(255,255,255,0.05)" />
            </svg>
            <div className="absolute top-[135px] w-36 text-center pointer-events-none px-2">
              <p className="text-[11px] font-black uppercase text-white tracking-tight leading-tight">{mantra.backText}</p>
            </div>
          </div>
        );
      case 1: // Style BOÎTE ORANGE
        return (
          <div className="relative flex flex-col items-center group scale-110">
            <svg width="240" height="240" viewBox="0 0 300 260" className="drop-shadow-2xl">
              <rect x="30" y="50" width="240" height="180" fill="#ff7f11" rx="4" />
              <rect x="30" y="130" width="240" height="20" fill="rgba(0,0,0,0.1)" />
            </svg>
            <div className="absolute top-[110px] w-48 text-center pointer-events-none italic">
               <p className="text-[14px] font-black text-black/70 tracking-tight" style={{fontFamily: 'Caveat'}}>{mantra.backText}</p>
            </div>
          </div>
        );
      default: // Style CARTE MINIMALISTE
        return (
          <div className="bg-white/5 p-10 rounded-full border border-white/10 animate-pulse">
            <p className="text-[15px] font-black text-center uppercase tracking-tighter max-w-[150px]">{mantra.backText}</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-shrink-0 w-[400px] h-[580px] mx-8 perspective-1000 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
      <div className={`relative w-full h-full transition-transform duration-[1000ms] transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* RECTO */}
        <div className={`absolute inset-0 backface-hidden squircle p-12 flex flex-col justify-between shadow-2xl ${mantra.colorTheme.bg}`}>
          <div className="flex justify-between items-start">
            <span className={`text-2xl font-black opacity-30 ${mantra.colorTheme.text}`}>{formattedIndex}</span>
            <span className={`text-[10px] font-black uppercase tracking-widest opacity-40 ${mantra.colorTheme.text}`}>Limited Edition</span>
          </div>
          <div className="text-center">
            <h3 className={`text-4xl font-black uppercase tracking-tighter ${mantra.colorTheme.text} leading-none`}>Mantra<br/>Archive</h3>
            <p className={`mt-6 text-[10px] font-black uppercase tracking-[0.5em] ${mantra.colorTheme.text} opacity-50`}>Cliquez pour révéler</p>
          </div>
          <div className={`w-full h-1 opacity-20 ${mantra.colorTheme.text === 'text-black' ? 'bg-black' : 'bg-white'}`}></div>
        </div>
        {/* VERSO */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 squircle p-10 flex flex-col justify-center items-center shadow-2xl bg-[#080808] border border-white/10 text-white">
          <div className="absolute top-10 text-[9px] font-black opacity-20 tracking-[1em] uppercase">{mantra.author} // CATALOGUE</div>
          {renderLuxuryItem()}
          <button className="absolute bottom-12 px-10 py-3 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-[0.3em]">Retourner</button>
        </div>
      </div>
    </div>
  );
};

// --- APPLICATION PRINCIPALE ---

const App: React.FC = () => {
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      
      // Données de base
      const local = INITIAL_MANTRAS.map((m, i) => ({
        id: `l-${i}`,
        backText: m.text,
        author: m.author,
        index: i + 1,
        colorTheme: COLOR_THEMES[i % COLOR_THEMES.length]
      }));
      setMantras(local);

      // Tentative Gemini
      try {
        // Fix: Access process.env.API_KEY directly as window.process is not defined in browser context
        const apiKey = process.env.API_KEY;
        if (apiKey) {
          const ai = new GoogleGenAI({ apiKey });
          const resp = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Generate 6 short, sassy, ironic motivational mantras. Format JSON: {mantras: [{backText, author}]}",
            config: { responseMimeType: "application/json" }
          });
          // Fix: Access .text property directly and ensure it's defined before parsing
          const responseText = resp.text;
          if (responseText) {
            const aiData = JSON.parse(responseText).mantras;
            const enriched = aiData.map((m: any, i: number) => ({
              id: `ai-${i}`,
              backText: m.backText.toUpperCase(),
              author: m.author.toUpperCase(),
              index: local.length + i + 1,
              colorTheme: COLOR_THEMES[(local.length + i) % COLOR_THEMES.length]
            }));
            setMantras(prev => [...prev, ...enriched]);
          }
        }
      } catch (e) {
        console.warn("API Gemini non disponible, utilisation du stock local.", e);
      }
      setLoading(false);
    };
    init();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center selection:bg-white selection:text-black">
      {/* Header fixe */}
      <header className="fixed top-0 left-0 w-full p-12 z-50 flex justify-between items-center pointer-events-none">
        <div className="text-4xl font-black tracking-tighter leading-none pointer-events-auto cursor-default">
          IRONIC.<br/>
          <span className="text-[10px] tracking-[0.8em] opacity-30">SYNDICATE</span>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 px-8 py-4 rounded-full pointer-events-auto">
          <p className="text-[10px] font-black tracking-widest uppercase opacity-60">Spring Collection 2025</p>
        </div>
      </header>

      {/* Galerie horizontale */}
      <div ref={scrollRef} className="w-full h-full flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory px-[20vw] py-32">
        <div className="flex items-center min-w-max pr-[20vw]">
          {mantras.map(m => <PostItCard key={m.id} mantra={m} />)}
          {loading && (
            <div className="px-20 text-[11px] font-black uppercase opacity-20 tracking-[0.5em] animate-pulse">
              Curating archive...
            </div>
          )}
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="fixed bottom-12 left-0 w-full px-12 flex justify-between items-center opacity-20 pointer-events-none text-[9px] font-black tracking-[0.5em] uppercase">
        <p>© 2025 IRONIC ARCHIVE</p>
        <p>Défilez pour explorer</p>
      </footer>
    </div>
  );
};

// --- MOUNTING ---
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
