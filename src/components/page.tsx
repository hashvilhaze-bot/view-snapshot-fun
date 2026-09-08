import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

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
      <div className={`relative mx-auto max-w-3xl px-6 ${image ? "py-14" : "pt-10 pb-6"}`}>
        {kicker && <p className="mb-2 text-xs font-medium tracking-wide text-saffron">{kicker}</p>}
        <h1
          className={`font-display text-[26px] leading-tight font-bold text-balance sm:text-3xl ${
            image ? "text-parchment" : "text-ink"
          }`}
        >
          {title}
        </h1>
        {lead && (
          <p
            className={`mt-3 max-w-[52ch] text-[15px] leading-relaxed ${
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
    <section className={`mx-auto max-w-3xl px-6 py-10 ${className}`}>
      {kicker && <p className="mb-2 text-xs font-medium tracking-wide text-saffron">{kicker}</p>}
      {title && (
        <h2 className="font-display text-[22px] leading-snug font-bold text-balance sm:text-2xl">
          {title}
        </h2>
      )}
      <div className={title ? "mt-5" : ""}>{children}</div>
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
  title = "בואו נדבר",
  text = "שיחה אחת, בלי התחייבות — גם אם עדיין אין לכם מסלול בראש.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <Section>
      <Card className="text-center">
        <h2 className="font-display text-xl font-bold sm:text-2xl">{title}</h2>
        <p className="mx-auto mt-2 max-w-[42ch] text-[15px] leading-relaxed text-ink/70">{text}</p>
        <Link
          to="/contact"
          className="mt-5 inline-block rounded-xl bg-saffron px-6 py-3.5 text-[15px] font-semibold text-parchment"
        >
          מתחילים מכאן
        </Link>
      </Card>
    </Section>
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
