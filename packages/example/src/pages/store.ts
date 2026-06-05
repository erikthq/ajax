import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";
import { type Variant, product } from "../data/product.ts";

export function storePage(
  variantId: Variant = "small",
): HtmlEscapedString | Promise<HtmlEscapedString> {
  const current = product.variants.find((v) => v.id === variantId)!;

  return html`
    <div id="product">
      <img
        src="${current.image}"
        alt="${current.id} variant"
        style="width:100%;margin-bottom:var(--jazz-spacing-4);image-rendering:pixelated"
      />

      <div class="prose" style="margin-bottom:var(--jazz-spacing-4)">
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
              class="variant-link button ${v.id === variantId
                ? "secondary"
                : "ghost"}"
              style="text-decoration:none"
            >
              ${v.name}
            </a>
          `,
        )}
      </fieldset>

      <script type="module">
        import { qute } from "@qute/core";
        import { morphPlugin } from "@qute/morph";

        qute.register({
          target: ".variant-link",
          history: "replace",
          swaps: [
            {
              replace: "#product",
              with: "#product",
              mode: "outerHTML",
              plugin: morphPlugin,
              transitions: ["variant-change"],
            },
          ],
        });
      </script>

      <form
        method="post"
        action="/cart"
        style="margin-top:var(--jazz-spacing-4)"
      >
        <input type="hidden" name="variant" value="${variantId}" />
        <button type="submit">Add to cart</button>
      </form>
    </div>
  `;
}
