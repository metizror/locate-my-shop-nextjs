"use client";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

const platformLogos = [
  "/assets/plateform-logos/Bigcommerce-Logo.png",
  "/assets/plateform-logos/shopify-Logo.png",
  "/assets/plateform-logos/squarespace-logo.png",
  "/assets/plateform-logos/Webflow-logo.png",
  "/assets/plateform-logos/Weebly-logo.png",
  "/assets/plateform-logos/Wordpress-logo-1.png",
  "/assets/plateform-logos/Wordpress-logo.png",
  // Moved Joomla into platform carousel
  "/assets/example-company-logos/Joomla-logo.png",
];

export default function PlatformLogosCarousel() {
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {platformLogos.map((src) => {
            // Derive a readable platform name from the file name so each logo
            // gets a specific alt (e.g. "Shopify logo") for a11y / SEO.
            const platformName = src
              .split("/")
              .pop()!
              .replace(/\.\w+$/, "")
              .replace(/[-_]?logo[-_]?\d*$/i, "")
              .replace(/[-_]+/g, " ")
              .trim()
              .replace(/\b\w/g, (c) => c.toUpperCase());
            return (
            <CarouselItem key={src} className="pl-2 md:pl-4 basis-1/3 md:basis-1/4 lg:basis-1/5">
              <div className="flex items-center justify-center h-16">
                <div className="relative h-8 w-32 flex items-center justify-center">
                  <Image
                    src={src}
                    alt={`${platformName || "Platform"} logo`}
                    width={128}
                    height={32}
                    className="max-h-8 max-w-full object-contain opacity-60 hover:opacity-100 transition-opacity cursor-pointer filter grayscale hover:grayscale-0"
                    loading="lazy"
                    quality={75}
                    sizes="(max-width: 768px) 80px, 128px"
                  />
                </div>
              </div>
            </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}