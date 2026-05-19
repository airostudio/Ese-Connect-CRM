"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Cloud, Mail, Lock, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@eseconnect.com");
  const [password, setPassword] = useState("password123");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Invalid credentials. Please try again.");
      } else {
        toast.success("Welcome back!");
        window.location.href = "/dashboard";
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F3F3F3" }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12" style={{ backgroundColor: "#032D60" }}>
        <div className="max-w-sm text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl mb-6" style={{ backgroundColor: "#0176D3" }}>
            <Cloud className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Ese Connect CRM</h1>
          <p className="text-base" style={{ color: "#8DB0D4" }}>
            The intelligent CRM platform that brings together your customers, deals, and insights in one place.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { label: "Contacts", value: "20+" },
              { label: "Deals", value: "30+" },
              { label: "Companies", value: "10+" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-lg p-3" style={{ backgroundColor: "#16325C" }}>
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs" style={{ color: "#8DB0D4" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#0176D3" }}>
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold" style={{ color: "#181818" }}>Ese Connect</span>
          </div>

          <h2 className="text-2xl font-bold mb-1" style={{ color: "#181818" }}>Sign In</h2>
          <p className="text-sm mb-8" style={{ color: "#706E6B" }}>Enter your credentials to access your workspace</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#181818" }}>
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#706E6B" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded text-sm focus:outline-none transition-all"
                  style={{ border: "1px solid #DDDBDA", backgroundColor: "white", color: "#181818" }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0176D3";
                    e.currentTarget.style.boxShadow = "0 0 0 1px #0176D3";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#DDDBDA";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#181818" }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#706E6B" }} />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded text-sm focus:outline-none transition-all"
                  style={{ border: "1px solid #DDDBDA", backgroundColor: "white", color: "#181818" }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#0176D3";
                    e.currentTarget.style.boxShadow = "0 0 0 1px #0176D3";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#DDDBDA";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#706E6B" }}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded text-white font-semibold text-sm transition-opacity disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ backgroundColor: "#0176D3" }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#014486"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#0176D3"; }}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-3 rounded" style={{ backgroundColor: "#D8EDFF", border: "1px solid #1B96FF" }}>
            <p className="text-xs font-semibold mb-1" style={{ color: "#032D60" }}>Demo credentials</p>
            <p className="text-xs" style={{ color: "#0176D3" }}>admin@eseconnect.com / password123</p>
          </div>

          <p className="mt-5 text-center text-sm" style={{ color: "#706E6B" }}>
            No account?{" "}
            <Link href="/register" className="font-medium" style={{ color: "#0176D3" }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
