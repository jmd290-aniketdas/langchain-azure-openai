import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { Feather } from "lucide-react";

const logoVariants = cva("rounded transition-colors flex [&_svg]:flex-1 [&_svg]:h-full [&_svg]:aspect-square", {
  variants: {
    variant: {
      default:
        "bg-sidebar-primary stroke-primary-foreground text-primary-foreground p-1",
      outline:
        "bg-transparent border-[1px] stroke-primary text-primary p-[3px]",
      ghost: "bg-transparent stroke-primary text-primary p-1",
    },
    size: {
      default: "w-full aspect-square",
      icon: "size-8 aspect-square",
      lg: "size-10 aspect-square",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const Logo = ({
  className,
  variant,
  size,
}: { className?: string } & VariantProps<typeof logoVariants>) => {
  return (
    <span className={cn(logoVariants({ variant, size, className }))}>
      <Feather />
    </span>
  );
};

export default Logo;
