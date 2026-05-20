import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";

export function homePage(): HtmlEscapedString | Promise<HtmlEscapedString> {
  return html`
    <div class="prose" style="margin-bottom: var(--jazz-spacing-4)">
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

    <article id="login-form" style="width: 400px">
      <form method="post" action="/form-response">
        <fieldset role="group">
          <input name="name" type="text" placeholder="Your name" />
          <button type="submit">Login</button>
        </fieldset>
      </form>
    </article>
  `;
}
