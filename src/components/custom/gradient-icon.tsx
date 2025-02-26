import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { renderToString } from "react-dom/server";

const GradientIcon = ({
  className,
  icon: Icon,
  strokeWidth,
}: {
  className?: string;
  icon: LucideIcon;
  strokeWidth?: number | string;
}) => {
  const logoSVG = encodeURIComponent(
    renderToString(<Icon strokeWidth={strokeWidth ?? 1} />)
  );
  return (
    <div
      className={cn("w-full h-full", className)}
      style={{
        maskImage: `url('data:image/svg+xml;charset=UTF-8,${logoSVG}')`,
        WebkitMaskImage: `url('data:image/svg+xml;charset=UTF-8,${logoSVG}')`,
        maskSize: "cover",
        WebkitMaskSize: "cover",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    />
  );
};

export default GradientIcon;
