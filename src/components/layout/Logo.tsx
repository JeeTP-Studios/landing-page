import { Link } from "react-router-dom";
import { useSite } from "@/content/ContentContext";

/** Brand mark. Links home from every surface it appears on. */
export default function Logo({ className = "" }: { className?: string }) {
  const { brand } = useSite();
  if (brand.logoType === "image" && brand.logoImg) {
    return (
      <Link to="/" className={`logo ${className}`} aria-label={brand.name}>
        <img src={brand.logoImg} alt={brand.name} />
      </Link>
    );
  }
  return (
    <Link to="/" className={`logo logo-text ${className}`}>
      {brand.name}
      <small>{brand.tagline}</small>
    </Link>
  );
}
