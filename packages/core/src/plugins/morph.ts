import type { Plugin } from '../types.js'

type IdiomorphModule = {
  Idiomorph: {
    morph(
      oldNode: Element,
      newNode: Element | string,
      options?: { morphStyle?: 'innerHTML' | 'outerHTML' },
    ): void
  }
}

let cached: IdiomorphModule | null = null

async function load(): Promise<IdiomorphModule | null> {
  try {
    if (!cached) cached = await import('idiomorph')
    return cached
  } catch {
    console.warn('[ajax] morph plugin requires "idiomorph" — install it as a dependency or remove the morph plugin.')
    return null
  }
}

export const morph: Plugin = {
  async swap(ctx, next) {
    const mod = await load()
    if (!mod) return next()

    const { Idiomorph } = mod
    const { config, nextDocument } = ctx
    if (!nextDocument) return

    for (const swapConfig of config.swaps) {
      const mode = swapConfig.mode ?? 'innerHTML'
      const currentElements = document.querySelectorAll(swapConfig.replace)
      const withSelectors = [swapConfig.with ?? swapConfig.replace].flat()

      let newElement: Element | undefined
      for (const selector of withSelectors) {
        const found = nextDocument.querySelector(selector)
        if (found) {
          newElement = found
          break
        }
      }

      if (!newElement) continue

      const html = mode === 'innerHTML' ? newElement.innerHTML : newElement.outerHTML

      for (const currentElement of currentElements) {
        if (swapConfig.if?.(currentElement, newElement) === false) continue

        Idiomorph.morph(currentElement, html, {
          morphStyle: mode === 'innerHTML' ? 'innerHTML' : 'outerHTML',
        })
        ctx.swappedElements.push(currentElement)
      }
    }
  },
}
