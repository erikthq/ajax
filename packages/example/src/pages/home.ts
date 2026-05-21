import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";

export function homePage(): HtmlEscapedString | Promise<HtmlEscapedString> {
  return html`
    <div class="prose">
      <h2>Home</h2>

      <p>
        Welcome to the Qute demo. Click the navigation links to see view
        transitions in action.
      </p>

      <p>
        Each link triggers a fetch, parses the response, and swaps the
        <code>#main</code> fragment with its own typed
        <code>document.startViewTransition()</code>.
      </p>
    </div>
  `;
}
