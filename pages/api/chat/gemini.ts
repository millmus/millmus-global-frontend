import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';
import withHandler from '@libs/server/withHandler';

// Initialize the Gemini API
// You'll need to add your Gemini API key to .env as GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return res.status(500).json({ 
        error: 'AI service is not configured', 
        response: '죄송합니다. AI 서비스가 현재 설정되지 않았습니다. 관리자에게 문의해주세요.' 
      });
    }

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create a context for the chatbot
    const context = `당신은 밀머스(밀레니얼머니스쿨) 교육 플랫폼의 친절한 AI 도우미입니다. 
    사용자의 질문에 대해 도움이 되는 답변을 제공하고, 필요한 경우 관련 강의나 서비스를 추천해주세요.
    항상 공손하고 전문적인 태도를 유지하며, 한국어로 답변해주세요.`;

    const prompt = `${context}\n\n사용자 질문: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.status(200).json({ 
      ok: true, 
      response: text 
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Provide a user-friendly error message
    let errorMessage = '죄송합니다. AI 응답을 생성하는 중 문제가 발생했습니다.';
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'AI 서비스 인증에 문제가 있습니다. 관리자에게 문의해주세요.';
      } else if (error.message.includes('quota')) {
        errorMessage = '일시적으로 요청이 많아 처리할 수 없습니다. 잠시 후 다시 시도해주세요.';
      }
    }

    return res.status(500).json({ 
      error: 'Failed to generate response',
      response: errorMessage
    });
  }
};

export default withHandler({ method: 'POST', handler });