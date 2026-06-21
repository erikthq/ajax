import type { Plugin } from '../types.js'

const badgeStyle = (color: string) =>
  `background:${color};color:#fff;border-radius:3px;padding:1px 0`

const dim = 'color:gray'

function badge(label: string, color: string, suffix?: string): [string, ...string[]] {
  if (suffix !== undefined) {
    return [`[ajax] - %c ${label} %c ${suffix}`, badgeStyle(color), dim]
  }
  return [`[ajax] - %c ${label} `, badgeStyle(color)]
}

export const debug: Plugin = {
  attach(element, config) {
    const id = element.id ? `#${element.id}` : element.tagName.toLowerCase()
    const url = element.tagName === 'FORM' ? element.getAttribute('action') : element.getAttribute('href')
    console.groupCollapsed(...badge('attach', '#6366f1', `${id} ${url ?? ''}`.trim()))
    console.log('%celement', dim, element)
    console.log('%cconfig', dim, config)
    console.groupEnd()
  },
  

  async request(ctx, next) {
    console.groupCollapsed(...badge(ctx.method, '#f59e0b', ctx.url))
    console.log('%celement', dim, ctx.element)
    console.log('%cheaders', dim, ctx.headers)
    if (ctx.body) console.log('%cbody', dim, ctx.body)
    console.groupEnd()

    await next()

    const ok = (ctx.response?.status ?? 0) < 400
    console.log(...badge(String(ctx.response?.status ?? '?'), ok ? '#22c55e' : '#ef4444', ctx.url))
  },

  async swap(ctx, next) {
    await next()

    console.groupCollapsed(...badge('swap', '#8b5cf6', `${ctx.swappedElements.length} element(s)`))
    for (const el of ctx.swappedElements) console.log(el)
    console.groupEnd()
  },

  error(error, ctx) {
    console.groupCollapsed(...badge('error', '#ef4444', ctx.url))
    console.error(error)
    console.log('%ccontext', dim, ctx)
    console.groupEnd()
  },
}
