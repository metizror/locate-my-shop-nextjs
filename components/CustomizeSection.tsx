"use client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ArrowRight, Settings, Palette, Code, Users } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import Image from "next/image";

// Import logos
const murkaniLogo = "/assets/logos/murkani-logo.png";
const camelotLogo = "/assets/logos/camelot-logo.png";
const twobearsLogo = "/assets/logos/twobears-logo.png";

const CustomizeSection = () => {
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  // Feature showcase carousel (replaces the old YouTube embed)
  const showcaseImages = [
    { src: "/assets/customize-showcase/analytics-dashboard.jpg", alt: "Analytics dashboard tracking store views and customer search patterns" },
    { src: "/assets/customize-showcase/quick-summary-view.jpg", alt: "Quick summary view with store locator views chart over 90 days" },
    { src: "/assets/customize-showcase/store-management.jpg", alt: "Store management dashboard with bulk CSV import/export and Google Sheets sync" },
    { src: "/assets/customize-showcase/map-provider-setup.jpg", alt: "Map provider setup for Google Maps and MapBox with transparent pricing" },
    { src: "/assets/customize-showcase/map-customization.jpg", alt: "Map customization settings for icon colors, radius, labels and zoom" },
    { src: "/assets/customize-showcase/store-categories.jpg", alt: "Store categories with pre-built and custom filters" },
  ];
  const showcasePlugin = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: true })
  );
  const [showcaseApi, setShowcaseApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!showcaseApi) return;
    const onSelect = () => setSelectedIndex(showcaseApi.selectedScrollSnap());
    onSelect();
    showcaseApi.on("select", onSelect);
    return () => {
      showcaseApi.off("select", onSelect);
    };
  }, [showcaseApi]);
  // New example company logos to appear first in the carousel
  const exampleCompanyLogos = [
    { name: "BigTree", logo: "/assets/example-company-logos/BigTree-logo.png", type: "image" },
    { name: "Cherry Lane", logo: "/assets/example-company-logos/Cherry lane-logo.png", type: "image" },
    { name: "Comvita", logo: "/assets/example-company-logos/Comvita-logo.png", type: "image" },
    { name: "Elementor", logo: "/assets/example-company-logos/Elementor-logo.png", type: "image" },
    { name: "Englander", logo: "/assets/example-company-logos/englander-logo.png", type: "image" },
    { name: "Handpan World", logo: "/assets/example-company-logos/handpan-logo.png", type: "image" },
    { name: "Izabel", logo: "/assets/example-company-logos/izabel_log.png", type: "image" },
    { name: "Nuvita", logo: "/assets/example-company-logos/Nuvita-logo.png", type: "image" },
    { name: "Philips", logo: "/assets/example-company-logos/Philips-logo.png", type: "image" },
    { name: "Quality", logo: "/assets/example-company-logos/Quality-logo.png", type: "image" },
    { name: "being human", logo: "/assets/example-company-logos/being_human_logo.png", type: "image" },
    // Added brand logos moved from platform carousel
    { name: "Theobroma", logo: "/assets/plateform-logos/Theobroma-logo.png", type: "image" },
  ];
  const features = [
    {
      icon: Settings,
      title: "Easy design & functionality controls",
      description: "Adjust colors, styles, and settings directly in the dashboard—no coding needed."
    },
    {
      icon: Palette,
      title: "Brand styling support included",
      description: "Our team can fine-tune the look to match your brand for a seamless fit."
    },
    {
      icon: Code,
      title: "Designer & developer friendly",
      description: "Customize with CSS or extend functionality as needed."
    },
    {
      icon: Users,
      title: "Works for everyone",
      description: "Simple settings make it easy, with advanced options available for more control."
    }
  ];

  const brandLogos = [
    { name: "Englander", logo: "ENGLANDER", type: "text" },
    { name: "Big River Distilling", logo: "BIG RIVER", type: "text" },
    { name: "Murkani", logo: murkaniLogo, type: "image" },
    { name: "Vita-Sol", logo: "VITA-SOL", type: "text" },
    { name: "Camelot", logo: camelotLogo, type: "image" },
    { name: "OKAI", logo: "OKAI", type: "text" },
    { name: "Bala Enzyme", logo: "BALA", type: "text" },
    { name: "Monomarket", logo: "monomarket", type: "text" },
    { name: "Two Bears", logo: twobearsLogo, type: "image" },
    { name: "QD Stores", logo: "QD", type: "text" },
    { name: "Cherry Lane", logo: "Cherry Lane", type: "text" },
    { name: "E-Ride Pros", logo: "E-RIDE PROS", type: "text" },
    { name: "Nora Fleming", logo: "nora fleming", type: "text" }
  ];

  return (
    <section className="mt-[10px] p-[10px] bg-background">
      <div className="container mx-auto px-4">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                Customize with ease.
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Create a store locator app that matches your brand and works the way you 
                need—effortlessly.
              </p>
            </div>

            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={feature.title} className="flex gap-4 group">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Button className="inline-flex items-center gap-2 px-6 py-3 text-base font-medium" asChild>
                <Link href={"/store-locator-layout" as any}>
                  Browse store locator layout
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Content - Feature Showcase Carousel */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-muted/50 to-muted/80 rounded-2xl p-4 sm:p-6 shadow-2xl">
              <Carousel
                opts={{ align: "start", loop: true }}
                plugins={[showcasePlugin.current]}
                setApi={setShowcaseApi}
                className="w-full"
              >
                <CarouselContent>
                  {showcaseImages.map((img, index) => (
                    <CarouselItem key={img.src}>
                      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted shadow-lg">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          className="object-cover"
                          loading={index === 0 ? "eager" : "lazy"}
                          quality={80}
                          sizes="(max-width: 1024px) 100vw, 600px"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 sm:-left-4" />
                <CarouselNext className="right-2 sm:-right-4" />
              </Carousel>

              {/* Dot indicators */}
              <div className="flex justify-center gap-2 mt-5">
                {showcaseImages.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => showcaseApi?.scrollTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      selectedIndex === i ? "w-6 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/50"
                    }`}
                  />
                ))}
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 h-24 w-24 bg-primary/10 rounded-full blur-xl pointer-events-none"></div>
              <div className="absolute -bottom-6 -left-6 h-32 w-32 bg-accent/10 rounded-full blur-xl pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="text-center space-y-12">
          <p className="text-4xl text-muted-foreground font-bold">
            Loved by thousands of small businesses, global brands and everyone in between.
          </p>
          
          {/* Brand Logos Carousel */}
          <div className="w-full max-w-4xl mx-auto">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              plugins={[plugin.current]}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {[...exampleCompanyLogos, ...brandLogos].map((brand, index) => (
                  <CarouselItem key={brand.name} className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5">
                    <div className="flex items-center justify-center h-16">
                      {brand.type === "image" ? (
                        <div className="relative h-8 w-32 flex items-center justify-center">
                          <Image 
                            src={brand.logo} 
                            alt={brand.name}
                            width={128}
                            height={32}
                            className="max-h-8 max-w-full object-contain opacity-60 hover:opacity-100 transition-opacity cursor-pointer filter grayscale hover:grayscale-0"
                            loading="lazy"
                            quality={75}
                            sizes="(max-width: 768px) 80px, 128px"
                          />
                        </div>
                      ) : (
                        <div 
                          className="text-foreground/70 font-medium text-lg transition-opacity cursor-pointer hover:opacity-100"
                          style={{ 
                            fontFamily: brand.name === 'nora fleming' || brand.name === 'monomarket' ? 'cursive' : 
                                        brand.name === 'ENGLANDER' || brand.name === 'E-RIDE PROS' ? 'Arial Black, sans-serif' : 
                                        brand.name === 'Cherry Lane' ? 'serif' :
                                        'inherit'
                          }}
                        >
                          {brand.logo}
                        </div>
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomizeSection;