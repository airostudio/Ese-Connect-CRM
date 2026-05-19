import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Recursively convert snake_case keys to camelCase (for Supabase → frontend)
export function toCamel(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(toCamel);
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        k.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()),
        toCamel(v),
      ])
    );
  }
  return obj;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";
    return format(d, "MMM d, yyyy");
  } catch {
    return "—";
  }
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return "—";
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return "—";
  }
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    lead: "bg-blue-100 text-blue-700",
    prospect: "bg-purple-100 text-purple-700",
    customer: "bg-green-100 text-green-700",
    churned: "bg-red-100 text-red-700",
    active: "bg-emerald-100 text-emerald-700",
    inactive: "bg-gray-100 text-gray-700",
    won: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
  };
  return colors[status.toLowerCase()] || "bg-gray-100 text-gray-700";
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-rose-100 text-rose-700",
  };
  return colors[priority.toLowerCase()] || "bg-gray-100 text-gray-700";
}

export function getStageColor(stage: string): string {
  const colors: Record<string, string> = {
    lead: "bg-blue-500",
    qualified: "bg-violet-500",
    proposal: "bg-amber-500",
    negotiation: "bg-orange-500",
    "closed won": "bg-emerald-500",
    "closed lost": "bg-rose-500",
  };
  return colors[stage.toLowerCase()] || "bg-gray-500";
}

export function getHealthScoreColor(score: number): string {
  if (score >= 70) return "text-emerald-600";
  if (score >= 40) return "text-amber-600";
  return "text-rose-600";
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function generateAvatarColor(name: string): string {
  const colors = [
    "bg-indigo-500",
    "bg-violet-500",
    "bg-pink-500",
    "bg-emerald-500",
    "bg-amber-500",
    "bg-sky-500",
    "bg-rose-500",
    "bg-teal-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function calculateDaysInStage(lastActivityAt: Date | string | null | undefined): number {
  if (!lastActivityAt) return 0;
  const last = new Date(lastActivityAt);
  if (isNaN(last.getTime())) return 0;
  const diffTime = Math.abs(new Date().getTime() - last.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isRottingDeal(lastActivityAt: Date | string | null | undefined, threshold = 14): boolean {
  if (!lastActivityAt) return false;
  return calculateDaysInStage(lastActivityAt) > threshold;
}
