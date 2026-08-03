import { Marked } from "marked";
import { escapeHtml } from "./html-escape.js";

const SAFE_URL_PATTERN = /^(https?:|mailto:)/i;

const marked = new Marked({
  breaks: true,
  renderer: {
    html() {
      return "";
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      if (!SAFE_URL_PATTERN.test(href.trim())) {
        return text;
      }
      const titleAttr = title ? ` title="${escapeHtml(title)}"` : "";
      return `<a href="${escapeHtml(href)}"${titleAttr}>${text}</a>`;
    },
  },
});

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown, { async: false });
}
