import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// Single source of truth for how post Markdown renders — used by both the public
// blog article and the admin editor's live preview, so they always match.
//
// remark-gfm  → tables, strikethrough, task lists, autolinks.
// rehype-raw  → lets trusted admin-authored HTML through (YouTube <iframe> embeds,
//               etc.). Content is authored only in the protected admin, so raw
//               HTML is acceptable here.
const COMPONENTS: Components = {
  h2: (props) => <h2 className="mt-8 font-display text-2xl font-semibold" {...props} />,
  h3: (props) => <h3 className="mt-6 text-xl font-semibold" {...props} />,
  p: (props) => <p className="text-muted-foreground" {...props} />,
  ul: (props) => <ul className="list-disc space-y-1 pl-6 text-muted-foreground" {...props} />,
  ol: (props) => <ol className="list-decimal space-y-1 pl-6 text-muted-foreground" {...props} />,
  a: (props) => <a className="text-primary underline" target="_blank" rel="noopener noreferrer" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-2 border-primary/60 pl-4 italic text-muted-foreground" {...props} />
  ),
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  img: (props) => <img loading="lazy" className="my-6 w-full rounded-xl border border-border" {...props} />,
  code: ({ className, ...props }) => {
    const isBlock = (className ?? "").includes("language-");
    return isBlock ? (
      <code className={`${className ?? ""} font-mono text-sm`} {...props} />
    ) : (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]" {...props} />
    );
  },
  pre: (props) => (
    <pre className="my-5 overflow-x-auto rounded-xl border border-border bg-muted/50 p-4 text-sm" {...props} />
  ),
  table: (props) => (
    <div className="my-5 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => <th className="border border-border bg-muted/40 px-3 py-2 text-left font-semibold" {...props} />,
  td: (props) => <td className="border border-border px-3 py-2 text-muted-foreground" {...props} />,
};

export function MarkdownContent({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={COMPONENTS}>
      {children}
    </ReactMarkdown>
  );
}
