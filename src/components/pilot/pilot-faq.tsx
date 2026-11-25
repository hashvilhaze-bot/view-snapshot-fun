import type { Faq } from "@/lib/pilot/itineraries";
export function PilotFaq({ items }: { items: Faq[] }) {
  return (
    <div>
      {items.map(({ question, answer }) => (
        <details key={question} className="p-rule last:border-b">
          <summary>{question}</summary>
          <p className="p-muted m-0 pb-5 text-[16px]">{answer}</p>
        </details>
      ))}
    </div>
  );
}
