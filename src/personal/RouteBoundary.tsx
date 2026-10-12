import { Component, type ReactNode } from 'react'
import { DestinationLink } from './DestinationLink'
import './route-recovery.css'

/** Keep navigation available if a route's code or rendering fails. */
export default class RouteBoundary extends Component<{ children: ReactNode; homeRoute?: boolean; onError?: () => void }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() { return { failed: true } }

  componentDidCatch() { this.props.onError?.() }

  render() {
    if (!this.state.failed) return this.props.children
    return <section className="route-error route-recovery" role="alert">
      <h1>This page couldn’t open.</h1>
      <p>Reload to try again, or choose another page from the menu.</p>
      <div><button type="button" className="destination-link" onClick={() => location.reload()}><span className="destination-link-label">Reload page</span><span aria-hidden="true">↻</span></button><DestinationLink href={this.props.homeRoute ? '/work' : '/'}>{this.props.homeRoute ? 'Explore work' : 'Go home'}</DestinationLink></div>
    </section>
  }
}
