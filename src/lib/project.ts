import type { GalleryMedia, GallerySection, Project } from "@/types/content";
import { isYouTube, youTubeThumb } from "./media";

/** Best still frame for a gallery item (poster for video, thumb for YouTube). */
export function mediaThumb(m: GalleryMedia): string {
  if (m.type === "image") return m.url;
  if (m.poster) return m.poster;
  return isYouTube(m.url) ? youTubeThumb(m.url) : "";
}

/**
 * The single most representative still of a project: its hero image, then the
 * first gallery still, then a video poster. Content-driven, nothing is
 * hardcoded per project.
 */
export function projectPoster(p: Project): string {
  if (p.heroImage) return p.heroImage;
  const galleries = (p.sections || []).filter(
    (s): s is GallerySection => s.type === "gallery"
  );
  for (const g of galleries) {
    const still = (g.items || []).find((i) => i.type === "image" && i.url);
    if (still) return still.url;
  }
  for (const g of galleries) {
    for (const item of g.items || []) {
      const t = mediaThumb(item);
      if (t) return t;
    }
  }
  return "";
}

/**
 * How a still sits in its frame. The JPGs are screen captures (they crop
 * well); the PNGs are marks and mascots on transparency, which cropping would
 * decapitate, so they are letterboxed.
 */
export function posterFit(url: string): "cover" | "contain" {
  return /\.png(\?|$)/i.test(url || "") ? "contain" : "cover";
}
