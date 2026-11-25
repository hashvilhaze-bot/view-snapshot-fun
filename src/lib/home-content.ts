import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const homeSchema = z.object({
  kicker: z.string().trim().max(140),
  titleStart: z.string().trim().min(1).max(100),
  titleAccent: z.string().trim().max(100),
  titleEnd: z.string().trim().max(100),
  intro: z.string().trim().min(1).max(1500),
});
export type HomeContent = z.infer<typeof homeSchema>;
export const DEFAULT_HOME: HomeContent = {
  kicker: "השביל הזה · טיולים בהתאמה אישית בנפאל",
  titleStart: "הטיול שלכם לנפאל",
  titleAccent: "מתחיל בהיכרות",
  titleEnd: "איתכם.",
  intro:
    "אני אוהד. יחד נתכנן טיול שמתאים לאנשים שנוסעים, לזמן ולתקציב שלכם. אלווה אתכם מההכנות בארץ ועד החזרה, ואסייע בתיאום מול החברה המקומית בנפאל לאורך הדרך.",
};
export function parseHomeContent(value: unknown): HomeContent | null {
  const result = homeSchema.safeParse(value);
  return result.success ? result.data : null;
}
export async function publishedHome(): Promise<HomeContent> {
  try {
    const { data } = await supabase
      .from("trek_published")
      .select("content")
      .eq("slug", "home")
      .abortSignal(AbortSignal.timeout(2500))
      .maybeSingle();
    return parseHomeContent(data?.content) ?? DEFAULT_HOME;
  } catch {
    return DEFAULT_HOME;
  }
}
