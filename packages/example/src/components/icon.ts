import { html } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";

const icons = {
  cart: html`
    <path d="M10 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <path d="M5.001 8h13.999a2 2 0 0 1 1.977 2.304l-1.255 7.152a3 3 0 0 1 -2.966 2.544h-9.512a3 3 0 0 1 -2.965 -2.544l-1.255 -7.152a2 2 0 0 1 1.977 -2.304" />
    <path d="M17 10l-2 -6" />
    <path d="M7 10l2 -6" />
  `,
  user: html`
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M9 10a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
  `,
  logout: html`
    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
    <path d="M9 12h12l-3 -3" />
    <path d="M18 15l3 -3" />
  `,
  plus: html`
    <path d="M12 5l0 14" />
    <path d="M5 12l14 0" />
  `,
  minus: html`
    <path d="M5 12l14 0" />
  `,
  x: html`
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  `,
} as const;

export type IconName = keyof typeof icons;

export function icon(name: IconName): HtmlEscapedString | Promise<HtmlEscapedString> {
  return html`
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
      ${icons[name]}
    </svg>
  `;
}
