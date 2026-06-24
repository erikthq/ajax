import type { Plugin } from '../types.js'

type HeadOptions = {
  title?: boolean
}

export function head(options: HeadOptions = {}): Plugin {
  return {
    async swap(ctx, next) {
      await next()

      if (options.title && ctx.incomingDocument) {
        const nextTitle = ctx.incomingDocument.title
        if (nextTitle) {
          document.title = nextTitle
        }
      }
    },
  }
}
