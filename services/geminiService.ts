import { FullAnalysisResult, Language } from "../types";

/**
 * Call the serverless backend to perform the full analysis (Text + Image).
 */
export const analyzeFate = async (userInput: string, language: Language): Promise<FullAnalysisResult> => {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput, language }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to consult the Oracle.");
    }

    return data as FullAnalysisResult;
  } catch (error: any) {
    console.error("Fate Analysis Error:", error);
    throw new Error(error.message || "The connection to the ethereal realm was severed.");
  }
};

// Deprecated functions kept (but unused) or removed to ensure clean switch. 
// We are removing the old direct API calls to Gemini.
