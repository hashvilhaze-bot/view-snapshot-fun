import { STAGE_LABELS, type Stage } from "@/lib/treks/itineraries";

const TIME_FALLBACK = {
  acclimatization: "משך הפעילות לפי התכנון האישי",
  transfer: "משך הנסיעה לפי התכנון והתנאים",
  walk: "משך ההליכה ייקבע לפי חלוקת היום",
};

export function Itinerary({ stages }: { stages: Stage[] }) {
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
            <span className="p-muted">{s.time || TIME_FALLBACK[s.kind]}</span>
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
                {STAGE_LABELS[s.kind]} · {s.time || TIME_FALLBACK[s.kind]}
              </p>
              <p className="p-muted pb-5">{s.story}</p>
            </details>
          </li>
        ))}
      </ol>
    </>
  );
}
