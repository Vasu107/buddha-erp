"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight, GraduationCap, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"director" | "faculty" | "student">("director");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const roles: { value: typeof role; label: string }[] = [
    { value: "director", label: "Director / HOD" },
    { value: "faculty",  label: "Faculty" },
    { value: "student",  label: "Student" },
  ];

  const roleRedirect: Record<string, string> = {
    director: "/director",
    hod:      "/hod",
    faculty:  "/faculty",
    student:  "/student",
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await api.auth.login({
        email,
        password,
        role: role === "director" ? undefined : role.toUpperCase(),
      });

      if (!data.success || !data.user || !data.token) {
        throw new Error(data.message || "Invalid credentials. Please verify email & password.");
      }

      // Store auth session in localStorage
      localStorage.setItem("bit_user", JSON.stringify(data.user));
      localStorage.setItem("bit_profile", JSON.stringify(data.profile));
      localStorage.setItem("bit_token", data.token);

      // Also store token in a cookie so Next.js proxy can read it
      document.cookie = `bit_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      const targetRole = (data.user.role as string).toLowerCase();
      window.location.href = roleRedirect[targetRole] || "/director";
    } catch (err: any) {
      setError(err.message || "Failed to log in. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-slate-900">
      
      {/* Background Image with Blur & Warm Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 filter blur-md opacity-50 transition-all duration-700"
        style={{ backgroundImage: "url('/campus.png')" }}
      />

      {/* Dark / Brand Warm Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-[#6B1A00]/40 to-black/75 backdrop-blur-[2px]" />

      {/* Centered Login Card */}
      <div className="relative z-10 w-full max-w-md animate-fade-in my-auto">
        
        {/* Card Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-7 sm:p-9 transition-all">
          
          {/* Institution Header & Branding */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C13A00] to-[#8B2500] text-white shadow-lg shadow-[#8B2500]/30 mb-3 border border-white/20">
              <GraduationCap size={28} />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              Buddha Institute of Technology
            </h1>
            <p className="text-xs font-semibold text-[#8B2500] tracking-widest uppercase mt-0.5">
              Buddha ERP Portal
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center justify-between animate-slide-left">
              <span className="flex-1 pr-2">{error}</span>
              <button
                onClick={() => setError(null)}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-200 text-red-600 font-bold"
              >
                ×
              </button>
            </div>
          )}

          {/* Role Selector */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Login Role
            </label>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
              {roles.map((r) => {
                const isSelected = role === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`py-2 px-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                      isSelected
                        ? "bg-[#8B2500] text-white shadow-md"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email & Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Institutional Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="director@bit.ac.in"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/15 transition placeholder:text-slate-400 text-slate-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#8B2500] hover:underline font-semibold"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-11 py-2.5 text-sm bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#8B2500] focus:ring-2 focus:ring-[#8B2500]/15 transition placeholder:text-slate-400 text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-[#C13A00] to-[#8B2500] hover:from-[#a33100] hover:to-[#6B1A00] text-white font-bold text-sm rounded-xl transition-all duration-150 shadow-lg shadow-[#8B2500]/25 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Security badge footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck size={14} className="text-[#8B2500]" />
            <span>Encrypted &amp; Secured BIT Access</span>
          </div>

        </div>

        {/* Footer text under card */}
        <p className="text-center text-xs text-slate-300/80 mt-4 drop-shadow font-medium">
          © {new Date().getFullYear()} Buddha Institute of Technology, GIDA, Gorakhpur
        </p>

      </div>

    </div>
  );
}
