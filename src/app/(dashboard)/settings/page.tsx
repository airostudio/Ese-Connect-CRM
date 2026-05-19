"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { User, Bell, Shield, Database, Puzzle, Users, GitBranch, Save } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import toast from "react-hot-toast";

const settingsTabs = [
  { key: "profile", label: "Profile", icon: User },
  { key: "team", label: "Team", icon: Users },
  { key: "pipeline", label: "Pipeline", icon: GitBranch },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "security", label: "Security", icon: Shield },
  { key: "data", label: "Data & Import", icon: Database },
  { key: "integrations", label: "Integrations", icon: Puzzle },
];

const integrations = [
  { name: "Slack", description: "Send CRM updates to Slack channels", status: "available", icon: "💬" },
  { name: "Gmail", description: "Sync emails with Gmail", status: "connected", icon: "📧" },
  { name: "Calendly", description: "Sync meeting scheduling", status: "available", icon: "📅" },
  { name: "Zapier", description: "Connect with 5000+ apps", status: "available", icon: "⚡" },
  { name: "Stripe", description: "Payment and invoice tracking", status: "available", icon: "💳" },
  { name: "HubSpot", description: "Import contacts from HubSpot", status: "available", icon: "🔄" },
];

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [profileData, setProfileData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
  });
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [notifications, setNotifications] = useState({
    dealUpdates: true,
    taskReminders: true,
    newContacts: true,
    weeklyReport: false,
    teamActivity: true,
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success("Profile updated!");
    setSaving(false);
  };

  const handleSeedData = async () => {
    if (!confirm("This will reset all data and load demo data. Continue?")) return;
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast.success("Demo data loaded successfully!");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error("Failed to seed data: " + String(error));
    } finally {
      setSeeding(false);
    }
  };

  const userName = session?.user?.name || "User";
  const userRole = (session?.user as { role?: string })?.role || "agent";

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="text-base font-semibold text-slate-900">Settings</h2>
        <p className="text-xs text-slate-500 mt-0.5">Manage your account and workspace settings</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Nav */}
        <div className="w-52 flex-shrink-0 space-y-1">
          {settingsTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  activeTab === tab.key
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Profile */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-5">Profile Settings</h3>
              <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-100">
                <Avatar name={userName} size="xl" />
                <div>
                  <h4 className="text-base font-semibold text-slate-900">{userName}</h4>
                  <p className="text-sm text-slate-500 capitalize">{userRole}</p>
                  <button className="mt-2 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                    Change avatar
                  </button>
                </div>
              </div>
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                <Input label="Full Name" value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                <Input label="Email Address" type="email" value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} />
                <Input label="Job Title" placeholder="Your role/title" />
                <Input label="Phone" placeholder="+1-555-0000" />
                <Button type="submit" loading={saving} icon={<Save className="h-4 w-4" />}>Save Changes</Button>
              </form>
            </div>
          )}

          {/* Team */}
          {activeTab === "team" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-slate-900">Team Members</h3>
                <Button size="sm">Invite Member</Button>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Alex Admin", email: "admin@eseconnect.com", role: "admin" },
                  { name: "Maria Manager", email: "manager@eseconnect.com", role: "manager" },
                  { name: "Sam Agent", email: "agent@eseconnect.com", role: "agent" },
                ].map((member) => (
                  <div key={member.email} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50">
                    <Avatar name={member.name} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.email}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      member.role === "admin" ? "bg-indigo-100 text-indigo-700" :
                      member.role === "manager" ? "bg-violet-100 text-violet-700" :
                      "bg-slate-100 text-slate-700"
                    }`}>
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pipeline Stages */}
          {activeTab === "pipeline" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-5">Pipeline Stages</h3>
              <div className="space-y-2">
                {["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"].map((stage, i) => (
                  <div key={stage} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100">
                    <div className="h-5 w-5 rounded bg-slate-200 flex items-center justify-center">
                      <span className="text-xs text-slate-600 font-medium">{i + 1}</span>
                    </div>
                    <span className="text-sm text-slate-900 flex-1">{stage}</span>
                    <button className="text-xs text-slate-400 hover:text-slate-600">Edit</button>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                + Add Stage
              </button>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-5">Notification Preferences</h3>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    dealUpdates: "Deal stage updates",
                    taskReminders: "Task reminders",
                    newContacts: "New contact assignments",
                    weeklyReport: "Weekly performance report",
                    teamActivity: "Team activity feed",
                  };
                  return (
                    <div key={key} className="flex items-center justify-between py-3 border-b border-slate-50">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{labels[key]}</p>
                      </div>
                      <button
                        onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${value ? "bg-indigo-600" : "bg-slate-200"}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${value ? "translate-x-4" : "translate-x-0.5"}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-5">Security Settings</h3>
              <div className="space-y-4 max-w-md">
                <Input label="Current Password" type="password" placeholder="••••••••" />
                <Input label="New Password" type="password" placeholder="••••••••" />
                <Input label="Confirm New Password" type="password" placeholder="••••••••" />
                <Button>Update Password</Button>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-100">
                <h4 className="text-sm font-medium text-slate-900 mb-3">Active Sessions</h4>
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-800">Current Session</p>
                    <p className="text-xs text-slate-500">Chrome · Now</p>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium">Active</span>
                </div>
              </div>
            </div>
          )}

          {/* Data Import */}
          {activeTab === "data" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-5">Data Management</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors">
                  <h4 className="text-sm font-semibold text-slate-900">Import Contacts</h4>
                  <p className="text-xs text-slate-500 mt-1">Upload a CSV file to bulk import contacts</p>
                  <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-indigo-100 transition-colors">
                    Choose CSV File
                    <input type="file" accept=".csv" className="hidden" />
                  </label>
                </div>

                <div className="p-4 rounded-xl border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900">Export Data</h4>
                  <p className="text-xs text-slate-500 mt-1">Download all your CRM data as CSV</p>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => toast.success("Export started!")} className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                      Export Contacts
                    </button>
                    <button onClick={() => toast.success("Export started!")} className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                      Export Deals
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50">
                  <h4 className="text-sm font-semibold text-rose-900">Load Demo Data</h4>
                  <p className="text-xs text-rose-700 mt-1">⚠️ This will reset all existing data</p>
                  <Button
                    variant="danger"
                    size="sm"
                    loading={seeding}
                    onClick={handleSeedData}
                    className="mt-3"
                  >
                    Load Demo Data
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Integrations */}
          {activeTab === "integrations" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-5">Integrations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {integrations.map((integration) => (
                  <div key={integration.name} className="p-4 rounded-xl border border-slate-200 hover:border-indigo-200 transition-all hover:shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{integration.name}</p>
                          <p className="text-xs text-slate-500">{integration.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        integration.status === "connected"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {integration.status === "connected" ? "Connected" : "Available"}
                      </span>
                      <button
                        onClick={() => toast(integration.status === "connected" ? "Already connected!" : `${integration.name} integration coming soon!`)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        {integration.status === "connected" ? "Manage" : "Connect"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
