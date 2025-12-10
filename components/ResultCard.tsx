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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 w-full animate-fade-in">
      
      {/* Image Section */}
      <div className="relative group perspective-1000">
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-accent-gold/30 bg-bg-secondary shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:scale-[1.01]">
          <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-transparent opacity-60 z-10" />
          <img 
            src={result.image_url} 
            alt={result.card_name} 
            className="w-full h-full object-cover animate-fade-in"
          />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-center">
            <span className="font-cinzel text-xs text-accent-gold tracking-[0.2em] uppercase mb-2 block">
              {labels.archetypeManifested}
            </span>
          </div>
        </div>
        
        {/* Decorative corner borders */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-accent-gold opacity-60" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-accent-gold opacity-60" />
      </div>

      {/* Text Section */}
      <div className="flex flex-col justify-center space-y-8 p-6 md:p-8 bg-bg-secondary/50 backdrop-blur-sm rounded-xl border border-white/5">
        <div className="space-y-2 border-b border-accent-gold/20 pb-6">
          <div className="flex items-center gap-2 text-accent-gold mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="font-cinzel text-sm tracking-widest uppercase">{labels.theRevelation}</span>
          </div>
          <h2 className="font-cinzel text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-accent-gold to-white font-bold leading-tight">
            {result.card_name}
          </h2>
        </div>

        <div className="space-y-6">
          <p className="font-cormorant text-xl md:text-2xl text-text-primary leading-relaxed italic opacity-90">
            "{result.interpretation}"
          </p>
        </div>

        <div className="pt-6 text-text-secondary font-cinzel text-xs tracking-widest opacity-60">
           {labels.generatedBy}
        </div>
      </div>
    </div>
  );
};