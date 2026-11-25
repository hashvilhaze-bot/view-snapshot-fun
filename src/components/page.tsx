import type { ReactNode } from "react";

import { FaqList } from "./renewed/faq";
import { cn } from "@/lib/utils";
import { nepalQuickFacts } from "@/lib/content";
import { whatsappHref } from "@/lib/leads";

/**
 * Content width. Default stays as it always was; `wide` and `xwide` exist so
 * pages that genuinely need the room on desktop (Match, Quote, the treks grid
 * and the comparison table) stop feeling lost inside a large viewport.
 */
export type SectionSize = "default" | "wide" | "xwide";

const WIDTH: Record<SectionSize, string> = {
  default: "site-frame site-reading",
  wide: "site-frame",
  xwide: "site-frame",
};

export function PageHero({
  kicker,
  title,
  lead,
  image,
  imageAlt,
  size = "default",
  actions,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  image?: string | undefined;
  imageAlt?: string | undefined;
  size?: SectionSize;
  actions?: ReactNode;
}) {
  return (
    <section className="inner-hero">
      <div className={WIDTH[size] + " inner-hero-grid" + (image ? " has-image" : "")}>
        <div className="inner-hero-copy">
          {kicker && <p className="p-kicker">{kicker}</p>}
          <h1 className="p-h1">{title}</h1>
          {lead && <p className="p-lead">{lead}</p>}
          {actions && <div className="hero-actions">{actions}</div>}
        </div>
        {image && (
          <img
            src={image}
            alt={imageAlt ?? ""}
            width={1000}
            height={700}
            fetchPriority="high"
            className="inner-hero-photo"
          />
        )}
      </div>
    </section>
  );
}

export function Section({
  title,
  kicker,
  children,
  className = "",
  size = "default",
}: {
  title?: string;
  kicker?: string;
  children: ReactNode;
  className?: string;
  size?: SectionSize;
}) {
  return (
    <section className={`mx-auto ${WIDTH[size]} inner-section ${className}`}>
      {kicker && <p className="p-kicker">{kicker}</p>}
      {title && <h2 className="p-h2 inner-section-title">{title}</h2>}
      <div className={title ? "mt-4" : ""}>{children}</div>
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-card p-5", className)}>{children}</div>;
}

/**
 * Plus/accordion. Used only where it genuinely shortens the page:
 * trek day-by-day, About / how we work, Quote extra details,
 * long secondary content in Knowledge.
 */
export function Accordion({
  items,
  className = "",
}: {
  items: { title: string; content: ReactNode }[];
  className?: string;
}) {
  return (
    <FaqList
      className={className}
      items={items.map(({ title, content }) => ({ question: title, answer: content }))}
    />
  );
}

/** A short "didn't know that" note — professionalism shown, not declared. */
export function Insight({ text, title = "שווה לדעת" }: { text: string; title?: string }) {
  return (
    <div className="rounded-2xl border-e-4 border-saffron bg-parchment/70 px-5 py-4">
      <p className="text-[0.6875rem] font-semibold tracking-wide text-saffron">{title}</p>
      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink/80">{text}</p>
    </div>
  );
}

/** Same box, different hat: a small surprising fact rather than practical advice. */
export function DidYouKnow({ text, action }: { text: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl bg-summit px-5 py-4 text-parchment">
      <p className="text-[0.6875rem] font-semibold tracking-wide text-saffron">הידעת?</p>
      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-parchment/85">{text}</p>
      {action && <div className="mt-3 text-[0.84375rem] font-semibold text-saffron">{action}</div>}
    </div>
  );
}

/** "נפאל בכמה רגעים" — verified basics, scannable, no article required. */
export function QuickFacts() {
  return (
    <dl className="quick-facts">
      {nepalQuickFacts.map((f) => (
        <div key={f.label} className="fact-cell">
          <dt className="fact-term">{f.label}</dt>
          <dd className="mt-0.5 font-display text-[0.9375rem] font-bold">{f.value}</dd>
          {f.note && <p className="fact-note">{f.note}</p>}
        </div>
      ))}
    </dl>
  );
}

export function WhatsappButton({
  message,
  label = "לכתוב בוואטסאפ",
  className = "",
}: {
  message?: string;
  label?: string;
  className?: string;
}) {
  const href = whatsappHref(message);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`rounded-xl bg-parchment px-5 py-3 text-[0.875rem] font-medium text-ink ring-1 ring-ink/10 ${className}`}
    >
      {label}
    </a>
  );
}

/**
 * Lead photo plus a deliberate two-up grid on mobile (three-up from `sm`),
 * so a gallery never ends with one huge image next to an empty gap.
 */
export function Gallery({ photos }: { photos: { src: string; alt: string; caption: string }[] }) {
  const [lead, ...rest] = photos;
  if (!lead) return null;
  return (
    <div className="space-y-2">
      <figure>
        <img
          src={lead.src}
          alt={lead.alt}
          loading="lazy"
          width={1200}
          height={800}
          className="aspect-[3/2] w-full rounded-2xl object-cover"
        />
        <figcaption className="mt-1.5 px-1 text-[0.75rem] text-ink/60">{lead.caption}</figcaption>
      </figure>
      {rest.length > 0 && (
        <div className="quick-facts">
          {rest.map((p) => (
            <figure key={p.src} className="min-w-0">
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                width={1200}
                height={800}
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
              <figcaption className="mt-1 px-0.5 text-[0.71875rem] leading-snug text-ink/60">
                {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}

export function EffortBars({ level }: { level: number }) {
  return (
    <span className="flex h-1.5 w-14 gap-1">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-full flex-1 rounded-full ${i <= level ? "bg-saffron" : "bg-ink/15"}`}
        />
      ))}
    </span>
  );
}
