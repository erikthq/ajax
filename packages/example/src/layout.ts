import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";

export function layout(
  content: HtmlEscapedString | Promise<HtmlEscapedString>,
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
          <h1>Qute</h1>

          <nav>
            <a href="/" id="link-home">Home</a>
            <a href="/about" id="link-about">About</a>
            <a href="/login" id="link-login">Login</a>
          </nav>

          <section id="profile">
            <button class="square ghost">
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
                  d="M9 8v-2a2 2 0 0 1 2 -2h7a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-2"
                />
                <path d="M3 12h13l-3 -3" />
                <path d="M13 15l3 -3" />
              </svg>
            </button>
          </section>
        </header>

        <main id="main">${content}</main>

        <script type="module" src="/client.js"></script>
      </body>
    </html>`;
}
