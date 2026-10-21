"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is the Minimum Order Quantity (M.O.P. / M.O.Q.) for wholesale dispatches?",
      a: "Our standard order pack sizes are based on master carton packaging (typically 10, 20, or 50 units depending on the filter size and model). Items should be ordered in multiples of the specified pack size to ensure safe, secure transit.",
    },
    {
      q: "How do wholesale trade discounts work against the published MRP?",
      a: "The prices published on this catalogue are Maximum Retail Prices (MRP). For wholesale stockists, regional distributors, and bulk workshop accounts, competitive net-gate trade discounts are provided based on order volumes upon WhatsApp quotation.",
    },
    {
      q: "Can trade buyers request product samples for fitment validation?",
      a: "Yes. Sample units for high-volume filter papers (e.g. Splendor, Activa, Pulsar) can be coordinated through our sales desk for established automotive spare parts counters and workshop operators.",
    },
    {
      q: "What transport and logistics options are available across India?",
      a: "Standard dispatches from Delhi are handed over to major freight carriers (TCI, V-Trans, ARC, Safexpress, etc.) with freight dockets and e-Way bills provided directly to the buyer for tracking.",
    },
  ];

  return (
    <section className="w-full bg-white py-16 lg:py-20 border-b border-slate-200" id="b2b-faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="font-mono text-xs font-bold text-red-700 uppercase tracking-widest">
            Trade Information
          </span>
          <h2 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900">
            FREQUENTLY ASKED WHOLESALE QUESTIONS
          </h2>
          <p className="text-sm text-slate-600">
            Straightforward terms for auto parts stockists, multi-brand workshops, and fleet maintenance buyers.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`border rounded-2xl p-4 sm:p-5 transition-all cursor-pointer ${
                  isOpen
                    ? "border-red-300 bg-white shadow-sm"
                    : "border-slate-200 bg-slate-50 hover:bg-white"
                }`}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-headline text-sm sm:text-base text-slate-900 font-semibold">
                    {faq.q}
                  </h4>
                  <ChevronDown
                    className={`w-5 h-5 text-red-600 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
                {isOpen && (
                  <div className="mt-3 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
