import { Link } from "react-router-dom";

interface HireusProps {
  text: string;
  buttonLabel: string;
  style?: React.CSSProperties;
}

/** Banda CTA "trabaja con nosotros". */
export default function Hireus({ text, buttonLabel, style }: HireusProps) {
  return (
    <div className="hireus" style={style}>
      <span>{text}</span>
      <Link to="/contact">{buttonLabel}</Link>
    </div>
  );
}
