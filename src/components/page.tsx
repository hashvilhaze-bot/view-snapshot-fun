import type { ReactNode } from "react";

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
}: {
  kicker?: string;
  title: string;
  lead?: string;
  image?: string;
  imageAlt?: string;
  size?: SectionSize;
}) {
  return (
    <section className="relative overflow-hidden">
      {image && (
        <>
          <img
            src={image}
            alt={imageAlt ?? ""}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-summit/75" />
        </>
      )}
      <div
        className={`relative mx-auto ${WIDTH[size]} px-6 ${image ? "pt-11 pb-12" : "pt-8 pb-5"}`}
      >
        {kicker && <p className="mb-2 text-xs font-medium tracking-wide text-saffron">{kicker}</p>}
        <h1
          className={`max-w-[26ch] font-display text-[1.625rem] leading-tight font-bold text-balance sm:text-3xl ${
            image ? "text-parchment" : "text-ink"
          }`}
        >
          {title}
        </h1>
        {lead && (
          <p
            className={`mt-3 max-w-[50ch] text-[0.9375rem] leading-relaxed ${
              image ? "text-parchment/85" : "text-ink/75"
            }`}
          >
            {lead}
          </p>
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
    <section className={`mx-auto ${WIDTH[size]} px-6 py-6 sm:py-8 ${className}`}>
      {kicker && <p className="mb-1.5 text-xs font-medium tracking-wide text-saffron">{kicker}</p>}
      {title && (
        <h2 className="max-w-[30ch] font-display text-[1.375rem] leading-snug font-bold text-balance sm:text-2xl">
          {title}
        </h2>
      )}
      <div className={title ? "mt-4" : ""}>{children}</div>
    </section>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-parchment/50 bg-parchment/85 p-5 ring-1 ring-ink/5 ${className}`}
    >
      {children}
    </div>
  );
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
    <div className={`space-y-2 ${className}`}>
      {items.map((it) => (
        <details
          key={it.title}
          className="group rounded-2xl border border-parchment/50 bg-parchment/85 ring-1 ring-ink/5"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-[0.90625rem] font-semibold text-ink">
            <span>{it.title}</span>
            <span
              aria-hidden="true"
              className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-saffron/12 text-[0.9375rem] leading-none font-bold text-saffron"
            >
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <div className="px-4 pt-0.5 pb-4 text-[0.875rem] leading-relaxed text-ink/75">
            {it.content}
          </div>
        </details>
      ))}
    </div>
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
    <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {nepalQuickFacts.map((f) => (
        <div key={f.label} className="rounded-xl bg-parchment/80 px-3.5 py-2.5 ring-1 ring-ink/5">
          <dt className="text-[0.6875rem] font-medium tracking-wide text-ink/55">{f.label}</dt>
          <dd className="mt-0.5 font-display text-[0.9375rem] font-bold">{f.value}</dd>
          {f.note && <p className="mt-0.5 text-[0.71875rem] leading-snug text-ink/65">{f.note}</p>}
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
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
