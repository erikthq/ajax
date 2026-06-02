#!/usr/bin/env node
import { writeFile, mkdir, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import type { Hono } from 'hono'

const [,, command, entryArg] = process.argv
const entry = resolve(process.cwd(), entryArg ?? 'src/app.ts')
const outDir = resolve(process.cwd(), 'dist')

if (command !== 'build') {
  console.error(`Unknown command: ${command ?? '(none)'}. Usage: honodocs build [entry]`)
  process.exit(1)
}

const mod = await import(entry)
const app: Hono = mod.default

if (!app?.fetch) {
  console.error(`${entry} must export a Hono app as default`)
  process.exit(1)
}

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

  const dir = join(outDir, path === '/' ? '' : path)
  const file = join(dir, 'index.html')

  await mkdir(dir, { recursive: true })
  await writeFile(file, html, 'utf-8')
  console.log(`  ${path}`)
}

console.log('Done.')
