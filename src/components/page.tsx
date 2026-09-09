import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { nepalQuickFacts } from "@/lib/content";
import { whatsappHref } from "@/lib/leads";


export function PageHero({
  kicker,
  title,
  lead,
  image,
  imageAlt,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  image?: string;
  imageAlt?: string;
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
      <div className={`relative mx-auto max-w-3xl px-6 ${image ? "pt-11 pb-12" : "pt-8 pb-5"}`}>
        {kicker && <p className="mb-2 text-xs font-medium tracking-wide text-saffron">{kicker}</p>}
        <h1
          className={`max-w-[26ch] font-display text-[26px] leading-tight font-bold text-balance sm:text-3xl ${
            image ? "text-parchment" : "text-ink"
          }`}
        >
          {title}
        </h1>
        {lead && (
          <p
            className={`mt-3 max-w-[50ch] text-[15px] leading-relaxed ${
              image ? "text-parchment/85" : "text-ink/70"
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
}: {
  title?: string;
  kicker?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-3xl px-6 py-7 sm:py-8 ${className}`}>
      {kicker && <p className="mb-1.5 text-xs font-medium tracking-wide text-saffron">{kicker}</p>}
      {title && (
        <h2 className="max-w-[30ch] font-display text-[22px] leading-snug font-bold text-balance sm:text-2xl">
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

export function TalkCta({
  title = "בואו נדבר על השביל שלכם",
  text = "שיחה קצרה, בלי התחייבות. נשמע מה מסקרן אתכם ונציע כמה כיוונים שמתאימים לימים שיש לכם.",
}: {
  title?: string;
  text?: string;
}) {
  const wa = whatsappHref();
  return (
    <Section>
      <Card className="text-center">
        <h2 className="font-display text-xl font-bold sm:text-2xl">{title}</h2>
        <p className="mx-auto mt-2 max-w-[42ch] text-[15px] leading-relaxed text-ink/70">{text}</p>
        <div className="mt-5 flex flex-col justify-center gap-2.5 sm:flex-row">
          <Link
            to="/contact"
            className="rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment"
          >
            דברו איתנו
          </Link>
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-parchment px-6 py-3.5 text-[15px] font-medium text-ink ring-1 ring-ink/10"
            >
              לכתוב בוואטסאפ
            </a>
          )}
          <Link
            to="/quote"
            className="rounded-xl bg-parchment px-6 py-3.5 text-[15px] font-medium text-ink ring-1 ring-ink/10"
          >
            לקבלת הצעה
          </Link>
        </div>
      </Card>
    </Section>
  );
}

/** A short "didn't know that" note — professionalism shown, not declared. */
export function Insight({ text, title = "שווה לדעת" }: { text: string; title?: string }) {
  return (
    <div className="rounded-2xl border-e-4 border-saffron bg-parchment/70 px-5 py-4">
      <p className="text-[11px] font-semibold tracking-wide text-saffron">{title}</p>
      <p className="mt-1.5 text-[15px] leading-relaxed text-ink/80">{text}</p>
    </div>
  );
}

/** Same box, different hat: a small surprising fact rather than practical advice. */
export function DidYouKnow({ text, action }: { text: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl bg-summit px-5 py-4 text-parchment">
      <p className="text-[11px] font-semibold tracking-wide text-saffron">הידעת?</p>
      <p className="mt-1.5 text-[15px] leading-relaxed text-parchment/85">{text}</p>
      {action && <div className="mt-3 text-[13.5px] font-semibold text-saffron">{action}</div>}
    </div>
  );
}

/** "נפאל בכמה רגעים" — verified basics, scannable, no article required. */
export function QuickFacts() {
  return (
    <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
      {nepalQuickFacts.map((f) => (
        <div key={f.label} className="rounded-xl bg-parchment/80 px-4 py-3 ring-1 ring-ink/5">
          <dt className="text-[11px] font-medium tracking-wide text-ink/45">{f.label}</dt>
          <dd className="mt-0.5 font-display text-[15px] font-bold">{f.value}</dd>
          {f.note && <p className="mt-1 text-[11.5px] leading-snug text-ink/55">{f.note}</p>}
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
      className={`rounded-xl bg-parchment px-5 py-3 text-[14px] font-medium text-ink ring-1 ring-ink/10 ${className}`}
    >
      {label}
    </a>
  );
}

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
        <figcaption className="mt-1.5 px-1 text-[12px] text-ink/50">{lead.caption}</figcaption>
      </figure>
      {rest.length > 0 && (
        <div
          className={`grid gap-2 ${rest.length % 2 === 1 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3"}`}
        >
          {rest.map((p) => (
            <figure key={p.src}>
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                width={1200}
                height={800}
                className="aspect-[4/3] w-full rounded-xl object-cover"
              />
              <figcaption className="mt-1 px-0.5 text-[11px] leading-snug text-ink/50">
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

