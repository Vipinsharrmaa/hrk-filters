import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function CatalogPage() {
  return (
    <div className="py-8 bg-white min-h-[80vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <h1 className="font-headline font-bold text-3xl text-slate-900">
          Two-Wheeler Replacement Products
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Explore the full range of HRK Filters replacement products, published MRPs, and standard box pack quantities.
        </p>
      </div>
      <FeaturedProducts />
    </div>
  );
}
