import type { AjaxConfig, Plugin } from '../types.js'

export type PreloadStrategy = 'prefetch' | 'prerender' | 'fetch'

export type IgnoreRule = string | RegExp | ((url: string) => boolean)

export interface PreloadOptions {
  /** How to load the URL. Pass an array to apply multiple strategies. Default: 'prefetch' */
  strategy?: PreloadStrategy | PreloadStrategy[]
  /** IntersectionObserver threshold. Default: 0 (any pixel visible) */
  threshold?: number
  /** Skip preloading on slow connections and when Save-Data is on. Default: true */
  respectConnection?: boolean
  /** Only preload links that push/replace history (i.e. actual page navigations). Default: true */
  onlyNavigations?: boolean
  /** URLs to never preload. Strings are matched against the pathname. */
  ignore?: IgnoreRule | IgnoreRule[]
}

export type PreloadPlugin = Plugin & { invalidate: (url?: string) => void }

const idle: (cb: () => void) => void =
  typeof requestIdleCallback !== 'undefined'
    ? (cb) => requestIdleCallback(cb)
    : (cb) => setTimeout(cb, 0)

interface ConnectionInfo {
  saveData?: boolean
  effectiveType?: string
}

function isSlow(): boolean {
  const conn = (navigator as Navigator & { connection?: ConnectionInfo })
    .connection
  if (!conn) return false
  if (conn.saveData) return true
  return /2g/.test(conn.effectiveType ?? '')
}

function supportsSpeculationRules(): boolean {
  return (
    typeof HTMLScriptElement !== 'undefined' &&
    typeof HTMLScriptElement.supports === 'function' &&
    HTMLScriptElement.supports('speculationrules')
  )
}

function resolveURL(url: string): string {
  try {
    return new URL(url, location.href).href
  } catch {
    return url
  }
}

function linkURL(element: HTMLElement): string | null {
  return element instanceof HTMLAnchorElement ? element.href : null
}

function isIgnored(url: string, rules: IgnoreRule[]): boolean {
  const { pathname } = new URL(url)
  return rules.some((rule) => {
    if (typeof rule === 'string') return pathname === rule
    if (rule instanceof RegExp) return rule.test(url)
    return rule(url)
  })
}

export function preload(options: PreloadOptions = {}): PreloadPlugin {
  const {
    strategy = 'prefetch',
    threshold = 0,
    respectConnection = true,
    ignore = [],
  } = options

  const ignoreRules = Array.isArray(ignore) ? ignore : [ignore]
  const strategies = Array.isArray(strategy) ? strategy : [strategy]

  const handled = new Set<string>()
  const injected: Array<{ url: string; el: HTMLElement }> = []
  const docCache = new Map<string, Document>()

  function applyStrategy(url: string, s: PreloadStrategy): void {
    const key = `${s}:${url}`
    if (handled.has(key)) return
    handled.add(key)

    switch (s) {
      case 'prefetch': {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = url
        document.head.appendChild(link)
        injected.push({ url, el: link })
        break
      }

      case 'prerender': {
        if (!supportsSpeculationRules()) {
          applyStrategy(url, 'prefetch')
          return
        }
        // A new element must be inserted each time — the API forbids mutating
        // an already-processed speculationrules script.
        const script = document.createElement('script')
        script.type = 'speculationrules'
        script.textContent = JSON.stringify({
          prerender: [{ source: 'list', urls: [url] }],
        })
        document.head.appendChild(script)
        injected.push({ url, el: script })
        break
      }

      case 'fetch': {
        fetch(url, { priority: 'low' } as RequestInit)
          .then((res) => res.text())
          .then((html) => {
            docCache.set(url, new DOMParser().parseFromString(html, 'text/html'))
          })
          .catch(() => {})
        break
      }
    }
  }

  function invalidate(url?: string): void {
    const target = url ? resolveURL(url) : undefined
    const remove = target
      ? injected.filter((e) => e.url === target)
      : injected.slice()

    for (const { url: u, el } of remove) {
      el.remove()
      for (const s of strategies) handled.delete(`${s}:${u}`)
    }

    if (target) {
      injected.splice(
        0,
        injected.length,
        ...injected.filter((e) => e.url !== target),
      )
      docCache.delete(target)
      // Overwrite the stale prefetch cache entry so the next navigation revalidates.
      fetch(target, {
        cache: 'reload',
        headers: { 'X-Ajax-Invalidate': '1' },
      }).catch(() => {})
    } else {
      injected.length = 0
      handled.clear()
      docCache.clear()
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const url = linkURL(entry.target as HTMLElement)
        if (!url) continue
        idle(() => {
          if (respectConnection && isSlow()) return
          if (isIgnored(url, ignoreRules)) return
          for (const s of strategies) applyStrategy(url, s)
        })
      }
    },
    { threshold },
  )

  return {
    attach(element) {
      if (element instanceof HTMLFormElement && element.method.toLowerCase() !== 'get') return
      if (!linkURL(element)) return
      observer.observe(element)
    },
    request(context, next) {
      const cached = docCache.get(resolveURL(context.url))
      if (cached) {
        context.nextDocument = cached
        return
      }
      return next()
    },
    invalidate,
  }
}
