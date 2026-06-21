import { observe } from './utils/observer.js'
import * as plugin from './plugins/index.js'
import type { AjaxConfig, AjaxContext, Hook, MethodType, Plugin } from './types.js'

export type {
  AjaxConfig,
  AjaxContext,
  Hook,
  ErrorHook,
  Plugin,
  TargetConfig,
  SwapStrategy,
  MethodType,
} from './types.js'
export {
  preload,
  morph,
  debug,
  loading,
  history,
  headers
} from './plugins/index.js'
export type {
  PreloadPlugin,
  PreloadOptions,
  PreloadStrategy,
  IgnoreRule,
  LoadingTarget,
} from './plugins/index.js'

const store = new Map<string, Set<AjaxConfig>>()
const registered = new WeakSet<HTMLElement>()
const plugins: Plugin[] = [
  plugin.headers(),
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
        context.nextDocument = new DOMParser().parseFromString(
          await context.response.text(),
          'text/html',
        )
      },
    )

    if (!context.nextDocument) return

    const runSwap = () =>
      runPipeline(
        allPlugins.flatMap((p) => (p.swap ? [p.swap] : [])),
        context,
        () => swap(context),
      )

    const { transitions } = context.config
    if (transitions?.length && 'startViewTransition' in document) {
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

function swap(context: AjaxContext): void {
  const { config, nextDocument } = context
  if (!nextDocument) return

  for (const swapConfig of config.swaps) {
    if (!swapConfig.with) swapConfig.with = swapConfig.replace
    if (!swapConfig.mode) swapConfig.mode = 'innerHTML'

    const currentElements = document.querySelectorAll(swapConfig.replace)
    let newElement: Element | undefined

    for (const selector of [swapConfig.with || swapConfig.replace].flat()) {
      const found = nextDocument.querySelector(selector)
      if (found) {
        newElement = found
        break
      }
    }

    if (!newElement) return

    for (const currentElement of currentElements) {
      if (swapConfig.if?.(currentElement, newElement) === false) continue

      if (swapConfig.mode === 'innerHTML') {
        currentElement.innerHTML = newElement.innerHTML
        context.swappedElements.push(currentElement)
      } else if (swapConfig.mode === 'outerHTML') {
        const imported = document.importNode(newElement, true)
        currentElement.replaceWith(imported)
        context.swappedElements.push(imported)
      } else {
        currentElement.insertAdjacentElement(swapConfig.mode, newElement)
      }
    }
  }
}

export default { register, use }
