import { Check, MapPin, Upload, Globe, Filter, Palette, Smartphone, Settings, Zap, Users, BarChart, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";
import Link from "next/link";
import { pageSeo } from "@/lib/seo";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = pageSeo({
  title: "Best Shopify Store Locator App - Find Stores Easily | Metizsoft",
  description:
    "Enhance customer experience with a Shopify store locator app offering custom maps, bulk uploads, and mobile-friendly design. Helps users quickly find physical store locations.",
  path: "/features",
});

export default function FeaturesPage() {
  const featureCategories = [
    {
      title: "Location Management",
      description: "Powerful tools to manage your store locations efficiently",
      features: [
        { icon: <Settings className="h-6 w-6" />, title: "Easily Manage Locations", description: "Add, edit & delete locations with ease using our simple management dashboard." },
        { icon: <Upload className="h-6 w-6" />, title: "Bulk Upload", description: "Easily upload & update locations in bulk using our CSV template." },
        { icon: <BarChart className="h-6 w-6" />, title: "Google Sheets Sync", description: "Easily sync & update locations by syncing with Google Sheets." },
      ]
    },
    {
      title: "Search Functionality",
      description: "Advanced search capabilities for your customers",
      features: [
        { icon: <MapPin className="h-6 w-6" />, title: "Automatic Geolocation Capable", description: "Use HTML5 Geolocation or IP Geolocation with your Locator" },
        { icon: <Globe className="h-6 w-6" />, title: "Works Anywhere", description: "Our Locator App Works with Locations Worldwide" },
        { icon: <Filter className="h-6 w-6" />, title: "Product and Category Filters", description: "Users can filter your locations by type or products they carry." },
      ]
    },
    {
      title: "Customization",
      description: "Make your store locator match your brand perfectly",
      features: [
        { icon: <Palette className="h-6 w-6" />, title: "Customizable Design", description: "We can customize any aspect of your locator. Contact us with your specific use-case for more information." },
        { icon: <Smartphone className="h-6 w-6" />, title: "Responsive Layout", description: "Your store locator will look perfect on all devices - desktop, tablet, and mobile." },
        { icon: <MapPin className="h-6 w-6" />, title: "Custom Map Pins", description: "Custom icons or colors - Choose different pins per category, location type, etc..." },
        { icon: <Zap className="h-6 w-6" />, title: "Free Design Customization", description: "Free Locator Design Customization by our in-house team included." },
        { icon: <Palette className="h-6 w-6" />, title: "Custom Map Colors", description: "Give your locator a clean greyscale map, for example." },
        { icon: <Globe className="h-6 w-6" />, title: "In Your Language", description: "We Can Translate Our Locator Into Any Language." },
      ]
    },
    {
      title: "Integration & Support",
      description: "Seamless integration with unbeatable support",
      features: [
        { icon: <Settings className="h-6 w-6" />, title: "Works With All Websites", description: "Storepoint Locator works with all website platforms. Squarespace, Shopify, Wordpress, etc..." },
        { icon: <Headphones className="h-6 w-6" />, title: "Unbeatable Support", description: "Our support team is here to help you every step of the way." },
        { icon: <Users className="h-6 w-6" />, title: "Enterprise Ready", description: "Scalable solutions for businesses of all sizes." },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Features", path: "/features" }]} />
      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">MSPL Store Locator App Features</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">Questions about specific features or capabilities? Feel free to start a chat with us.</p>
          <Button size="lg" asChild>
            <a href="https://apps.shopify.com/store-locator-by-metizsoft?search_id=d4364157-915e-41b0-9b8f-380eabfd7a47&surface_detail=metizsoft&surface_inter_position=1&surface_intra_position=5&surface_type=search">Start Your Free Trial</a>
          </Button>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-6 max-w-7xl">
          {featureCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">{category.title}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{category.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.features.map((feature, featureIndex) => (
                  <Card key={featureIndex} className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">{feature.icon}</div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8">Join thousands of businesses already using MSPL Store Locator to help customers find their locations.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="https://apps.shopify.com/store-locator-by-metizsoft?search_id=d4364157-915e-41b0-9b8f-380eabfd7a47&surface_detail=metizsoft&surface_inter_position=1&surface_intra_position=5&surface_type=search">Start Free Trial</a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="https://www.storelocator.in/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}


