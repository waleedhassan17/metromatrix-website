import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
// primary: MetroMatrix Green. secondary: outlined (brand rule for secondary actions).
// Both read the scoped tokens, so they work on ivory and on the ink bands.
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Icon rendered after the label. */
  trailing?: ReactNode;
  /** Icon rendered before the label. */
  leading?: ReactNode;
  fullWidth?: boolean;
}

interface LinkButtonProps extends BaseProps {
  href: string;
  external?: boolean;
  onClick?: never;
  type?: never;
  disabled?: never;
}

interface NativeButtonProps
  extends
    BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> {
  href?: never;
  external?: never;
}

export type ButtonProps = LinkButtonProps | NativeButtonProps;

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full whitespace-nowrap transition-[background-color,color,border-color] duration-200 ease-out-soft select-none disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-[#04684b]",
  secondary: "border border-line-strong text-ink hover:border-ink/40 hover:bg-ink/5",
  ghost: "text-ink hover:bg-ink/5",
  inverse: "bg-white text-dark hover:bg-ivory",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-label-md",
  md: "h-11 px-5 text-label-lg",
  lg: "h-12 px-6 text-label-lg",
};

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    trailing,
    leading,
    fullWidth,
  } = props;
  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );
  const content = (
    <>
      {leading}
      <span>{children}</span>
      {trailing}
    </>
  );

  if ("href" in props && props.href !== undefined) {
    if (props.external) {
      return (
        <a
          href={props.href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={props.href} className={classes}>
        {content}
      </Link>
    );
  }

  const {
    href: _href,
    external: _external,
    variant: _variant,
    size: _size,
    className: _className,
    children: _children,
    trailing: _trailing,
    leading: _leading,
    fullWidth: _fullWidth,
    type = "button",
    ...rest
  } = props as NativeButtonProps;
  return (
    <button type={type} className={classes} {...rest}>
      {content}
    </button>
  );
}
