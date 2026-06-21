import { html } from 'hono/html'
import type { HtmlEscapedString } from 'hono/utils/html'
import { type Variant, product } from '../data/product.ts'

export function storePage(
  variantId: Variant = 'small',
): HtmlEscapedString | Promise<HtmlEscapedString> {
  const current = product.variants.find((v) => v.id === variantId)!

  return html`
    <div id="product">
      <img
        src="${current.image}"
        alt="${current.id} variant"
        style="width:100%;margin-bottom:var(--ui-spacing-4);image-rendering:pixelated"
      />

      <div class="prose" style="margin-bottom:var(--ui-spacing-4)">
        <hgroup>
          <h2>Example Product</h2>
          <p id="variant-description">${current.description}</p>
        </hgroup>
      </div>

      <fieldset role="group">
        ${product.variants.map(
          (v) => html`
            <a
              href="/store?variant=${v.id}"
              class="variant-link button ghost"
              style="${v.id === variantId
                ? 'background-color: var(--ui-neutral-900); color: var(--ui-neutral-50); box-shadow: 0 0 0 1px var(--ui-neutral-900) inset;'
                : ''}"
            >
              ${v.name}
            </a>
          `,
        )}
      </fieldset>

      <script type="module">
        import ajax, { history } from '@erikt/ajax'

        ajax.register({
          target: '.variant-link',
          transitions: ['variant-change'],
          plugins: [history('replace')],
          swaps: [
            {
              replace: '#product',
              with: '#product',
              mode: 'outerHTML',
            },
          ],
        })
      </script>

      <form method="post" action="/cart" style="margin-top:var(--ui-spacing-4)">
        <input type="hidden" name="variant" value="${variantId}" />
        <button type="submit">Add to cart</button>
      </form>
    </div>
  `
}
