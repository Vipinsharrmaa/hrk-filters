"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  Bike,
  ExternalLink,
  ShieldAlert,
  Lock,
  KeyRound,
  LogOut,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "All Products", icon: Package },
  { href: "/admin/products/new", label: "Add New SKU", icon: PlusCircle },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/vehicles", label: "Vehicles & Models", icon: Bike },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if admin session was previously authenticated in this browser session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = sessionStorage.getItem("hrk_admin_authenticated");
      setIsAuthenticated(auth === "true");
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validPasscode =
      process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "hrk@admin2026";

    if (passcode.trim() === validPasscode) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("hrk_admin_authenticated", "true");
      }
      setIsAuthenticated(true);
    } else {
      setError("Incorrect administrator passcode. Access denied.");
    }
  };

  const handleLock = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("hrk_admin_authenticated");
    }
    setIsAuthenticated(false);
    setPasscode("");
  };

  // Prevent flicker during initial client hydration check
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // --- Locked Screen: Admin Verification Gate ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="inline-block p-1.5 rounded-xl bg-white shadow-sm">
              <Image
                src="/hrk-logo.jpeg"
                alt="HRK Filters"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="font-headline font-bold text-xl text-white tracking-tight">
                HRK ADMIN CONSOLE
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Restricted Operations &amp; Inventory Management
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <span>
              This area is restricted to authorized HRK Filters personnel. Enter your master administrator passcode to proceed.
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Passcode Form */}
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-300 mb-1.5">
                Master Passcode
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <KeyRound className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-headline font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock Admin Console</span>
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="text-center pt-2 border-t border-slate-800">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <span>Return to Public Store</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Unlocked: Full Admin Dashboard ---
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-4 flex-shrink-0 border-r border-slate-800">
        <div className="space-y-6">
          {/* Admin Header */}
          <div className="flex items-center gap-3 px-2 py-2 border-b border-slate-800">
            <div className="p-1 rounded bg-white">
              <Image
                src="/hrk-logo.jpeg"
                alt="HRK Filters"
                width={80}
                height={28}
                className="h-6 w-auto object-contain"
              />
            </div>
            <div>
              <div className="font-headline font-bold text-white text-sm">
                ADMIN CONSOLE
              </div>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Session Active</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-headline font-semibold transition-colors ${
                    isActive
                      ? "bg-red-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold mb-1">
              <ShieldAlert className="w-3.5 h-3.5 text-emerald-400" />
              <span>Privately Authenticated</span>
            </div>
            <span>Restricted internal console for catalogue &amp; price management.</span>
          </div>

          {/* Lock / Logout Button */}
          <button
            type="button"
            onClick={handleLock}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-headline font-medium text-red-400 hover:text-white hover:bg-red-950/40 border border-red-900/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </div>
            <span className="text-[10px] font-mono opacity-60">End Session</span>
          </button>

          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-headline font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span>Exit to Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
