import { escapeHtml } from "./html-escape.js";
import type { ReportsModel } from "./reports.js";

export function renderReportsHtml(reports: ReportsModel): string {
  const periods = distinctSorted(reports.wins.map((win) => win.period));
  const jobs = distinctSorted(reports.wins.map((win) => win.job).filter(isDefined));
  const tags = distinctSorted(reports.wins.flatMap((win) => win.tags));

  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Reports</title>
<style>${STYLE}</style>
</head>
<body>
<h1>Reports</h1>
<div class="filters">
${renderSelect("filter-period", "Período", periods)}
${renderSelect("filter-job", "Job", jobs)}
${renderSelect("filter-tag", "Tag", tags)}
</div>
${renderSection("Por Período", "by-period")}
${renderSection("Por Tag", "by-tag")}
${renderSection("Por Job", "by-job")}
<ul id="wins-data" hidden>
${reports.wins.map(renderWinMarker).join("\n")}
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

function renderSection(title: string, id: string): string {
  return `<section>
<h2>${escapeHtml(title)}</h2>
<ul id="${id}"></ul>
</section>`;
}

function renderWinMarker(win: ReportsModel["wins"][number]): string {
  return `<li data-period="${escapeHtml(win.period)}" data-job="${escapeHtml(win.job ?? "")}" data-tags="${escapeHtml(win.tags.join("|"))}"></li>`;
}

function distinctSorted(values: string[]): string[] {
  return [...new Set(values)].sort();
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

const SCRIPT = `
(function () {
  var periodFilter = document.getElementById("filter-period");
  var jobFilter = document.getElementById("filter-job");
  var tagFilter = document.getElementById("filter-tag");
  var markers = Array.prototype.slice.call(document.querySelectorAll("#wins-data li"));
  var byPeriodList = document.getElementById("by-period");
  var byTagList = document.getElementById("by-tag");
  var byJobList = document.getElementById("by-job");

  function countBy(values) {
    var counts = {};
    values.forEach(function (value) {
      counts[value] = (counts[value] || 0) + 1;
    });
    return Object.keys(counts)
      .sort()
      .map(function (key) {
        return { key: key, count: counts[key] };
      });
  }

  function renderCounts(list, counts) {
    list.textContent = "";
    counts.forEach(function (entry) {
      var item = document.createElement("li");
      item.textContent = entry.key + ": " + entry.count;
      list.appendChild(item);
    });
  }

  function apply() {
    var period = periodFilter.value;
    var job = jobFilter.value;
    var tag = tagFilter.value;

    var matched = markers.filter(function (marker) {
      var matchesPeriod = period === "" || marker.dataset.period === period;
      var matchesJob = job === "" || marker.dataset.job === job;
      var tags = marker.dataset.tags === "" ? [] : marker.dataset.tags.split("|");
      var matchesTag = tag === "" || tags.indexOf(tag) !== -1;
      return matchesPeriod && matchesJob && matchesTag;
    });

    renderCounts(byPeriodList, countBy(matched.map(function (marker) { return marker.dataset.period; })));
    renderCounts(
      byJobList,
      countBy(
        matched
          .map(function (marker) { return marker.dataset.job; })
          .filter(function (job) { return job !== ""; }),
      ),
    );
    renderCounts(
      byTagList,
      countBy(
        matched.reduce(function (acc, marker) {
          return acc.concat(marker.dataset.tags === "" ? [] : marker.dataset.tags.split("|"));
        }, []),
      ),
    );
  }

  periodFilter.addEventListener("change", apply);
  jobFilter.addEventListener("change", apply);
  tagFilter.addEventListener("change", apply);
  apply();
})();
`;

const STYLE = `
body { font-family: system-ui, sans-serif; max-width: 42rem; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; }
.filters { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
.filters select { font: inherit; padding: 0.3rem 0.5rem; }
section { margin-bottom: 1.5rem; }
section ul { list-style: none; padding: 0; }
section li { border-top: 1px solid #ddd; padding: 0.4rem 0; }
`;
