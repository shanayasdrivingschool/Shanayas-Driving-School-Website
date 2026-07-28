import { Component, type ErrorInfo, type ReactNode } from "react";
import ServerError from "@/pages/ServerError";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

/**
 * Top-level boundary for uncaught render errors. Without it, a throw in any
 * route component blanks the whole app (white screen); with it, users see the
 * branded 500 page and can reload. Recovery uses a full page reload rather than
 * client navigation, since the boundary state persists across route changes.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <ServerError />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
