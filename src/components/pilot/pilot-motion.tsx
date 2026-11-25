import { useEffect } from "react";
export function usePilotMotion(pathname: string) {
  useEffect(() => {
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
          elements.forEach((el) => {
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
