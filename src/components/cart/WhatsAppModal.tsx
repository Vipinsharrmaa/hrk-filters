"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { siteConfig } from "@/lib/config";
import { BusinessType, WhatsAppBuyerDetails } from "@/types";
import { buildWhatsAppRFQUrl, formatWhatsAppMessage } from "@/lib/whatsapp";
import { X, Send, Eye, MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";

const BUSINESS_TYPES: BusinessType[] = [
  "Retailer",
  "Wholesaler",
  "Workshop",
  "Fleet Owner",
  "Other",
];

const STORAGE_KEY_BUYER = "hrk_cached_buyer_info_v1";

export default function WhatsAppModal() {
  const {
    items,
    isWhatsAppModalOpen,
    closeWhatsAppModal,
    customerProfile,
  } = useCart();

  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("Retailer");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [hasLaunched, setHasLaunched] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Pre-fill from customer profile or cached buyer info
  useEffect(() => {
    if (customerProfile) {
      setName(customerProfile.full_name || "");
      setCompanyName(customerProfile.company_name || "");
      setBusinessType(customerProfile.business_type || "Retailer");
      setCity(customerProfile.city || "");
      setPhoneNumber(customerProfile.phone_number || "");
    } else if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(STORAGE_KEY_BUYER);
        if (cached) {
          const parsed = JSON.parse(cached);
          setName(parsed.name || "");
          setCompanyName(parsed.companyName || "");
          setBusinessType(parsed.businessType || "Retailer");
          setCity(parsed.city || "");
          setPhoneNumber(parsed.phoneNumber || "");
        }
      } catch {
        // fallback gracefully
      }
    }
  }, [customerProfile, isWhatsAppModalOpen]);

  if (!isWhatsAppModalOpen) return null;

  const currentBuyerDetails: WhatsAppBuyerDetails = {
    name: name.trim() || "Wholesale Buyer",
    companyName: companyName.trim(),
    businessType,
    city: city.trim() || "Delhi NCR",
    phoneNumber: phoneNumber.trim(),
  };

  const previewMessage = formatWhatsAppMessage(currentBuyerDetails, items);

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Please enter your name / contact person name.");
      return;
    }
    if (!city.trim()) {
      setErrorMsg("Please enter your city / location.");
      return;
    }
    const deskPhone = siteConfig.whatsappNumber || "919810000000";

    // Cache buyer details for next time
    if (typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEY_BUYER,
        JSON.stringify(currentBuyerDetails)
      );
    }

    const waUrl = buildWhatsAppRFQUrl(
      deskPhone,
      currentBuyerDetails,
      items
    );

    // Open WhatsApp
    window.open(waUrl, "_blank", "noopener,noreferrer");
    setHasLaunched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-base">
                Request Trade Quotation via WhatsApp
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Direct to HRK Filters Factory Desk
              </p>
            </div>
          </div>
          <button
            onClick={closeWhatsAppModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {hasLaunched ? (
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-headline font-bold text-lg text-slate-900">
                WhatsApp Chat Opened
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                We have opened WhatsApp in a new tab with your pre-filled inquiry.
                Please tap <strong>Send</strong> in WhatsApp to transmit the enquiry directly to our factory desk.
              </p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 text-left font-mono space-y-1">
                <div>• Recipient: HRK Filters Factory Desk (+{siteConfig.whatsappNumber})</div>
                <div>• Total Items: {items.length} SKUs</div>
                <div>• Turnaround: Wholesale quotes are typically reviewed within 1–2 factory business hours.</div>
              </div>
              <div className="pt-2 flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    const waUrl = buildWhatsAppRFQUrl(
                      siteConfig.whatsappNumber,
                      currentBuyerDetails,
                      items
                    );
                    window.open(waUrl, "_blank", "noopener,noreferrer");
                  }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold font-headline hover:bg-emerald-700 transition-colors"
                >
                  Re-open WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setHasLaunched(false);
                    closeWhatsAppModal();
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold font-headline hover:bg-slate-200 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendWhatsApp} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <p className="text-xs text-slate-600">
                Please provide your trade contact details. We format your {items.length} enquiry items into a structured B2B RFQ message.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Shop / Firm Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. National Auto Spares"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-red-600 bg-white"
                  >
                    {BUSINESS_TYPES.map((bt) => (
                      <option key={bt} value={bt}>
                        {bt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Town <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Jaipur, Rajasthan"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-red-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Mobile / WhatsApp Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 98100 12345"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-red-600 font-mono"
                  />
                </div>
              </div>

              {/* Message Preview Accordion */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full px-4 py-2.5 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <span className="flex items-center gap-1.5 font-mono text-[11px]">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    {showPreview ? "Hide Message Preview" : "Preview WhatsApp RFQ Text"}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-mono">
                    {items.length} SKUs formatted
                  </span>
                </button>
                {showPreview && (
                  <pre className="p-3 bg-slate-900 text-slate-200 text-[11px] font-mono leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap border-t border-slate-800">
                    {previewMessage}
                  </pre>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={closeWhatsAppModal}
                  className="px-4 py-2 rounded-lg text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-headline text-xs font-bold tracking-wide shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Launch WhatsApp RFQ</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
