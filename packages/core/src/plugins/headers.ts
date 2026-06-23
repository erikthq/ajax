import type { Plugin } from '../types.js'

export function headers(extra: Record<string, string> = {}): Plugin {
  return {
    request(ctx, next) {
      Object.assign(ctx.headers, extra)
      return next()
    },
  }
}
