import { ArrowRight, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best Store Locator Examples with Maps",
  description:
    "Browse live store locator examples showing maps, filters, and search. Choose a store locator app that fits your website. Explore now.",
  alternates: { canonical: "/store-locator-examples" },
  openGraph: {
    title: "Best Store Locator Examples with Maps",
    description:
      "Browse live store locator examples showing maps, filters, and search. Choose a store locator app that fits your website. Explore now.",
    type: "website",
    url: "/store-locator-examples",
  },
  twitter: {
    card: "summary_large_image",
    title: "Best Store Locator Examples with Maps",
    description:
      "Browse live store locator examples showing maps, filters, and search. Choose a store locator app that fits your website. Explore now.",
  },
};

const storeExamples = [
  {
    name: "Englander Store Locator",
    url: "https://www.englander.com/a/storelocator",
    description:
      "Englander is one of the world's most respected mattress brands, known for comfort, reliability, and innovation in sleep solutions. Their store locator reflects the same philosophy — keeping the experience simple, welcoming, and stress-free for customers who are often making an important, long-term purchase decision.",
    features: [
      "Design & Branding - Clean, breathable design that mirrors the peace of mind customers expect",
      "Search Functionality - Intuitive search with geolocation for automatic detection",
      "Mobile Friendly Experience - Fully responsive with large buttons for easy tapping",
      "Detailed Store Profiles - Phone numbers, operating hours, directions, and 'Authorized Dealer' badges",
    ],
    demoImage: "/lovable-uploads/englander-example.jpg",
  },
  {
    name: "Vita-Sol Store Locator",
    url: "https://www.vita-sol.com/a/storelocator",
    description:
      "Vita-Sol is a wellness and nutrition brand that focuses on creating health from within through scientifically formulated supplements. Their store locator extends this philosophy by offering a calm, clear, and reliable way for customers to connect with stockists.",
    features: [
      "Design & Branding - Soft, calming colors with minimalist interface reflecting wellness identity",
      "Search Functionality - Instant results with geolocation for health-conscious consumers",
      "Mobile Optimization - Smooth adaptation for smaller screens with easy-to-tap buttons",
      "Filtering Options - Search by product availability to prevent customer frustration",
    ],
    demoImage: "/lovable-uploads/vita-sol-example.jpg",
  },
  {
    name: "QD Stores Store Locator",
    url: "https://www.qdstores.co.uk/a/storelocator",
    description:
      "QD Stores is a popular UK-based retailer known for affordable home, garden, and everyday products. With such a broad customer base, their store locator is designed for practicality and speed.",
    features: [
      "Design & Branding - Simple and functional, matching the brand's value-first identity",
      "Search Functionality - Real-time results with geolocation for multiple nearby branches",
      "Mobile Optimization - Tap-friendly interface for users on the move",
      "Comprehensive Store Details - Full contact info plus services like 'Click & Collect'",
    ],
    demoImage: "/lovable-uploads/qd-stores-example.jpg",
  },
  {
    name: "Cherry Lane Store Locator",
    url: "https://www.cherry-lane.co.uk/a/storelocator",
    description:
      "Cherry Lane is one of the UK's leading garden center groups, offering plants, tools, and home & garden products. Their store locator mirrors this outdoor inspiration with a fresh, nature-driven design that feels both inviting and practical.",
    features: [
      "Design & Branding - Natural tones like greens and earth-inspired colors to tie in with gardening theme",
      "Search Functionality - Quick results by city, postcode, or county with geolocation support",
      "Mobile-Friendly Navigation - Seamless adaptation with touch-friendly buttons for calls and directions",
      "Store Profiles - Full information including special features like cafés, nursery sections, or seasonal offers",
    ],
    demoImage: "/lovable-uploads/cherry-lane-example.jpg",
  },
  {
    name: "Theobroma Store Locator",
    url: "https://theobroma.in/a/storelocator",
    description:
      "Theobroma, India's beloved bakery and patisserie chain, is famous for its brownies, cakes, and indulgent treats. Their store locator reflects this indulgent yet approachable brand identity, making it simple for dessert lovers to find the nearest outlet whenever cravings strike.",
    features: [
      "Design & Branding - Warm, inviting tones reflecting cozy bakery indulgence with handcrafted typography",
      "Search Functionality - City, state, or ZIP code search with auto-detection for mobile users",
      "Mobile Adaptability - Fully optimized with large buttons for calling or navigating to outlets",
      "Store Profiles - Rich details including custom cake availability and dine-in café services",
    ],
    demoImage: "/lovable-uploads/theobroma-example.jpg",
  },
  {
    name: "Comvita Store Locator",
    url: "https://www.comvita.com/a/storelocator",
    description:
      "Comvita, globally recognized for its Manuka honey and natural health products, takes a thoughtful approach with its store locator. In a competitive wellness market, their locator ensures authenticity and creates an inclusive customer experience.",
    features: [
      "Design & Branding - Clean, modern interface with earthy tones reflecting natural roots and quality",
      "Localized Experience - Multilingual support (English and Chinese) for diverse Hong Kong market",
      "Geo-Friendly Search - Manual searches and automatic location detection for dense urban navigation",
      "Store Profiles - Detailed information including product types, opening hours, and authorized dealer verification",
    ],
    demoImage: "/lovable-uploads/comvita-example.jpg",
  },
  {
    name: "Big Tree Distillery Store Locator",
    url: "https://bigtreedistillery.com.au/a/storelocator",
    description:
      "Big Tree Distillery is a boutique Australian gin maker that prides itself on craftsmanship and authenticity. Their store locator embodies the same artisanal sophistication, creating not just a tool for navigation but an extension of the brand's storytelling.",
    features: [
      "Design & Branding - Deep, bold tones and elegant fonts reflecting luxury gin identity",
      "Navigation Options - City, region search with geolocation and map clustering for clarity",
      "Mobile Experience - Seamless adaptation with large tap-friendly buttons for directions and calls",
      "Store Profiles - Rich details including cellar door, bar, or retail stockist with tasting information",
    ],
    demoImage: "/lovable-uploads/big-tree-example.jpg",
  },
  {
    name: "Nuvita Baby Store Locator",
    url: "https://nuvitababy.com/a/storelocator",
    description:
      "Nuvita Baby is a trusted name in innovative baby care products, from feeding solutions to monitoring devices. Their store locator is designed with parents in mind, focusing on simplicity, reassurance, and efficiency for time-pressed parents.",
    features: [
      "Design & Branding - Soft, inviting design with pastel tones and rounded buttons echoing safety and care",
      "Search Functionality - City or postal code search with instant geolocation for busy parents",
      "Mobile Optimization - Highly responsive with touch-friendly buttons and intuitive scrolling",
      "Store Profiles - Opening hours, contact info, plus parent-friendly amenities like stroller access",
    ],
    demoImage: "/lovable-uploads/nuvita-baby-example.jpg",
  },
  {
    name: "Handpan World Store Locator",
    url: "https://www.handpan.world/en-in/a/storelocator",
    description:
      "Handpan World caters to a niche but passionate community of musicians and enthusiasts. Their store locator is more than a retail tool — it doubles as a cultural gateway that connects people with sellers, workshops, and events across the globe.",
    features: [
      "Artistic Design - Unique elements like circular pins resembling handpans for creative, musical touch",
      "Global Reach - International scale connecting users from different continents with local sellers and instructors",
      "Mobile Accessibility - Responsive design for traveling enthusiasts with one-tap directions",
      "Store Profiles - Listings include shops, community spaces, and event venues with workshop and rental information",
    ],
    demoImage: "/lovable-uploads/handpan-world-example.jpg",
  },
  {
    name: "Philips Domestic Appliances India Store Locator",
    url: "https://www.domesticappliances.philips.co.in/a/storelocator",
    description:
      "Philips has built strong trust in the Indian market through reliable products and customer support. Their store locator serves not only as a tool to find retail outlets but also as a gateway to service centers—bridging purchase and after-sales care.",
    features: [
      "Design & Branding - Signature Philips branding: modern, minimal, and professional with dependable feel",
      "Dual Functionality - Integrates both retail stores and authorized service centers for complete lifecycle support",
      "Mobile Optimization - Mobile-first design with large, thumb-friendly buttons for calls and directions",
      "Comprehensive Profiles - Full details including services offered, spare parts availability, and business hours",
    ],
    demoImage: "/lovable-uploads/philips-example.jpg",
  },
];

export default function StoreLocatorExamples() {
  return (
    <div className="min-h-screen">
      <main className="pt-20">
        <section className="py-16 bg-muted/30" style={{ marginBottom: "10px" }}>
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Store Locator Examples</h1>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-8">
                Looking for inspiration on how different brands use store locators? Here are some real examples from businesses across industries. 
                Each of these companies has created a simple, user-friendly store locator to help customers find products and services near them.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                <a href="https://apps.shopify.com/store-locator-by-metizsoft" target="_blank" rel="noopener noreferrer">
                  Create Your Store Locator Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>

            <div className="space-y-12">
              {storeExamples.map((example, index) => (
                <Card key={example.name} className="overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-2xl font-bold">
                            {index + 1}. {example.name}
                          </h3>
                          <Button variant="outline" size="sm" asChild>
                            <a href={example.url} target="_blank" rel="noopener noreferrer">
                              Try It <ExternalLink className="ml-2 h-4 w-4" />
                            </a>
                          </Button>
                        </div>

                        <p className="text-muted-foreground mb-6">{example.description}</p>

                        <div>
                          <h4 className="font-semibold mb-3">Key Features:</h4>
                          <ul className="space-y-2">
                            {example.features.map((feature) => (
                              <li key={feature} className="flex items-start gap-2">
                                <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {example.demoImage && (
                        <div className="flex-1 relative w-full aspect-video rounded-lg border shadow-lg overflow-hidden">
                          <Image
                            src={example.demoImage}
                            alt={`${example.name} Demo`}
                            fill
                            className="object-cover"
                            loading="lazy"
                            quality={80}
                            sizes="(max-width: 1024px) 100vw, 50vw"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-16 text-center">
              <Card className="p-8 bg-primary/5">
                <h3 className="text-2xl font-bold mb-4">Ready to Create Your Own Store Locator?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Join thousands of businesses that trust MSPL Store Locator to help their customers find them. 
                  Get started today with our easy-to-use platform and customizable design options.
                </p>
                <Button size="lg" className="bg-primary hover:bg-primary/90" asChild>
                  <a href="https://www.storelocator.in/contact" target="_blank" rel="noopener noreferrer">
                    Start Building Your Store Locator
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </Button>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


