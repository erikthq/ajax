import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";
import { loginButton } from "../components/login-button.ts";

export function logoutResponsePage(): HtmlEscapedString | Promise<HtmlEscapedString> {
  return html`${loginButton()}`;
}
