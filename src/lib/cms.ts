import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { z } from "zod";

export const statuses = {
  new: "חדש",
  working: "בטיפול",
  offered: "הוצעה הצעה",
  won: "נסגר",
  irrelevant: "לא רלוונטי",
};
export type Status = keyof typeof statuses;
export const formNames: Record<string, string> = { contact: "צור קשר", quote: "בקשת הצעה" };
export const statusSchema = z.enum(["new", "working", "offered", "won", "irrelevant"]);
const noteSchema = z.object({ actor: z.string(), body: z.string(), created_at: z.string() });
const leadSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  form: z.string(),
  origin_page: z.string(),
  channel: z.string(),
  payload: z.record(z.string(), z.string()),
  status: statusSchema,
  assignee: z.string().nullable(),
  follow_up: z.string().nullable(),
  version: z.number(),
  delivery: z.string(),
  notes: z.array(noteSchema),
});
export const leadsSchema = z.object({ rows: z.array(leadSchema), staff: z.array(z.string()) });
export type Lead = z.infer<typeof leadSchema>;
export const reportsSchema = z.array(
  z.object({
    form: z.string(),
    origin_page: z.string(),
    channel: z.string(),
    leads: z.number(),
    won: z.number(),
  }),
);
export const historySchema = z.array(
  z.object({
    actor: z.string(),
    action: z.string(),
    target: z.string(),
    detail: z.string(),
    created_at: z.string(),
  }),
);
export const calendarSchema = z.object({
  dates: z.record(z.string(), z.string()),
  leads: z.record(z.string(), z.number()),
});
export const seoSchema = z.object({
  focus: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  noindex: z.boolean().optional(),
});
export type Seo = z.infer<typeof seoSchema>;
export const integrationsSchema = z.object({
  ga: z.string().optional(),
  pixel: z.string().optional(),
  verification: z.string().optional(),
  turnstile: z.string().optional(),
  googleClient: z.string().optional(),
  property: z.string().optional(),
  searchProperty: z.string().optional(),
});
export type Integrations = z.infer<typeof integrationsSchema>;
export const settingsSchema = z.object({
  config: integrationsSchema,
  version: z.number(),
  captchaSecret: z.boolean(),
});
export const pageSettingsSchema = z.object({ config: seoSchema, version: z.number() });
export const publicSchema = z.object({
  pages: z.record(z.string(), seoSchema),
  integrations: integrationsSchema,
});
export type PublicConfig = z.infer<typeof publicSchema>;
export async function fetchPublicConfig(): Promise<PublicConfig> {
  try {
    const { data, error } = await supabase
      .rpc("cms_public_config")
      .abortSignal(AbortSignal.timeout(2200));
    if (!error) return publicSchema.parse(data);
  } catch {
    /* Public content retains its original metadata during a database outage. */
  }
  return { pages: {}, integrations: {} };
}
export async function readCms<T>(
  section: string,
  schema: z.ZodType<T>,
  opts: Record<string, Json> = {},
) {
  const { data, error } = await supabase.rpc("cms_read", { section, opts });
  if (error) throw error;
  return schema.parse(data);
}
export async function editCms(
  action_name: string,
  target_key: string,
  expected: number,
  value: Record<string, Json | undefined>,
) {
  const { error } = await supabase.rpc("cms_edit", { action_name, target_key, expected, value });
  if (error) throw error;
}
export function friendlyError(error: unknown) {
  const code = error && typeof error === "object" && "code" in error ? error.code : "";
  if (code === "40001") return "מנהל נוסף שמר שינוי. רעננו את הנתונים לפני השמירה הבאה.";
  if (code === "42501") return "לחשבון הזה אין הרשאה לפעולה.";
  return "הפעולה לא הושלמה. בדקו את הפרטים ונסו שוב.";
}
export function dateLabel(iso: string) {
  return new Intl.DateTimeFormat("he-IL", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    timeZone: "Asia/Jerusalem",
  }).format(new Date(iso));
}

export const staffSchema = z.array(z.string());
export const overviewSchema = z.object({ leads: z.number(), won: z.number(), due: z.number() });
