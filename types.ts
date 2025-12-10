export interface TarotAnalysis {
  card_name: string;
  interpretation: string;
  image_prompt: string;
}

export interface FullAnalysisResult extends TarotAnalysis {
  image_url: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING_TEXT = 'ANALYZING_TEXT',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export type Language = 'en' | 'ru';