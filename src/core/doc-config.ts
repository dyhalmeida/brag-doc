import { parse } from "yaml";
import type { DocConfig } from "./site.js";

export type ParseDocConfigResult = { ok: true; docConfig: DocConfig } | { ok: false; reason: string };

const SHOW_KEYS = ["metrics", "dates", "company", "links"] as const;

export function parseDocConfig(slug: string, yamlText: string): ParseDocConfigResult {
  let raw: unknown;
  try {
    raw = parse(yamlText);
  } catch (error) {
    return { ok: false, reason: `YAML inválido: ${(error as Error).message}` };
  }

  if (typeof raw !== "object" || raw === null) {
    return { ok: false, reason: "Documento YAML vazio ou não é um objeto" };
  }
  const doc = raw as Record<string, unknown>;

  const title = doc.title;
  if (typeof title !== "string" || title.trim() === "") {
    return { ok: false, reason: "Campo obrigatório ausente ou inválido: title" };
  }

  const intro = doc.intro;
  if (intro !== undefined && typeof intro !== "string") {
    return { ok: false, reason: "Campo inválido: intro deve ser string" };
  }

  const order = doc.order;
  if (order !== "newest" && order !== "oldest") {
    return { ok: false, reason: 'Campo obrigatório ausente ou inválido: order (deve ser "newest" ou "oldest")' };
  }

  if (typeof doc.show !== "object" || doc.show === null) {
    return { ok: false, reason: "Campo obrigatório ausente: show" };
  }
  const rawShow = doc.show as Record<string, unknown>;

  const missingShowKey = SHOW_KEYS.find((key) => typeof rawShow[key] !== "boolean");
  if (missingShowKey) {
    return { ok: false, reason: `Campo obrigatório ausente ou inválido: show.${missingShowKey} (deve ser booleano)` };
  }
  const [metrics, dates, company, links] = SHOW_KEYS.map((key) => rawShow[key] as boolean);

  return {
    ok: true,
    docConfig: { slug, title, intro, order, show: { metrics, dates, company, links } },
  };
}
