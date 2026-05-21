import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { readFile } from 'node:fs/promises'
import { layout } from './layout.ts'
import { homePage } from './pages/home.ts'
import { aboutPage } from './pages/about.ts'
import { loginPage } from './pages/login.ts'
import { loginResponsePage } from './pages/login-response.ts'
import { logoutResponsePage } from './pages/logout-response.ts'

const app = new Hono()

app.get('/qute.js', async c => {
  const js = await readFile(new URL('../../core/dist/index.js', import.meta.url), 'utf-8')
  c.header('Content-Type', 'application/javascript')
  return c.body(js)
})

app.use('/*', serveStatic({ root: './public' }))

app.get('/', c => c.html(layout(homePage(), getCookie(c, 'user'))))
app.get('/about', c => c.html(layout(aboutPage(), getCookie(c, 'user'))))
app.get('/login', c => c.html(layout(loginPage(), getCookie(c, 'user'))))

app.get('/logout', c => {
  deleteCookie(c, 'user')
  return c.html(logoutResponsePage())
})

app.post('/login', async c => {
  const { name } = await c.req.parseBody<{ name: string }>()
  setCookie(c, 'user', name, { httpOnly: true, path: '/' })
  return c.html(loginResponsePage(name))
})

const server = serve({ fetch: app.fetch, port: 3000 }, () => {
  console.log('http://localhost:3000')
})

process.on('SIGTERM', () => server.close())
