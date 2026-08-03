import { escapeHtml } from "./html-escape.js";
import { renderMarkdown } from "./markdown.js";
import type { DashboardModel, DashboardWin } from "./site.js";

export function renderDashboardHtml(dashboard: DashboardModel): string {
  const jobs = distinctSorted(dashboard.wins.map((win) => win.job).filter(isDefined));
  const tags = distinctSorted(dashboard.wins.flatMap((win) => win.tags));
  const periods = distinctSorted(dashboard.wins.map((win) => win.period));

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Todos os Wins</title>
<style>${STYLE}</style>
</head>
<body>
<h1>Todos os Wins</h1>
<div class="filters">
<input type="search" id="search" placeholder="Buscar...">
${renderSelect("filter-job", "Job", jobs)}
${renderSelect("filter-tag", "Tag", tags)}
${renderSelect("filter-period", "Período", periods)}
</div>
<p id="empty-state" class="empty-state" hidden>Nenhum Win encontrado.</p>
<ul class="wins" id="wins">
${dashboard.wins.map(renderWin).join("\n")}
</ul>
<script>${SCRIPT}</script>
</body>
</html>
`;
}

function renderSelect(id: string, label: string, options: string[]): string {
  return `<select id="${id}">
<option value="">${escapeHtml(label)}: todos</option>
${options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("\n")}
</select>`;
}

function renderWin(win: DashboardWin): string {
  const searchText = [win.title, win.details, win.impactMetric, win.job, ...win.tags, ...win.brags]
    .filter(isDefined)
    .join(" ")
    .toLowerCase();

  return `<li class="win" data-job="${escapeHtml(win.job ?? "")}" data-tags="${escapeHtml(win.tags.join("|"))}" data-period="${escapeHtml(win.period)}" data-search="${escapeHtml(searchText)}">
<h2>${escapeHtml(win.title)}</h2>
<p class="meta">${escapeHtml(win.date)}${win.job ? ` &middot; ${escapeHtml(win.job)}` : ""} &middot; ${escapeHtml(win.period)}</p>
${win.impactMetric ? `<p class="impact-metric">${escapeHtml(win.impactMetric)}</p>` : ""}
${win.details ? `<div class="details">${renderMarkdown(win.details)}</div>` : ""}
${win.tags.length > 0 ? `<ul class="tags">${win.tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>` : ""}
${win.links.length > 0 ? `<ul class="links">${win.links.map(renderLink).join("")}</ul>` : ""}
${renderBrags(win.brags)}
<a class="issue-link" href="${escapeHtml(win.issueUrl)}">#${win.issueNumber}</a>
</li>`;
}

function renderLink(link: string): string {
  return `<li><a href="${escapeHtml(link)}">${escapeHtml(link)}</a></li>`;
}

function renderBrags(brags: string[]): string {
  if (brags.length === 0) {
    return `<p class="brags brags-empty">Ainda não curado em nenhum Brag Doc</p>`;
  }
  return `<ul class="brags">${brags.map((slug) => `<li>${escapeHtml(slug)}</li>`).join("")}</ul>`;
}

function distinctSorted(values: string[]): string[] {
  return [...new Set(values)].sort();
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

const SCRIPT = `
(function () {
  var search = document.getElementById("search");
  var jobFilter = document.getElementById("filter-job");
  var tagFilter = document.getElementById("filter-tag");
  var periodFilter = document.getElementById("filter-period");
  var wins = Array.prototype.slice.call(document.querySelectorAll("#wins .win"));
  var emptyState = document.getElementById("empty-state");

  function apply() {
    var query = search.value.trim().toLowerCase();
    var job = jobFilter.value;
    var tag = tagFilter.value;
    var period = periodFilter.value;
    var visibleCount = 0;

    wins.forEach(function (win) {
      var matchesSearch = query === "" || win.dataset.search.indexOf(query) !== -1;
      var matchesJob = job === "" || win.dataset.job === job;
      var matchesTag = tag === "" || win.dataset.tags.split("|").indexOf(tag) !== -1;
      var matchesPeriod = period === "" || win.dataset.period === period;
      var visible = matchesSearch && matchesJob && matchesTag && matchesPeriod;
      win.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    emptyState.hidden = visibleCount !== 0;
  }

  search.addEventListener("input", apply);
  jobFilter.addEventListener("change", apply);
  tagFilter.addEventListener("change", apply);
  periodFilter.addEventListener("change", apply);
  apply();
})();
`;

const STYLE = `
body { font-family: system-ui, sans-serif; max-width: 42rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; }
.filters { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1rem; }
.filters input, .filters select { font: inherit; padding: 0.3rem 0.5rem; }
.empty-state { color: #666; }
.wins { list-style: none; padding: 0; }
.win { border-top: 1px solid #ddd; padding: 1rem 0; }
.win h2 { margin-bottom: 0.25rem; }
.meta { color: #666; font-size: 0.9rem; }
.details p:first-child { margin-top: 0; }
.tags { display: flex; gap: 0.5rem; padding: 0; list-style: none; }
.tags li { background: #eee; border-radius: 999px; padding: 0.1rem 0.6rem; font-size: 0.8rem; }
.brags { display: flex; gap: 0.5rem; padding: 0; list-style: none; margin-top: 0.5rem; }
.brags li { background: #dbeafe; border-radius: 999px; padding: 0.1rem 0.6rem; font-size: 0.8rem; }
.brags-empty { font-size: 0.8rem; color: #999; margin-top: 0.5rem; }
`;
