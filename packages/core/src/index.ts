type TODO = any

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
  plugin?: TODO
  mode?: SwapStrategy
  transitions?: string[]
}

export type AjaxConfig = {
  target: string
  trigger?: string | string[]
  swaps: TargetConfig[]
  prevent?: boolean
  history?: 'push' | 'replace'
}

const store = new Map<string, Set<AjaxConfig>>()

export const qute = {
  register(config: AjaxConfig) {
    const regs = store.get(config.target)

    if (regs?.has(config)) return

    if (!regs) {
      store.set(config.target, new Set([config]))
    } else {
      store.set(config.target, regs.add(config))
    }

    listen(config)

    console.log(store)
  },
}

function listen(config: AjaxConfig) {
  const elements = document.querySelectorAll<HTMLElement>(config.target)

  for (const element of elements) {
    if (element.dataset.ajax !== undefined) return

    const triggers = [config.trigger ?? defaultTrigger(element)].flat()

    for (const trigger of triggers) {
      element.addEventListener(trigger, (e) => performSwap(e, config))
    }
  }
}

function defaultTrigger(element: HTMLElement) {
  switch (element.tagName) {
    case 'FORM':
      return 'submit'
    default:
      return 'click'
  }
}

async function performSwap(e: Event, config: AjaxConfig) {
  if (config.prevent !== false) {
    e.preventDefault()
  }

  if (!e.target || !(e.target instanceof HTMLElement)) {
    console.log('[ajax] - No target')
    return
  }

  const { name } = e.constructor
  const el = e.target.closest(name === 'SubmitEvent' ? 'form' : 'a')

  if (!el) {
    console.log('[ajax] - No closest <form> or <a>')
    return
  }

  const url = el?.getAttribute('href') ?? el?.getAttribute('action')

  if (!url) {
    console.log('[ajax] - No url to fetch')
    return
  }

  const response = await fetch(url)
  const html = new DOMParser().parseFromString(
    await response.text(),
    'text/html',
  )

  console.log(html)
}
