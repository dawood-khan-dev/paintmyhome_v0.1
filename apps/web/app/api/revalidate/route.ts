import { log } from "@repo/observability/log";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { env } from "@/env";

const REVALIDATED_PATHS: [string, "page"][] = [
  ["/[locale]/guides", "page"],
  ["/[locale]/guides/[slug]", "page"],
  ["/[locale]/services", "page"],
  ["/[locale]/services/[slug]", "page"],
  ["/[locale]/about", "page"],
];

// Mirrors basehub's own webhook signing scheme (HMAC-SHA256 over the raw
// body, hex-encoded, compared in constant time) — see `authenticateWebhook`
// in the basehub SDK, which is typed for their Workflows feature and isn't a
// fit for a plain repo.commit webhook subscription.
const verifySignature = async (
  secret: string,
  body: string,
  signature: string
): Promise<boolean> => {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expected = Array.from(new Uint8Array(signed))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  if (expected.length !== signature.length) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }

  return mismatch === 0;
};

export const POST = async (request: Request): Promise<Response> => {
  if (!env.BASEHUB_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Not configured", ok: false });
  }

  const signature = request.headers.get("x-basehub-webhook-signature");
  const body = await request.text();

  if (
    !signature ||
    !(await verifySignature(env.BASEHUB_WEBHOOK_SECRET, body, signature))
  ) {
    log.warn("BaseHub webhook rejected: invalid signature");

    return NextResponse.json(
      { message: "Invalid signature", ok: false },
      { status: 401 }
    );
  }

  for (const [path, type] of REVALIDATED_PATHS) {
    revalidatePath(path, type);
  }

  log.info("Revalidated CMS paths from BaseHub webhook");

  return NextResponse.json({ ok: true });
};
