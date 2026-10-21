import Hero from "@/components/home/Hero";
import ProductDivisions from "@/components/home/ProductDivisions";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import DistributorAssurance from "@/components/home/DistributorAssurance";
import FAQAccordion from "@/components/home/FAQAccordion";
import DealershipBanner from "@/components/home/DealershipBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProductDivisions />
      <FeaturedProducts />
      <DistributorAssurance />
      <FAQAccordion />
      <DealershipBanner />
    </>
  );
}
