interface ScrollCueProps {
  id: string;
  /** "home" usa .scrollcue (posición absoluta del hero); "page" usa .pcue */
  variant?: "home" | "page";
}

/** Círculo giratorio "SCROLL TO DISCOVER". */
export default function ScrollCue({ id, variant = "page" }: ScrollCueProps) {
  return (
    <div className={variant === "home" ? "scrollcue" : "pcue"}>
      <div className="rot">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path
              id={id}
              d="M50 50 m -36 0 a 36 36 0 1 1 72 0 a 36 36 0 1 1 -72 0"
            />
          </defs>
          <text
            fontSize="9"
            letterSpacing="2.6"
            fill="rgba(255,255,255,.6)"
            fontFamily="Satoshi"
          >
            <textPath href={`#${id}`}>
              SCROLL TO DISCOVER · SCROLL ·{" "}
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
