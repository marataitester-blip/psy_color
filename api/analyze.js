export const config = {
  maxDuration: 30,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userInput } = req.body;

    if (!userInput) {
      throw new Error('User input is required');
    }

    if (!process.env.GROQ_API_KEY || !process.env.OPENROUTER_API_KEY) {
      throw new Error('Server configuration error: Missing API keys');
    }

    // 1. Text Analysis via Groq
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { 
            role: 'system', 
            content: 'Ты юнгианский психолог и таролог. Верни ТОЛЬКО JSON: {card_name, interpretation, image_prompt}' 
          },
          { role: 'user', content: userInput }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!groqResponse.ok) {
      throw new Error(`Groq API Error: ${await groqResponse.text()}`);
    }

    const groqData = await groqResponse.json();
    const content = groqData.choices[0].message.content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
      
    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (e) {
      throw new Error('Failed to parse JSON from Groq response');
    }

    // 2. Image Generation via OpenRouter
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://mirmag-groq.vercel.app',
        'X-Title': 'MirMag Groq'
      },
      body: JSON.stringify({
        model: 'black-forest-labs/flux.2-pro',
        prompt: analysis.image_prompt,
        response_format: 'b64_json',
        num_images: 1
      })
    });

    if (!openRouterResponse.ok) {
      throw new Error(`OpenRouter API Error: ${await openRouterResponse.text()}`);
    }

    const imageData = await openRouterResponse.json();
    let finalImageUrl = '';

    if (imageData.data && imageData.data[0].b64_json) {
      finalImageUrl = `data:image/png;base64,${imageData.data[0].b64_json}`;
    } else if (imageData.data && imageData.data[0].url) {
      // Fallback: If model only returns URL, fetch and convert to base64
      // This ensures we always return a self-contained response
      const imageFetch = await fetch(imageData.data[0].url);
      const arrayBuffer = await imageFetch.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      finalImageUrl = `data:image/png;base64,${buffer.toString('base64')}`;
    } else {
      throw new Error('No image data received from OpenRouter');
    }

    return res.status(200).json({
      card_name: analysis.card_name,
      interpretation: analysis.interpretation,
      image_url: finalImageUrl
    });

  } catch (error) {
    console.error('Analyze API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}