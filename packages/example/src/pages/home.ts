import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";

export function homePage(): HtmlEscapedString | Promise<HtmlEscapedString> {
  return html`
    <div class="prose">
      <h1 class="sr-only">Home</h1>

      <p>
        Welcome to the Qute demo. Click the navigation links to see view
        transitions in action.
      </p>

      <p>
        Each link triggers a fetch, parses the response, and swaps the
        <code>#main</code> fragment with its own typed
        <code>document.startViewTransition()</code>.
      </p>

      <h2>How it works</h2>

      <p>
        Qute intercepts clicks on registered elements, fetches the target URL,
        and surgically replaces only the parts of the page that need to change.
        The rest of the DOM — header, navigation, persistent UI — stays
        untouched.
      </p>

      <p>
        Transitions are opt-in and typed. Each swap declares which transition
        type it wants, and the CSS responds to
        <code>:root:active-view-transition-type()</code> to animate only the
        elements that are actually changing.
      </p>

      <h2>Features</h2>

      <ul>
        <li>Declarative — register targets and swaps in plain JavaScript</li>
        <li>No bundler required — ships as a standard ES module</li>
        <li>History API support — pushState and replaceState built in</li>
        <li>Back/forward navigation handled automatically</li>
        <li>Works with any server — just HTML responses</li>
      </ul>

      <h2>Try it</h2>

      <p>
        Head to the <a href="/store">store</a> to browse products and add items
        to your cart. Watch the cart count animate when items are added. Visit
        <a href="/about">about</a> for a slide transition, or log in to see
        a form transition.
      </p>

      <p>
        The brown circle in the corner runs a continuous CSS animation. It is
        excluded from all view transitions so it never jumps or pauses when the
        page updates.
      </p>
    </div>
  `;
}
