/* The public site doubles as the editor's live preview when it is opened as
   `/?preview=1&sid=<id>` inside the editor's iframe. Read once at load: the
   flag must survive in-app navigation that drops the query string. */
const query = new URLSearchParams(window.location.search);

/** Only inside a frame: opened on its own, `?preview=1` leaves the site as it is. */
export const IS_PREVIEW = query.get("preview") === "1" && window.self !== window.top;
/** Pairs one editor with the iframe it opened, so two editors never cross. */
export const PREVIEW_SID = query.get("sid") ?? "";
