import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";
import { icon } from "./icon.ts";

export function userButton(name: string): HtmlEscapedString | Promise<HtmlEscapedString> {
  return html`
    <div id="user">
      <strong>${name || "stranger"}</strong>

      <form method="get" action="/logout">
        <button type="submit" class="ghost square" aria-label="Logout" data-placement="bottom">
          ${icon("logout")}
        </button>
      </form>
    </div>
  `;
}
