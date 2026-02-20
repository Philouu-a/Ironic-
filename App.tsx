import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Sparkles, ArrowRight, X, Info, ChevronRight, RefreshCcw } from "lucide-react";

// --- TYPES ---
interface Question {
  id: number;
  text: string;
  options: string[];
}

interface Result {
  title: string;
  description: string;
}

// --- CONSTANTS ---
const COLOR_THEMES = [
  { bg: 'bg-[#FF0055]', text: 'text-white', accent: 'bg-white' }, // Vibrant Pink
  { bg: 'bg-[#00FF66]', text: 'text-black', accent: 'bg-black' }, // Electric Green
  { bg: 'bg-[#0066FF]', text: 'text-white', accent: 'bg-white' }, // Bright Blue
  { bg: 'bg-[#FFFF00]', text: 'text-black', accent: 'bg-black' }, // Neon Yellow
  { bg: 'bg-[#FF6600]', text: 'text-white', accent: 'bg-white' }, // Vivid Orange
  { bg: 'bg-[#9D00FF]', text: 'text-white', accent: 'bg-white' }, // Electric Purple
  { bg: 'bg-[#00FFFF]', text: 'text-black', accent: 'bg-black' }, // Cyan
];

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "HOW DO YOU DEFINE YOUR CURRENT AESTHETIC?",
    options: [
      "DEPRESSED VICTORIAN GHOST",
      "TIKTOK TREND VICTIM",
      "QUIET LUXURY (BUT ACTUALLY BROKE)",
      "WHATEVER WAS CLEAN ON THE FLOOR"
    ]
  },
  {
    id: 2,
    text: "WHAT IS YOUR RELATIONSHIP WITH FAST FASHION?",
    options: [
      "A GUILTY PLEASURE I HIDE FROM MY FRIENDS",
      "I ONLY WEAR VINTAGE COUTURE (LIES)",
      "I AM THE REASON THE PLANET IS DYING",
      "I DON'T KNOW HER"
    ]
  },
  {
    id: 3,
    text: "HOW DO YOU REACT TO A 'SOLD OUT' NOTIFICATION?",
    options: [
      "I CRY IN 4K RESOLUTION",
      "I BUY THE FAKE VERSION ON THE DARK WEB",
      "I PRETEND I NEVER WANTED IT ANYWAY",
      "I CALL MY THERAPIST"
    ]
  },
  {
    id: 4,
    text: "YOUR OPINION ON LOGOMANIA?",
    options: [
      "I AM A WALKING BILLBOARD FOR CAPITALISM",
      "IT'S TACKY (UNLESS IT'S BALENCIAGA)",
      "I PREFER THE LOGO OF MY OWN DISPAIR",
      "ONLY IF IT'S IRONIC"
    ]
  }
];

// --- APP ---

const App: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'looser' | 'quiz' | 'result'>('intro');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const [aiResult, setAiResult] = useState<Result | null>(null);
  const [loadingResult, setLoadingResult] = useState(false);

  const handleNo = () => setStep('looser');
  const handleYes = () => setStep('quiz');

  const handleAnswer = (index: number) => {
    const newAnswers = [...answers, index];
    setAnswers(newAnswers);
    
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      generateResult(newAnswers);
    }
  };

  const generateResult = async (finalAnswers: number[]) => {
    setStep('result');
    setLoadingResult(true);
    
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      // Fallback result
      setAiResult({
        title: "THE FASHION VICTIM",
        description: "You are a masterpiece of pretension. Your taste is as shallow as a runway puddle, and your aesthetic is a cry for help that nobody is answering."
      });
      setLoadingResult(false);
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Based on these ironic fashion quiz answers (indices: ${finalAnswers.join(', ')}), generate a highly ironic, sassy, and "mean" fashion persona result. 
      The questions were: ${QUESTIONS.map(q => q.text).join(' | ')}.
      Format as JSON: { "title": "...", "description": "..." }`;
      
      const resp = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      setAiResult(JSON.parse(resp.text));
    } catch (e) {
      setAiResult({
        title: "ERROR IN STYLE",
        description: "Even the AI is too jaded to judge you right now. Try again when you're wearing something better."
      });
    } finally {
      setLoadingResult(false);
    }
  };

  const reset = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setAnswers([]);
    setAiResult(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'} selection:bg-current selection:text-current overflow-hidden flex flex-col font-sans`}>
      <div className="fixed inset-0 bg-grain opacity-5 pointer-events-none z-50" />
      
      {/* TICKER */}
      <div className={`fixed top-0 left-0 w-full h-8 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} z-[70] flex items-center overflow-hidden border-b border-current`}>
        <div className="flex whitespace-nowrap animate-marquee font-display text-[9px] font-black uppercase tracking-[0.3em]">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8">
              TRUTH FASHION WEEK • TRUTH FASHION WEEK • TRUTH FASHION WEEK • TRUTH FASHION WEEK • TRUTH FASHION WEEK •
            </span>
          ))}
        </div>
      </div>

      {/* HEADER */}
      <header className="fixed top-8 left-0 w-full p-12 z-[60] flex justify-between items-start">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="cursor-pointer"
          onClick={reset}
        >
          <h1 className="text-4xl font-display font-black tracking-tighter uppercase">
            ROGUE.
          </h1>
        </motion.div>

        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center"
        >
          <button 
            onClick={() => setShowInfo(true)}
            className={`w-10 h-10 rounded-full border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} flex items-center justify-center hover:bg-current hover:text-current transition-all duration-500`}
          >
            <Info size={16} />
          </button>
        </motion.div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full min-h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
            >
              {/* SECTION 1: PINTEREST PHRASE */}
              <section className="h-screen w-full flex items-center justify-center p-12 snap-start">
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`text-3xl md:text-5xl lg:text-7xl font-display font-black uppercase ${theme === 'dark' ? 'text-white' : 'text-black'} text-center max-w-7xl mx-auto leading-[0.9] tracking-tighter`} 
                >
                  "Click on the options that best match the personality you invented for yourself on Pinterest this morning."
                </motion.h2>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                  <p className={`text-[10px] font-display uppercase tracking-[0.5em] ${theme === 'dark' ? 'opacity-30' : 'opacity-20'}`}>Scroll</p>
                  <div className={`w-px h-12 ${theme === 'dark' ? 'bg-white/20' : 'bg-black/20'}`} />
                </motion.div>
              </section>

              {/* SECTION 2: THE CARD */}
              <section className="h-screen w-full flex items-center justify-center p-6 snap-start">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="w-full max-w-xl aspect-[3/4] bg-[#FF3E00] p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 pointer-events-none opacity-10">
                    <div className="absolute top-0 left-1/2 w-px h-full bg-white" />
                    <div className="absolute top-1/2 left-0 w-full h-px bg-white" />
                  </div>
                  <div className="z-10">
                    <h2 className="text-7xl font-display font-black uppercase tracking-tighter leading-[0.85]">
                      ARE YOU<br/>BRAVE ENOUGH<br/>TO BE<br/>HONEST?
                    </h2>
                  </div>
                  <div className="flex gap-4 z-10">
                    <button 
                      onClick={handleYes}
                      className="flex-1 py-6 bg-white text-black font-display font-black uppercase tracking-widest hover:bg-black hover:text-white transition-colors duration-500"
                    >
                      YES
                    </button>
                    <button 
                      onClick={handleNo}
                      className="flex-1 py-6 border border-white/30 font-display font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-500"
                    >
                      NO
                    </button>
                  </div>
                </motion.div>
              </section>
            </motion.div>
          )}

          {step === 'quiz' && (
            <div className="flex flex-col items-center justify-center min-h-screen w-full p-6 pt-32">
              <motion.div
                key={`quiz-card-${currentQuestion}`}
                initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className={`w-full max-w-xl aspect-[3/4] ${COLOR_THEMES[currentQuestion % COLOR_THEMES.length].bg} ${COLOR_THEMES[currentQuestion % COLOR_THEMES.length].text} p-12 flex flex-col justify-between shadow-2xl relative overflow-hidden`}
              >
                {/* Measurement Lines */}
                <div className="absolute inset-0 pointer-events-none opacity-10">
                  <div className="absolute top-0 left-1/2 w-px h-full bg-current" />
                  <div className="absolute top-1/2 left-0 w-full h-px bg-current" />
                  <div className="absolute top-1/4 left-0 w-full h-px bg-current border-t border-dashed" />
                  <div className="absolute top-3/4 left-0 w-full h-px bg-current border-t border-dashed" />
                </div>

                <div className="z-10">
                  <h2 className="text-5xl font-display font-black uppercase tracking-tighter leading-[0.85] mb-8">
                    {QUESTIONS[currentQuestion].text}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-3 z-10">
                  {QUESTIONS[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className={`group relative w-full p-6 border ${COLOR_THEMES[currentQuestion % COLOR_THEMES.length].text === 'text-white' ? 'border-white/20' : 'border-black/20'} flex items-center justify-between hover:bg-current transition-all duration-500 text-left overflow-hidden`}
                    >
                      <span className={`text-sm font-display font-black uppercase tracking-tight leading-none group-hover:invert`}>
                        {option}
                      </span>
                      <ChevronRight size={16} className="opacity-40 group-hover:opacity-100 group-hover:invert transition-all" />
                    </button>
                  ))}
                </div>

                {/* VERTICAL DECORATION REMOVED */}
              </motion.div>
            </div>
          )}

          {step === 'looser' && (
            <div className="flex items-center justify-center min-h-screen w-full p-6">
              <motion.div
                key="looser"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <h2 className="text-[15vw] font-display font-black uppercase tracking-tighter leading-none mb-8">
                  LOOSER.
                </h2>
                <p className="text-[10px] font-display uppercase tracking-[1em] opacity-30 mb-12">Cowardice is so last season.</p>
                <button 
                  onClick={reset}
                  className="px-12 py-4 rounded-full border border-white/10 font-display font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500"
                >
                  Try Again
                </button>
              </motion.div>
            </div>
          )}

          {step === 'result' && (
            <div className="flex items-center justify-center min-h-screen w-full p-6">
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-3xl text-center"
              >
                {loadingResult ? (
                  <div className="flex flex-col items-center gap-8">
                    <div className="w-24 h-24 border-4 border-white/10 border-t-white rounded-full animate-spin" />
                    <p className="text-[10px] font-display font-black uppercase tracking-[0.8em] opacity-30 animate-pulse">
                      Calculating your flaws...
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center mb-12">
                      <Sparkles size={24} />
                    </div>
                    <h2 className="text-8xl font-display font-black uppercase tracking-tighter leading-[0.8] mb-8">
                      {aiResult?.title}
                    </h2>
                    <p className={`text-3xl font-serif italic leading-relaxed ${theme === 'dark' ? 'text-white/70' : 'text-black/70'} mb-12 max-w-2xl`}>
                      "{aiResult?.description}"
                    </p>
                    <div className={`w-24 h-px ${theme === 'dark' ? 'bg-white/20' : 'bg-black/20'} mb-12`} />
                    <button 
                      onClick={reset}
                      className={`flex items-center gap-4 px-12 py-6 ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'} font-display font-black uppercase tracking-widest hover:scale-105 transition-transform duration-500`}
                    >
                      <RefreshCcw size={18} />
                      New Assessment
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER REMOVED FOR CLEANER LOOK */}

      {/* INFO OVERLAY */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] ${theme === 'dark' ? 'bg-black/95' : 'bg-white/95'} backdrop-blur-xl flex items-center justify-center p-12`}
          >
            <button 
              onClick={() => setShowInfo(false)}
              className={`absolute top-12 right-12 w-16 h-16 rounded-full border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} flex items-center justify-center hover:bg-current hover:text-current transition-all duration-500`}
            >
              <X size={24} />
            </button>
            <div className="max-w-2xl text-center">
              <h2 className="text-6xl font-display font-black tracking-tighter uppercase mb-12">ROGUE.</h2>
              
              <div className="flex flex-col items-center gap-8 mb-12">
                <p className={`text-[10px] font-display uppercase tracking-[0.4em] ${theme === 'dark' ? 'opacity-40' : 'opacity-30'}`}>System Settings</p>
                <div className={`flex p-1 ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} rounded-full border`}>
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`px-8 py-3 rounded-full text-[10px] font-display font-black uppercase tracking-widest transition-all ${theme === 'dark' ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white') : (theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black')}`}
                  >
                    Dark Mode
                  </button>
                  <button 
                    onClick={() => setTheme('light')}
                    className={`px-8 py-3 rounded-full text-[10px] font-display font-black uppercase tracking-widest transition-all ${theme === 'light' ? (theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white') : (theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-black/40 hover:text-black')}`}
                  >
                    Light Mode
                  </button>
                </div>
              </div>

              <p className={`text-2xl font-black italic leading-relaxed ${theme === 'dark' ? 'text-white/70' : 'text-black/70'} mb-12`} style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                "Honesty is the ultimate luxury. Most people can't afford it."
              </p>
              <div className={`w-16 h-px ${theme === 'dark' ? 'bg-white/20' : 'bg-black/20'} mx-auto mb-12`} />
              <p className={`text-[10px] font-display uppercase tracking-[0.8em] ${theme === 'dark' ? 'text-white/20' : 'text-black/20'}`}>
                A PSYCHOLOGICAL EXPERIMENT
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;