import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

/** Última red de seguridad: si una página truena, muestra un mensaje simple
 *  con link al home en vez de una pantalla en blanco. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Unhandled render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="boot" style={{ gap: 14 }}>
          <div>SOMETHING WENT WRONG</div>
          <a
            href="/"
            style={{ letterSpacing: "0.1em", borderBottom: "1px solid #fff" }}
          >
            BACK TO HOME
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}
