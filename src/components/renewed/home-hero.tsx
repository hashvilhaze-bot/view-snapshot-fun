import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pause, Play } from 'lucide-react';
import { ContactCtas } from './contact-ctas';
import { heroPhotos } from '@/lib/home-hero-photos';

export function HomeHero({ children }: { children?: ReactNode }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [ready, setReady] = useState<Set<number>>(() => new Set([0]));
  const requested = useRef(0);

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
          <p className="p-hero-intro">
            אני אוהד. יחד נתכנן טיול שמתאים לאנשים שנוסעים, לזמן ולתקציב שלכם. אלווה אתכם מההכנות
            בארץ ועד החזרה, ואסייע בתיאום מול החברה המקומית בנפאל לאורך הדרך.
          </p>
          <div className="p-hero-ctas">{children ?? <ContactCtas />}</div>
        </div>
        <div className="p-slide-nav" role="group" aria-label="תמונות מנפאל">
          {heroPhotos.map((item, index) => (
            <button key={item.src} type="button" className="p-slide-pick"
              aria-pressed={index === active} aria-label={`הצגת צילום ${index + 1}, ${item.name}`}
              title={item.name} onClick={() => void choose(index)}>
              <span aria-hidden="true" />
            </button>
          ))}
          {!reduced && (
            <button type="button" className="p-slide-play"
              aria-label={paused ? 'המשך הצגת התמונות' : 'עצירת החלפת התמונות'}
              title={paused ? 'המשך הצגת התמונות' : 'עצירת החלפת התמונות'}
              onClick={() => setPaused(value => !value)}>
              {paused ? <Play aria-hidden="true" size={14} /> : <Pause aria-hidden="true" size={14} />}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
