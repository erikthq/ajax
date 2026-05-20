import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { readFile } from 'node:fs/promises'
import { layout } from './layout.ts'
import { homePage } from './pages/home.ts'
import { aboutPage } from './pages/about.ts'
import { formResponsePage } from './pages/form-response.ts'

const app = new Hono()

app.get('/qute.js', async c => {
  const js = await readFile(new URL('../../core/dist/index.js', import.meta.url), 'utf-8')
  c.header('Content-Type', 'application/javascript')
  return c.body(js)
})

app.use('/*', serveStatic({ root: './public' }))

app.get('/', c => c.html(layout(homePage())))
app.get('/about', c => c.html(layout(aboutPage())))
app.post('/form-response', async c => {
  const { name } = await c.req.parseBody<{ name: string }>()
  return c.html(layout(formResponsePage(name)))
})

const server = serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log('http://localhost:3000')
})

process.on('SIGTERM', () => server.close())
