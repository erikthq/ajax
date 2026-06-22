import type { Plugin } from '../types.js'

type HeadOptions = {
  title?: boolean
}

export function head(options: HeadOptions = {}): Plugin {
  return {
    async swap(ctx, next) {
      await next()

      if (options.title && ctx.nextDocument) {
        const nextTitle = ctx.nextDocument.title
        if (nextTitle) {
          document.title = nextTitle
        }
      }
    },
  }
}
