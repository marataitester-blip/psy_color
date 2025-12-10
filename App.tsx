import React, { useState, useRef } from 'react';
import { analyzeText, generateTarotImage } from './services/geminiService';
import { FullAnalysisResult, AnalysisStatus, Language } from './types';
import { translations } from './constants/translations';
import { Button } from './components/Button';
import { ResultCard } from './components/ResultCard';
import { Sparkles, Trash2, Globe, Star } from 'lucide-react';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<FullAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('ru');
  
  const t = translations[language];
  const resultRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ru' : 'en');
  };

  const handleAnalyze = async () => {
    if (!userInput.trim()) return;

    setStatus(AnalysisStatus.ANALYZING_TEXT);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeText(userInput, language);
      setStatus(AnalysisStatus.GENERATING_IMAGE);
      const imageUrl = await generateTarotImage(analysis.image_prompt);

      setResult({
        ...analysis,
        image_url: imageUrl
      });
      
      setStatus(AnalysisStatus.COMPLETE);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err: any) {
      setError(err.message || t.errorGeneric);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleClear = () => {
    setUserInput('');
    setResult(null);
    setStatus(AnalysisStatus.IDLE);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-black text-text-primary relative overflow-x-hidden flex flex-col items-center py-8 px-4 font-cormorant selection:bg-accent-gold/30 selection:text-white">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-gold/5 blur-[150px] rounded-full opacity-30" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl p-2 md:p-6">
        
        <div className="flex flex-col relative min-h-[85vh]">
          
          {/* Language Switcher - Top Right */}
          <div className="absolute top-0 right-0 z-50 p-2">
            <button 
              onClick={toggleLanguage}
              className="text-accent-gold border border-accent-gold/30 hover:border-accent-gold hover:bg-accent-gold/10 font-cinzel text-[10px] tracking-[0.2em] uppercase transition-all flex items-center gap-2 px-4 py-2 rounded-sm"
            >
              <Globe className="w-3 h-3" />
              <span>{language === 'en' ? 'EN' : 'RU'}</span>
            </button>
          </div>

          {/* Header */}
          <header className="text-center space-y-6 mb-16 mt-16 animate-fade-in">
            <div className="flex items-center justify-center gap-4 text-accent-gold/60">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-accent-gold"></div>
              <Star className="w-4 h-4 text-accent-gold" fill="currentColor" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-accent-gold"></div>
            </div>
            
            <h1 className="font-cinzel text-4xl md:text-7xl text-accent-gold font-normal tracking-[0.1em] uppercase drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              {t.title}
            </h1>
            
            <p className="font-cormorant text-xl md:text-2xl text-text-secondary italic max-w-2xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>
          </header>

          {/* Input Section */}
          <section className={`flex-1 flex flex-col items-center transition-all duration-700 ${result ? 'hidden' : 'block'}`}>
            <div className="w-full max-w-3xl relative group border-t border-b border-accent-gold/30 py-10 bg-transparent">
              
              <label htmlFor="userInput" className="block text-center font-cinzel text-accent-gold text-sm tracking-[0.3em] uppercase mb-8">
                {t.inputLabel}
              </label>

              <textarea
                id="userInput"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                disabled={status === AnalysisStatus.ANALYZING_TEXT || status === AnalysisStatus.GENERATING_IMAGE}
                placeholder={t.placeholder}
                className="w-full min-h-[180px] bg-transparent border-none text-xl md:text-2xl text-center font-cormorant text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:ring-0 transition-all resize-none py-4 px-4 leading-loose"
              />
            </div>

            <div className="mt-12 flex flex-col md:flex-row gap-6 w-full max-w-xs">
              <Button 
                onClick={handleAnalyze} 
                isLoading={status === AnalysisStatus.ANALYZING_TEXT || status === AnalysisStatus.GENERATING_IMAGE}
                loadingText={status === AnalysisStatus.ANALYZING_TEXT ? t.analyzing : t.generating}
                disabled={!userInput.trim()}
                className="flex-1 w-full border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-black"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t.buttonAnalyze}</span>
              </Button>
            </div>
            
            {error && (
              <div className="mt-8 text-red-400 font-cormorant italic text-center text-lg">
                {error}
              </div>
            )}
          </section>

          {/* Result Section */}
          <div ref={resultRef} className="w-full max-w-6xl mx-auto">
            {result && status === AnalysisStatus.COMPLETE && (
               <div className="space-y-12">
                  <div className="flex justify-center">
                    <Button 
                      variant="secondary" 
                      onClick={handleClear}
                      className="text-xs py-3 px-8 opacity-60 hover:opacity-100 border-accent-gold/30 text-accent-gold"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{t.buttonClear}</span>
                    </Button>
                  </div>

                  <ResultCard 
                    result={result} 
                    labels={{
                      archetypeManifested: t.archetypeManifested,
                      theRevelation: t.theRevelation,
                      generatedBy: t.generatedBy
                    }}
                  />
               </div>
            )}
          </div>

          {/* Footer */}
          <footer className="mt-auto pt-20 pb-8 text-center">
             <div className="flex items-center justify-center gap-4 opacity-50 mb-6">
              <div className="h-px w-12 bg-accent-gold"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-accent-gold"></div>
              <div className="h-px w-12 bg-accent-gold"></div>
             </div>
             <p className="font-cinzel text-[10px] tracking-[0.3em] text-accent-gold/50 uppercase">
                {t.footer}
             </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default App;