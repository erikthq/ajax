import type { HtmlEscapedString } from "hono/utils/html";
import { cartButton } from "../components/cart-button.ts";

export function cartResponsePage(
  count: number,
): HtmlEscapedString | Promise<HtmlEscapedString> {
  return cartButton(count);
}
