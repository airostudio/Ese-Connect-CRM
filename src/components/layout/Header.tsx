"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Search, Bell, Plus, ChevronDown } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/contacts": "Contacts",
  "/companies": "Companies",
  "/deals": "Deals",
  "/pipeline": "Pipeline",
  "/tasks": "Tasks",
  "/activities": "Activities",
  "/emails": "Email",
  "/reports": "Reports & Analytics",
  "/ai-assistant": "AI Assistant",
  "/settings": "Settings",
};

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const pageTitle = Object.entries(pageTitles).find(([path]) =>
    pathname === path || pathname.startsWith(path + "/")
  )?.[1] || "Dashboard";

  const userName = session?.user?.name || "User";

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 z-30">
      {/* Page Title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-slate-900">{pageTitle}</h1>
      </div>

      {/* Search */}
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search contacts, deals..."
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
      </div>

      {/* Quick Add */}
      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
        <Plus className="h-4 w-4" />
        Quick Add
      </button>

      {/* Notifications */}
      <button className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors">
        <Bell className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500" />
      </button>

      {/* User */}
      <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
        <Avatar name={userName} size="sm" />
        <div className="text-left hidden sm:block">
          <p className="text-xs font-medium text-slate-900 leading-tight">{userName}</p>
          <p className="text-xs text-slate-500">
            {(session?.user as { role?: string })?.role || "Agent"}
          </p>
        </div>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </button>
    </header>
  );
}
