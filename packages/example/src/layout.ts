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
        <link rel="stylesheet" href="/transitions.css" />

        <script src="/qute.js" type="module"></script>
      </head>
      <body>
        <aside class="idle-animation"></aside>
        <aside class="idle-view-transition"></aside>
        <aside class="markers"></aside>

        <header>
          <a href="/" id="link-home">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M21 17.998v-.5l-8.13 -14.99a1 1 0 0 0 -1.74 0l-8.13 14.989v.5c0 1.659 4.03 3.003 9 3.003s9 -1.344 9 -3.002"
              />
            </svg>
          </a>

          <nav>
            <a href="/about" id="link-about">About</a>
            <a href="/store" id="link-store">Store</a>
          </nav>

          <span>
            ${user ? userButton(user) : loginButton()} ${cartButton(cartCount)}
          </span>
        </header>

        <main id="main">${content}</main>
        <script src="/client.js" type="module"></script>
      </body>
    </html>`;
}
