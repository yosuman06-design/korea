import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;

interface ChatHistoryItem {
  role: 'user' | 'assistant';
  text: string;
}

interface TutorRequestBody {
  message?: string;
  history?: ChatHistoryItem[];
  mode?: 'conversation' | 'grammar' | 'roleplay_cafe' | 'topik_coach';
  learnerLevel?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  uiLanguage?: 'ru' | 'en' | 'tg' | 'ko';
}

const LANGUAGE_NAMES: Record<string, string> = {
  ru: 'Russian (Русский)',
  en: 'English',
  tg: 'Tajik (Тоҷикӣ)',
  ko: 'Korean (한국어)',
};

const MODE_INSTRUCTIONS: Record<string, string> = {
  conversation: 'Have a friendly, natural everyday Korean conversation matched to the student level.',
  grammar: 'Focus on analyzing the student Korean sentence, gently correcting any particle, conjugation, or politeness errors, and showing a natural improved sentence.',
  roleplay_cafe: 'Act as a friendly Seoul cafe barista in Hongdae. Keep the roleplay realistic, warm, and interactive.',
  topik_coach: 'Act as a TOPIK I & II examiner and writing/reading coach. Provide formal academic Korean examples and exam tips.',
};

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function handleTutorRequest(body: TutorRequestBody) {
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!message || message.length > 1500) {
    return { status: 400, payload: { error: 'Message must be between 1 and 1500 characters.' } };
  }

  const mode = body.mode && MODE_INSTRUCTIONS[body.mode] ? body.mode : 'conversation';
  const level = ['A1', 'A2', 'B1', 'B2', 'C1'].includes(body.learnerLevel || '') ? body.learnerLevel : 'A1';
  const uiLang = ['ru', 'en', 'tg', 'ko'].includes(body.uiLanguage || '') ? body.uiLanguage! : 'ru';
  const targetLangName = LANGUAGE_NAMES[uiLang];

  const history = Array.isArray(body.history)
    ? body.history.slice(-8).map((item) => `${item.role === 'user' ? 'Student' : 'Tutor'}: ${String(item.text).slice(0, 400)}`).join('\n')
    : '';

  const systemInstruction = `You are Minji (민지 선생님), a warm, encouraging native Korean language teacher on the platform "Korean Journey — 한국어".
Student proficiency level: ${level}.
Preferred explanation language: ${targetLangName}.
Teaching mode: ${MODE_INSTRUCTIONS[mode]}
Always reply in valid JSON matching the schema.
- koreanReply: Write a natural Korean reply appropriate for level ${level} (include Hangul only, concise 1-3 sentences).
- romanization: Accurate Revised Romanization of koreanReply.
- translation: Accurate translation of koreanReply in ${targetLangName}.
- grammarTip: Helpful feedback, correction of the student's message (if any mistakes), or a short grammar/cultural note written in ${targetLangName}.
- suggestedVocab: 1 to 3 useful Korean words or expressions from your reply with romanization/transcription and translation in ${targetLangName}.`;

  const prompt = history
    ? `Recent conversation:\n${history}\n\nStudent's latest message: ${message}`
    : `Student's message: ${message}`;

  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents: prompt,
    config: {
      systemInstruction,
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

  const text = (response.text ?? '{}').trim();
  const parsed = JSON.parse(text);
  return { status: 200, payload: parsed };
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'korean-journey' });
  });

  app.post('/api/tutor', async (req, res) => {
    try {
      const result = await handleTutorRequest(req.body || {});
      res.status(result.status).json(result.payload);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to generate AI tutor response.';
      const status = message.includes('GEMINI_API_KEY') ? 503 : 500;
      res.status(status).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distDir, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found. Run npm run build.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Korean Journey server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
