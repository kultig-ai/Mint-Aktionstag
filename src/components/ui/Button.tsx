import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-base font-semibold " +
  "transition-transform duration-150 active:scale-[0.97] select-none " +
  "min-h-12 cursor-pointer";

const variants = {
  primary:
    "bg-accent text-accent-contrast shadow-lg shadow-accent/25 hover:brightness-110",
  secondary:
    "glass text-foreground hover:bg-[var(--glass-bg-strong)]",
  ghost:
    "text-foreground hover:bg-[var(--glass-bg)]",
} as const;

type Variant = keyof typeof variants;

export function Button({
  variant = "primary",
  className = "",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...rest} />;
}

export function LinkButton({
  variant = "primary",
  className = "",
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return <a className={`${base} ${variants[variant]} ${className}`} {...rest} />;
}
