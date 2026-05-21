import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";

export function loginPage(): HtmlEscapedString | Promise<HtmlEscapedString> {
  return html`
    <section class="login-page prose" id="login-form">
      <hgroup>
        <h2>Welcome back</h2>
        <p>Sign in to continue to your dashboard.</p>
      </hgroup>

      <article>
        <form method="post" action="/form-response">
          <label class="field">
            <span>Username</span>

            <input
              name="name"
              type="text"
              value="John Doe"
              placeholder="you@example.com"
              autocomplete="username"
            />
          </label>

          <label class="field">
            <span>Password</span>

            <input
              name="password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
            />
          </label>

          <button type="submit">Sign in</button>
        </form>
      </article>
    </section>
  `;
}
