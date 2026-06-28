"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("admin_token", data.token);
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to log in. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brown px-4 py-12 text-ivory">
      <div className="w-full max-w-md bg-brown/40 border border-gold/20 p-8 lg:p-10 shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

        <div className="flex flex-col items-center mb-8">
          <BrandLogo tone="ivory" size="sm" showTagline={false} />
          <span className="eyebrow text-gold text-[10px] tracking-widest mt-4">
            MANAGEMENT PORTAL
          </span>
        </div>

        <h1 className="font-display text-2xl lg:text-3xl text-center text-ivory mb-6 leading-tight">
          Admin <span className="italic">Login</span>
        </h1>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 mb-6 text-xs text-center font-sans">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="border border-gold/20 focus-within:border-gold/60 transition-colors px-4 py-3 bg-brown/20">
            <label className="eyebrow text-gold/50 text-[9px] block mb-1">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
              className="w-full bg-transparent font-display text-gold text-lg outline-none placeholder:text-gold/25"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full eyebrow py-4 transition-all text-[11px] ${
              isSubmitting
                ? "bg-gold/15 text-gold/30 cursor-not-allowed"
                : "bg-gold text-brown hover:bg-ivory hover:text-brown"
            }`}
          >
            {isSubmitting ? "Authenticating..." : "Access Dashboard"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="eyebrow text-[10px] text-ivory/40 hover:text-gold transition-colors inline-block"
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
