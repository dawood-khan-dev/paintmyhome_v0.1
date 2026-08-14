import { keys } from "./keys";

const { GOOGLE_SHEETS_WEBHOOK_URL, GOOGLE_SHEETS_WEBHOOK_SECRET } = keys();

interface QuoteRequest {
  city: string;
  name: string;
  phone: string;
}

export const submitQuoteRequest = async (
  quote: QuoteRequest
): Promise<{ error?: string }> => {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    return { error: "Google Sheets webhook is not configured." };
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...quote,
        secret: GOOGLE_SHEETS_WEBHOOK_SECRET,
      }),
      redirect: "manual",
      signal: AbortSignal.timeout(10_000),
    });

    // Apps Script always 302-redirects a successful doPost to a content
    // echo URL. Some Workspace domains block anonymous callers from
    // reading that echo URL's body, so the redirect itself (not a
    // followed, parsed response) is the only reliable success signal.
    const isAppsScriptSuccessRedirect =
      response.status >= 300 &&
      response.status < 400 &&
      (response.headers.get("location") ?? "").includes(
        "script.googleusercontent.com"
      );

    if (!(response.ok || isAppsScriptSuccessRedirect)) {
      return { error: "Failed to submit quote request." };
    }

    return {};
  } catch {
    return { error: "Failed to submit quote request." };
  }
};
