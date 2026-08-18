import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Unexpected render error." };
  }

  componentDidCatch(error, info) {
    console.error("Portfolio error boundary:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: "" });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-panel error-boundary-panel" role="alert">
          <span className="eyebrow">COMPONENT ERROR</span>
          <h3>{this.props.fallbackTitle || "This section failed to render."}</h3>
          <p>The rest of the portfolio is still available. The failure was isolated here.</p>
          <p className="error-boundary-detail">{this.state.message}</p>
          <button type="button" className="glass-btn secondary-button" onClick={this.handleReset}>
            Retry section
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}