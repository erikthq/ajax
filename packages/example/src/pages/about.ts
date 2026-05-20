import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";

export function aboutPage(): HtmlEscapedString | Promise<HtmlEscapedString> {
  return html`
    <div class="prose">
      <h2>About</h2>

      <p>Qute is a hypermedia library focused on the View Transitions API.</p>

      <ul>
        <li>Declarative source/target pairs configured in TypeScript</li>
        <li>One fetch, multiple independent swaps per trigger</li>
        <li>
          Each swap gets its own
          <code>document.startViewTransition({ types })</code>
        </li>
        <li>Graceful fallback when the API is unavailable</li>
      </ul>

      <script type="module">
        import { qute } from "@qute/core";

        console.log("Script added");

        qute.register({
          source: "#link-back-home",
          swaps: [
            {
              source: "#main",
              target: "#main",
              mode: "innerHTML",
              transitions: ["fade"],
            },
          ],
        });
      </script>

      <a href="/" id="link-back-home">Back to Home</a>
    </div>
  `;
}
