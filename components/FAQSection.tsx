"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Is the app easy to install?",
    answer: "Yes, the app is user-friendly and integrates seamlessly with Shopify. Installation takes just a few clicks from the Shopify App Store, and our setup wizard guides you through the entire process."
  },
  {
    question: "How do I add multiple stores?",
    answer: "You can bulk upload store locations using a CSV file for quick setup, or add them individually through our intuitive interface."
  },
  {
    question: "Is there a free trial available?",
    answer: "Yes! The app offers a free plan for up to 3 locations with no time limit. All paid plans also come with a 14-day free trial."
  },
  {
    question: "Is the store locator mobile - friendly?",
    answer: "Yes, the app is fully responsive and works perfectly across all devices — desktops, tablets, and smartphones. Customers can locate stores, get directions, and contact outlets directly from their phones."
  },
  {
    question: "Do I need technical knowledge to set it up?",
    answer: "No technical expertise is required. The app is built for everyone — just install it, upload your store data, and embed it on your preferred page. Setup takes only a few minutes."
  },
  {
    question: "can i customize the map design to my store theme?",
    answer: "Yes. You can easily change map colors, pin icons, and layouts to align with your brand's Shopify theme. Every part of the locator can be personalized to match your design style."
  },
  {
    question: "Can I add a store locator for my website without coding?",
    answer: "Yes, you can add a store locator for your website without writing any code. The Shopify Store Locator App provides a plug-and-play setup, allowing you to display your locations within minutes."
  },
  {
    question: "What's the difference between a store locator map and store locator software?",
    answer: "A store locator map focuses on showing your stores visually to customers, while store locator software includes management tools like analytics, bulk uploads, and customization."
  },
  {
    question: "How does a store locator widget help improve user experience?",
    answer: "Adding a store locator widget helps customers find your outlets without leaving your website. It creates a quick, direct path from online search to in-store visit — saving time and reducing friction."
  },
  {
    question: "Does having a store locator map improve local SEO?",
    answer: "Yes. Embedding a store locator map helps search engines recognize your physical locations. It increases the chances of appearing in \"near me\" searches and local results, driving more organic foot traffic."
  }
];

const FAQItem = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden transition-smooth hover:shadow-md">
        <CollapsibleTrigger className="w-full text-left p-6 flex items-start justify-between gap-4 group">
          <h3 className="font-medium text-[#0B0B45] leading-relaxed pr-2" style={{ fontFamily: 'Inter', fontWeight: 500 }}>
            {question}
          </h3>
          <ChevronDown 
            className={`h-5 w-5 text-[#0B0B45] shrink-0 transition-transform duration-300 mt-0.5 ${isOpen ? 'rotate-180' : ''}`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
          <div className="px-6 pb-6 pt-0">
            <div className="border-t border-border/50 pt-4">
              <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: 'Inter', fontWeight: 400 }}>
                {answer}
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

const FAQSection = () => {
  const leftColumnFaqs = faqs.filter((_, index) => index % 2 === 0);
  const rightColumnFaqs = faqs.filter((_, index) => index % 2 === 1);

  // Generate JSON-LD schema for FAQs
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <section className="py-[10px] bg-gradient-to-b from-background to-muted/30">
      {/* Server-rendered JSON-LD so all crawlers (not just JS-rendering ones)
          see the FAQ structured data in the initial HTML. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container mx-auto px-4 pt-[20px]">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Frequently Asked
              <span className="gradient-hero bg-clip-text text-transparent"> Questions</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Got questions? We've got answers. Find everything you need to know about our store locator app.
            </p>
          </div>

          {/* Two-Column FAQ Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {/* Left Column */}
            <div className="space-y-4">
              {leftColumnFaqs.map((faq, index) => (
                <FAQItem 
                  key={index * 2} 
                  question={faq.question} 
                  answer={faq.answer}
                  index={index * 2}
                />
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {rightColumnFaqs.map((faq, index) => (
                <FAQItem 
                  key={index * 2 + 1} 
                  question={faq.question} 
                  answer={faq.answer}
                  index={index * 2 + 1}
                />
              ))}
            </div>
          </div>

          {/* Still have questions CTA */}
          <div className="text-center mt-12">
            <div className="inline-block bg-white rounded-lg shadow-sm border border-border p-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-[#0B0B45]" style={{ fontFamily: 'Inter', fontWeight: 500 }}>
                  Still have questions?
                </h4>
                <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Inter', fontWeight: 400 }}>
                  Our support team is here to help you succeed
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
                  <a 
                    href="mailto:support@metizsoft.com" 
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Email Support
                  </a>
                  <div className="hidden sm:block h-4 w-px bg-border" />
                  <a 
                    href="#" 
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Live Chat
                  </a>
                  <div className="hidden sm:block h-4 w-px bg-border" />
                  <a 
                    href="https://support.metizsoft.com/portal/en/kb/store-locator-by-metizsoft" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Documentation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;