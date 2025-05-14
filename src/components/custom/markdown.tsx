import { cn, copyToClipboard } from "@/lib/utils";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import React, { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { toast } from "sonner";
import { Button } from "../ui/button";

const MemoizedReactMarkdown = memo(ReactMarkdown, (prevProps, nextProps) => prevProps.children === nextProps.children);

export function Markdown({ children }: { children: string }) {
  return (
    <ErrorBoundary errorComponent={undefined}>
      <MemoizedReactMarkdown
        components={{
          pre: CustomPre,
          ol: ({ node, className, ...props }) => <ol className={cn("list-decimal list-outside ml-4", className)} {...props} />,
          li: ({ node, className, ...props }) => <li className={cn("py-1", className)} {...props} />,
          ul: ({ node, className, ...props }) => <ul className={cn("list-disc list-outside ml-4", className)} {...props} />,
          strong: ({ node, className, ...props }) => <span className={cn("font-semibold", className)} {...props} />,
          a: ({ node, className, ...props }) => (
            <a className={cn("hover:underline", className)} target="_blank" rel="noreferrer" {...props} />
          ),
        }}
        remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
      >
        {children}
      </MemoizedReactMarkdown>
    </ErrorBoundary>
  );
}

function CustomPre({ children, className, ...props }: React.ComponentProps<"pre">) {
  const { language, codeChunk } = useMemo(() => {
    const childProps = (children as any).props;
    const classNameInternal = childProps?.className || "";
    const match = /language-(\w+)/.exec(classNameInternal);
    return {
      language: match ? match[1] : "plaintext",
      codeChunk: String(childProps.children),
    };
  }, [children]);

  return (
    <pre {...props} className={cn("p-0 pb-2 space-y-2 rounded border max-h-256 overflow-auto w-full text-sm", className)}>
      <section className="bg-muted text-muted-foreground py-1 px-3 flex gap-1 justify-between items-center sticky top-0 z-10">
        <code className="text-xs font-medium m-0">{language}</code>
        <Button
          variant="ghost"
          className="text-xs h-4"
          onClick={() => copyToClipboard(codeChunk).then(() => toast.success("Copied to clipboard"))}
        >
          Copy
        </Button>
      </section>
      <section className="px-3 w-fit">{children}</section>
    </pre>
  );
}
