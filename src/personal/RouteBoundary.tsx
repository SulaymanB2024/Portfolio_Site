import { Component, type ReactNode } from 'react'

/** Keep navigation available if a route's code or rendering fails. */
export default class RouteBoundary extends Component<{ children: ReactNode; homeRoute?: boolean; onError?: () => void }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() { return { failed: true } }

  componentDidCatch() { this.props.onError?.() }

  render() {
    if (!this.state.failed) return this.props.children
    return <section className="route-error" role="alert">
      <h1>This page couldn’t open.</h1>
      <p>Reload to try again, or choose another page from the menu.</p>
      <div><button type="button" onClick={() => location.reload()}>Reload page <span aria-hidden="true">↻</span></button><a href={this.props.homeRoute ? '#/work' : '#/'}>{this.props.homeRoute ? 'Explore work' : 'Go home'} <span aria-hidden="true">↗</span></a></div>
    </section>
  }
}
