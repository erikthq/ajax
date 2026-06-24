export type MethodType = 'GET' | 'POST'

export type SwapStrategy =
  | 'innerHTML'
  | 'outerHTML'
  | 'beforebegin'
  | 'afterbegin'
  | 'beforeend'
  | 'afterend'

export type TargetConfig = {
  replace: string
  with?: string | string[]
  if?: (current: Element, next: Element) => boolean
  mode?: SwapStrategy
  transition?: string | ((context: AjaxContext) => string)
}

export type AjaxConfig = {
  target: string
  trigger?: string | string[]
  swaps: TargetConfig[]
  plugins?: Plugin[]
  prevent?: boolean
  transitions?: string[] | ((context: AjaxContext) => string[])
}

export type AjaxContext = {
  trigger: string
  element: HTMLElement
  url: string
  method: MethodType
  body?: FormData
  headers: Record<string, string>
  config: AjaxConfig
  response?: Response
  incomingDocument?: Document
  swappedElements: Element[]
  replace: Replacer
}

export type Replacer = (
  current: Element,
  incoming: Element,
  mode: SwapStrategy,
) => Element | null

export type Hook = (
  context: AjaxContext,
  next: () => Promise<void>,
) => Promise<void> | void

export type ErrorHook = (error: unknown, context: AjaxContext) => void

export type Plugin = {
  key?: string
  attach?: (element: HTMLElement, config: AjaxConfig) => void
  request?: Hook
  swap?: Hook
  error?: ErrorHook
}
