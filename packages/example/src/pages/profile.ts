import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";
import { userButton } from "../components/user-button.ts";

export function profilePage(
  name: string,
): HtmlEscapedString | Promise<HtmlEscapedString> {
  return html`
    <p>Don't render me</p>

    <hr />

    <div id="form-response">
      <hgroup>
        <h2>Logged in</h2>
        <p>Hello, <strong>${name || "stranger"}</strong>!</p>
      </hgroup>
    </div>

    ${userButton(name)}
  `;
}
