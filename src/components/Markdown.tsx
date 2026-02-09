import { Link } from "@/navigation";
import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const linkRe = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRe.exec(text)) !== null) {
    const [full, label, href] = match;
    const start = match.index;
    if (start > lastIndex) nodes.push(text.slice(lastIndex, start));
    const key = `${start}-${href}`;
    if (href.startsWith("/")) {
      nodes.push(
        <Link key={key} href={href} className="underline underline-offset-4">
          {label}
        </Link>,
      );
    } else {
      nodes.push(
        <a
          key={key}
          href={href}
          className="underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          {label}
        </a>,
      );
    }
    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

type Block =
  | { kind: "h"; level: 1 | 2 | 3; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "code"; lang: string | null; code: string };

function parseBlocks(markdown: string): Block[] {
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const blocks: Block[] = [];

  let i = 0;
  while (i < lines.length) {
    const raw = lines[i];
    const line = raw.trimEnd();

    if (line.trim().length === 0) {
      i += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || null;
      i += 1;
      const codeLines: string[] = [];
      while (i < lines.length && !lines[i].trimEnd().startsWith("```")) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push({ kind: "code", lang, code: codeLines.join("\n") });
      continue;
    }

    const h1 = /^# (.+)$/.exec(line);
    const h2 = /^## (.+)$/.exec(line);
    const h3 = /^### (.+)$/.exec(line);
    if (h1) {
      blocks.push({ kind: "h", level: 1, text: h1[1] });
      i += 1;
      continue;
    }
    if (h2) {
      blocks.push({ kind: "h", level: 2, text: h2[1] });
      i += 1;
      continue;
    }
    if (h3) {
      blocks.push({ kind: "h", level: 3, text: h3[1] });
      i += 1;
      continue;
    }

    if (/^- /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^- /.test(lines[i].trimEnd())) {
        items.push(lines[i].trimEnd().slice(2));
        i += 1;
      }
      blocks.push({ kind: "ul", items });
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i].trimEnd())) {
        items.push(lines[i].trimEnd().replace(/^\d+\. /, ""));
        i += 1;
      }
      blocks.push({ kind: "ol", items });
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim().length > 0 &&
      !lines[i].trimEnd().startsWith("```") &&
      !/^# /.test(lines[i].trimEnd()) &&
      !/^## /.test(lines[i].trimEnd()) &&
      !/^### /.test(lines[i].trimEnd()) &&
      !/^- /.test(lines[i].trimEnd()) &&
      !/^\d+\. /.test(lines[i].trimEnd())
    ) {
      paraLines.push(lines[i].trimEnd());
      i += 1;
    }
    blocks.push({ kind: "p", text: paraLines.join(" ") });
  }

  return blocks;
}

export function Markdown({ content }: { content: string }) {
  const blocks = parseBlocks(content);
  return (
    <div className="prose prose-neutral max-w-none prose-headings:tracking-tight prose-headings:text-black/85 prose-p:text-black/75 prose-li:text-black/70 dark:prose-headings:text-white/85 dark:prose-p:text-white/75 dark:prose-li:text-white/70">
      {blocks.map((b, idx) => {
        const key = `${b.kind}-${idx}`;
        if (b.kind === "h") {
          if (b.level === 1) return <h1 key={key}>{renderInline(b.text)}</h1>;
          if (b.level === 2) return <h2 key={key}>{renderInline(b.text)}</h2>;
          return <h3 key={key}>{renderInline(b.text)}</h3>;
        }
        if (b.kind === "p") return <p key={key}>{renderInline(b.text)}</p>;
        if (b.kind === "ul")
          return (
            <ul key={key}>
              {b.items.map((it, j) => (
                <li key={`${key}-${j}`}>{renderInline(it)}</li>
              ))}
            </ul>
          );
        if (b.kind === "ol")
          return (
            <ol key={key}>
              {b.items.map((it, j) => (
                <li key={`${key}-${j}`}>{renderInline(it)}</li>
              ))}
            </ol>
          );
        const className = b.lang ? `language-${b.lang}` : undefined;
        return (
          <pre key={key}>
            <code className={className}>{b.code}</code>
          </pre>
        );
      })}
    </div>
  );
}
