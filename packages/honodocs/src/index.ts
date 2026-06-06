import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Hono } from "hono";
import { html, raw } from "hono/html";
import type { HtmlEscapedString } from "hono/utils/html";
import { marked } from "marked";
import { getSingletonHighlighter } from "shiki";

const style = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "style.css"),
  "utf-8",
);

const highlighter = await getSingletonHighlighter({
  themes: ["github-light", "github-dark"],
  langs: [
    "javascript",
    "typescript",
    "jsx",
    "tsx",
    "html",
    "css",
    "bash",
    "json",
    "shell",
    "markdown",
  ],
});

function slugify(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

marked.use({
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      const loaded = highlighter.getLoadedLanguages();
      const language = lang && loaded.includes(lang as never) ? lang : "text";
      return highlighter.codeToHtml(text, {
        lang: language,
        themes: { light: "github-light", dark: "github-dark" },
      });
    },
    heading({ text, depth }: { text: string; depth: number }) {
      const id = slugify(text);
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    },
  },
});

export interface DocsConfig {
  title: string;
  headline?: string;
  description?: string;
  pagesDir?: string;
  baseUrl?: string;
}

interface Heading {
  depth: number;
  text: string;
  id: string;
}

interface Page {
  title: string;
  slug: string;
  group?: string;
  content: string;
  headings: Heading[];
}

function stripNumericPrefix(name: string): string {
  return name.replace(/^\d+-/, "");
}

function toTitle(name: string): string {
  return stripNumericPrefix(name)
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractTitle(content: string): string | undefined {
  return content.match(/^#\s+(.+)$/m)?.[1]?.trim();
}

function extractHeadings(content: string): Heading[] {
  const headings: Heading[] = [];
  const regex = /^(#{1,6})\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const text = match[2].replace(/`([^`]*)`/g, "$1").trim();
    headings.push({ depth: match[1].length, text, id: slugify(text) });
  }
  return headings;
}

function scanPages(pagesDir: string, dir = pagesDir, group?: string): Page[] {
  const pages: Page[] = [];
  const entries = readdirSync(dir).sort();
  const files = entries.filter((e) => e.endsWith(".md"));
  const dirs = entries.filter((e) => !e.endsWith(".md"));

  for (const entry of [...files, ...dirs]) {
    const fullPath = join(dir, entry);

    if (statSync(fullPath).isDirectory()) {
      pages.push(...scanPages(pagesDir, fullPath, toTitle(entry)));
    } else if (entry.endsWith(".md")) {
      const base = stripNumericPrefix(entry.slice(0, -3));
      const relDir = dir
        .slice(pagesDir.length)
        .replace(/\\/g, "/")
        .split("/")
        .map(stripNumericPrefix)
        .join("/");
      const slug =
        base === "index"
          ? relDir.slice(1)
          : [relDir, base].filter(Boolean).join("/").replace(/^\//, "");

      const content = readFileSync(fullPath, "utf-8");
      const title =
        extractTitle(content) ??
        toTitle(base === "index" ? relDir.slice(1) : base);

      pages.push({ title, slug, group, content, headings: extractHeadings(content) });
    }
  }

  return pages;
}

function groupedNav(
  pages: Page[],
  currentSlug: string,
  base: string,
): HtmlEscapedString {
  const groups = new Map<string, Page[]>();

  for (const page of pages) {
    const key = page.group ?? "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(page);
  }

  const sections = Array.from(groups.entries()).map(([group, items]) => {
    const links = items
      .map((p) => {
        return (
          p.title &&
          html`<li>
            <a
              class="button ghost"
              href="${p.slug === "" ? `${base}/` : `${base}/${p.slug}`}"
              ${p.slug === currentSlug ? raw('aria-current="page"') : ""}
            >
              ${p.title}
            </a>
          </li>`
        );
      })
      .filter(Boolean);

    if (!links.length) return;

    return group
      ? html`<menu>
          <li><small>${group}</small></li>
          ${links}
        </menu>`
      : html`<menu>${links}</menu>`;
  });

  return html`${sections.filter(Boolean)}` as HtmlEscapedString;
}

function tocNav(headings: Heading[]): HtmlEscapedString {
  const items = headings.map(
    (h) => html`<li style="padding-left: ${(h.depth - 1) * 0.75}rem">
      <a class="button ghost" href="#${h.id}">${h.text}</a>
    </li>`,
  );
  return html`<menu>${items}</menu>` as HtmlEscapedString;
}

function layout(
  cfg: DocsConfig,
  base: string,
  pages: Page[],
  page: Page,
  content: string,
): HtmlEscapedString {
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${page.title} — ${cfg.title}</title>
        <link
          rel="stylesheet"
          href="https://esm.sh/gh/erikthalen/jazz@v0.1.0-beta.47/jazz.css"
        />
        <style>
          ${raw(style)}
        </style>
      </head>
      <body>
        <div>
          <nav>
            <div>
              <a href="${base}/">
                ${cfg.headline ? html`<pre>${cfg.headline}</pre>` : cfg.title}
              </a>

              ${groupedNav(pages, page.slug, base)}
            </div>
          </nav>
          <main class="prose">${raw(content)}</main>
          <aside>${tocNav(page.headings)}</aside>
        </div>
      </body>
    </html>` as HtmlEscapedString;
}

export function createDocs(cfg: DocsConfig): Hono {
  const pagesDir = cfg.pagesDir ?? `${process.cwd()}/pages`;
  const base = cfg.baseUrl ? `/${cfg.baseUrl.replace(/^\/|\/$/g, "")}` : "";
  const pages = scanPages(pagesDir);
  const app = new Hono();
  (app as any)._base = base;

  for (const page of pages) {
    const routePath = page.slug === "" ? "/" : `${base}/${page.slug}`;
    app.get(routePath, async (c) => {
      const content = await marked.parse(page.content);
      return c.html(layout(cfg, base, pages, page, content));
    });
  }

  return app;
}
