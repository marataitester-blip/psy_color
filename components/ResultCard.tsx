import React from 'react';
import { FullAnalysisResult } from '../types';
import { Sparkles } from 'lucide-react';

interface ResultCardProps {
  result: FullAnalysisResult;
  labels: {
    archetypeManifested: string;
    theRevelation: string;
    generatedBy: string;
  };
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, labels }) => {
  return (
    <div className="w-full animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* Left Panel: Image */}
        <div className="border border-accent-gold/40 p-4 rounded-sm bg-bg-secondary/50 flex flex-col items-center text-center shadow-[0_0_20px_rgba(212,175,55,0.05)]">
          <div className="font-cinzel text-xs text-accent-gold uppercase tracking-[0.25em] mb-4 border-b border-accent-gold/20 pb-2 w-full">
            {labels.archetypeManifested}
          </div>
          
          <div className="relative w-full aspect-[3/4] border border-accent-gold/30 p-2 bg-black">
            <div className="w-full h-full overflow-hidden relative group border border-accent-gold/10">
               <img 
                src={result.image_url} 
                alt={result.card_name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
            </div>
          </div>
        </div>

        {/* Right Panel: Interpretation */}
        <div className="border-t border-b border-accent-gold/30 py-8 md:py-12 px-2 flex flex-col justify-center relative min-h-[400px]">
           {/* Background Deco */}
           <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
             <Sparkles className="w-16 h-16 text-accent-gold" />
           </div>

           <div className="relative z-10 flex flex-col h-full justify-between">
             <div className="text-center mb-8">
               <div className="font-cinzel text-xs text-text-secondary uppercase tracking-[0.3em] mb-3">
                 {labels.theRevelation}
               </div>
               
               <h2 className="font-cinzel text-3xl md:text-5xl text-accent-gold mb-2 tracking-wider drop-shadow-md">
                 {result.card_name}
               </h2>
               <div className="h-px w-16 bg-accent-gold/50 mx-auto mt-4"></div>
             </div>

             <div className="prose prose-p:text-text-primary prose-p:font-cormorant prose-p:text-xl prose-p:leading-8 prose-p:text-justify max-w-none mb-8">
                <p>
                  {result.interpretation}
                </p>
             </div>

             <div className="flex justify-between items-end border-t border-accent-gold/10 pt-4 mt-auto">
                <span className="font-cinzel text-[10px] tracking-[0.2em] text-accent-gold/30 uppercase">
                  Arcana {Math.floor(Math.random() * 21)}
                </span>
                <span className="font-cinzel text-[10px] tracking-[0.2em] text-accent-gold/30 uppercase">
                  {labels.generatedBy}
                </span>
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};