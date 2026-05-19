"use client";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, icon, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "text-white shadow-sm hover:opacity-90",
      secondary: "text-white shadow-sm hover:opacity-90",
      outline: "bg-white hover:bg-[#F3F3F3]",
      ghost: "hover:bg-[#F3F3F3]",
      danger: "text-white shadow-sm hover:opacity-90",
    };

    const variantStyles: Record<string, React.CSSProperties> = {
      primary: { backgroundColor: "#0176D3", color: "white" },
      secondary: { backgroundColor: "#032D60", color: "white" },
      outline: { border: "1px solid #DDDBDA", color: "#181818" },
      ghost: { color: "#181818" },
      danger: { backgroundColor: "#EA001E", color: "white" },
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        style={{ ...variantStyles[variant], ...(props.style || {}) }}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
