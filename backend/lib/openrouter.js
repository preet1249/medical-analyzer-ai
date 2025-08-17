const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not defined in environment variables');
}

const openRouterClient = axios.create({
  baseURL: OPENROUTER_BASE_URL,
  timeout: 60000, // 60 seconds timeout
  headers: {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.FRONTEND_URL || 'http://localhost:3000',
    'X-Title': 'Medical Report Analyzer'
  }
});

// Test function to verify API key
async function testOpenRouterConnection() {
  try {
    console.log('Testing OpenRouter API connection...');
    const response = await openRouterClient.get('/models');
    console.log('✅ OpenRouter API connection successful');
    return true;
  } catch (error) {
    console.error('❌ OpenRouter API connection failed:', error.response?.data || error.message);
    return false;
  }
}

async function analyzeImageFast(imageBase64) {
  try {
    console.log('🚀 Starting FAST AI analysis with GPT-4o (no OCR)...');
    
    // First test API connection
    const isConnected = await testOpenRouterConnection();
    if (!isConnected) {
      throw new Error('OpenRouter API connection failed. Please check your API key and internet connection.');
    }

    const systemPrompt = `Analyze this medical report image and return ONLY valid JSON in this exact format:
{
  "summary": "Brief overview in 1-2 sentences",
  "reportType": "Type of medical report",
  "keyFindings": ["Finding 1", "Finding 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "medicinesSuggested": ["Medicine 1"],
  "severity": "low"
}

Rules:
- Return ONLY valid JSON, no other text
- Keep responses concise
- Always recommend consulting healthcare professionals`;

    const userMessage = `Analyze this medical report and return valid JSON only.`;

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: userMessage
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ]
      }
    ];

    console.log('📤 Sending request to GPT-4o-mini...');
    const response = await openRouterClient.post('/chat/completions', {
      model: 'openai/gpt-4o-mini',
      messages,
      max_tokens: 1000, // Reduced for faster response
      temperature: 0.1
    });

    const result = response.data.choices[0].message.content;
    console.log('✅ GPT-4o analysis completed successfully');
    
    return result;
  } catch (error) {
    console.error('❌ Error analyzing image:', error.response?.data || error.message);
    throw new Error('Failed to analyze medical report. Please try again.');
  }
}

async function analyzeImage(imageBase64, extractedText) {
  // Use the fast version by default
  return analyzeImageFast(imageBase64);
}

async function chatWithReport(messages, reportContext) {
  try {
    const systemMessage = {
      role: 'system',
      content: `You are a medical AI assistant helping users understand their medical report. 

Report Context:
${reportContext}

Guidelines:
- Answer questions specifically about this medical report
- Provide clear, understandable explanations
- Always recommend consulting healthcare professionals for medical decisions
- Be helpful but remind users you're an AI assistant
- If asked about something not in the report, politely redirect to the report content`
    };

    const response = await openRouterClient.post('/chat/completions', {
      model: 'openai/gpt-4o-mini',
      messages: [systemMessage, ...messages],
      max_tokens: 1000,
      temperature: 0.4
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error in chat:', error.response?.data || error.message);
    throw new Error('Failed to process chat message. Please try again.');
  }
}

module.exports = {
  analyzeImageFast,
  analyzeImage,
  chatWithReport
};