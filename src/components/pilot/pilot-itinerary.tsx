import { useEffect, useState } from "react";
import {
  examples,
  parseStages,
  storageKey,
  STAGE_LABELS,
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
export function PilotItinerary({ stages }: { stages: Stage[] }) {
  return (
    <>
      <ol className="p-route-chart" aria-label="תרשים שלבי המסלול">
        {stages.map((s, i) => (
          <li key={s.id} data-kind={s.kind}>
            <span className="p-route-dot" aria-hidden>
              {i + 1}
            </span>
            <span className="p-kicker">{STAGE_LABELS[s.kind]}</span>
            <strong>
              {s.start}
              <span aria-hidden> ← </span>
              {s.end}
            </strong>
            <span className="p-muted">{s.time || (s.kind === "acclimatization" ? "משך הפעילות לפי התכנון האישי" : s.kind === "transfer" ? "משך הנסיעה לפי התכנון והתנאים" : "משך ההליכה ייקבע לפי חלוקת היום")}</span>
          </li>
        ))}
      </ol>
      <ol className="p-day-list" aria-label="פירוט יומי נגיש">
        {stages.map((s, i) => (
          <li key={s.id}>
            <details className="p-rule">
              <summary>
                <span>
                  יום {i + 1}: {s.start} ← {s.end}
                </span>
              </summary>
              <p className="p-kicker">
                {STAGE_LABELS[s.kind]} · {s.time || (s.kind === "acclimatization" ? "משך הפעילות לפי התכנון האישי" : s.kind === "transfer" ? "משך הנסיעה לפי התכנון והתנאים" : "משך ההליכה ייקבע לפי חלוקת היום")}
              </p>
              <p className="p-muted pb-5">{s.story}</p>
            </details>
          </li>
        ))}
      </ol>
    </>
  );
}
export function TrekItinerary({ slug }: { slug: string }) {
  const example = examples[slug];
  if (!example) return null;
  return <LoadedItinerary slug={slug} defaults={example.stages} />;
}
function LoadedItinerary({ slug, defaults }: { slug: string; defaults: Stage[] }) {
  const { stages } = usePilotStages(slug, defaults);
  return <PilotItinerary stages={stages} />;
}
