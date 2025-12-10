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
    <div className="w-full animate-fade-in border-t border-b border-accent-gold/20 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center max-w-6xl mx-auto">
        
        {/* Left Panel: Image */}
        <div className="flex flex-col items-center">
          <div className="font-cinzel text-xs text-accent-gold/80 uppercase tracking-[0.25em] mb-6 flex items-center gap-4">
             <span className="h-px w-8 bg-accent-gold/40"></span>
             {labels.archetypeManifested}
             <span className="h-px w-8 bg-accent-gold/40"></span>
          </div>
          
          <div className="relative w-full max-w-sm aspect-[3/4] p-1 border border-accent-gold/40 bg-black shadow-[0_0_40px_rgba(212,175,55,0.1)]">
            <div className="w-full h-full border border-accent-gold/20 p-2">
               <img 
                src={result.image_url} 
                alt={result.card_name} 
                className="w-full h-full object-cover filter contrast-[1.1] brightness-[0.9] sepia-[0.2]"
              />
            </div>
          </div>
        </div>

        {/* Right Panel: Interpretation */}
        <div className="flex flex-col h-full justify-center">
           <div className="text-center mb-8 md:mb-10">
             <div className="font-cinzel text-xs text-text-secondary uppercase tracking-[0.3em] mb-4">
               {labels.theRevelation}
             </div>
             
             <h2 className="font-cinzel text-4xl md:text-5xl text-accent-gold mb-6 tracking-wider drop-shadow-md">
               {result.card_name}
             </h2>
             <div className="flex justify-center">
                <Sparkles className="w-5 h-5 text-accent-gold opacity-60" />
             </div>
           </div>

           <div className="prose prose-p:text-text-primary prose-p:font-cormorant prose-p:text-xl md:prose-p:text-2xl prose-p:leading-loose prose-p:text-center max-w-none py-2 px-4">
              <p>
                {result.interpretation}
              </p>
           </div>

           <div className="flex justify-center mt-8 md:mt-12 opacity-40">
              <span className="font-cinzel text-[10px] tracking-[0.2em] text-accent-gold uppercase">
                {labels.generatedBy}
              </span>
           </div>
        </div>

      </div>
    </div>
  );
};