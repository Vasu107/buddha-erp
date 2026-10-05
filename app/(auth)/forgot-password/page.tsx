"use client";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-6">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition">
            <ArrowLeft size={14} /> Back to login
          </Link>

          {sent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
                <Mail size={28} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Check your inbox</h2>
              <p className="text-slate-500 text-sm">
                We've sent a password reset link to your registered email address.
              </p>
              <Link href="/login" className="mt-6 inline-block text-sm font-medium text-[#245DA8] hover:underline">
                Return to sign in
              </Link>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Forgot password?</h2>
              <p className="text-slate-500 text-sm mb-6">
                Enter your institutional email and we'll send a reset link.
              </p>
              <form onSubmit={handle} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email" required
                      placeholder="Enter your institutional email"
                      className="w-full pl-10 pr-4 py-3 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-[#245DA8] transition"
                    />
                  </div>
                </div>
                <button
                  type="submit" disabled={loading}
                  className="w-full py-3 bg-[#245DA8] text-white font-semibold text-sm rounded-xl hover:bg-[#1a4580] transition disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
