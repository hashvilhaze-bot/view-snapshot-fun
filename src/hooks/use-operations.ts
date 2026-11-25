import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { z } from "zod";
import type { Json } from "@/integrations/supabase/types";
import { useAuth } from "@/hooks/use-auth";
import { readCms, friendlyError } from "@/lib/cms";
export function useSection<T>(
  section: string,
  schema: z.ZodType<T>,
  opts: Record<string, Json> = {},
) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["operations", user?.id, section, opts],
    queryFn: () => readCms(section, schema, opts),
    enabled: !!user,
    retry: false,
    refetchOnWindowFocus: false,
  });
}
export function useSave() {
  const [saving, setSaving] = useState(false),
    [message, setMessage] = useState("");
  async function run(task: () => Promise<void>) {
    if (saving) return;
    setSaving(true);
    setMessage("");
    try {
      await task();
      setMessage("השינויים נשמרו.");
    } catch (e) {
      setMessage(friendlyError(e));
    } finally {
      setSaving(false);
    }
  }
  return { saving, message, run };
}
