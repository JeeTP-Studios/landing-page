/** Utilidades para manejar medios (YouTube / video / imagen). */

/** Extrae el ID de un video de YouTube de varias formas de URL. */
export function youTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

export function isYouTube(url: string): boolean {
  return youTubeId(url) !== null;
}

/** URL de embed de YouTube. */
export function youTubeEmbed(url: string, autoplay = false): string {
  const id = youTubeId(url);
  return `https://www.youtube.com/embed/${id}${
    autoplay ? "?autoplay=1&rel=0" : "?rel=0"
  }`;
}

/** Miniatura de un video de YouTube. */
export function youTubeThumb(url: string): string {
  const id = youTubeId(url);
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
