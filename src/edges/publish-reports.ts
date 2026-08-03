import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { renderReportsHtml } from "../core/render-reports.js";
import { buildSite } from "../core/site.js";
import { loadWins } from "./github-issues.js";

const OUTPUT_DIR = ".local";
const OUTPUT_FILE = "reports.html";

function openInBrowser(absolutePath: string): void {
  try {
    if (process.platform === "darwin") {
      execFileSync("open", [absolutePath]);
    } else if (process.platform === "win32") {
      execFileSync("cmd", ["/c", "start", "", absolutePath]);
    } else {
      execFileSync("xdg-open", [absolutePath]);
    }
  } catch {
    console.log(`Abra manualmente: ${absolutePath}`);
  }
}

function main(): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const wins = loadWins();
  const reports = buildSite(wins, []).reports;

  const outputPath = path.join(OUTPUT_DIR, OUTPUT_FILE);
  writeFileSync(outputPath, renderReportsHtml(reports));

  const absolutePath = path.resolve(outputPath);
  console.log(`Reports gerado: ${absolutePath} (${reports.wins.length} win(s))`);
  openInBrowser(absolutePath);
}

main();
