export const config = {
  runtime: 'edge', // Using Edge runtime for better performance
};

export default async function handler(req) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { userInput, language } = await req.json();

    if (!userInput) {
      throw new Error('User input is required');
    }

    const groqKey = process.env.GROQ_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (!groqKey || !openRouterKey) {
      throw new Error('Server configuration error: Missing API keys');
    }

    // --- STEP 1: Text Analysis via Groq ---
    const systemPrompt = `You are a Jungian psychologist and Tarot master. Analyze the user's state of mind described in the input.
You must return a JSON object containing:
1. "card_name": The name of a Tarot card that best represents the archetype of their situation (in ${language === 'ru' ? 'Russian' : 'English'}).
2. "interpretation": A psychological analysis (300-400 characters) written from the perspective of a wise mentor (in ${language === 'ru' ? 'Russian' : 'English'}).
3. "image_prompt": A detailed English prompt for AI image generation. The style must be: surrealism, abstract, mystical, dark gold colors, psychological portrait. NOTE: This prompt must ALWAYS be in English.`;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userInput }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      throw new Error(`Groq API Error: ${errText}`);
    }

    const groqData = await groqResponse.json();
    let analysis;
    try {
      analysis = JSON.parse(groqData.choices[0].message.content);
    } catch (e) {
      throw new Error("Failed to parse Tarot analysis from Groq");
    }

    // --- STEP 2: Image Generation via OpenRouter ---
    // Using black-forest-labs/flux-pro (Flux.1 Pro) as requested logic implies high quality
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        // 'HTTP-Referer': 'https://tarot-app.com', // Optional: Add your site URL here
        // 'X-Title': 'Tarot Reader', // Optional: Add your site name here
      },
      body: JSON.stringify({
        model: 'black-forest-labs/flux-pro', 
        prompt: analysis.image_prompt,
        response_format: 'b64_json',
        num_images: 1
      })
    });

    if (!openRouterResponse.ok) {
        // Fallback: If image fails, return text analysis only with a placeholder or error indication
        console.error("OpenRouter Error:", await openRouterResponse.text());
        // We still return the analysis, but maybe with a default image or null
        // However, the spec asks to throw error or handle gracefully. 
        // Let's throw for now to show the error in UI as per instruction "Все ошибки... отправлять на фронт"
        const errText = await openRouterResponse.text();
        throw new Error(`OpenRouter API Error: ${errText}`);
    }

    const imageData = await openRouterResponse.json();
    const imageBase64 = imageData.data?.[0]?.b64_json; // OpenAI format
    // Note: Some OpenRouter models might return 'url' instead. Flux-pro usually supports b64_json.
    
    let finalImageUrl = '';
    if (imageBase64) {
        finalImageUrl = `data:image/png;base64,${imageBase64}`;
    } else if (imageData.data?.[0]?.url) {
        finalImageUrl = imageData.data[0].url;
    } else {
        throw new Error("No image data received from OpenRouter");
    }

    // --- Return Combined Result ---
    return new Response(JSON.stringify({
      card_name: analysis.card_name,
      interpretation: analysis.interpretation,
      image_prompt: analysis.image_prompt,
      image_url: finalImageUrl
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    });

  } catch (error) {
    console.error('API Handler Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    });
  }
}