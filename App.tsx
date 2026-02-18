import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mantra, GeminiResponse } from './types.ts';
import { COLOR_THEMES, INITIAL_MANTRAS, AUTHORS } from './constants.ts';
import PostItCard from './components/PostItCard.tsx';
import { fetchIronicMantras } from './services/geminiService.ts';

const App: React.FC = () => {
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const initializeData = useCallback(async () => {
    setLoading(true);
    
    // Initialisation avec le stock local (immédiat)
    const initialSet: Mantra[] = INITIAL_MANTRAS.map((text, idx) => ({
      id: `initial-${idx}`,
      frontText: "Archive Item",
      backText: text,
      author: AUTHORS[idx % AUTHORS.length],
      index: idx + 1,
      colorTheme: COLOR_THEMES[idx % COLOR_THEMES.length],
    }));
    
    setMantras(initialSet);

    // Tentative d'enrichissement via Gemini
    try {
      const result = await fetchIronicMantras();
      if (result && result.mantras) {
        const geminiSet: Mantra[] = result.mantras.map((m, idx) => ({
          id: `gemini-${idx}`,
          frontText: "Digital Artifact",
          backText: m.backText,
          author: m.author,
          index: initialSet.length + idx + 1,
          colorTheme: COLOR_THEMES[(initialSet.length + idx) % COLOR_THEMES.length],
        }));
        setMantras(prev => [...prev, ...geminiSet]);
      }
    } catch (e) {
      console.warn("Gemini service unavailable, sticking to initial collection.");
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Gestion du scroll horizontal fluide (Souris/Touch)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.style.scrollSnapType = 'none';
        container.scrollLeft += e.deltaY * 1.5;
        window.clearTimeout((container as any)._snapTimer);
        (container as any)._snapTimer = window.setTimeout(() => {
          container.style.scrollSnapType = 'x mandatory';
        }, 150);
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      container.style.cursor = 'grabbing';
      container.style.scrollSnapType = 'none';
      startX.current = e.pageX - container.offsetLeft;
      scrollLeft.current = container.scrollLeft;
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      container.style.cursor = 'grab';
      container.style.scrollSnapType = 'x mandatory';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX.current) * 2;
      container.scrollLeft = scrollLeft.current - walk;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden selection:bg-white selection:text-black">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full px-12 py-10 z-50 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
        <div className="text-3xl font-black tracking-tighter">IRONIC.</div>
        <nav className="hidden lg:flex gap-16">
          {['GALLERY', 'MANIFESTO', 'ARCHIVE'].map(item => (
            <a key={item} href="#" className="text-[11px] font-black tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity uppercase">
              {item}
            </a>
          ))}
        </nav>
        <button 
          onClick={() => scrollContainerRef.current?.scrollTo({ left: 0, behavior: 'smooth' })}
          className="bg-white text-black px-10 py-3.5 rounded-full text-[11px] font-black tracking-[0.2em] uppercase hover:invert transition-all"
        >
          Top of Archive
        </button>
      </header>

      {/* Main Experience */}
      <div 
        ref={scrollContainerRef}
        className="w-full h-full flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory px-[25vw] py-20 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center h-full min-w-max pr-[25vw]">
          {mantras.map((mantra) => (
            <div key={mantra.id} className="snap-center pointer-events-auto">
              <PostItCard mantra={mantra} />
            </div>
          ))}
          
          {loading && (
             <div className="flex flex-col items-center justify-center px-40 opacity-30">
                <div className="w-10 h-10 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
                <p className="mt-6 text-[10px] font-black tracking-[0.5em] uppercase">Loading Digital Heritage...</p>
             </div>
          )}

          <div className="flex-shrink-0 w-[420px] h-[600px] mx-6 rounded-[80px] border-4 border-dashed border-white/5 flex flex-col items-center justify-center text-center opacity-20 hover:opacity-80 transition-opacity">
            <h3 className="text-2xl font-black uppercase mb-4">End of Line.</h3>
            <button onClick={initializeData} className="text-[10px] font-black tracking-widest uppercase underline underline-offset-8">Restock</button>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="fixed bottom-0 left-0 w-full p-12 flex justify-between items-center pointer-events-none z-40">
        <div className="text-[9px] font-black tracking-[0.5em] uppercase opacity-20">
          &copy; 2025 IRONIC SYNDICATE
        </div>
        <div className="flex items-center gap-3 px-6 py-2.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-40">System Online</span>
        </div>
      </footer>
    </div>
  );
};

export default App;