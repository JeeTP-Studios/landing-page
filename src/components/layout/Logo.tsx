import { Link } from "react-router-dom";
import { useSite } from "@/content/ContentContext";

/** Brand mark. Links home from every surface it appears on. */
export default function Logo({ className = "" }: { className?: string }) {
  const { brand } = useSite();
  return (
    <Link
      to="/"
      className={`logo ${className}`.trim()}
      aria-label={brand.name}
      data-edit="brand"
    >
      {brand.logoImg ? <img src={brand.logoImg} alt={brand.name} /> : <b>{brand.name}</b>}
    </Link>
  );
}
