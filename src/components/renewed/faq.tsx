import type { ReactNode } from "react";
export function FaqList({
  items,
  className = "",
}: {
  items: { question: string; answer: ReactNode }[];
  className?: string;
}) {
  return (
    <div className={"site-faq " + className}>
      {items.map(({ question, answer }) => (
        <details key={question} className="p-rule">
          <summary>{question}</summary>
          <div className="faq-response">{answer}</div>
        </details>
      ))}
    </div>
  );
}
