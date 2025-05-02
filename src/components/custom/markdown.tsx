import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkEmoji from "remark-emoji";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";

export function Markdown({ children }: { children?: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
    >
      {children?.replaceAll("\\times", "&times;").replaceAll("\\div", "&div;")}
    </ReactMarkdown>
  );
}
