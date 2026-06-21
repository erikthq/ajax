import type { AjaxContext, Plugin } from '../types.js'

export type LoadingTarget = string | ((ctx: AjaxContext) => Element | null)

export function loading(target?: LoadingTarget): Plugin {
  return {
    key: 'loading',
    async request(ctx, next) {
      const el =
        typeof target === 'function'
          ? target(ctx)
          : typeof target === 'string'
            ? document.querySelector(target)
            : ctx.element

      el?.setAttribute('aria-busy', 'true')
      try {
        await next()
      } finally {
        el?.removeAttribute('aria-busy')
      }
    },
  }
}
