import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formAttribution } from "./form-attribution";
/** International format, digits only, no plus. e.g. "9725XXXXXXX" */
export const WHATSAPP_NUMBER = "972546545275";

export const CONTACT_PHONE = "054-6545275";
export const CONTACT_EMAIL = "hashvilhaze@gmail.com";

/** Local partner in Nepal, as published on shalomtreks.com */
export const NEPAL_PARTNER_NAME = "בד נאת׳ רגמי (Bed Nath Regmi, ״דב״)";
export const NEPAL_PARTNER_ROLE = "מייסד Shalom Rafting Treks & Expedition, קטמנדו";
export const NEPAL_PARTNER_NOTE =
  "מפעיל את הסוכנות מתאמל שבקטמנדו מ-2010, עם צוות שנותן שירות גם בעברית · info@shalomtreks.com · +977-985-1000405";

export const WHATSAPP_DEFAULT_MESSAGE =
  "היי, הגעתי דרך 'השביל הזה'. אני מתכנן טיול לנפאל ורוצה להתייעץ.";

export function whatsappHref(message: string = WHATSAPP_DEFAULT_MESSAGE): string | null {
  if (!WHATSAPP_NUMBER) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export type LeadPayload = Record<string, string> & { source: string };

export type LeadResult = "sent" | "failed";

export function useLeadSubmission(kind: "contact" | "quote") {
  const last = useRef<{ key: string; id: string } | null>(null);
  const pending = useRef<Promise<LeadResult> | null>(null);
  const [attempt, setAttempt] = useState(0);
  async function submitLead(payload: LeadPayload, form: HTMLFormElement): Promise<LeadResult> {
    if (pending.current) return pending.current;
    const key = JSON.stringify(payload);
    if (last.current?.key !== key) last.current = { key, id: crypto.randomUUID() };
    const ticket = last.current.id;
    const challenge = String(new FormData(form).get("cf-turnstile-response") ?? "");
    const send = async (): Promise<LeadResult> => {
      try {
        const args = { ticket, form_kind: kind, ...formAttribution(), fields: payload, challenge };
        for (let poll = 0; poll < 14; poll++) {
          const { data, error } = await supabase.rpc("cms_receive_lead", args);
          if (error) throw error;
          if (data === true) {
            last.current = null;
            return "sent";
          }
          await new Promise((resolve) => setTimeout(resolve, 900));
        }
        throw new Error("Verification timed out");
      } catch {
        setAttempt((n) => n + 1);
        return "failed";
      }
    };
    pending.current = send();
    try {
      return await pending.current;
    } finally {
      pending.current = null;
    }
  }
  return { submitLead, attempt };
}
