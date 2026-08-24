import { log } from "@repo/observability/log";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { env } from "@/env";

const REVALIDATED_PATHS: [string, "page"][] = [
  ["/[locale]/guides", "page"],
  ["/[locale]/guides/[slug]", "page"],
  ["/[locale]/services", "page"],
  ["/[locale]/services/[slug]", "page"],
  ["/[locale]/about", "page"],
];

export const POST = async (request: Request): Promise<Response> => {
  if (!env.BASEHUB_WEBHOOK_SECRET) {
    return NextResponse.json({ message: "Not configured", ok: false });
  }

  const body = await request.text();
  const headers = Object.fromEntries(request.headers.entries());
  const webhook = new Webhook(env.BASEHUB_WEBHOOK_SECRET);

  try {
    webhook.verify(body, headers);
  } catch {
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
