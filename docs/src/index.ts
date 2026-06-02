import { serve } from '@hono/node-server'
import app from './app.ts'

serve({ fetch: app.fetch, port: 3001 }, () => {
  console.log('http://localhost:3001')
})
