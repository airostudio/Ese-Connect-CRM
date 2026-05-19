"use client";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "purple";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-[#F3F3F3] text-[#706E6B]",
    success: "bg-[#E3F5E1] text-[#2E844A]",
    warning: "bg-[#FEF4D0] text-[#7A5600]",
    danger: "bg-[#FEDED9] text-[#BA0517]",
    info: "bg-[#D8EDFF] text-[#0176D3]",
    purple: "bg-[#F0E6FF] text-[#5A08A5]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
