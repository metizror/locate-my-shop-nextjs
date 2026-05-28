"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
// Updated to use uploaded image

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center gradient-section overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 my-[15px] py-[10px] pointer-events-none" />
      
      <div className="container mx-auto px-4 py-16 md:py-20 lg:py-24 pt-[10px] pb-[10px] relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left content */}
          <div className="space-y-6 md:space-y-8 animate-fade-in-up">
            <div className="space-y-3 md:space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-bold leading-tight tracking-tight">
                 Store Locator App – <br />
                <span className="gradient-hero bg-clip-text text-transparent block sm:inline"> Bulk Upload, Custom Maps & Advanced Analytics</span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                Empower customers to find your stores with our  store locator app for easy setup and real-time store management.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
              <Button
                variant="hero"
                size="xl"
                className="group px-6 md:px-8 py-3 md:py-4 text-sm md:text-base"
                aria-label="Get Started for Free"
                onClick={() => {
                  window.open(
                    "https://apps.shopify.com/store-locator-by-metizsoft?search_id=d4364157-915e-41b0-9b8f-380eabfd7a47&surface_detail=metizsoft&surface_inter_position=1&surface_intra_position=5&surface_type=search",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                Get Started for Free
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
              </Button>

              <Button
                variant="outline"
                size="xl"
                className="px-6 md:px-8 py-3 md:py-4 text-sm md:text-base"
                aria-label="View Examples"
                asChild
              >
                <Link
                  href="/store-locator-examples"
                  rel="noopener noreferrer"
                >
                  View Examples
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 pt-4 md:pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent flex-shrink-0" />
                <span>3000+ Active Stores</span>
              </div>
              <div className="hidden sm:block h-4 w-px bg-border" />
              <span>⭐ 4.9/5 Rating</span>
              <div className="hidden sm:block h-4 w-px bg-border" />
              <span>Free Setup</span>
            </div>
          </div>

          {/* Right content - Hero Image */}
          <div className="relative animate-float mt-8 lg:mt-0">
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden shadow-elegant">
              <Image
                src="/lovable-uploads/store-locator-hero.jpg"
                alt="One app for all your store locator needs - find, manage and showcase your store locations on a world map"
                width={1600}
                height={900}
                className="w-full h-auto object-cover"
                priority
                fetchPriority="high"
                quality={80}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating elements - Hidden on mobile for cleaner look */}
            <div className="hidden md:block absolute -top-2 md:-top-4 -right-2 md:-right-4 bg-accent text-accent-foreground px-3 md:px-4 py-1 md:py-2 rounded-full shadow-card animate-bounce">
              <span className="font-semibold text-sm md:text-base">Live Updates</span>
            </div>
            
            <div className="hidden md:block absolute -bottom-4 md:-bottom-6 -left-4 md:-left-6 bg-card border shadow-card px-4 md:px-6 py-3 md:py-4 rounded-lg">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="h-2 w-2 md:h-3 md:w-3 bg-accent rounded-full animate-pulse" />
                <span className="text-xs md:text-sm font-medium">Real-time Location Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;