import { siteConfig } from "@/lib/config";
import { MessageSquare } from "lucide-react";

export default function AnnouncementTicker() {
  const whatsappUrl = siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent("Hi, I am interested in HRK Filters wholesale pricing.")}`
    : "#product-catalog";

  return (
    <div className="w-full bg-[#f8fafc] border-b border-slate-200 py-2 px-4 sm:px-6 lg:px-8 overflow-hidden z-50 relative">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-slate-600 gap-2">
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap py-0.5 max-w-full">
          <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
          <span className="font-semibold text-slate-900">
            Official B2B Manufacturer &amp; Wholesale Portal
          </span>
          <span className="text-slate-300">|</span>
          <span>Two-Wheeler Filtration Range</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline">Precision Engineered Fitment</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-semibold">Direct Factory-Gate Rates</span>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="text-[11px] font-mono uppercase tracking-wider text-red-700 font-bold px-2 py-0.5 rounded bg-red-50 border border-red-200">
            Wholesale Dispatches
          </span>
          <a
            href={whatsappUrl}
            target={siteConfig.whatsappNumber ? "_blank" : undefined}
            rel={siteConfig.whatsappNumber ? "noopener noreferrer" : undefined}
            className="flex items-center gap-1.5 text-emerald-700 font-semibold hover:text-emerald-600 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Fast RFQ</span>
          </a>
        </div>
      </div>
    </div>
  );
}
