import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";
import { loginButton } from "./components/login-button.ts";
import { userButton } from "./components/user-button.ts";

export function layout(
  content: HtmlEscapedString | Promise<HtmlEscapedString>,
  user?: string,
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

        <script type="importmap">
          { "imports": { "@qute/core": "/qute.js" } }
        </script>
      </head>
      <body>
        <header>
          <a href="/" id="link-home">
            <h1>Qute</h1>
          </a>

          <nav>
            <a href="/about" id="link-about">About</a>
          </nav>

          ${user ? userButton(user) : loginButton()}
        </header>

        <main id="main">${content}</main>

        <script type="module" src="/client.js"></script>
      </body>
    </html>`;
}
