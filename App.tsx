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
    
    const initialSet: Mantra[] = INITIAL_MANTRAS.map((text, idx) => ({
      id: `initial-${idx}`,
      frontText: "Collection Item",
      backText: text,
      author: AUTHORS[idx % AUTHORS.length],
      index: idx + 1,
      colorTheme: COLOR_THEMES[idx % COLOR_THEMES.length],
    }));
    
    setMantras(initialSet);

    const result = await fetchIronicMantras();
    if (result && result.mantras) {
      const geminiSet: Mantra[] = result.mantras.map((m, idx) => ({
        id: `gemini-${idx}`,
        frontText: "Collection Item",
        backText: m.backText,
        author: m.author,
        index: initialSet.length + idx + 1,
        colorTheme: COLOR_THEMES[(initialSet.length + idx) % COLOR_THEMES.length],
      }));
      setMantras(prev => [...prev, ...geminiSet]);
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

    const handleMouseLeave = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      container.style.cursor = 'grab';
      container.style.scrollSnapType = 'x mandatory';
    };

    const handleMouseUp = () => {
      if (!isDragging.current) return;
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
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center overflow-hidden selection:bg-white selection:text-black">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 w-full px-12 py-10 z-50 flex justify-between items-center bg-gradient-to-b from-black/90 via-black/40 to-transparent">
        <div className="text-3xl font-black tracking-tighter cursor-pointer hover:scale-110 transition-transform">IRONIC.</div>
        
        <nav className="hidden lg:flex gap-16">
          {['HOME', 'SHOWROOM', 'COLLECTION', 'MANIFESTO'].map(item => (
            <a key={item} href="#" className="text-[11px] font-black tracking-[0.4em] hover:text-white transition-colors uppercase opacity-40 hover:opacity-100">
              {item}
            </a>
          ))}
        </nav>

        <button 
          onClick={() => scrollContainerRef.current?.scrollTo({ left: 0, behavior: 'smooth' })}
          className="bg-white text-black px-12 py-4 rounded-full text-[11px] font-black tracking-[0.2em] uppercase hover:invert active:scale-95 transition-all shadow-2xl"
        >
          Reset View
        </button>
      </header>

      {/* Background Decorative Typography */}
      <div className="fixed top-[20%] left-12 opacity-5 pointer-events-none select-none z-0">
        <p className="text-[180px] font-black uppercase tracking-tighter leading-none">LUXE</p>
      </div>
      <div className="fixed bottom-[10%] right-12 opacity-5 pointer-events-none select-none z-0">
        <p className="text-[180px] font-black uppercase tracking-tighter leading-none">VOID</p>
      </div>

      {/* Main Experience Container */}
      <div 
        ref={scrollContainerRef}
        className="w-full h-full flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory px-[10vw] md:px-[25vw] py-20 cursor-grab active:cursor-grabbing scroll-smooth"
      >
        <div className="flex items-center h-full min-w-max pr-[25vw]">
          {mantras.map((mantra) => (
            <div key={mantra.id} className="snap-center pointer-events-auto transition-transform duration-700 ease-out hover:scale-[1.03]">
              <PostItCard mantra={mantra} />
            </div>
          ))}
          
          {loading && (
             <div className="flex flex-col items-center justify-center px-40">
                <div className="w-12 h-12 border-[4px] border-white/5 border-t-white rounded-full animate-spin"></div>
                <p className="mt-8 text-[11px] font-black tracking-[0.6em] opacity-30 uppercase">Curating the Archive...</p>
             </div>
          )}

          {/* End of Line / CTA */}
          <div className="flex-shrink-0 w-[420px] h-[600px] mx-6 rounded-[80px] border-4 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-14 snap-center opacity-30 hover:opacity-100 transition-opacity">
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-6">Collection Over.</h3>
            <button 
              onClick={initializeData}
              className="px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full text-[11px] font-black tracking-[0.3em] uppercase border border-white/20 transition-all"
            >
              Restock Archive
            </button>
          </div>
        </div>
      </div>

      {/* Interaction Help */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none flex flex-col items-center z-50">
        <p className="text-[10px] font-black tracking-[0.8em] uppercase mb-4">Slide to Browse</p>
        <div className="w-[2px] h-12 bg-gradient-to-b from-white to-transparent animate-pulse"></div>
      </div>

      <footer className="fixed bottom-0 left-0 w-full p-12 flex justify-between items-center z-40 pointer-events-none">
        <div className="text-[10px] font-black tracking-[0.5em] uppercase opacity-20">
          &copy; 2025 Ironic Luxury Syndicate / Studio-V
        </div>
        <div className="flex gap-10 items-center pointer-events-auto">
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_#10b981]"></div>
              <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-50">Archive v4.0.1 Connected</span>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;