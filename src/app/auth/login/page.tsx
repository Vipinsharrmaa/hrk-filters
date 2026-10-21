"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { CustomerProfile } from "@/types";
import { User, Lock, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setProfile } = useCart();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    // Customer profile simulated authentication
    // Check if account was saved previously, otherwise create standard authenticated session
    let existingProfile: CustomerProfile | null = null;
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(`hrk_user_profile_${email.toLowerCase().trim()}`);
        if (stored) {
          existingProfile = JSON.parse(stored);
        }
      } catch {
        // fallback
      }
    }

    const profile: CustomerProfile = existingProfile || {
      id: `cust-${email.replace(/[^a-zA-Z0-9]/g, "_")}`,
      email: email.trim(),
      full_name: email.split("@")[0].toUpperCase() + " AUTO",
      company_name: "Trade Automotive Partner",
      business_type: "Retailer",
      city: "Delhi NCR",
      is_admin: email.toLowerCase().includes("admin"),
    };

    setProfile(profile);
    setSuccess(true);

    setTimeout(() => {
      router.push("/catalog");
    }, 800);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-100">
            <User className="w-6 h-6" />
          </div>
          <h2 className="font-headline font-bold text-2xl text-slate-900">
            Customer Account Login
          </h2>
          <p className="text-xs text-slate-600">
            Access your saved trade enquiries and cross-device enquiry cart.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-mono">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Login successful! Syncing enquiry cart...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-headline text-xs font-bold transition-all shadow-md shadow-red-600/20 active:scale-95"
          >
            Sign In to Customer Account
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>New trade buyer? </span>
          <Link href="/auth/register" className="text-red-600 font-semibold hover:underline">
            Register business account
          </Link>
        </div>
      </div>
    </div>
  );
}
