import { Link } from "react-router-dom";
import { useSite } from "@/content/ContentContext";

/** Logo de marca (texto o imagen) que enlaza al home. */
export default function Logo({ className = "" }: { className?: string }) {
  const { brand } = useSite();
  if (brand.logoType === "image" && brand.logoImg) {
    return (
      <Link to="/" className={`logo logo-img ${className}`}>
        <img src={brand.logoImg} alt={brand.name} />
      </Link>
    );
  }
  return (
    <Link to="/" className={`logo ${className}`}>
      {brand.name}
      <small>{brand.tagline}</small>
    </Link>
  );
}
