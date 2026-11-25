import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ClipboardPenLine } from 'lucide-react';
import { WhatsappIcon } from '@/components/whatsapp-icon';
import { whatsappHref } from '@/lib/leads';

export function ContactCtas({ trek }: { trek?: string }) {
  const wa = whatsappHref();
  return <div className="p-ctas">
    <Button asChild className="p-btn p-btn-primary"><Link to="/quote" search={trek ? { trek, source: 'trek-page' } : { source: 'direct' }}><ClipboardPenLine aria-hidden="true" />לבקשת הצעה</Link></Button>
    {wa && <Button asChild variant="outline" className="p-btn p-btn-ghost"><a href={wa} target="_blank" rel="noopener noreferrer"><WhatsappIcon />לאוהד בוואטסאפ</a></Button>}
  </div>;
}
