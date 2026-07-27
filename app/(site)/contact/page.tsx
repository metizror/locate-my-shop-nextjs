import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";
import { pageSeo } from "@/lib/seo";

export const metadata: Metadata = pageSeo({
  title: "Contact Us - Best Store Locator App",
  description: "Have questions? Contact us to explore how our Store Locator can boost your business. Let’s connect and build success together.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageClient />;
}

