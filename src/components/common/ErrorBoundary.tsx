import { Component, type ReactNode } from "react";
import { useSite } from "@/content/ContentContext";

function Fallback() {
  const { ui } = useSite();
  return (
    <div className="boot">
      <div>{ui.error.title}</div>
      <a href="/" className="boot-link">
        {ui.error.back}
      </a>
    </div>
  );
}

interface Props {
  children: ReactNode;
}
interface State {
  hasError: boolean;
}

/** Last safety net: if a page throws, show a plain message with a way home
 *  instead of a blank screen. */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Unhandled render error:", error);
  }

  render() {
    return this.state.hasError ? <Fallback /> : this.props.children;
  }
}
