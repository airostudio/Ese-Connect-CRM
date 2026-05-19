"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  TrendingUp,
  KanbanSquare,
  CheckSquare,
  Activity,
  Mail,
  BarChart3,
  Sparkles,
  Settings,
  LogOut,
  Cloud,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/companies", label: "Companies", icon: Building2 },
  { href: "/deals", label: "Deals", icon: TrendingUp },
  { href: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/activities", label: "Activities", icon: Activity },
  { href: "/emails", label: "Emails", icon: Mail },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/ai-assistant", label: "AI Assistant", icon: Sparkles },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-40" style={{ backgroundColor: "#032D60" }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-4 border-b" style={{ borderColor: "#16325C" }}>
        <div className="flex items-center justify-center h-9 w-9 rounded-lg" style={{ backgroundColor: "#0176D3" }}>
          <Cloud className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Ese Connect</p>
          <p className="text-xs" style={{ color: "#8DB0D4" }}>CRM Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const isAI = item.href === "/ai-assistant";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150",
                isActive
                  ? "text-white"
                  : "hover:text-white"
              )}
              style={
                isActive
                  ? { backgroundColor: "#0176D3" }
                  : { color: "#8DB0D4" }
              }
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "#16325C";
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              }}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isAI && (
                <span className="text-xs text-white px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: "#1B96FF" }}>
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t space-y-1" style={{ borderColor: "#16325C" }}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-md" style={{ backgroundColor: "#16325C" }}>
          <div className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#0176D3" }}>
            <span className="text-white text-xs font-bold">EC</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">Ese Connect</p>
            <p className="text-xs truncate" style={{ color: "#8DB0D4" }}>CRM</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all"
          style={{ color: "#8DB0D4" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "#16325C";
            (e.currentTarget as HTMLElement).style.color = "#EA001E";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#8DB0D4";
          }}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
