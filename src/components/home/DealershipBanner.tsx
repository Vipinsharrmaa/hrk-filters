import { siteConfig } from "@/lib/config";
import { Phone, ArrowRight } from "lucide-react";

export default function DealershipBanner() {
  const whatsappDealershipUrl = siteConfig.whatsappNumber
    ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent("Interested in becoming an Authorized Distributor / Stockist for HRK Filters")}`
    : "#product-catalog";

  return (
    <section className="w-full bg-[#f8fafc] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white border border-red-200 p-6 sm:p-10 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 shadow-md shadow-red-500/5">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 via-rose-500 to-red-400" />

          <div className="space-y-2 text-center lg:text-left z-10 max-w-xl">
            <span className="font-mono text-xs font-bold text-red-700 uppercase tracking-widest">
              Trade Partnership
            </span>
            <h3 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900 leading-tight">
              BECOME AN AUTHORIZED REGIONAL STOCKIST
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Connect directly with our manufacturing sales desk for regional wholesale allotments, volume pricing rate cards, and freight support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3.5 z-10 w-full lg:w-auto">
            {siteConfig.contactPhone && (
              <a
                href={`tel:${siteConfig.contactPhone}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full border border-slate-300 text-slate-800 font-headline text-xs sm:text-sm font-semibold hover:border-red-400 hover:text-red-700 transition-colors"
              >
                <Phone className="w-4 h-4 text-red-600" />
                <span>{siteConfig.contactPhone}</span>
              </a>
            )}

            <a
              href={whatsappDealershipUrl}
              target={siteConfig.whatsappNumber ? "_blank" : undefined}
              rel={siteConfig.whatsappNumber ? "noopener noreferrer" : undefined}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-headline text-xs sm:text-sm font-bold shadow-md shadow-red-600/25 transition-all"
            >
              <span>CONNECT ON WHATSAPP</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
