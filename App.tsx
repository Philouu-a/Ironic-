import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mantra } from './types.ts';
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
    
    // Fallback immédiat avec les données locales
    const initialSet: Mantra[] = INITIAL_MANTRAS.map((text, idx) => ({
      id: `initial-${idx}`,
      frontText: "Archive Item",
      backText: text,
      author: AUTHORS[idx % AUTHORS.length],
      index: idx + 1,
      colorTheme: COLOR_THEMES[idx % COLOR_THEMES.length],
    }));
    
    setMantras(initialSet);

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
      console.warn("Gemini service unavailable, using local fallback.");
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden">
      <header className="fixed top-0 left-0 w-full px-12 py-10 z-50 flex justify-between items-center bg-gradient-to-b from-black to-transparent">
        <div className="text-3xl font-black tracking-tighter">IRONIC.</div>
        <button 
          onClick={() => scrollContainerRef.current?.scrollTo({ left: 0, behavior: 'smooth' })}
          className="bg-white text-black px-10 py-3 rounded-full text-[11px] font-black tracking-[0.2em] uppercase hover:invert transition-all"
        >
          Reset View
        </button>
      </header>

      <div 
        ref={scrollContainerRef}
        className="w-full h-full flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory px-[25vw] py-20 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center h-full min-w-max pr-[25vw]">
          {mantras.map((mantra) => (
            <div key={mantra.id} className="snap-center">
              <PostItCard mantra={mantra} />
            </div>
          ))}
          
          {loading && (
             <div className="px-40 opacity-20 text-[10px] font-black uppercase tracking-widest animate-pulse">
                Curating Archive...
             </div>
          )}

          <div className="flex-shrink-0 w-[420px] h-[600px] mx-6 rounded-[80px] border-4 border-dashed border-white/5 flex flex-col items-center justify-center opacity-20">
            <h3 className="text-xl font-black uppercase">End of Archive</h3>
            <button onClick={initializeData} className="mt-4 underline text-[10px] font-black tracking-widest uppercase">Refresh</button>
          </div>
        </div>
      </div>

      <footer className="fixed bottom-0 left-0 w-full p-12 flex justify-between items-center opacity-20 z-40 pointer-events-none">
        <div className="text-[9px] font-black tracking-[0.5em] uppercase">© 2025 IRONIC SYNDICATE</div>
        <div className="text-[9px] font-black tracking-[0.5em] uppercase">STANDALONE VERSION</div>
      </footer>
    </div>
  );
};

export default App;