import type { GalleryMedia, GallerySection, Project } from "@/types/content";
import { isYouTube, youTubeThumb } from "./media";

/** Best still frame for a gallery item (poster for video, thumb for YouTube). */
export function mediaThumb(m: GalleryMedia): string {
  if (m.type === "image") return m.url;
  if (m.poster) return m.poster;
  return isYouTube(m.url) ? youTubeThumb(m.url) : "";
}

/**
 * The single most representative still for a project, in priority order:
 * custom hero image, first gallery still, first section image, then the
 * project mark. Content-driven, so nothing is hardcoded per project.
 */
export function projectPoster(p: Project): string {
  if (p.heroMode === "custom" && p.heroImage) return p.heroImage;
  // Real stills beat video posters, which are often low-resolution.
  for (const s of p.sections || []) {
    if (s.type === "gallery") {
      for (const item of (s as GallerySection).items || []) {
        if (item.type === "image" && item.url) return item.url;
      }
    }
    if ((s.type === "overview" || s.type === "conclusion") && s.image) {
      return s.image;
    }
  }
  for (const s of p.sections || []) {
    if (s.type !== "gallery") continue;
    for (const item of (s as GallerySection).items || []) {
      const t = mediaThumb(item);
      if (t) return t;
    }
  }
  return p.img || "";
}

/** Every still a project can offer, for galleries and hero collages. */
export function projectStills(p: Project, limit = 6): string[] {
  const out: string[] = [];
  const push = (u: string) => {
    if (u && !out.includes(u)) out.push(u);
  };
  if (p.heroMode === "custom" && p.heroImage) push(p.heroImage);
  for (const s of p.sections || []) {
    if (s.type === "gallery") {
      for (const item of (s as GallerySection).items || []) push(mediaThumb(item));
    } else if (
      (s.type === "overview" || s.type === "conclusion") &&
      s.image
    ) {
      push(s.image);
    }
  }
  return out.slice(0, limit);
}

/** First playable background video a project offers, if any. */
export function projectVideo(p: Project): { url: string; poster: string } | null {
  if (p.bg && p.bg.type === "video" && p.bg.url) {
    return { url: p.bg.url, poster: p.bg.poster || "" };
  }
  for (const s of p.sections || []) {
    if (s.type !== "gallery") continue;
    for (const item of (s as GallerySection).items || []) {
      if (item.type === "video" && item.url && !isYouTube(item.url)) {
        return { url: item.url, poster: item.poster || "" };
      }
    }
  }
  return null;
}

/**
 * How a still should sit in its frame. In this library the JPGs are screen
 * captures (they crop well) and the PNGs are marks, mascots and transparent
 * art (cropping them decapitates the subject), so PNGs get letterboxed.
 */
export function posterFit(url: string): "cover" | "contain" {
  return /\.png(\?|$)/i.test(url || "") ? "contain" : "cover";
}
