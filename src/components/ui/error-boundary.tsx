import { Component, type ErrorInfo, type ReactNode } from 'react';
import { SystemNotice } from './system-notice';

interface Props {
  children: ReactNode;
  /** Changing this value clears a caught error (e.g. pass the pathname). */
  resetKey?: unknown;
}

interface State {
  error: Error | null;
  resetKey: unknown;
}

/** Catches render errors in a section so the rest of the archive keeps working. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, resetKey: this.props.resetKey };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    return props.resetKey !== state.resetKey ? { error: null, resetKey: props.resetKey } : null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error('[GPC] section crashed', error, info.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="p-4 md:p-6">
        <SystemNotice
          kind="error"
          title="Sector read failure"
          action={
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="text-caption text-cyan-400 underline"
            >
              Retry read
            </button>
          }
        >
          This section of the vault returned corrupted blocks. Other sections remain accessible from the
          sidebar.
        </SystemNotice>
      </div>
    );
  }
}
