import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";

export function formResponsePage(
  name: string,
): HtmlEscapedString | Promise<HtmlEscapedString> {
  return html`
    <p>Don't render me</p>

    <hr />

    <div id="form-response">
      <div class="prose">
        <h2>Form submitted</h2>
        <p>Hello, <strong>${name || "stranger"}</strong>!</p>
      </div>
    </div>

    <div id="user">
      <p><strong>${name || "stranger"}</strong></p>
    </div>
  `;
}
