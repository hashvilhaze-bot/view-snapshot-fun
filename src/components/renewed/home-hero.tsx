import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContactCtas } from './contact-ctas';
import { heroPhotos } from '@/lib/home-hero-photos';

export function HomeHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState<Set<number>>(() => new Set([0]));
  const requested = useRef(0);
  const photo = heroPhotos[active] ?? heroPhotos[0];

  useEffect(() => {
    let cancelled = false;
    // SSR images may finish loading before React attaches onLoad listeners.
    heroPhotos.forEach((item, index) => {
      const image = new Image();
      image.src = item.src;
      image.decode().then(() => {
        if (!cancelled) setReady(previous => previous.has(index) ? previous : new Set([...previous, index]));
      }).catch(() => { /* Keep the current photograph visible if the next fails. */ });
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setReduced(media.matches); if (media.matches) setPaused(true); };
    const visibility = () => setHidden(document.hidden);
    update(); visibility();
    media.addEventListener('change', update);
    document.addEventListener('visibilitychange', visibility);
    return () => { media.removeEventListener('change', update); document.removeEventListener('visibilitychange', visibility); };
  }, []);

  useEffect(() => {
    if (paused || reduced || hidden) return;
    const timer = window.setTimeout(() => {
      const next = (active + 1) % heroPhotos.length;
      if (ready.has(next)) setActive(next);
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [active, paused, reduced, hidden, ready]);

  const choose = async (index: number) => {
    setPaused(true);
    requested.current += 1;
    const request = requested.current;
    if (!ready.has(index)) {
      const target = heroPhotos[index];
      if (!target) return;
      const image = new Image(); image.src = target.src;
      try { await image.decode(); } catch { return; }
      setReady(previous => new Set([...previous, index]));
    }
    if (request === requested.current) setActive(index);
  };

  return (
    <section className="p-hero-slides" aria-label="נופי נפאל">
      <div className="p-hero-images">
        {heroPhotos.map((item, index) => (
          <img key={item.src} src={item.src} alt={item.alt} aria-hidden={index !== active}
            className={`p-hero-image p-hero-${item.position}`} data-active={index === active}
            fetchPriority={index === 0 ? 'high' : 'low'} loading="eager" decoding="async"
            onLoad={() => setReady(previous => previous.has(index) ? previous : new Set([...previous, index]))} />
        ))}
      </div>
      <div className="p-hero-local-light" aria-hidden="true" />
      <div className="p-wrap p-hero-content">
        <div className="p-hero-copy">
          <p className="p-kicker">השביל הזה · טיולים בהתאמה אישית בנפאל</p>
          <h1 className="p-h1 mt-4">הטיול שלכם לנפאל <span className="p-accent">מתחיל בהיכרות</span> איתכם.</h1>
          <p className="mt-6 max-w-[54ch] text-[18px] font-light leading-[1.7] md:text-[19px]">
            אני אוהד. יחד נתכנן טיול שמתאים לאנשים שנוסעים, לזמן ולתקציב שלכם. אלווה אתכם מההכנות
            בארץ ועד החזרה, ואסייע בתיאום מול החברה המקומית בנפאל לאורך הדרך.
          </p>
          <div className="mt-8"><ContactCtas /></div>
        </div>
        <div className="p-hero-controls" role="group" aria-label="בחירת צילום ועצירת ההחלפה">
          <div className="p-hero-control-row">
            <Button variant="ghost" size="icon" className="p-hero-control" aria-label="הצילום הקודם" title="הצילום הקודם" onClick={() => void choose((active + heroPhotos.length - 1) % heroPhotos.length)}><ChevronRight /></Button>
            {heroPhotos.map((item, index) => (
              <Button key={item.src} variant="ghost" size="icon" className="p-hero-control" aria-label={`הצגת צילום ${index + 1}: ${item.name}`} title={item.name} aria-pressed={active === index} onClick={() => void choose(index)}><span className="p-hero-dot" /></Button>
            ))}
            <Button variant="ghost" size="icon" className="p-hero-control" aria-label="הצילום הבא" title="הצילום הבא" onClick={() => void choose((active + 1) % heroPhotos.length)}><ChevronLeft /></Button>
            <Button variant="ghost" size="icon" className="p-hero-control" disabled={reduced} aria-label={paused || reduced ? 'הפעלת החלפת התמונות' : 'עצירת החלפת התמונות'} title={reduced ? 'החלפה אוטומטית כבויה בהתאם להעדפת תנועה מופחתת' : paused ? 'הפעלת החלפת התמונות' : 'עצירת החלפת התמונות'} onClick={() => setPaused(value => !value)}>{paused || reduced ? <Play /> : <Pause />}</Button>
          </div>
          <p className="p-hero-credit"><a href={photo.source} target="_blank" rel="noopener noreferrer">צילום: {photo.author}</a> · <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer">{photo.license}</a></p>
        </div>
      </div>
    </section>
  );
}