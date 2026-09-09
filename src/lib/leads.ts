/**
 * Lead channels.
 *
 * The lead pipeline (form -> webhook -> Make -> Google Sheets) posts here.
 * If this URL is empty, forms stay usable and tell the visitor to send on
 * WhatsApp instead — no lead is silently swallowed.
 */
export const LEAD_WEBHOOK_URL = "https://hook.eu1.make.com/nmdv2k2jjslg9rttlwlpah9wxs8gw14x";

/** International format, digits only, no plus. e.g. "9725XXXXXXX" */
export const WHATSAPP_NUMBER = "972546545275";

export const CONTACT_PHONE = "054-6545275";
export const CONTACT_EMAIL = "hashvilhaze@gmail.com";

export const WHATSAPP_DEFAULT_MESSAGE =
  "היי, הגעתי דרך 'השביל הזה'. אני מתכנן טיול לנפאל ורוצה להתייעץ.";

export function whatsappHref(message: string = WHATSAPP_DEFAULT_MESSAGE): string | null {
  if (!WHATSAPP_NUMBER) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export type LeadPayload = Record<string, string> & { source: string };

export type LeadResult = "sent" | "unconfigured" | "failed";

export async function submitLead(payload: LeadPayload): Promise<LeadResult> {
  if (!LEAD_WEBHOOK_URL) return "unconfigured";
  try {
    const res = await fetch(LEAD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, submittedAt: new Date().toISOString() }),
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
