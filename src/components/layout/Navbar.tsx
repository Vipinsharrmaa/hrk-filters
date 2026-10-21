"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import { useCart } from "@/context/CartContext";
import {
  Phone,
  ShoppingCart,
  User,
  LogOut,
  ShieldCheck,
  Menu,
  X,
  Package,
} from "lucide-react";

export default function Navbar() {
  const { totalItems, openDrawer, customerProfile, setProfile } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setProfile(null);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo Only (No artificial text logo next to it) */}
        <Link href="/" className="flex items-center flex-shrink-0 group">
          <div className="p-1.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center transition-transform group-hover:scale-102">
            <Image
              src="/hrk-logo.jpeg"
              alt="HRK Filters"
              width={140}
              height={48}
              className="h-10 md:h-12 w-auto object-contain"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          <Link
            href="/"
            className="font-headline text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/catalog"
            className="font-headline text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors flex items-center gap-1.5"
          >
            <Package className="w-3.5 h-3.5 text-red-600" />
            <span>Products</span>
          </Link>
          <a
            href="/#product-divisions"
            className="font-headline text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
          >
            Categories
          </a>
          <a
            href="/#dealer-benefits"
            className="font-headline text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
          >
            Why Choose Us
          </a>
          <a
            href="/#b2b-faq"
            className="font-headline text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
          >
            FAQ &amp; Contact
          </a>
          <Link
            href="/admin"
            className="font-headline text-xs font-semibold text-slate-600 hover:text-red-600 transition-colors flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
            <span>Admin</span>
          </Link>
        </nav>

        {/* Support, Cart & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-4 flex-shrink-0">
          {siteConfig.contactPhone && (
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">
                Factory Desk
              </span>
              <a
                href={`tel:${siteConfig.contactPhone}`}
                className="text-xs font-bold text-slate-800 hover:text-red-600 transition-colors flex items-center gap-1 justify-end"
              >
                <Phone className="w-3 h-3 text-red-600" />
                <span>{siteConfig.contactPhone}</span>
              </a>
            </div>
          )}

          {/* Cart Trigger Button */}
          <button
            type="button"
            onClick={openDrawer}
            className="relative inline-flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-headline text-xs font-semibold transition-all shadow-2xs"
            title="Enquiry Cart"
          >
            <ShoppingCart className="w-4 h-4 text-red-600" />
            <span className="hidden sm:inline">Enquiry Cart</span>
            {totalItems > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-bold leading-none text-white bg-red-600 rounded-full min-w-[18px]">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Account / Profile */}
          {customerProfile ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {customerProfile.full_name}
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {customerProfile.business_type}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="hidden sm:inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-headline text-xs sm:text-sm font-bold tracking-wide shadow-md shadow-red-600/20 active:scale-95 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>LOGIN</span>
            </Link>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-fadeIn">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-headline font-semibold text-slate-800 hover:bg-slate-50 hover:text-red-600"
            >
              Home
            </Link>
            <Link
              href="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-headline font-semibold text-slate-800 hover:bg-slate-50 hover:text-red-600 flex items-center justify-between"
            >
              <span>Products</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-50 text-red-600 font-bold">
                130+ SKUs
              </span>
            </Link>
            <a
              href="/#product-divisions"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-headline font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600"
            >
              Categories
            </a>
            <a
              href="/#dealer-benefits"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-headline font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600"
            >
              Why Choose Us
            </a>
            <a
              href="/#b2b-faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-headline font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600"
            >
              FAQ &amp; Contact
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-headline font-medium text-slate-700 hover:bg-slate-50 hover:text-red-600 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>Admin Console</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {siteConfig.contactPhone && (
              <a
                href={`tel:${siteConfig.contactPhone}`}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 text-xs font-mono font-bold text-slate-800"
              >
                <Phone className="w-4 h-4 text-red-600" />
                <span>Call Factory: {siteConfig.contactPhone}</span>
              </a>
            )}

            {customerProfile ? (
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 text-xs">
                <div>
                  <div className="font-bold text-slate-900">{customerProfile.full_name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{customerProfile.business_type}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1 rounded bg-red-50 text-red-700 font-bold font-headline text-[11px]"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-600 text-white font-headline text-xs font-bold tracking-wide"
              >
                <User className="w-4 h-4" />
                <span>LOGIN / REGISTER</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
