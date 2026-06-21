import { html } from 'hono/html'
import type { HtmlEscapedString } from 'hono/utils/html'

export function aboutPage(): HtmlEscapedString | Promise<HtmlEscapedString> {
  return html`
    <div class="prose">
      <h2>About</h2>

      <p>Qute is a hypermedia library focused on the View Transitions API.</p>

      <ul>
        <li>Declarative source/target pairs configured in TypeScript</li>
        <li>One fetch, multiple independent swaps per trigger</li>
        <li>
          Each swap gets its own
          <code>document.startViewTransition({ types })</code>
        </li>
        <li>Graceful fallback when the API is unavailable</li>
      </ul>

      <a href="/" id="link-back-home">Back to Home</a>

      <script type="module">
        import ajax, { history } from '@erikt/ajax'

        ajax.use({
          swap(ctx, next) {
            console.log('[about] swapping', ctx.url)
            return next()
          },
        })

        ajax.register({
          target: '#link-back-home',
          transitions: ['fade'],
          plugins: [history('push')],
          swaps: [
            {
              replace: '#main',
              with: '#main',
              mode: 'innerHTML',
            },
          ],
        })
      </script>
    </div>
  `
}
