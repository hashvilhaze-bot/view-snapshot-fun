import type { Faq } from "@/lib/pilot/itineraries";
import { FaqList } from "@/components/renewed/faq";
export function PilotFaq({ items }: { items: Faq[] }) {
  return <FaqList items={items} />;
}
