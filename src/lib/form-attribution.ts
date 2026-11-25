const key = "hashvil.form-origin.v1";
type Visit = { current: string; previous: string; channel: string };
let memory: Visit | undefined;
function read(): Visit | undefined {
  try {
    return JSON.parse(sessionStorage.getItem(key) ?? "null") ?? memory;
  } catch {
    return memory;
  }
}
export function observePage(path: string) {
  if (!/^\/[a-z0-9/-]*$/.test(path) || /^\/(admin|profile|auth|pilot)(\/|$)/.test(path)) return;
  const old = read();
  const utm = new URLSearchParams(location.search).get("utm_source");
  const source = utm?.match(/^[a-zA-Z0-9_.-]{1,60}$/)?.[0];
  let ref: URL | undefined;
  try {
    if (document.referrer) ref = new URL(document.referrer);
  } catch {
    /* Missing referrer. */
  }
  const external = ref && ref.origin !== location.origin ? ref.hostname : "";
  const channel = source || old?.channel || external || "direct";
  const previous =
    old?.current === path
      ? old.previous
      : old?.current || (ref?.origin === location.origin ? ref.pathname : "");
  memory = { current: path, previous, channel };
  try {
    sessionStorage.setItem(key, JSON.stringify(memory));
  } catch {
    /* This tab can keep attribution in memory. */
  }
}
export function formAttribution() {
  observePage(location.pathname);
  return {
    origin_path:
      /^\/[a-z0-9/-]{0,155}$/.test(memory?.previous ?? "") &&
      !/^\/(admin|profile|auth|pilot)(\/|$)/.test(memory!.previous)
        ? memory!.previous
        : location.pathname,
    source_channel: memory?.channel?.slice(0, 120).replace(/[^a-zA-Z0-9_.:/-]/g, "") || "direct",
  };
}
