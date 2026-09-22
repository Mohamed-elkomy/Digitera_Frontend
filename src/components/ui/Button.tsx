import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "gold";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClassName: Record<ButtonVariant, string> = {
  primary:
    "bg-inverse text-on-inverse hover:opacity-90 active:scale-[0.99] disabled:bg-[#b8b2aa]",
  secondary:
    "border border-line bg-surface text-ink hover:border-ink hover:bg-shell disabled:text-[#b8b2aa]",
  ghost: "text-muted hover:bg-shell hover:text-ink disabled:text-[#b8b2aa]",
  gold: "bg-gold text-[#faf8f5] hover:bg-[#b8996f] active:scale-[0.99] disabled:bg-[#d8c7ad]",
};

const sizeClassName: Record<ButtonSize, string> = {
  sm: "px-3 py-2 text-[11px]",
  md: "px-4 py-3 text-[12px]",
  lg: "px-6 py-4 text-[13px]",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded font-semibold tracking-wide uppercase",
        "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "disabled:cursor-not-allowed disabled:active:scale-100",
        variantClassName[variant],
        sizeClassName[size],
        className,
      )}
      {...props}
    />
  );
}
