import { observe } from './utils/observer.js'
import * as plugin from './plugins/index.js'
import type { AjaxConfig, AjaxContext, Hook, MethodType, Plugin, Replacer, SwapStrategy } from './types.js'

const store = new Map<string, Set<AjaxConfig>>()
const registered = new WeakSet<HTMLElement>()
const plugins: Plugin[] = [
  plugin.headers({ 'X-Ajax-Request': 'true' }),
  plugin.scripts,
  plugin.events,
]

export function use(plugin: Plugin): void {
  plugins.push(plugin)
}

export function register(config: AjaxConfig): void {
  const regs = store.get(config.target)

  if (regs?.has(config)) return

  if (!regs) {
    store.set(config.target, new Set([config]))
  } else {
    store.set(config.target, regs.add(config))
  }

  for (const element of document.querySelectorAll<HTMLElement>(config.target)) {
    attach(element, config)
  }
}

function attach(element: HTMLElement, config: AjaxConfig): void {
  if (registered.has(element)) return

  registered.add(element)

  for (const plugin of [...plugins, ...(config.plugins ?? [])]) {
    plugin.attach?.(element, config)
  }

  const triggers = [config.trigger ?? defaultTrigger(element)].flat()

  for (const trigger of triggers) {
    element.addEventListener(trigger, (e) => {
      if (config.prevent !== false) e.preventDefault()

      const context = createContext(trigger, element, element, config)

      if (!context) return

      performRequest(context)
    })
  }
}

observe(store, attach)

// request lifecycle: request pipeline → ajax:response (notification) → swap pipeline
async function performRequest(context: AjaxContext): Promise<void> {
  const configPlugins = context.config.plugins ?? []
  const overriddenKeys = new Set(
    configPlugins.map((p) => p.key).filter(Boolean),
  )
  const allPlugins = [
    ...plugins.filter((p) => !p.key || !overriddenKeys.has(p.key)),
    ...configPlugins,
  ]

  try {
    await runPipeline(
      allPlugins.flatMap((p) => (p.request ? [p.request] : [])),
      context,
      async () => {
        context.response = await fetch(context.url, {
          method: context.method,
          headers: context.headers,
          ...(context.body ? { body: context.body } : {}),
        })
        context.incomingDocument = new DOMParser().parseFromString(
          await context.response.text(),
          'text/html',
        )
      },
    )

    if (!context.incomingDocument) return

    const runSwap = () =>
      runPipeline(
        allPlugins.flatMap((p) => (p.swap ? [p.swap] : [])),
        context,
        () => swap(context),
      )

    const transitions = resolveTransitions(context)
    if (transitions.length && 'startViewTransition' in document) {
      await document.startViewTransition({
        update: runSwap,
        types: transitions,
      }).finished
    } else {
      await runSwap()
    }
  } catch (error) {
    for (const plugin of allPlugins) plugin.error?.(error, context)
  }
}

function runPipeline(
  hooks: Hook[],
  context: AjaxContext,
  defaultFn: () => Promise<void> | void,
): Promise<void> {
  let i = 0
  const next = (): Promise<void> => {
    if (i < hooks.length) {
      return Promise.resolve(hooks[i++](context, next))
    }
    return Promise.resolve(defaultFn())
  }
  return next()
}

function defaultTrigger(element: HTMLElement): string {
  switch (element.tagName) {
    case 'FORM':
      return 'submit'
    default:
      return 'click'
  }
}

function createContext(
  trigger: string,
  element: HTMLElement,
  target: Element | null,
  config: AjaxConfig,
): AjaxContext | null {
  if (!target) return null

  const defaults = {
    trigger,
    element,
    config,
    headers: {} as Record<string, string>,
    swappedElements: [] as Element[],
    replace: defaultReplace,
  }

  if (target.tagName === 'FORM') {
    const url = target.getAttribute('action')
    if (!url) return null
    return {
      ...defaults,
      url,
      method: (target.getAttribute('method') || 'GET') as MethodType,
      body: new FormData(target as HTMLFormElement),
    }
  }

  const url = target.getAttribute('href')
  if (!url) return null
  return { ...defaults, url, method: 'GET' }
}

function resolveTransitions(context: AjaxContext): string[] {
  const { config, incomingDocument } = context

  const base = typeof config.transitions === 'function'
    ? config.transitions(context)
    : (config.transitions ?? [])

  if (!incomingDocument) return base

  const perSwap: string[] = []

  for (const swapConfig of config.swaps) {
    if (!swapConfig.transition) continue

    const currentElements = Array.from(document.querySelectorAll(swapConfig.replace))
    if (!currentElements.length) continue

    let incomingElement: Element | undefined
    for (const selector of [swapConfig.with ?? swapConfig.replace].flat()) {
      const found = incomingDocument.querySelector(selector)
      if (found) { incomingElement = found; break }
    }

    if (!incomingElement) continue

    const incoming = incomingElement
    const willSwap = currentElements.some(el => swapConfig.if?.(el, incoming) !== false)
    if (!willSwap) continue

    const t = typeof swapConfig.transition === 'function'
      ? swapConfig.transition(context)
      : swapConfig.transition

    if (t) perSwap.push(t)
  }

  return [...base, ...perSwap]
}

export const defaultReplace: Replacer = (current, incoming, mode) => {
  if (mode === 'innerHTML') {
    current.innerHTML = incoming.innerHTML
    return current
  }
  if (mode === 'outerHTML') {
    const imported = document.importNode(incoming, true)
    current.replaceWith(imported)
    return imported
  }
  current.insertAdjacentElement(mode as InsertPosition, incoming)
  return null
}

function swap(context: AjaxContext): void {
  const { config, incomingDocument } = context
  if (!incomingDocument) return

  for (const swapConfig of config.swaps) {
    const mode: SwapStrategy = swapConfig.mode ?? 'innerHTML'
    const currentElements = document.querySelectorAll(swapConfig.replace)

    let incomingElement: Element | undefined
    for (const selector of [swapConfig.with ?? swapConfig.replace].flat()) {
      const found = incomingDocument.querySelector(selector)
      if (found) {
        incomingElement = found
        break
      }
    }

    if (!incomingElement) return

    for (const currentElement of currentElements) {
      if (swapConfig.if?.(currentElement, incomingElement) === false) continue
      const swapped = context.replace(currentElement, incomingElement, mode)
      if (swapped) context.swappedElements.push(swapped)
    }
  }
}

export default { register, use }
