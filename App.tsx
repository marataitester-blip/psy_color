import React, { useState, useRef } from 'react';
import { analyzeText, generateTarotImage } from './services/geminiService';
import { FullAnalysisResult, AnalysisStatus, Language } from './types';
import { translations } from './constants/translations';
import { Button } from './components/Button';
import { ResultCard } from './components/ResultCard';
import { Sparkles, Trash2, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<FullAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('ru'); // Default to Russian as per request context
  
  const t = translations[language];

  // Use a ref to scroll to results
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
      // Step 1: Text Analysis (pass language to prompt)
      const analysis = await analyzeText(userInput, language);
      
      setStatus(AnalysisStatus.GENERATING_IMAGE);
      
      // Step 2: Image Generation
      const imageUrl = await generateTarotImage(analysis.image_prompt);

      setResult({
        ...analysis,
        image_url: imageUrl
      });
      
      setStatus(AnalysisStatus.COMPLETE);

      // Scroll to result after a brief delay for render
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
    <div className="min-h-screen relative overflow-hidden text-text-primary">
      {/* Background Ambience - Explicitly z-0 */}
      <div className="fixed inset-0 z-0 bg-bg-primary pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-gold/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full" />
      </div>

      {/* Main Content - Explicitly z-10 to sit above background */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-accent-gold/30 bg-bg-secondary/50 backdrop-blur-sm text-accent-gold font-cinzel text-xs font-bold hover:bg-accent-gold/10 transition-colors"
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'en' ? 'EN' : 'RU'}</span>
          </button>
        </div>

        {/* Header */}
        <header className="text-center mb-16 space-y-4 animate-fade-in pt-8 md:pt-0">
          <h1 className="font-cinzel text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-accent-gold to-accent-gold-dim drop-shadow-sm">
            {t.title}
          </h1>
          <p className="font-cormorant text-xl text-text-secondary italic max-w-lg mx-auto">
            {t.subtitle}
          </p>
        </header>

        {/* Input Section */}
        <section className={`bg-bg-secondary/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 md:p-10 transition-all duration-700 ${result ? 'mb-16' : 'mb-0'}`}>
          <label htmlFor="userInput" className="block font-cinzel text-accent-gold text-lg mb-4 tracking-widest uppercase">
            {t.inputLabel}
          </label>
          
          <textarea
            id="userInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={status === AnalysisStatus.ANALYZING_TEXT || status === AnalysisStatus.GENERATING_IMAGE}
            placeholder={t.placeholder}
            className="w-full min-h-[180px] bg-bg-primary/50 border border-white/10 rounded-lg p-6 text-lg font-cormorant text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent-gold/50 focus:ring-1 focus:ring-accent-gold/50 transition-all resize-y mb-8"
          />

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleAnalyze} 
              isLoading={status === AnalysisStatus.ANALYZING_TEXT || status === AnalysisStatus.GENERATING_IMAGE}
              loadingText={status === AnalysisStatus.ANALYZING_TEXT ? t.analyzing : t.generating}
              disabled={!userInput.trim()}
              className="flex-1"
            >
              <Sparkles className="w-5 h-5" />
              <span>{t.buttonAnalyze}</span>
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={handleClear}
              disabled={status === AnalysisStatus.ANALYZING_TEXT || status === AnalysisStatus.GENERATING_IMAGE}
            >
              <Trash2 className="w-5 h-5" />
              <span>{t.buttonClear}</span>
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-red-200 font-cormorant flex items-center justify-center animate-fade-in">
              {error}
            </div>
          )}
        </section>

        {/* Result Section */}
        <div ref={resultRef}>
          {result && status === AnalysisStatus.COMPLETE && (
            <ResultCard 
              result={result} 
              labels={{
                archetypeManifested: t.archetypeManifested,
                theRevelation: t.theRevelation,
                generatedBy: t.generatedBy
              }}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-24 text-center text-text-secondary/40 font-cinzel text-xs tracking-widest border-t border-white/5 pt-8">
          <p className="flex items-center justify-center gap-2">
             {t.footer}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;