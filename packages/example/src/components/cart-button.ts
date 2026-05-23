import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";
import { icon } from "./icon.ts";

export function cartButton(
  count: number,
): HtmlEscapedString | Promise<HtmlEscapedString> {
  return html`
    <a
      id="cart-button"
      href="/cart"
      class="button ghost square"
      aria-label="Cart${count > 0 ? ` (${count} items)` : ""}"
      data-placement="bottom"
      style="position:relative;text-decoration:none"
    >
      ${icon("cart")}
      ${count > 0 ? html`<span id="cart-count">${count}</span>` : ""}
    </a>
  `;
}
