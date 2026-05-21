import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";

export function userButton(name: string): HtmlEscapedString | Promise<HtmlEscapedString> {
  return html`
    <div id="user">
      <strong>${name || "stranger"}</strong>

      <form method="get" action="/logout">
        <button type="submit" class="ghost square" aria-label="Logout" data-placement="bottom">
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
              d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
            />
            <path d="M9 12h12l-3 -3" />
            <path d="M18 15l3 -3" />
          </svg>
        </button>
      </form>
    </div>
  `;
}
