import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";
import { icon } from "./icon.ts";

export function loginButton(): HtmlEscapedString | Promise<HtmlEscapedString> {
  return html`
    <section id="profile">
      <a
        class="button ghost square"
        href="/login"
        id="link-login"
        aria-label="Login"
        data-placement="bottom"
      >
        ${icon("user")}
      </a>
    </section>
  `;
}
