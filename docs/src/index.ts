import { readFileSync } from 'fs'
import { serve } from '@hono/node-server'
import { createDocs } from 'honodocs'

function md(file: string) {
  return readFileSync(new URL(`./pages/${file}.md`, import.meta.url), 'utf-8')
}

const app = createDocs({
  title: 'Qute',
  description: 'A hypermedia library focused on the View Transitions API',
  pages: [
    {
      title: 'Introduction',
      slug: '',
      content: md('introduction'),
    },
    {
      title: 'qute.register()',
      slug: 'register',
      group: 'API',
      content: md('register'),
    },
    {
      title: 'Transitions',
      slug: 'transitions',
      group: 'API',
      content: md('transitions'),
    },
    {
      title: 'Plugins',
      slug: 'plugins',
      group: 'API',
      content: md('plugins'),
    },
    {
      title: 'Morph',
      slug: 'plugin-morph',
      group: 'Plugins',
      content: md('plugin-morph'),
    },
    {
      title: 'Preload',
      slug: 'plugin-preload',
      group: 'Plugins',
      content: md('plugin-preload'),
    },
  ],
})

serve({ fetch: app.fetch, port: 3001 }, () => {
  console.log('http://localhost:3001')
})
