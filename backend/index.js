require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { findSymbolsInText } = require('./dreamSymbols');

const app = express();
const PORT = process.env.PORT || 5001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'https://oneirvision.vercel.app',
      // Add other domains as needed
    ];
    
    if (process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'OneirVision Dream Interpretation API is running',
    version: '1.0.0'
  });
});

// Pollinations.ai image generation fallback
const generatePollinationsImage = async (prompt, options = {}) => {
  const {
    width = 1024,
    height = 1024,
    seed,
    model = 'flux',
    enhance = true,
    nologo = true
  } = options;

  // Clean and encode the prompt
  const cleanPrompt = prompt
    .replace(/[^\w\s,.-]/g, '') // Remove special characters except basic punctuation
    .trim()
    .replace(/\s+/g, ' '); // Normalize whitespace

  const encodedPrompt = encodeURIComponent(cleanPrompt);
  
  // Build URL with parameters
  const params = new URLSearchParams();
  params.append('width', width.toString());
  params.append('height', height.toString());
  params.append('model', model);
  
  if (seed !== undefined) {
    params.append('seed', seed.toString());
  }
  
  if (enhance) {
    params.append('enhance', 'true');
  }
  
  if (nologo) {
    params.append('nologo', 'true');
  }

  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?${params.toString()}`;
  
  // Test if the image loads successfully
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Pollinations API returned ${response.status}`);
    }
    
    // Convert to base64 for consistent handling
    const imageBuffer = await response.buffer();
    const base64Image = imageBuffer.toString('base64');
    return `data:image/jpeg;base64,${base64Image}`;
  } catch (error) {
    console.error('Pollinations.ai generation failed:', error);
    throw error;
  }
};

// Enhanced image generation with Pollinations fallback
const generateImageWithFallback = async (prompt, style = 'dreamlike') => {
  const enhancedPrompt = `A dreamlike visualization of: ${prompt}${style ? `, in the style of ${style}` : ''}. Highly detailed, 4k, photorealistic, surreal, ethereal, vibrant colors`;
  
  console.log('Generating image with prompt:', enhancedPrompt);
  
  // Try Hugging Face first
  if (HUGGINGFACE_API_KEY) {
    try {
      console.log('Attempting Hugging Face generation...');
      
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            inputs: enhancedPrompt,
            parameters: {
              num_inference_steps: 30,
              guidance_scale: 7.5,
            }
          }),
        }
      );

      if (response.ok) {
        // Check if the response is JSON (error) or binary (image)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.log('Hugging Face returned JSON error:', errorData);
          throw new Error(`Hugging Face API error: ${errorData.error || 'Unknown error'}`);
        }

        const imageArrayBuffer = await response.arrayBuffer();
        const imageBuffer = Buffer.from(imageArrayBuffer);
        const base64Image = imageBuffer.toString('base64');
        
        console.log('✅ Hugging Face generation successful');
        return `data:image/jpeg;base64,${base64Image}`;
      } else {
        const errorText = await response.text();
        console.log('Hugging Face API failed:', response.status, errorText);
        throw new Error(`Hugging Face API failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.log('❌ Hugging Face failed, trying Pollinations.ai fallback...');
      console.error('Hugging Face error:', error.message);
    }
  } else {
    console.log('No Hugging Face API key, using Pollinations.ai...');
  }
  
  // Fallback to Pollinations.ai
  try {
    console.log('🔄 Using Pollinations.ai fallback...');
    const pollinationsImage = await generatePollinationsImage(enhancedPrompt, {
      width: 1024,
      height: 1024,
      model: 'flux',
      enhance: true,
      nologo: true
    });
    
    console.log('✅ Pollinations.ai generation successful');
    return pollinationsImage;
  } catch (pollinationsError) {
    console.error('❌ Pollinations.ai also failed:', pollinationsError);
    throw new Error('Both Hugging Face and Pollinations.ai image generation failed');
  }
};

// Dream interpretation endpoint
app.post('/api/interpret', async (req, res) => {
  console.log('Received interpretation request:', { 
    body: req.body,
    headers: req.headers,
    method: req.method
  });

  if (!GEMINI_API_KEY) {
    console.error('Gemini API key is not configured');
    return res.status(500).json({ 
      error: 'Server configuration error',
      message: 'Gemini API key is not configured' 
    });
  }

  try {
    const { dream } = req.body;
    
    if (!dream) {
      console.error('No dream content provided');
      return res.status(400).json({ 
        error: 'Bad Request',
        message: 'Dream content is required' 
      });
    }

    if (!dream) {
      return res.status(400).json({ error: 'Dream description is required' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const prompt = `For the following dream, provide:
    1. A brief (2-3 sentences) overall interpretation
    2. 3-5 key symbols from the dream with their meanings (format as "symbol: meaning" on separate lines)
    3. Emotional insights (1-2 sentences)
    4. Actionable advice (1-2 sentences)

    Dream: ${dream}

    Format your response exactly like this:
    INTERPRETATION: [your interpretation here]
    SYMBOLS: [symbol1] | [meaning1]\n[symbol2] | [meaning2]\n[...]
    EMOTIONS: [emotional insights here]
    ADVICE: [actionable advice here]`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      return res.status(response.status).json({ 
        error: 'Failed to interpret dream',
        details: errorData 
      });
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse the structured response
    const interpretationMatch = responseText.match(/INTERPRETATION:([\s\S]*?)(?=EMOTIONS:|$)/i);
    const emotionsMatch = responseText.match(/EMOTIONS:([\s\S]*?)(?=ADVICE:|$)/i);
    const adviceMatch = responseText.match(/ADVICE:([\s\S]*?)$/i);
    
    // Find symbols in the dream text
    const symbols = findSymbolsInText(dream);
    
    // If no symbols found, add some common ones based on the interpretation
    if (symbols.length === 0) {
      const commonSymbols = [
        { symbol: 'Dream', meaning: 'Your subconscious mind is processing daily experiences' },
        { symbol: 'Emotions', meaning: 'Your feelings are seeking attention and understanding' },
        { symbol: 'Thoughts', meaning: 'Your mind is working through complex ideas' }
      ];
      symbols.push(...commonSymbols);
    }

    // Prepare response
    const responseData = {
      success: true,
      interpretation: interpretationMatch ? interpretationMatch[1].trim() : 'No interpretation available',
      symbols: symbols.slice(0, 5), // Limit to top 5 symbols
      emotions: emotionsMatch ? emotionsMatch[1].trim() : 'Emotional insights not available',
      advice: adviceMatch ? adviceMatch[1].trim() : 'No specific advice available'
    };
    
    console.log('Sending response:', responseData);
    res.json(responseData);
  } catch (error) {
    console.error('Error in dream interpretation:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
    });
  }
});

// Sequential dream visualization endpoint with Pollinations fallback
app.post('/api/visualize-sequential', async (req, res) => {
  try {
    const { dream } = req.body;

    if (!dream) {
      return res.status(400).json({ error: 'Dream description is required' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    console.log('Processing sequential dream visualization for:', dream);

    // Step 1: Generate two sequential prompts using Gemini
    const promptGenerationRequest = `You are an AI image prompt generator.  
Given a dream description, split the dream into two logical parts:
- Part 1: The first half of the dream — the setup or beginning situation.
- Part 2: The second half — the action, climax, or what happens next.

For each part, write a visually descriptive prompt that includes:
- Important characters, emotions, setting, and objects.
- Clear environmental and emotional context for image generation.
- Artistic style: dreamlike, surreal, highly detailed, vibrant colors, fantasy art

Return the two prompts clearly labeled as "Prompt 1" and "Prompt 2".
Dream: "${dream}"`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    console.log('Sending request to Gemini API:', { url: geminiUrl });
    
    let geminiResponse;
    let geminiData;
    
    try {
      geminiResponse = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptGenerationRequest,
                },
              ],
            },
          ],
        }),
        timeout: 30000 // 30 second timeout
      });

      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json().catch(() => ({}));
        console.error('Gemini API Error:', {
          status: geminiResponse.status,
          statusText: geminiResponse.statusText,
          errorData
        });
        return res.status(500).json({ 
          success: false,
          error: 'AI Service Error',
          message: 'Failed to generate image prompts',
          details: errorData 
        });
      }

      geminiData = await geminiResponse.json();
      console.log('Gemini API Response:', JSON.stringify(geminiData, null, 2));
      
      if (!geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response format from Gemini API');
      }
      
      const promptsText = geminiData.candidates[0].content.parts[0].text;
      console.log('Generated prompts from Gemini:', promptsText);
      
      // Process the prompts and continue with the response
      const prompt1Match = promptsText.match(/Prompt 1:(.*?)(?=Prompt 2:|$)/is);
      const prompt2Match = promptsText.match(/Prompt 2:(.*?)$/is);
      
      if (!prompt1Match || !prompt2Match) {
        throw new Error('Could not extract prompts from Gemini response');
      }
      
      const prompt1 = prompt1Match[1].trim();
      const prompt2 = prompt2Match[1].trim();
      
      // Generate images using the prompts
      const [image1, image2] = await Promise.all([
        generateImageWithFallback(prompt1, 'dreamlike'),
        generateImageWithFallback(prompt2, 'dreamlike')
      ]);
      
      // Prepare the response
      const interpretation = {
        id: Date.now().toString(),
        summary: `Interpretation for dream about ${dream.substring(0, 30)}...`,
        symbols: findSymbolsInText(dream).map(symbol => ({
          symbol,
          meaning: `Meaning of ${symbol} in dreams`
        })),
        psychological: 'Psychological analysis would appear here...',
        psychologicalAnalysis: 'Detailed psychological analysis...',
        emotional: 'Emotional analysis would appear here...',
        emotionalInsights: 'Detailed emotional insights...',
        advice: 'Actionable advice based on the dream...',
        actionableAdvice: 'Detailed actionable advice...',
        createdAt: new Date().toISOString()
      };
      
      res.status(200).json({
        success: true,
        prompts: {
          prompt1,
          prompt2
        },
        images: {
          image1,
          image2
        },
        style: 'dreamlike'
      });
      
    } catch (error) {
      console.error('Error in sequential dream visualization:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to process sequential dream visualization',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  } catch (error) {
    console.error('Unexpected error in sequential dream visualization:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Original single dream visualization endpoint with Pollinations fallback
app.post('/api/visualize', async (req, res) => {
  try {
    const { prompt, style = 'dreamlike' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('Generating single visualization with prompt:', prompt);
    
    try {
      const imageUrl = await generateImageWithFallback(prompt, style);
      
      console.log('Successfully generated single visualization');
      
      // Prepare response
      const responseData = {
        success: true,
        imageUrl: imageUrl,
        prompt: prompt,
        style,
        generatedAt: new Date().toISOString()
      };
      
      res.json(responseData);
    } catch (error) {
      console.error('Image generation failed:', error);
      res.status(500).json({
        error: 'Failed to generate visualization',
        message: error.message
      });
    }
  } catch (error) {
    console.error('Error in dream visualization:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OneirVision API Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 Gemini API: ${GEMINI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🎨 Hugging Face API: ${HUGGINGFACE_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🌸 Pollinations.ai: ✅ Available as fallback (no API key required)`);
});

module.exports = app;