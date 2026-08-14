"use server";

import { submitQuoteRequest } from "@repo/google-sheets";
import { parseError } from "@repo/observability/error";
import { createRateLimiter, slidingWindow } from "@repo/rate-limit";
import { headers } from "next/headers";
import { z } from "zod";
import { env } from "@/env";

const quoteRequestSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  city: z.string().trim().min(1),
});

export const submitQuote = async (
  name: string,
  phone: string,
  city: string
): Promise<{
  error?: string;
}> => {
  try {
    const parsed = quoteRequestSchema.safeParse({ name, phone, city });

    if (!parsed.success) {
      throw new Error("Invalid quote request.");
    }

    if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
      const rateLimiter = createRateLimiter({
        limiter: slidingWindow(5, "10 m"),
      });
      const head = await headers();
      const ip = head.get("x-forwarded-for");

      const { success } = await rateLimiter.limit(`submit_quote_${ip}`);

      if (!success) {
        throw new Error(
          "You have reached your request limit. Please try again later."
        );
      }
    }

    const { error } = await submitQuoteRequest(parsed.data);

    if (error) {
      throw new Error(error);
    }

    return {};
  } catch (error) {
    const errorMessage = parseError(error);

    return { error: errorMessage };
  }
};
