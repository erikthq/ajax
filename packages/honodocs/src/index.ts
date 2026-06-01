import { Hono } from 'hono'
import { html, raw } from 'hono/html'
import type { HtmlEscapedString } from 'hono/utils/html'
import { marked } from 'marked'

export interface Page {
  title: string
  slug: string
  group?: string
  content: string
}

export interface DocsConfig {
  title: string
  description?: string
  pages: Page[]
}

function groupedNav(pages: Page[], currentSlug: string): HtmlEscapedString {
  const groups = new Map<string, Page[]>()

  for (const page of pages) {
    const group = page.group ?? ''
    if (!groups.has(group)) groups.set(group, [])
    groups.get(group)!.push(page)
  }

  const sections = Array.from(groups.entries()).map(([group, items]) => {
    const links = items.map(p =>
      html`<a href="/${p.slug}" ${p.slug === currentSlug ? raw('aria-current="page"') : ''}>
        ${p.title}
      </a>`,
    )
    return group
      ? html`<section><h3>${group}</h3>${links}</section>`
      : html`<section>${links}</section>`
  })

  return html`${sections}` as HtmlEscapedString
}

function layout(
  config: DocsConfig,
  page: Page,
  content: string,
): HtmlEscapedString {
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${page.title} — ${config.title}</title>
        <link rel="stylesheet" href="https://esm.sh/gh/erikthalen/jazz/jazz.css" />
        <style>
          body { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; margin: 0; }
          nav { padding: var(--jazz-spacing-4); border-right: 1px solid var(--jazz-color-border); position: sticky; top: 0; height: 100vh; overflow-y: auto; }
          nav h2 { margin-bottom: var(--jazz-spacing-4); }
          nav section { margin-bottom: var(--jazz-spacing-4); }
          nav h3 { font-size: var(--jazz-font-size-sm); text-transform: uppercase; letter-spacing: 0.05em; color: var(--jazz-color-muted); margin-bottom: var(--jazz-spacing-2); }
          nav a { display: block; padding: var(--jazz-spacing-1) 0; text-decoration: none; color: inherit; }
          nav a[aria-current="page"] { font-weight: bold; }
          main { padding: var(--jazz-spacing-8); max-width: 720px; }
        </style>
      </head>
      <body>
        <nav>
          <h2><a href="/" style="text-decoration:none;color:inherit">${config.title}</a></h2>
          ${groupedNav(config.pages, page.slug)}
        </nav>
        <main class="prose">
          ${raw(content)}
        </main>
      </body>
    </html>` as HtmlEscapedString
}

export function createDocs(config: DocsConfig): Hono {
  const app = new Hono()

  for (const page of config.pages) {
    const path = page.slug === '' ? '/' : `/${page.slug}`
    app.get(path, async (c) => {
      const content = await marked.parse(page.content)
      return c.html(layout(config, page, content))
    })
  }

  return app
}
