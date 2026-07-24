import { z } from 'zod';

const envSchema = z.object({
  VITE_APP_NAME: z.string().min(1).default('ExamForge Admin Portal'),
  VITE_API_BASE_URL: z.string().url(),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
  throw new Error(`Invalid environment configuration: ${parsedEnv.error.message}`);
}

export const appEnv = {
  appName: parsedEnv.data.VITE_APP_NAME,
  apiBaseUrl: parsedEnv.data.VITE_API_BASE_URL,
} as const;

