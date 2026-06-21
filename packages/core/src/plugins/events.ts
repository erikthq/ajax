import type { Plugin } from '../types.js'

function dispatch(name: string, detail: unknown): void {
  document.dispatchEvent(new CustomEvent(name, { detail }))
}

export const events: Plugin = {
  attach(element, config) {
    dispatch('ajax:attach', { element, config })
  },

  request(ctx, next) {
    dispatch('ajax:before-request', ctx)
    return next().then(() => dispatch('ajax:after-request', ctx))
  },

  swap(ctx, next) {
    dispatch('ajax:before-swap', ctx)
    return next().then(() => dispatch('ajax:after-swap', ctx))
  },

  error(error, ctx) {
    dispatch('ajax:error', { error, context: ctx })
  },
}
