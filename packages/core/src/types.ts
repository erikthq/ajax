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
}

export type AjaxConfig = {
  target: string
  trigger?: string | string[]
  swaps: TargetConfig[]
  plugins?: Plugin[]
  prevent?: boolean
  transitions?: string[]
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
  nextDocument?: Document
  swappedElements: Element[]
}

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
