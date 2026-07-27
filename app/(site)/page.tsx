import dynamic from "next/dynamic";
import Script from "next/script";
import { pageSeo } from "@/lib/seo";
import HeroSection from "@/components/HeroSection";
import CustomizeSection from "@/components/CustomizeSection";

// Dynamically import below-the-fold components to reduce initial bundle size
const FeaturesSection = dynamic(() => import("@/components/FeaturesSection"), {
  loading: () => <div className="min-h-[400px]" />,
});
const PlatformLogosCarousel = dynamic(() => import("@/components/PlatformLogosCarousel"), {
  loading: () => <div className="min-h-[120px]" />,
});
const HowItWorksSection = dynamic(() => import("@/components/HowItWorksSection"), {
  loading: () => <div className="min-h-[400px]" />,
});
const PricingSection = dynamic(() => import("@/components/PricingSection"), {
  loading: () => <div className="min-h-[400px]" />,
});
const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"), {
  loading: () => <div className="min-h-[400px]" />,
});
const FAQSection = dynamic(() => import("@/components/FAQSection"), {
  loading: () => <div className="min-h-[400px]" />,
});
const BlogSection = dynamic(() => import("@/components/BlogSection"), {
  loading: () => <div className="min-h-[400px]" />,
});
const CTASection = dynamic(() => import("@/components/CTASection"), {
  loading: () => <div className="min-h-[200px]" />,
});
const ScrollToHash = dynamic(() => import("@/components/ScrollToHash"), {
  ssr: false,
});

export const metadata = pageSeo({
  title: "Custom Store Locator App with Maps, Search & Filters",
  description:
    "Help customers find stores fast with a mobile-friendly store locator app. Custom maps, bulk uploads, Google Sheet auto sync. Get started today.",
  path: "/",
});

export default function Page() {
  const siteUrlFromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  const vercelUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined;
  const baseUrl = siteUrlFromEnv || vercelUrl || 'http://localhost:3000';

  const homePageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.storelocator.in/website",
        "url": "https://www.storelocator.in/",
        "name": "StoreLocator.in",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.storelocator.in/?s={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://www.storelocator.in/#organization",
        "name": "StoreLocator.in",
        "url": "https://www.storelocator.in/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.storelocator.in/path-to-your-logo.png"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://www.storelocator.in/#webpage",
        "url": "https://www.storelocator.in/",
        "name": "Store Locator App for Shopify | StoreLocator.in",
        "description": "Add a fully customizable store locator to your Shopify store. Display multiple locations, track searches, and help customers find the nearest outlet fast.",
        "inLanguage": "en",
        "isPartOf": {
          "@id": "https://www.storelocator.in/#website"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen">
      {/* JSON-LD Schema - Loaded with Script component for better performance */}
      <Script
        id="homepage-schema"
          type="application/ld+json"
        strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
        />
      <main>
        <div className="my-[15px]">
          <HeroSection />
        </div>
        <div className="my-[15px]">
          <CustomizeSection />
        </div>
        <section id="features" className="my-[15px] scroll-mt-28">
          <FeaturesSection />
        </section>
        <section id="how-it-works" className="my-[15px] scroll-mt-28">
          <HowItWorksSection />
        </section>
        <section id="pricing" className="my-[15px] scroll-mt-28">
          <PricingSection />
        </section>
        <section id="platforms" className="my-[24px]">
          <div className="text-center space-y-8">
            <p className="text-4xl font-bold">
              <span className="text-4xl">Works Seamlessly </span>
              <span className="gradient-hero bg-clip-text text-transparent">
                 Across Your Favorite Platforms
              </span>
            </p>
            <div className="pt-2 pb-2">
              <PlatformLogosCarousel />
            </div>
          </div>
        </section>
        <section id="testimonials" className="my-[15px] scroll-mt-28">
          <TestimonialsSection />
        </section>
        <section id="faq" className="my-[15px] scroll-mt-28">
          <FAQSection />
        </section>
        <section id="blog" className="my-[15px] scroll-mt-28">
          <BlogSection />
        </section>
        <div className="my-[15px]">
          <CTASection />
        </div>
      </main>
      <ScrollToHash />
    </div>
  );
}


