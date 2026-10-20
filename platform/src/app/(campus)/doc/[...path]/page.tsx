import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { allModules, loadCurriculum, readDoc } from "@/lib/curriculum";
import { logActivity } from "@/lib/db";

const GITHUB_BLOB = process.env.GITHUB_BLOB_URL ?? "https://github.com/goksche/agentic-ai-journey/blob/main";

export default async function DocPage({ params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const rel = path.posix.normalize(parts.map(decodeURIComponent).join("/"));
  if (rel.startsWith("..") || rel.startsWith("/")) notFound();
  const source = readDoc(rel);
  if (source === null) notFound();

  logActivity("doc_opened", rel);
  const owner = allModules(loadCurriculum()).find((m) => [m.skript, m.aufgaben, m.quiz].includes(rel));
  const baseDir = path.posix.dirname(rel);

  const components: Components = {
    a({ href, children, ...rest }) {
      if (!href) return <a {...rest}>{children}</a>;
      if (/^[a-z]+:/i.test(href) || href.startsWith("#")) {
        const external = /^https?:/i.test(href);
        return (
          <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
            {children}
          </a>
        );
      }
      const [target, hash] = href.split("#");
      const resolved = path.posix.normalize(path.posix.join(baseDir, target));
      if (resolved.startsWith("..")) return <span>{children}</span>;
      if (resolved.endsWith(".md")) {
        return <Link href={`/doc/${resolved}${hash ? `#${hash}` : ""}`}>{children}</Link>;
      }
      return (
        <a href={`${GITHUB_BLOB}/${resolved}`} target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    },
  };

  return (
    <>
      <p className="crumbs">
        <Link href="/">Übersicht</Link>
        {owner && (
          <>
            {" / "}
            <Link href={`/modul/${owner.id}`}>
              {owner.project ? owner.title : `Modul ${owner.id}`}
            </Link>
          </>
        )}
      </p>
      <div className="doc-meta">
        <span>{rel}</span>
        <a href={`${GITHUB_BLOB}/${rel}`} target="_blank" rel="noreferrer">
          Auf GitHub ansehen
        </a>
      </div>
      <article className="doc">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSlug]} components={components}>
          {source}
        </ReactMarkdown>
      </article>
    </>
  );
}
