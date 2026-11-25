import { useId, useRef, useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, Clock3, Footprints, Mountain, Route } from "lucide-react";
import { STAGE_LABELS, type Stage } from "@/lib/treks/itineraries";

const TIME_FALLBACK = {
  acclimatization: "משך הפעילות לפי התכנון האישי",
  transfer: "משך הנסיעה לפי התכנון והתנאים",
  walk: "משך ההליכה ייקבע לפי חלוקת היום",
};
const icons = { walk: Footprints, acclimatization: Mountain, transfer: Route };

function DayTitle({ day }: { day: Stage }) {
  return day.start === day.end ? (
    <>{day.start}</>
  ) : (
    <>
      {day.start} <span aria-hidden="true">←</span>
      <span className="sr-only"> אל </span> {day.end}
    </>
  );
}

export function Itinerary({ stages }: { stages: Stage[] }) {
  const [active, setActive] = useState(0);
  const rail = useRef<HTMLDivElement>(null);
  const id = useId();
  if (!stages.length) return null;
  const index = Math.min(active, stages.length - 1);

  function select(next: number, focus = false) {
    if (next < 0 || next >= stages.length) return;
    setActive(next);
    const strip = rail.current;
    const button = strip?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next];
    if (!strip || !button) return;
    if (focus) button.focus({ preventScroll: true });
    const track = strip.getBoundingClientRect();
    const box = button.getBoundingClientRect();
    if (box.left < track.left) strip.scrollBy({ left: box.left - track.left });
    if (box.right > track.right) strip.scrollBy({ left: box.right - track.right });
  }

  function keyDown(e: KeyboardEvent<HTMLButtonElement>, current: number) {
    const last = stages.length - 1;
    const next = {
      ArrowLeft: (current + 1) % stages.length,
      ArrowRight: (current + last) % stages.length,
      Home: 0,
      End: last,
    }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(next, true);
  }

  return (
    <div className="route-viewer">
      <ul className="route-legend" aria-label="מקרא לסוגי הימים">
        {Object.entries(STAGE_LABELS)
          .filter(([kind]) => stages.some((stage) => stage.kind === kind))
          .map(([kind, label]) => (
            <li key={kind} data-kind={kind}>
              <i aria-hidden="true" />
              {label}
            </li>
          ))}
      </ul>
      <div className="route-interactive">
        <div ref={rail} className="route-days" role="tablist" aria-label="בחירת יום במסלול">
          {stages.map((stage, n) => (
            <button
              key={stage.id}
              type="button"
              role="tab"
              id={id + "-tab-" + n}
              aria-controls={id + "-day-" + n}
              aria-label={`יום ${n + 1}, ${STAGE_LABELS[stage.kind]}, ${stage.end}`}
              aria-selected={index === n}
              tabIndex={index === n ? 0 : -1}
              data-kind={stage.kind}
              onKeyDown={(e) => keyDown(e, n)}
              onClick={() => select(n)}
            >
              {n + 1}
            </button>
          ))}
        </div>
        <div className="route-card">
          {stages.map((stage, n) => {
            const KindIcon = icons[stage.kind];
            return (
              <section
                key={stage.id}
                id={id + "-day-" + n}
                role="tabpanel"
                aria-labelledby={id + "-tab-" + n}
                hidden={index !== n}
                tabIndex={0}
              >
                <p className="p-kicker">
                  יום {n + 1} מתוך {stages.length}
                </p>
                <h3 className="p-h3">
                  <DayTitle day={stage} />
                </h3>
                <p className="route-facts">
                  <span>
                    <KindIcon aria-hidden="true" />
                    {STAGE_LABELS[stage.kind]}
                  </span>
                  <span>
                    <Clock3 aria-hidden="true" />
                    {stage.time || TIME_FALLBACK[stage.kind]}
                  </span>
                </p>
                <p>{stage.story}</p>
              </section>
            );
          })}
          <div className="route-arrows">
            <button type="button" disabled={index === 0} onClick={() => select(index - 1)}>
              <ChevronRight aria-hidden="true" />
              היום הקודם
            </button>
            <button
              type="button"
              disabled={index === stages.length - 1}
              onClick={() => select(index + 1)}
            >
              היום הבא
              <ChevronLeft aria-hidden="true" />
            </button>
          </div>
          <span className="sr-only" aria-live="polite">
            יום {index + 1} מתוך {stages.length}, {stages[index]?.end}
          </span>
        </div>
      </div>
      <details className="route-all">
        <summary>
          <span>כל הימים ברצף</span>
          <span>חזרה לבחירה לפי יום</span>
        </summary>
        <ol>
          {stages.map((s, n) => (
            <li key={s.id}>
              <h3 className="p-h3">
                יום {n + 1} · <DayTitle day={s} />
              </h3>
              <p className="p-muted">
                {STAGE_LABELS[s.kind]} · {s.time || TIME_FALLBACK[s.kind]}
              </p>
              <p>{s.story}</p>
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
