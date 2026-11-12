import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  size?: "default" | "narrow";
}

const sizes = {
  default: "max-w-[1200px]",
  narrow: "max-w-3xl",
} as const;

export function Container({ as, className, children, size = "default" }: ContainerProps) {
  const Tag = as ?? "div";
  return (
    <Tag className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)}>
      {children}
    </Tag>
  );
}
