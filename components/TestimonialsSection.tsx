"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/testimonials";

const TestimonialsSection = () => {
  return (
    <section className="my-[10px] py-[10px] gradient-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
            What Our 
            <span className="gradient-hero bg-clip-text text-transparent"> Users Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Metizsoft
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={testimonial.name} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
                <Card 
                  className="group hover:shadow-elegant transition-smooth hover:-translate-y-1 gradient-card border-0 relative overflow-hidden h-full"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <CardContent className="p-6 space-y-4 flex flex-col h-full">
                    {/* Quote icon */}
                    <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Quote className="h-6 w-6 text-primary" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Content */}
                    <blockquote className="text-foreground leading-relaxed text-sm flex-grow">
                      "{testimonial.content}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-3 pt-3 border-t mt-auto">
                      <div className="h-10 w-10 rounded-full gradient-hero flex items-center justify-center text-primary-foreground font-semibold shadow-card text-sm">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.role}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>

        {/* Trust indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16 pt-16 border-t">
          <Card className="gradient-card border-0 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
                <Star className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div className="text-3xl font-bold text-primary mb-2">240+</div>
            <div className="text-sm text-muted-foreground">Professionals</div>
          </Card>
          <Card className="gradient-card border-0 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
                <Quote className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div className="text-3xl font-bold text-primary mb-2">15+</div>
            <div className="text-sm text-muted-foreground">Years of Experience</div>
          </Card>
          <Card className="gradient-card border-0 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
                <Star className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div className="text-3xl font-bold text-primary mb-2">2000+</div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </Card>
          <Card className="gradient-card border-0 p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
                <Quote className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
            <div className="text-3xl font-bold text-primary mb-2">46+</div>
            <div className="text-sm text-muted-foreground">Countries Globally</div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;