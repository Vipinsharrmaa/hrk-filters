"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { BusinessType, CustomerProfile } from "@/types";
import { UserPlus, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

const BUSINESS_TYPES: BusinessType[] = [
  "Retailer",
  "Wholesaler",
  "Workshop",
  "Fleet Owner",
  "Other",
];

export default function RegisterPage() {
  const router = useRouter();
  const { setProfile } = useCart();

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("Retailer");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const profile: CustomerProfile = {
      id: `cust-${email.replace(/[^a-zA-Z0-9]/g, "_")}`,
      email: email.trim(),
      full_name: fullName.trim(),
      company_name: companyName.trim() || undefined,
      business_type: businessType,
      city: city.trim() || "Delhi NCR",
      phone_number: phone.trim() || undefined,
      is_admin: email.toLowerCase().includes("admin"),
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(`hrk_user_profile_${email.toLowerCase().trim()}`, JSON.stringify(profile));
    }

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
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="font-headline font-bold text-2xl text-slate-900">
            Register Business Account
          </h2>
          <p className="text-xs text-slate-600">
            Save enquiry carts across devices for faster wholesale quotations.
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
            <span>Account created! Redirecting to catalog...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
              Contact Person Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Ramesh Patel"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
              Business / Shop Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Patel Auto Spares"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
              Business Type <span className="text-red-500">*</span>
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value as BusinessType)}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-red-600 transition-colors bg-white"
            >
              {BUSINESS_TYPES.map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                City / Town
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Delhi NCR"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-red-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 98100 12345"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-red-600 transition-colors font-mono"
              />
            </div>
          </div>

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
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-red-600 transition-colors"
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
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-red-600 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-headline text-xs font-bold transition-all shadow-md shadow-red-600/20 active:scale-95"
          >
            Create Customer Account
          </button>
        </form>

        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>Already registered? </span>
          <Link href="/auth/login" className="text-red-600 font-semibold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
