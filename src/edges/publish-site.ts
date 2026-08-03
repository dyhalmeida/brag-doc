import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseDocConfig } from "../core/doc-config.js";
import { findLeaks } from "../core/publish-guard.js";
import { renderDocHtml } from "../core/render.js";
import { buildSite, type DocConfig } from "../core/site.js";
import { loadWins } from "./github-issues.js";

const DOC_CONFIG_DIR = "docs/brag";
const OUTPUT_DIR = "public";

function loadDocConfigs(): DocConfig[] {
  let files: string[];
  try {
    files = readdirSync(DOC_CONFIG_DIR).filter((file) => file.endsWith(".yml"));
  } catch {
    return [];
  }

  return files.map((file) => {
    const slug = file.replace(/\.yml$/, "");
    const yamlText = readFileSync(path.join(DOC_CONFIG_DIR, file), "utf8");
    const result = parseDocConfig(slug, yamlText);
    if (!result.ok) {
      throw new Error(`${DOC_CONFIG_DIR}/${file}: ${result.reason}`);
    }
    return result.docConfig;
  });
}

function main(): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const docConfigs = loadDocConfigs();
  if (docConfigs.length === 0) {
    console.log(`Nenhum ${DOC_CONFIG_DIR}/*.yml encontrado — nada para publicar.`);
    return;
  }

  const wins = loadWins();
  const site = buildSite(wins, docConfigs);

  const leaks = findLeaks(wins, site);
  if (leaks.length > 0) {
    const details = leaks.map((leak) => `issue #${leak.issueNumber} no doc "${leak.slug}"`).join(", ");
    throw new Error(`Guard anti-vazamento: Win(s) publicado(s) sem o label brag:* correspondente: ${details}`);
  }

  for (const doc of site.docs) {
    const docDir = path.join(OUTPUT_DIR, doc.slug);
    mkdirSync(docDir, { recursive: true });
    writeFileSync(path.join(docDir, "index.html"), renderDocHtml(doc));
    console.log(`Publicado: ${docDir}/index.html (${doc.wins.length} win(s))`);
  }
}

main();
