'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

type Props = {
  children: ReactNode
  // Rendered instead of children after an error. Defaults to nothing, so a
  // broken widget just disappears instead of taking the whole page down.
  fallback?: ReactNode
  // Used in the console message to identify which boundary caught the error
  name?: string
}

type State = { hasError: boolean }

// Isolates render errors to a single part of the page. Next's error.tsx only
// works per route segment, so an error inside e.g. the map would otherwise
// replace the entire page with the error screen.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `ErrorBoundary${this.props.name ? ` (${this.props.name})` : ''} caught:`,
      error,
      info.componentStack,
    )
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null
    }
    return this.props.children
  }
}
