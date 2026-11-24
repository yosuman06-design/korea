import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

interface VercelRequestLike {
  method?: string;
  body?: {
    message?: string;
    history?: Array<{ role: 'user' | 'assistant'; text: string }>;
    mode?: 'conversation' | 'grammar' | 'roleplay_cafe' | 'topik_coach';
    learnerLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
    uiLanguage?: 'ru' | 'en' | 'tg' | 'ko';
  };
}

interface VercelResponseLike {
  status: (code: number) => VercelResponseLike;
  json: (data: unknown) => void;
}

const LANGUAGE_NAMES: Record<string, string> = {
  ru: 'Russian (Русский)',
  en: 'English',
  tg: 'Tajik (Тоҷикӣ)',
  ko: 'Korean (한국어)',
};

const MODE_INSTRUCTIONS: Record<string, string> = {
  conversation: 'Have a friendly, natural everyday Korean conversation matched to the student level.',
  grammar: 'Analyze the student Korean sentence, gently correct errors, and show a natural improved sentence.',
  roleplay_cafe: 'Act as a friendly Seoul cafe barista in Hongdae. Keep the roleplay realistic and interactive.',
  topik_coach: 'Act as a TOPIK I & II examiner and writing/reading coach with formal Korean exam tips.',
};

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'GEMINI_API_KEY is not configured in environment variables.' });
    return;
  }

  try {
    const body = req.body || {};
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    if (!message || message.length > 1500) {
      res.status(400).json({ error: 'Message must be between 1 and 1500 characters.' });
      return;
    }

    const mode = body.mode && MODE_INSTRUCTIONS[body.mode] ? body.mode : 'conversation';
    const level = ['A1', 'A2', 'B1', 'B2', 'C1'].includes(body.learnerLevel || '') ? body.learnerLevel : 'A1';
    const uiLang = ['ru', 'en', 'tg', 'ko'].includes(body.uiLanguage || '') ? body.uiLanguage! : 'ru';
    const targetLangName = LANGUAGE_NAMES[uiLang];

    const history = Array.isArray(body.history)
      ? body.history.slice(-8).map((item) => `${item.role === 'user' ? 'Student' : 'Tutor'}: ${String(item.text).slice(0, 400)}`).join('\n')
      : '';

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: history ? `Recent conversation:\n${history}\n\nStudent's latest message: ${message}` : `Student's message: ${message}`,
      config: {
        systemInstruction: `You are Minji (민지 선생님), a warm native Korean language teacher on "Korean Journey — 한국어".
Student proficiency level: ${level}.
Explanation language: ${targetLangName}.
Mode: ${MODE_INSTRUCTIONS[mode]}`,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            koreanReply: { type: Type.STRING },
            romanization: { type: Type.STRING },
            translation: { type: Type.STRING },
            grammarTip: { type: Type.STRING },
            suggestedVocab: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  korean: { type: Type.STRING },
                  transcription: { type: Type.STRING },
                  translation: { type: Type.STRING },
                },
                required: ['korean', 'transcription', 'translation'],
              },
            },
          },
          required: ['koreanReply', 'romanization', 'translation', 'grammarTip', 'suggestedVocab'],
        },
      },
    });

    const parsed = JSON.parse((response.text ?? '{}').trim());
    res.status(200).json(parsed);
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'AI Tutor request failed.';
    res.status(500).json({ error: msg });
  }
}
