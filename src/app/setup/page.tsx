"use client";
import { useState, useEffect } from "react";

interface DBStatus {
  users: number;
  contacts: number;
  deals: number;
  companies: number;
  seeded: boolean;
}

export default function SetupPage() {
  const [status, setStatus] = useState<DBStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkStatus() {
    try {
      const res = await fetch("/api/setup");
      const data = await res.json();
      setStatus(data);
    } catch {
      setError("Could not reach the API. Check your Supabase env vars.");
    }
  }

  useEffect(() => { checkStatus(); }, []);

  async function handleSeed() {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setResult("✓ Database seeded! 3 users · 10 companies · 20 contacts · 30 deals · 20 tasks");
        await checkStatus();
      } else {
        setError(data.error || "Seed failed");
      }
    } catch {
      setError("Request failed — check Vercel logs for details");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Ese Connect CRM</h1>
            <p className="text-xs text-slate-400">First-run setup</p>
          </div>
        </div>

        {/* DB Status */}
        <div className="bg-slate-800 rounded-xl p-4 mb-6 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Database Status</p>
          {status === null && !error && (
            <p className="text-sm text-slate-400 animate-pulse">Checking connection…</p>
          )}
          {error && !result && (
            <p className="text-sm text-rose-400">{error}</p>
          )}
          {status && (
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Users", value: status.users },
                { label: "Contacts", value: status.contacts },
                { label: "Companies", value: status.companies },
                { label: "Deals", value: status.deals },
              ].map((item) => (
                <div key={item.label} className="bg-slate-700/50 rounded-lg p-2.5">
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="text-lg font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {result && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 mb-4">
            <p className="text-sm text-emerald-400">{result}</p>
          </div>
        )}

        {status?.seeded ? (
          <div className="space-y-4">
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
              <p className="text-sm font-semibold text-indigo-400 mb-2">Ready to log in</p>
              <div className="space-y-1 text-xs text-slate-300 font-mono">
                <p>admin@eseconnect.com / password123</p>
                <p>manager@eseconnect.com / password123</p>
                <p>agent@eseconnect.com / password123</p>
              </div>
            </div>
            <a
              href="/login"
              className="block w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Go to Login →
            </a>
          </div>
        ) : (
          <button
            onClick={handleSeed}
            disabled={loading || !!error}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {loading ? "Seeding database…" : "Seed Demo Data"}
          </button>
        )}

        <p className="text-xs text-slate-500 text-center mt-4">
          This page is only available in non-production or with empty DB
        </p>
      </div>
    </div>
  );
}
