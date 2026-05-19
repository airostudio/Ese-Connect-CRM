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
    <header
      className="fixed top-0 left-64 right-0 h-14 bg-white flex items-center px-5 gap-4 z-30"
      style={{ borderBottom: "1px solid #DDDBDA" }}
    >
      {/* Page Title */}
      <div className="flex-1">
        <h1 className="text-base font-semibold" style={{ color: "#181818" }}>{pageTitle}</h1>
      </div>

      {/* Search */}
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#706E6B" }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="w-full pl-9 pr-4 py-1.5 rounded text-sm placeholder-[#706E6B] focus:outline-none transition-colors"
          style={{
            border: "1px solid #DDDBDA",
            backgroundColor: "#FAFAF9",
            color: "#181818",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = "#0176D3";
            e.currentTarget.style.boxShadow = "0 0 0 1px #0176D3";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#DDDBDA";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>

      {/* Quick Add */}
      <button
        className="flex items-center gap-1.5 px-3 py-1.5 rounded text-white text-sm font-medium transition-colors shadow-sm"
        style={{ backgroundColor: "#0176D3" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#014486")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0176D3")}
      >
        <Plus className="h-4 w-4" />
        New
      </button>

      {/* Notifications */}
      <button
        className="relative p-2 rounded transition-colors"
        style={{ color: "#706E6B" }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F3F3")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <Bell className="h-5 w-5" />
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: "#EA001E" }} />
      </button>

      {/* User */}
      <button
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded transition-colors"
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F3F3F3")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
      >
        <Avatar name={userName} size="sm" />
        <div className="text-left hidden sm:block">
          <p className="text-xs font-medium leading-tight" style={{ color: "#181818" }}>{userName}</p>
          <p className="text-xs" style={{ color: "#706E6B" }}>
            {(session?.user as { role?: string })?.role || "Agent"}
          </p>
        </div>
        <ChevronDown className="h-3 w-3" style={{ color: "#706E6B" }} />
      </button>
    </header>
  );
}
