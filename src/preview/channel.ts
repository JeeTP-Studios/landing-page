import type { Lang } from "@/content/i18n";
import type { SiteContent } from "@/types/content";

/* ============================================================
   Editor <-> preview messages. A BroadcastChannel carries them (same origin,
   no coupling between the two windows); where it does not exist, the same
   messages travel by postMessage between the editor and its iframe.
   ============================================================ */

/** Editor to preview. */
export type ToPreview =
  | { t: "state"; doc: SiteContent; lang: Lang }
  | { t: "route"; path: string }
  | { t: "focus"; key: string };

/** Preview to editor. */
export type ToEditor = { t: "ready" } | { t: "select"; key: string };

export interface Link<Out, In> {
  send(msg: Out): void;
  onMessage(cb: (msg: In) => void): () => void;
  close(): void;
}

/** `peer` returns the window on the other side, used only by the fallback. */
export function openLink<Out, In>(sid: string, peer: () => Window | null): Link<Out, In> {
  if (typeof BroadcastChannel !== "undefined") {
    const bc = new BroadcastChannel(`jeetp-preview:${sid}`);
    return {
      send: (msg) => bc.postMessage(msg),
      onMessage: (cb) => {
        const h = (e: MessageEvent) => cb(e.data as In);
        bc.addEventListener("message", h);
        return () => bc.removeEventListener("message", h);
      },
      close: () => bc.close(),
    };
  }
  return {
    send: (msg) => peer()?.postMessage({ __jeetp: sid, msg }, window.location.origin),
    onMessage: (cb) => {
      const h = (e: MessageEvent) => {
        if (e.origin !== window.location.origin) return;
        const d = e.data as { __jeetp?: string; msg?: In } | null;
        if (d && d.__jeetp === sid && d.msg) cb(d.msg);
      };
      window.addEventListener("message", h);
      return () => window.removeEventListener("message", h);
    },
    close: () => undefined,
  };
}
