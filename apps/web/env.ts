import { keys as cms } from "@repo/cms/keys";
import { keys as email } from "@repo/email/keys";
import { keys as flags } from "@repo/feature-flags/keys";
import { keys as googleSheets } from "@repo/google-sheets/keys";
import { keys as core } from "@repo/next-config/keys";
import { keys as observability } from "@repo/observability/keys";
import { keys as rateLimit } from "@repo/rate-limit/keys";
import { keys as security } from "@repo/security/keys";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  extends: [
    cms(),
    core(),
    email(),
    observability(),
    flags(),
    security(),
    rateLimit(),
    googleSheets(),
  ],
  server: {
    BASEHUB_WEBHOOK_SECRET: z.string().min(1).optional(),
  },
  client: {},
  runtimeEnv: {
    BASEHUB_WEBHOOK_SECRET: process.env.BASEHUB_WEBHOOK_SECRET,
  },
});
