import { createGroq } from '@ai-sdk/groq';

import { getEnv } from '@/lib/env';

export function getGroqClient() {
  const env = getEnv();
  return createGroq({ apiKey: env.GROQ_API_KEY });
}

export const MODEL_ID = 'openai/gpt-oss-120b' as const;
