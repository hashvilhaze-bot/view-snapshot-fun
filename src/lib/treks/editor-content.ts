import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import type { Example } from "./itineraries";

const requiredText = z.string().trim().min(1);
const editorContent = z.object({
  description: requiredText,
  altitude: requiredText,
  difference: requiredText,
  stages: z
    .array(
      z.object({
        id: requiredText,
        start: requiredText,
        end: requiredText,
        kind: z.enum(["walk", "acclimatization", "transfer"]),
        time: z.string(),
        story: requiredText,
      }),
    )
    .min(1)
    .max(65),
});
export type TrekContent = z.infer<typeof editorContent>;
export function parseContent(value: unknown) {
  const result = editorContent.safeParse(value);
  return result.success ? result.data : null;
}
export function defaultContent({
  description,
  altitude,
  difference,
  stages,
}: Example): TrekContent {
  return { description, altitude, difference, stages };
}
export async function publishedExample(slug: string, defaults: Example): Promise<Example> {
  try {
    const { data, error } = await supabase
      .from("trek_published")
      .select("content")
      .eq("slug", slug)
      .abortSignal(AbortSignal.timeout(3500))
      .maybeSingle();
    if (error) console.warn("Published trek details unavailable", slug);
    const content = data && parseContent(data.content);
    return content ? { ...defaults, ...content } : defaults;
  } catch {
    return defaults;
  }
}
