"use client";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border",
        hover && "hover:shadow-md transition-shadow duration-200 cursor-pointer",
        className
      )}
      style={{ borderColor: "#DDDBDA", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-5 py-4 border-b", className)} style={{ borderColor: "#DDDBDA" }}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-5 py-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-sm font-semibold", className)} style={{ color: "#181818" }}>
      {children}
    </h3>
  );
}
