import type { Plugin } from '../types.js'

export function history(mode: 'push' | 'replace', updateUrl = true): Plugin {
  return {
    async swap(ctx, next) {
      await next()
      const url = updateUrl ? ctx.url : undefined
      if (mode === 'push') {
        window.history.pushState({}, '', url)
      } else {
        window.history.replaceState({}, '', url)
      }
    },
  }
}
