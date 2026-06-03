#!/usr/bin/env node
import { writeFile, mkdir, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import type { Hono } from 'hono'

const [,, command, entryArg] = process.argv
const entry = resolve(process.cwd(), entryArg ?? 'src/app.ts')

async function loadApp(): Promise<Hono> {
  const mod = await import(entry)
  const app: Hono = mod.default
  if (!app?.fetch) {
    console.error(`${entry} must export a Hono app as default`)
    process.exit(1)
  }
  return app
}

if (command === 'dev') {
  const { serve } = await import('@hono/node-server')
  const app = await loadApp()
  const port = 3001
  serve({ fetch: app.fetch, port }, () => {
    console.log(`http://localhost:${port}`)
  })
} else if (command === 'build') {
  const app = await loadApp()
  const outDir = resolve(process.cwd(), 'dist')
  const base: string = (app as any)._base ?? ''

  const routes = [...new Set(
    app.routes
      .filter(r => r.method === 'GET')
      .map(r => r.path)
  )]

  await rm(outDir, { recursive: true, force: true })
  console.log(`Building ${routes.length} pages to dist/`)

  for (const path of routes) {
    const res = await app.fetch(new Request(`http://localhost${path}`))
    const html = await res.text()
    const filePath = base && path.startsWith(base) ? path.slice(base.length) || '/' : path
    const dir = join(outDir, filePath === '/' ? '' : filePath)
    await mkdir(dir, { recursive: true })
    await writeFile(join(dir, 'index.html'), html, 'utf-8')
    console.log(`  ${path}`)
  }

  console.log('Done.')
} else {
  console.error(`Unknown command: ${command ?? '(none)'}`)
  console.error('Usage: honodocs dev|build [entry]')
  process.exit(1)
}
