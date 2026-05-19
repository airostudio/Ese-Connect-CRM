"use client";
import { cn, formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconBg: string;
  prefix?: string;
  suffix?: string;
  isCurrency?: boolean;
}

export function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon,
  iconBg,
  prefix,
  suffix,
  isCurrency,
}: KPICardProps) {
  const isPositive = change !== undefined && change >= 0;

  const displayValue = isCurrency && typeof value === "number"
    ? formatCurrency(value)
    : `${prefix || ""}${value}${suffix || ""}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 tracking-tight">
            {displayValue}
          </p>
          {change !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              {isPositive ? (
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
              )}
              <span
                className={cn(
                  "text-xs font-medium",
                  isPositive ? "text-emerald-600" : "text-rose-600"
                )}
              >
                {isPositive ? "+" : ""}{change}%
              </span>
              {changeLabel && (
                <span className="text-xs text-slate-500">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconBg)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
