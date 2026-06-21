import type { Plugin } from '../types.js'

function executeScripts(root: Element): void {
  for (const script of root.querySelectorAll('script')) {
    const next = document.createElement('script')
    for (const { name, value } of script.attributes) {
      next.setAttribute(name, value)
    }
    next.textContent = script.textContent
    script.replaceWith(next)
  }
}

export const scripts: Plugin = {
  swap(ctx, next) {
    return next().then(() => {
      for (const el of ctx.swappedElements) {
        executeScripts(el)
      }
    })
  },
}
