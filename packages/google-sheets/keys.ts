import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const keys = () =>
  createEnv({
    emptyStringAsUndefined: true,
    skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
    server: {
      GOOGLE_SHEETS_WEBHOOK_URL: z.url().optional(),
      GOOGLE_SHEETS_WEBHOOK_SECRET: z.string().optional(),
    },
    runtimeEnv: {
      GOOGLE_SHEETS_WEBHOOK_URL: process.env.GOOGLE_SHEETS_WEBHOOK_URL,
      GOOGLE_SHEETS_WEBHOOK_SECRET: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET,
    },
  });
