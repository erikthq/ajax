import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";
import { product } from "../data/product.ts";
import { icon } from "../components/icon.ts";

export function cartPage(
  cart: Record<string, number>,
): HtmlEscapedString | Promise<HtmlEscapedString> {
  const items = Object.entries(cart).flatMap(([id, quantity]) => {
    const variant = product.variants.find((v) => v.id === id);
    return variant ? [{ ...variant, quantity }] : [];
  });

  return html`
    <div id="cart-page">
      <div class="prose" style="margin-bottom:var(--jazz-spacing-4)">
        <h2>Cart</h2>
      </div>

      ${items.length === 0
        ? html`<p>Your cart is empty.</p>`
        : items.map(
            (item) => html`
              <div
                style="display:flex;align-items:center;gap:var(--jazz-spacing-4);margin-bottom:var(--jazz-spacing-4)"
              >
                <img
                  src="${item.image}"
                  alt="${item.name}"
                  style="width:80px;border-radius:var(--jazz-radius);image-rendering:pixelated"
                />

                <div style="flex:1">
                  <strong>${item.name}</strong>
                </div>

                <form
                  method="post"
                  action="/cart-update"
                  class="cart-update-form"
                >
                  <input type="hidden" name="variantId" value="${item.id}" />

                  <fieldset role="group">
                    <input
                      type="number"
                      value="${item.quantity}"
                      min="0"
                      readonly
                      name="quantity"
                      style="width:6ch"
                    />
                    <button
                      type="button"
                      class="ghost square"
                      aria-label="Decrement"
                      onclick="const i=this.closest('form').querySelector('[name=quantity]');i.stepDown();i.dispatchEvent(new Event('change',{bubbles:true}))"
                    >
                      ${icon("minus")}
                    </button>
                    <button
                      type="button"
                      class="ghost square"
                      aria-label="Increment"
                      onclick="const i=this.closest('form').querySelector('[name=quantity]');i.stepUp();i.dispatchEvent(new Event('change',{bubbles:true}))"
                    >
                      ${icon("plus")}
                    </button>
                  </fieldset>
                </form>
              </div>
            `,
          )}
    </div>
  `;
}
