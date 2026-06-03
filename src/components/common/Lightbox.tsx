import { useEffect } from "react";
import type { GalleryMedia } from "@/types/content";
import { isYouTube, youTubeEmbed } from "@/lib/media";

/** Overlay para expandir una imagen o video al hacer clic en la galería. */
export default function Lightbox({
  media,
  onClose,
}: {
  media: GalleryMedia;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lightbox-close" aria-label="Cerrar" onClick={onClose}>
        ✕
      </button>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {media.type === "image" ? (
          <img src={media.url} alt="" />
        ) : isYouTube(media.url) ? (
          <div className="lightbox-video">
            <iframe
              src={youTubeEmbed(media.url, true)}
              title="video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <video src={media.url} poster={media.poster} controls autoPlay />
        )}
      </div>
    </div>
  );
}
