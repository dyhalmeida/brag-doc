import { escapeHtml } from "./html-escape.js";
import { renderMarkdown } from "./markdown.js";
import type { DocModel, DocModelWin } from "./site.js";

export function renderDocHtml(doc: DocModel): string {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(doc.title)}</title>
<style>${STYLE}</style>
</head>
<body>
<h1>${escapeHtml(doc.title)}</h1>
${doc.intro ? `<p class="intro">${escapeHtml(doc.intro)}</p>` : ""}
<ul class="wins">
${doc.wins.map(renderWin).join("\n")}
</ul>
</body>
</html>
`;
}

function renderWin(win: DocModelWin): string {
  return `<li class="win">
<h2>${escapeHtml(win.title)}</h2>
${renderMeta(win)}
${win.impactMetric ? `<p class="impact-metric">${escapeHtml(win.impactMetric)}</p>` : ""}
${win.details ? `<div class="details">${renderMarkdown(win.details)}</div>` : ""}
${win.tags.length > 0 ? `<ul class="tags">${win.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>` : ""}
${win.links.length > 0 ? `<ul class="links">${win.links.map(renderLink).join("")}</ul>` : ""}
<a class="issue-link" href="${escapeHtml(win.issueUrl)}">#${win.issueNumber}</a>
</li>`;
}

function renderMeta(win: DocModelWin): string {
  const parts = [win.date, win.job].filter((value): value is string => Boolean(value));
  if (parts.length === 0) return "";
  return `<p class="meta">${parts.map(escapeHtml).join(" &middot; ")}</p>`;
}

function renderLink(link: string): string {
  return `<li><a href="${escapeHtml(link)}">${escapeHtml(link)}</a></li>`;
}

const STYLE = `
body { font-family: system-ui, sans-serif; max-width: 42rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; }
.intro { color: #444; }
.wins { list-style: none; padding: 0; }
.win { border-top: 1px solid #ddd; padding: 1rem 0; }
.win h2 { margin-bottom: 0.25rem; }
.meta { color: #666; font-size: 0.9rem; }
.details p:first-child { margin-top: 0; }
.tags { display: flex; gap: 0.5rem; padding: 0; list-style: none; }
.tags li { background: #eee; border-radius: 999px; padding: 0.1rem 0.6rem; font-size: 0.8rem; }

@page {
  margin: 2cm;
}

@media print {
  body { max-width: none; margin: 0; padding: 0; font-size: 11pt; color: #000; }
  .intro { color: #222; }
  .win { border-top-color: #999; page-break-inside: avoid; }
  h1, h2 { page-break-after: avoid; }
  a { color: #000; text-decoration: underline; overflow-wrap: break-word; }
  .tags li { background: #eee; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .issue-link { display: none; }
}
`;
