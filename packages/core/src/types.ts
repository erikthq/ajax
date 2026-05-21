export type SwapStrategy = 'innerHTML' | 'outerHTML' | 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'

export interface QuteSwapDetail {
  /** The element that triggered the transition */
  trigger: HTMLElement
  /** The URL that was fetched */
  url: string
  /** The swap configuration that produced this element pair */
  swap: TargetConfig
  /** The old element (on 'qute:before') or the new element (on 'qute:after') */
  element: Element
  /** The element that was replaced — only present on 'qute:after' */
  previousElement?: Element
}

export interface QuteErrorDetail {
  trigger: HTMLElement
  url: string
  error: unknown
}

export interface TargetConfig {
  /** CSS selector for the element to swap content into */
  replace: string
  /** CSS selector applied to the fetched response document to pick the fragment */
  with: string
  mode?: SwapStrategy
  transitions?: string[]
}

export interface SourceConfig {
  /** CSS selector for trigger elements (e.g. links, forms) */
  target: string
  /** Event to listen for. Defaults to 'submit' for <form>, 'click' for everything else */
  trigger?: string
  swaps: TargetConfig[]
  /** How to update the browser history after a swap. 'push' adds a new entry, 'replace' updates the current one */
  history?: 'push' | 'replace'
}

