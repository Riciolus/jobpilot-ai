import type { ComponentProps } from "react";
import ReactMarkdown, { type Components } from "react-markdown";

type ReactMarkdownProps = ComponentProps<typeof ReactMarkdown> & {
  className?: string;
};

const Markdown = ({ className, ...props }: ReactMarkdownProps) => (
  <div className={className}>
    <ReactMarkdown {...props} />
  </div>
);

const MarkdownComponents: Components = {
  p: ({ children }) => <p className="mb-4 text-slate-200">{children}</p>,
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),

  // Style headers
  h1: ({ children }) => <h1 className="mb-2 text-2xl font-bold">{children}</h1>,
  h2: ({ children }) => <h2 className="mb-2 text-xl font-bold">{children}</h2>,
  h3: ({ children }) => <h3 className="mb-2 text-sm font-bold">{children}</h3>,

  // Style lists
  ul: ({ children }) => <ul className="mb-2 ml-4 list-disc">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal">{children}</ol>,

  // Style code blocks
  code: ({ children }) => (
    <code className="rounded bg-gray-900 px-1 py-0.5">{children}</code>
  ),

  pre: ({ children }) => (
    <pre className="borde mb-3 rounded-xl border-slate-600 bg-gray-900 p-3">
      {children}
    </pre>
  ),

  // Style blockquotes
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic dark:border-gray-600">
      {children}
    </blockquote>
  ),
};

const MessageContent = ({ content }: { content: string }) => (
  <Markdown
    className="prose dark:prose-invert prose-sm max-w-none text-sm md:text-[14.5px]"
    components={MarkdownComponents}
  >
    {content}
  </Markdown>
);

export default MessageContent;
