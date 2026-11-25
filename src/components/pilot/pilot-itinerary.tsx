import { useEffect, useState } from "react";
import {
  examples,
  parseStages,
  storageKey,
  type Stage,
} from "@/lib/pilot/itineraries";
export function usePilotStages(slug: string, defaults: Stage[]) {
  const [stages, setStages] = useState(defaults);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setStages(defaults);
    try {
      setStages(parseStages(localStorage.getItem(storageKey(slug))) ?? defaults);
    } catch {
      /* storage unavailable: retain defaults */
    }
    setReady(true);
  }, [slug, defaults]);
  return { stages, setStages, ready };
}
export { Itinerary as PilotItinerary } from "../renewed/itinerary";
import { Itinerary } from "../renewed/itinerary";
export function TrekItinerary({ slug }: { slug: string }) {
  const example = examples[slug];
  if (!example) return null;
  return <LoadedItinerary slug={slug} defaults={example.stages} />;
}
function LoadedItinerary({ slug, defaults }: { slug: string; defaults: Stage[] }) {
  const { stages } = usePilotStages(slug, defaults);
  return <Itinerary stages={stages} />;
}
