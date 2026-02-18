
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mantra, GeminiResponse } from './types';
import { COLOR_THEMES, INITIAL_MANTRAS, AUTHORS } from './constants';
import PostItCard from './components/PostItCard';
import { fetchIronicMantras } from './services/geminiService';

const App: React.FC = () => {
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Drag and Scroll state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const initializeData = useCallback(async () => {
    setLoading(true);
    
    // Initial cards
    const initialSet: Mantra[] = INITIAL_MANTRAS.map((text, idx) => ({
      id: `initial-${idx}`,
      frontText: "Tap to discover",
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
        frontText: "Tap to discover",
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

  // Combined Interaction Logic
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
    <div className="min-h-screen bg-black flex flex-col items-center justify-center overflow-hidden selection:bg-white selection:text-black">
      {/* Premium Header */}
      <header className="fixed top-0 left-0 w-full px-12 py-10 z-50 flex justify-between items-center bg-gradient-to-b from-black/90 via-black/40 to-transparent">
        <div className="text-3xl font-black tracking-tighter cursor-pointer hover:scale-105 transition-transform">IRONIC.</div>
        
        <nav className="hidden lg:flex gap-16">
          {['HOME', 'SHOWROOM', 'COLLECTION'].map(item => (
            <a key={item} href="#" className="text-[11px] font-black tracking-[0.3em] hover:text-white transition-colors uppercase opacity-60 hover:opacity-100">
              {item}
            </a>
          ))}
        </nav>

        <button 
          onClick={() => scrollContainerRef.current?.scrollTo({ left: 0, behavior: 'smooth' })}
          className="bg-white text-black px-10 py-3.5 rounded-full text-[11px] font-black tracking-[0.1em] uppercase hover:bg-neutral-200 active:scale-95 transition-all shadow-lg"
        >
          Reset View
        </button>
      </header>

      {/* Decorative Text Layers */}
      <div className="fixed top-[18%] left-12 opacity-10 pointer-events-none select-none z-0">
        <p className="text-sm font-black uppercase tracking-[0.4em]">Le luxe de la vérité.</p>
      </div>
      <div className="fixed top-[18%] right-12 opacity-10 pointer-events-none select-none z-0">
        <p className="text-sm font-black uppercase tracking-[0.4em]">Showroom Privé</p>
      </div>

      {/* Main Experience Container */}
      <div 
        ref={scrollContainerRef}
        className="w-full h-full flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory px-[15vw] md:px-[30vw] py-20 cursor-grab active:cursor-grabbing scroll-smooth"
      >
        <div className="flex items-center h-full min-w-max pr-[30vw]">
          {mantras.map((mantra) => (
            <div key={mantra.id} className="snap-center pointer-events-auto transition-transform duration-500 ease-out hover:scale-[1.02]">
              <PostItCard mantra={mantra} />
            </div>
          ))}
          
          {loading && (
             <div className="flex flex-col items-center justify-center px-32">
                <div className="w-10 h-10 border-[3px] border-white/10 border-t-white rounded-full animate-spin"></div>
                <p className="mt-6 text-[10px] font-black tracking-[0.4em] opacity-30 uppercase">Curating luxury...</p>
             </div>
          )}

          <div className="flex-shrink-0 w-[420px] h-[600px] mx-6 rounded-[80px] border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center p-14 snap-center opacity-40 hover:opacity-100 transition-opacity">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">Limited Edition.</h3>
            <button 
              onClick={initializeData}
              className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full text-[10px] font-black tracking-widest uppercase border border-white/20 transition-all"
            >
              New Arrivals
            </button>
          </div>
        </div>
      </div>

      {/* Interaction Guide */}
      <div className="fixed bottom-14 left-1/2 -translate-x-1/2 opacity-30 pointer-events-none flex flex-col items-center z-50">
        <p className="text-[9px] font-black tracking-[0.6em] uppercase mb-3">Scroll or Drag to Browse</p>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent animate-bounce"></div>
      </div>

      <footer className="fixed bottom-0 left-0 w-full p-10 flex justify-between items-center z-40 pointer-events-none">
        <div className="text-[10px] font-black tracking-[0.4em] uppercase opacity-20">
          &copy; 2025 Ironic Luxury Syndicate
        </div>
        <div className="flex gap-8 items-center pointer-events-auto">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
              <span className="text-[9px] font-black tracking-widest uppercase opacity-60">Authentication Secure</span>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
