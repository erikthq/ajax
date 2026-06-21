import type { Plugin } from '../types.js'

export function headers(extra: Record<string, string> = {}): Plugin {
  return {
    request(ctx, next) {
      ctx.headers['X-Ajax-Request'] = 'true'
      Object.assign(ctx.headers, extra)
      return next()
    },
  }
}
