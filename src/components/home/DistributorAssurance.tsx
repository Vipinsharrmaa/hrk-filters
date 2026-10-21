import { Factory, ShieldCheck, Cpu, Truck } from "lucide-react";

export default function DistributorAssurance() {
  const assurances = [
    {
      title: "Direct Factory Pricing",
      icon: Factory,
      description:
        "Direct factory-gate pricing structure offering solid profit margins for secondary stockists, automotive retailers, and garage networks.",
      tag: "Direct Manufacturer",
    },
    {
      title: "Packaging Integrity",
      icon: ShieldCheck,
      description:
        "Standardized master carton packaging ensuring safe transit, dust-free warehousing, and easy barcode/SKU inventory handling.",
      tag: "Sealed Carton Lots",
    },
    {
      title: "100% Precision OE Fitment",
      icon: Cpu,
      description:
        "Die-moulded housings, accurate pleat spacing, and pliable sealing collars ensure airtight fitment without unmetered air bypass.",
      tag: "Engineered Fitment",
    },
    {
      title: "Logistics Coordination",
      icon: Truck,
      description:
        "Prompt dispatch coordination through leading transport freight lines with docket tracking across major Indian industrial routes.",
      tag: "Pan-India Freight",
    },
  ];

  return (
    <section className="w-full bg-[#f8fafc] py-16 lg:py-20 border-b border-slate-200" id="dealer-benefits">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-2 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-50 border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-600" />
            <span className="font-mono text-xs font-bold text-red-700 uppercase tracking-wider">
              Manufacturing Standards
            </span>
          </div>
          <h2 className="font-headline font-bold text-2xl sm:text-3xl text-slate-900">
            WHY WHOLESALE DISTRIBUTORS CHOOSE HRK FILTERS
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Reliable supply consistency, standardized packaging, and disciplined manufacturing tolerances for two-wheeler parts stockists across India.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {assurances.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="clean-card-interactive rounded-2xl p-5 relative overflow-hidden group"
              >
                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mb-4 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-headline font-bold text-base text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] font-mono font-bold uppercase text-red-600 tracking-wider">
                  {item.tag}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
