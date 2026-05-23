import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";
import { loginButton } from "./components/login-button.ts";
import { userButton } from "./components/user-button.ts";
import { cartButton } from "./components/cart-button.ts";

export function layout(
  content: HtmlEscapedString | Promise<HtmlEscapedString>,
  user?: string,
  cartCount: number = 0,
): HtmlEscapedString | Promise<HtmlEscapedString> {
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Qute</title>
        <link
          rel="stylesheet"
          href="https://esm.sh/gh/erikthalen/jazz/jazz.css"
        />
        <link rel="stylesheet" href="/style.css" />

        <script src="/qute.js" type="module"></script>
      </head>
      <body>
        <header>
          <a href="/" id="link-home">
            <h1>Qute</h1>
          </a>

          <nav>
            <a href="/about" id="link-about">About</a>
            <a href="/store" id="link-store">Store</a>
          </nav>

          <span>
            ${user ? userButton(user) : loginButton()}
            ${cartButton(cartCount)}
          </span>
        </header>

        <main id="main">${content}</main>
        <script src="/client.js" type="module"></script>
      </body>
    </html>`;
}
