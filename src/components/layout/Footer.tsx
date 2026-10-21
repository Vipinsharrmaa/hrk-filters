import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/config";
import {
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#f8fafc] border-t border-slate-200 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-200">
          {/* Col 1: Brand Info & Socials */}
          <div className="space-y-3">
            <div className="p-1 rounded-lg bg-white border border-slate-200 shadow-2xs inline-block">
              <Image
                src="/hrk-logo.jpeg"
                alt="HRK Filters"
                width={130}
                height={42}
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="font-mono text-xs font-bold text-red-700 uppercase tracking-wide">
              Automotive Filtration Manufacturer
            </p>
            <p className="text-xs leading-relaxed text-slate-600">
              High-efficiency replacement air filters, oil filters, and automotive accessories engineered for two-wheeler durability under demanding Indian road conditions.
            </p>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-pink-600 hover:bg-pink-50 flex items-center justify-center transition-colors shadow-2xs"
                title="Follow HRK Filters on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors shadow-2xs"
                title="Subscribe to HRK Filters on YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-emerald-600 hover:bg-emerald-50 flex items-center justify-center transition-colors shadow-2xs"
                title="WhatsApp Factory Desk"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="font-headline text-xs font-bold text-slate-900 uppercase tracking-wider">
              Product Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-red-700 transition-colors">
                <Link href="/catalog?category=air-filter-paper">Air Filter Paper (Metal Cap &amp; Moulded)</Link>
              </li>
              <li className="hover:text-red-700 transition-colors">
                <Link href="/catalog?category=air-filter-foam">Air Filter Foam &amp; Foam with Jali</Link>
              </li>
              <li className="hover:text-red-700 transition-colors">
                <Link href="/catalog?category=oil-filters">BS6 Engine Oil Filtration</Link>
              </li>
              <li className="hover:text-red-700 transition-colors">
                <Link href="/catalog?category=petrol-filters">Petrol Filter Kits &amp; Accessories</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Contact Numbers */}
          <div className="space-y-3">
            <h4 className="font-headline text-xs font-bold text-slate-900 uppercase tracking-wider">
              Contact &amp; Factory Helplines
            </h4>
            <div className="space-y-1.5 text-xs text-slate-600 font-mono">
              <div className="text-[11px] font-sans text-slate-500 font-semibold mb-1">
                Sales &amp; Dealer Inquiries:
              </div>
              {siteConfig.contactPhones.map((ph, idx) => (
                <div key={ph} className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                  <a href={`tel:${ph.replace(/\s+/g, "")}`} className="hover:text-red-700 transition-colors">
                    {ph} {idx === 0 && <span className="text-[10px] text-emerald-600 font-bold">(WhatsApp)</span>}
                  </a>
                </div>
              ))}

              <div className="pt-2 flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="hover:text-red-700 transition-colors truncate"
                >
                  {siteConfig.contactEmail}
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Location & Plant */}
          <div className="space-y-3">
            <h4 className="font-headline text-xs font-bold text-slate-900 uppercase tracking-wider">
              Address &amp; Supply Center
            </h4>
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">{siteConfig.address}</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Automotive Wholesale Market, Delhi</p>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 font-mono text-[10px] font-bold">
                PAN-INDIA FACTORY SUPPLY
              </span>
              <div>
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent("Hi HRK Filters, I would like to enquire about wholesale dealer terms.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp: +91 93112 26050</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} HRK Filters. All Rights Reserved. Karol Bagh, New Delhi.</p>
          <div className="flex flex-wrap items-center gap-5">
            <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 flex items-center gap-1">
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
            <a href={siteConfig.youtubeUrl} target="_blank" rel="noopener noreferrer" className="hover:text-red-600 flex items-center gap-1">
              <Youtube className="w-3.5 h-3.5" />
              <span>YouTube</span>
            </a>
            <Link href="/admin" className="hover:text-red-600 transition-colors font-semibold">
              Admin Console
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
