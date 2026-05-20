export type SwapStrategy = 'innerHTML' | 'outerHTML' | 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'

export interface TargetConfig {
  /** CSS selector for the element to swap content into */
  source: string
  /** CSS selector applied to the fetched response document to pick the fragment */
  target: string
  mode?: SwapStrategy
  transitions?: string[]
}

export interface SourceConfig {
  /** CSS selector for trigger elements (e.g. links, forms) */
  source: string
  /** Event to listen for. Defaults to 'submit' for <form>, 'click' for everything else */
  trigger?: string
  swaps: TargetConfig[]
}

