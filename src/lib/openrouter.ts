import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not defined in environment variables');
}

const openRouterClient = axios.create({
  baseURL: OPENROUTER_BASE_URL,
  headers: {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': process.env.NEXTAUTH_URL || 'http://localhost:3000',
    'X-Title': 'Medical Report Analyzer'
  }
});

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string | Array<{
    type: 'text' | 'image_url';
    text?: string;
    image_url?: {
      url: string;
    };
  }>;
}

export async function analyzeImageFast(imageBase64: string): Promise<string> {
  try {
    console.log('🚀 Starting FAST AI analysis with GPT-4o (no OCR)...');

    const systemPrompt = `You are a medical AI assistant specialized in analyzing medical reports and images. You have excellent OCR capabilities built-in, so you can read text from images directly.

Analyze the medical report image and provide a structured response in the following JSON format:
{
  "summary": "Brief overview of the report (2-3 sentences)",
  "reportType": "Type of medical report (e.g., Blood Test, X-Ray, MRI, CT Scan, Ultrasound, Lab Results, etc.)",
  "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "medicinesSuggested": ["Medicine/Treatment 1", "Medicine/Treatment 2"],
  "severity": "low|medium|high"
}

IMPORTANT INSTRUCTIONS:
- Read ALL text visible in the image carefully
- Extract specific values, numbers, and measurements
- Pay attention to reference ranges and normal values
- Identify any abnormal or concerning values
- Be very thorough in reading the medical report
- Always recommend consulting with healthcare professionals
- Be accurate but not alarmist
- Explain medical terms in simple language
- Focus on what the report shows, not diagnosing conditions`;

    const userMessage = `Please carefully analyze this medical report image. Read all the text, numbers, values, and measurements visible in the image. 

Provide a comprehensive analysis including:
1. What type of medical report this is
2. All the key findings and values you can read from the image
3. Any abnormal values compared to reference ranges
4. Recommendations based on the findings
5. Any medicine or treatment suggestions if appropriate

Please be very thorough in reading the text and numbers in the image.`;

    const messages: ChatMessage[] = [
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
      max_tokens: 3000,
      temperature: 0.1
    });

    const result = response.data.choices[0].message.content;
    console.log('✅ GPT-4o analysis completed successfully');
    
    return result;
  } catch (error: any) {
    console.error('❌ Error analyzing image:', error.response?.data || error.message);
    throw new Error('Failed to analyze medical report. Please try again.');
  }
}

// Keep the old function as backup
export async function analyzeImage(imageBase64: string, extractedText?: string): Promise<string> {
  // Use the fast version by default
  return analyzeImageFast(imageBase64);
}

export async function chatWithReport(messages: ChatMessage[], reportContext: string): Promise<string> {
  try {
    const systemMessage: ChatMessage = {
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
  } catch (error: any) {
    console.error('Error in chat:', error.response?.data || error.message);
    throw new Error('Failed to process chat message. Please try again.');
  }
}