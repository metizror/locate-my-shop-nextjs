import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Best Store Locator Layout Examples & Designs",
  description:
    "View map-based store locator layouts and design ideas. Choose a flexible store locator app layout that fits your site. See examples now.",
  path: "/store-locator-layout",
});

const mapStyles = [
  {
    name: "Standard",
    description:
      "The classic Google Maps look that most users are familiar with. Clear roads, green landscapes, and simple pin visibility. Best for businesses that value simplicity and familiarity—ideal for retail chains, grocery stores, or service centers.",
    previewImage: "/lovable-uploads/standard-map-style.png", // Standard Map Style - Shopify admin preview
    demoImage: "/lovable-uploads/standard-map-look.png", // Standard Map Look - Actual store locator page
  },
  {
    name: "Silver",
    description:
      "A minimalist, muted, and modern look. Uses light grays and subtle tones instead of bold colors. Perfect for premium, luxury, or corporate brands that want the map to feel clean, calm, and professional.",
    previewImage: "/lovable-uploads/silver-map-style.png",
    demoImage: "/lovable-uploads/silver-map-look.png",
  },
  {
    name: "Retro",
    description:
      "A warm, vintage-inspired design with beige and earthy tones. Evokes nostalgia and friendliness while still being clear. Great for artisanal, boutique, or heritage-focused businesses such as bakeries, breweries, or handcrafted goods.",
    previewImage: "/lovable-uploads/retro-map-style.png",
    demoImage: "/lovable-uploads/retro-map-look.png",
  },
  {
    name: "Dark",
    description:
      "A bold, black-themed map style with strong contrast. Feels sleek, stylish, and modern, making store pins pop visually. Ideal for high-end brands like tech companies, fashion outlets, or premium restaurants that want a more dramatic look.",
    previewImage: "/lovable-uploads/dark-map-style.png",
    demoImage: "/lovable-uploads/dark-map-look.png",
  },
  {
    name: "Night",
    description:
      "Designed with dark blue and muted tones, resembling nighttime navigation. Easy on the eyes, especially for users browsing in low light. Works well for nightlife brands, bars, entertainment venues, or late-night service providers.",
    previewImage: "/lovable-uploads/night-map-style.png",
    demoImage: "/lovable-uploads/night-map-look.png",
  },
  {
    name: "Aubergine",
    description:
      "A creative purple-toned map style with unique contrast levels. Adds personality and fun to the map without being overwhelming. Best suited for lifestyle, beauty, or youth-oriented brands that want to stand out with vibrancy and uniqueness.",
    previewImage: "/lovable-uploads/aubergine-map-style.png",
    demoImage: "/lovable-uploads/aubergine-map-look.png",
  },
];

const layoutStyles = [
  {
    name: "Map on Left",
    description:
      "The map sits on the left side, and the store list appears on the right. A balanced, classic design that works across industries. Best for businesses that want a straightforward, easy-to-use layout.",
    isDefault: true,
  },
  {
    name: "Map on Right",
    description:
      "Reverses the default: map on the right, store list on the left. Sometimes aligns better with websites where the design flow leads from left to right. Useful when you want the list to be the first thing users see before exploring the map.",
  },
  {
    name: "Map on Left Top",
    description:
      "The map is placed above the store list (stacked design). Works well for mobile-friendly sites or landing pages where vertical scrolling feels natural. Great for audiences who expect quick browsing on smartphones.",
  },
  {
    name: "Map on Right Top",
    description:
      "Same stacked layout but with the map on the right side. Adds variation to standard layouts while still being mobile-optimized. Works best when your site's design favors right-hand visuals.",
  },
];

export default function StoreLocatorLayout() {
  return (
    <div className="min-h-screen">
      <main className="pt-20">
        <section className="py-8 md:py-12 lg:py-16 bg-gradient-to-b from-background to-muted/30" style={{ marginBottom: "10px" }}>
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-8 md:mb-12 lg:mb-16">
              <h1 className="text-3xl leading-normal md:text-4xl lg:text-5xl xl:text-6xl xl:leading-normal font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary to-primary-soft bg-clip-text text-transparent">
                Store Locator Layout
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 md:mb-8 px-2">
                Personalize your store locator with the right map visual style and page layout. Create a branded, user-friendly experience that converts.
              </p>
              <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto" asChild>
                <a href="https://apps.shopify.com/store-locator-by-metizsoft" target="_blank" rel="noopener noreferrer">
                  Create Your Store Locator Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12 lg:py-16" style={{ marginBottom: "10px" }}>
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Personalize Your Store Locator</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-4xl mx-auto px-2 mb-6">
                Our store locator is more than a simple map—it's an extension of your website's branding and customer journey. 
                To make it both functional and visually aligned with your business, you can customize two main aspects:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-6 md:mt-8 px-4">
                <div className="flex items-center gap-2 text-sm md:text-base">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  <span className="font-semibold">Map Styles</span> – How the map itself looks (colors, tones, themes)
                </div>
                <div className="flex items-center gap-2 text-sm md:text-base">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                  <span className="font-semibold">Map Layout Styles</span> – How the map and store list are arranged
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12 lg:py-16 bg-muted/30" style={{ marginBottom: "10px" }}>
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">1. Map Styles</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-4xl mx-auto px-2">
                The map style determines how your store locator visually appears to customers. Instead of sticking to a single standard look, 
                you can choose from multiple pre-designed styles depending on your brand identity.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              {mapStyles.map((style) => (
                <Card key={style.name} className="overflow-hidden">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                      <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
                      <h3 className="text-lg md:text-xl font-semibold">
                        {style.name} {style.name === "Standard" && "(Default)"}
                      </h3>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">{style.description}</p>

                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                      <div>
                        <h4 className="font-medium mb-2 text-sm md:text-base">{style.name} Map Style</h4>
                        <div className="relative w-full aspect-video rounded-lg border overflow-hidden">
                          <Image
                            src={style.previewImage}
                            alt={`${style.name} Map Style - MSPL Store Locator`}
                            fill
                            className="object-cover"
                            loading="lazy"
                            quality={80}
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2 text-sm md:text-base">{style.name} Map Look</h4>
                        <div className="relative w-full aspect-video rounded-lg border overflow-hidden">
                          <Image
                            src={style.demoImage}
                            alt={`${style.name} Map Look - MSPL Store Locator`}
                            fill
                            className="object-cover"
                            loading="lazy"
                            quality={80}
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 p-6 bg-primary/10 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Why Map Styles Matter</h3>
              <p className="text-muted-foreground">
                Each style changes how users emotionally connect with your locator. A grocery chain might use Standard or Silver for clarity, 
                while a nightlife brand might choose Dark or Night for mood. By aligning the map's style with your brand, you create a seamless digital experience.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12 lg:py-16" style={{ marginBottom: "10px" }}>
          <div className="container mx-auto px-4 md:px-6 max-w-7xl">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">2. Map Layout Styles</h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-4xl mx-auto px-2">
                The layout style decides how your map and store list are arranged on the page. This matters for usability, readability, and user flow.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {layoutStyles.map((layout) => (
                <Card key={layout.name}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold">
                        {layout.name} {layout.isDefault && "(Default)"}
                      </h3>
                    </div>
                    <p className="text-muted-foreground">{layout.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 p-6 bg-primary/10 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Why Layout Styles Matter</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>• A side-by-side layout (Map Left or Right) gives users a broader view of both the map and the list at once.</p>
                <p>• A stacked layout (Map Left Top or Right Top) is better for mobile-first audiences, as it flows naturally with scrolling.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


