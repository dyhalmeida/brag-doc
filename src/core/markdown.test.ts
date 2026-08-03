import { describe, expect, it } from "vitest";
import { renderMarkdown } from "./markdown.js";

describe("renderMarkdown", () => {
  it("renders standard markdown formatting", () => {
    const html = renderMarkdown("Migramos o **pipeline** de CI e paralelizamos os testes.");

    expect(html).toContain("<strong>pipeline</strong>");
  });

  it("renders a markdown link as an anchor", () => {
    const html = renderMarkdown("Veja o [PR](https://github.com/acme/repo/pull/123).");

    expect(html).toContain('<a href="https://github.com/acme/repo/pull/123">PR</a>');
  });

  it("renders a markdown list", () => {
    const html = renderMarkdown("- Migrei o pipeline\n- Paralelizei os testes");

    expect(html).toContain("<li>Migrei o pipeline</li>");
    expect(html).toContain("<li>Paralelizei os testes</li>");
  });

  it("strips raw HTML embedded in the markdown instead of passing it through", () => {
    const html = renderMarkdown('<script>alert("xss")</script>\n\nTexto normal.');

    expect(html).not.toContain("<script>");
    expect(html).toContain("Texto normal.");
  });

  it("drops unsafe link schemes, keeping only the link text", () => {
    const html = renderMarkdown('[clique aqui](javascript:alert("xss"))');

    expect(html).not.toContain("<a ");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("clique aqui");
  });

  it("keeps safe http(s) and mailto links", () => {
    expect(renderMarkdown("[site](https://example.com)")).toContain('<a href="https://example.com">site</a>');
    expect(renderMarkdown("[email](mailto:a@b.com)")).toContain('<a href="mailto:a@b.com">email</a>');
  });

  it("treats a single line break as a line break, matching how GitHub renders issue prose", () => {
    const html = renderMarkdown("Linha um.\nLinha dois.");

    expect(html).toContain("Linha um.<br>");
  });
});
