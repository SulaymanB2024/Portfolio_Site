import { createElement, lazy, memo, type ComponentType } from 'react'
import { createDeferredModule } from './deferred-module'

export function deferredPage<Props extends object>(load: () => Promise<{ default: ComponentType<Props> }>) {
  const module = createDeferredModule(load)
  const Lazy = lazy(module.prepare)
  // React.lazy still suspends once when first mounted after a separate prefetch.
  // A ready destination must mount synchronously for the live canvas handoff.
  // Header/menu updates need not rerender an unchanged page; page state and contexts still update.
  const Page = memo((props: Props) => createElement(module.read()?.default ?? Lazy, props))
  return { Page, load: module.prepare }
}
