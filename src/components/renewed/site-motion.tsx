import { useLayoutEffect } from "react";
export function useSiteMotion(pathname: string) {
  useLayoutEffect(() => {
    if (!pathname) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
          const elements = gsap.utils.toArray<HTMLElement>(
            ".pilot main [data-p-reveal], .pilot main .p-cat, .pilot main .p-read, .pilot main figure, .pilot main #process li",
          );
          elements.filter(el => !el.querySelector('[data-p-photo-story], [data-p-depth]') && !el.closest('[data-p-photo-story]')).forEach((el) => {
            const replay = () => {
              el.dataset["replays"] = String(Number(el.dataset["replays"] ?? 0) + 1);
              gsap.fromTo(
                el,
                { y: 16, opacity: 0.7 },
                { y: 0, opacity: 1, duration: 0.42, ease: "power2.out", overwrite: true },
              );
            };
            const reset = () => {
              gsap.killTweensOf(el);
              gsap.set(el, { clearProps: "transform,opacity" });
            };
            ScrollTrigger.create({
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              onEnter: replay,
              onEnterBack: replay,
              onLeave: reset,
              onLeaveBack: reset,
            });
          });
          // Additional photo motion is desktop-only; the same composition is static on phones.
          const media = gsap.matchMedia();
          media.add('(min-width: 768px)', () => {
            gsap.utils.toArray<HTMLImageElement>('.pilot main [data-p-depth]').forEach(image => {
              gsap.fromTo(image, { y: -8 }, {
                y: 8, ease: 'none',
                scrollTrigger: { trigger: image.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
              });
            });
            gsap.utils.toArray<HTMLElement>('.pilot main [data-p-photo-story]').forEach(group => {
              const frames = group.querySelectorAll('[data-p-story-frame]');
              const replay = () => {
                group.dataset['storyReplays'] = String(Number(group.dataset['storyReplays'] ?? 0) + 1);
                gsap.fromTo(frames, { y: 14, opacity: .65 }, { y: 0, opacity: 1, duration: .3, stagger: .08, ease: 'power2.out', overwrite: true });
              };
              const reset = () => { gsap.killTweensOf(frames); gsap.set(frames, { clearProps: 'transform,opacity' }); };
              ScrollTrigger.create({ trigger: group, start: 'top 85%', end: 'bottom top', onEnter: replay, onEnterBack: replay, onLeave: reset, onLeaveBack: reset });
            });
          });
          return () => media.revert();
        });
        ScrollTrigger.refresh();
        cleanup = () => ctx.revert();
        const stop = () => {
          if (reduced.matches) ctx.revert();
        };
        reduced.addEventListener("change", stop);
        const oldCleanup = cleanup;
        cleanup = () => {
          reduced.removeEventListener("change", stop);
          oldCleanup();
        };
      },
    );
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [pathname]);
}
