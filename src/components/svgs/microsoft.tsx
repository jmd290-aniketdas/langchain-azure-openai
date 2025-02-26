import { cn } from "@/lib/utils";

export const Microsoft = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={cn("size-6", className)}
    >
      <rect
        xmlns="http://www.w3.org/2000/svg"
        x="17"
        y="17"
        width="10"
        height="10"
        fill="currentColor"
      />
      <rect
        xmlns="http://www.w3.org/2000/svg"
        x="5"
        y="17"
        width="10"
        height="10"
        fill="currentColor"
      />
      <rect
        xmlns="http://www.w3.org/2000/svg"
        x="17"
        y="5"
        width="10"
        height="10"
        fill="currentColor"
      />
      <rect
        xmlns="http://www.w3.org/2000/svg"
        x="5"
        y="5"
        width="10"
        height="10"
        fill="currentColor"
      />
    </svg>
  );
};
