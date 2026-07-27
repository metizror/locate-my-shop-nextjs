"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MapPin, Zap, Star } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 gradient-hero relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
      <div className="absolute top-10 left-10 h-20 w-20 bg-primary-foreground/10 rounded-full blur-xl" />
      <div className="absolute bottom-10 right-10 h-32 w-32 bg-primary-foreground/5 rounded-full blur-2xl" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground px-6 py-3 rounded-full text-sm font-medium border border-primary-foreground/20">
            <Zap className="h-4 w-4" />
            Ready to boost your store's discoverability?
          </div>

          {/* Main heading */}
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight text-primary-foreground">
              Ready to help customers find your stores faster?
            </h2>
            
            <p className="text-xl lg:text-2xl text-primary-foreground/80 leading-relaxed max-w-3xl mx-auto">
              Join growing Shopify stores using our store locator software to attract local shoppers and boost conversions.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              variant="secondary" 
              size="xl" 
              className="group shadow-elegant hover:shadow-glow transition-bounce"
              asChild
            >
              <a href="https://apps.shopify.com/store-locator-by-metizsoft?search_id=d4364157-915e-41b0-9b8f-380eabfd7a47&surface_detail=metizsoft&surface_inter_position=1&surface_intra_position=5&surface_type=search" target="_blank" rel="noopener noreferrer">
                <MapPin className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Start for Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            
            <Button 
              variant="secondary" 
              size="xl"
              className="bg-background text-foreground hover:bg-background/90 shadow-elegant"
              asChild
            >
              <a href="https://www.storelocator.in/contact" target="_blank" rel="noopener noreferrer">
                Schedule Demo
              </a>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12">
            <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground">
              <CardContent className="p-6 text-center space-y-2">
                <div className="flex justify-center">
                  <Star className="h-6 w-6 fill-current" />
                </div>
                <div className="text-2xl font-bold">4.9/5</div>
                <div className="text-sm opacity-80">Customer Rating</div>
              </CardContent>
            </Card>

            <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground">
              <CardContent className="p-6 text-center space-y-2">
                <div className="flex justify-center">
                  <MapPin className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">3000+</div>
                <div className="text-sm opacity-80">Active Stores</div>
              </CardContent>
            </Card>

            <Card className="bg-primary-foreground/10 backdrop-blur-sm border-primary-foreground/20 text-primary-foreground">
              <CardContent className="p-6 text-center space-y-2">
                <div className="flex justify-center">
                  <Zap className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">&lt; 5min</div>
                <div className="text-sm opacity-80">Setup Time</div>
              </CardContent>
            </Card>
          </div>

          {/* Footer note */}
          <div className="text-sm text-primary-foreground/70 pt-8">
            No credit card required • 14-day free trial • Cancel anytime
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute left-0 right-0 bottom-[-1px]">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
};

export default CTASection;