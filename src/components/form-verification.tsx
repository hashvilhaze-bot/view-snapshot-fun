import { useEffect, useRef } from "react";
import { Route as Root } from "@/routes/__root";
type Widget = {
  render: (node: HTMLElement, settings: Record<string, string>) => string;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Widget;
  }
}
export function FormVerification({ attempt }: { attempt: number }) {
  const { cms } = Root.useRouteContext(),
    sitekey = cms.integrations.turnstile,
    container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!sitekey || !container.current) return;
    const node = container.current;
    let id: string | undefined;
    function mount() {
      if (window.turnstile && !id)
        id = window.turnstile.render(node, { sitekey: sitekey!, action: "lead", language: "he" });
    }
    let script = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
    if (!script) {
      script = document.createElement("script");
      script.dataset["turnstile"] = "true";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      document.head.append(script);
    }
    script.addEventListener("load", mount);
    mount();
    return () => {
      script.removeEventListener("load", mount);
      if (id) window.turnstile?.remove(id);
    };
  }, [sitekey, attempt]);
  return sitekey ? <div ref={container} aria-label="אימות הטופס" /> : null;
}
