// Critical CSS - loaded first for FCP optimization
import "./globals.css";
// Quill CSS - only loaded when rich text editor is used (admin/blog pages)
// This will be tree-shaken if not used, but we import it here for blog prose styles
// Consider moving to blog layout if not needed on all pages
import "@/styles/quill.css";
import type { Metadata } from "next";
import Script from "next/script";
import { ReactQueryClientProvider } from "@/components/providers/ReactQueryClientProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSiteBaseUrl } from "@/lib/site";
import { SITE_NAME, OG_IMAGE, OG_IMAGE_ALT } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: "Best Shopify Store Locator App - Find Stores Easily",
    template: "%s",
  },
  description:
    "Metizsoft's Shopify app helps customers find stores quickly with custom maps, bulk uploads, and mobile-friendly design. Ideal for businesses needing efficient store location solutions.",
  // Canonical base for all metadata/canonical URLs. getSiteBaseUrl() enforces
  // the canonical www host, so relative `alternates.canonical` values resolve
  // to www.storelocator.in site-wide (matching the apex->www 301 redirect).
  metadataBase: new URL(getSiteBaseUrl()),
  // Explicit indexing directive (best practice). Emits
  // <meta name="robots" content="index, follow"> site-wide.
  robots: {
    index: true,
    follow: true,
  },
  // Site-wide social-share defaults. Pages that define their own openGraph /
  // twitter (via pageSeo) replace these; pages that don't (e.g. admin) still
  // get a valid card with the default 1200x630 image.
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: OG_IMAGE_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    images: [OG_IMAGE],
  },
  icons: {
    icon: "/lovable-uploads/e38b2a7e-a356-4be7-a266-c52662189454.png",
    apple: "/lovable-uploads/e38b2a7e-a356-4be7-a266-c52662189454.png",
    shortcut: "/lovable-uploads/e38b2a7e-a356-4be7-a266-c52662189454.png",
  },
  // Optional: allow Search Console verification via meta tag
  // Add token in NEXT_PUBLIC_GSC_VERIFICATION to emit the tag
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to critical external origins for faster resource loading */}
        {/* Fonts - critical for FCP, use preconnect with crossorigin */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preconnect to same origin for faster CSS/JS loading - only in production */}
        {process.env.NODE_ENV === 'production' && (
          <link
            rel="preconnect"
            href={getSiteBaseUrl()}
          />
        )}
        
        {/* Analytics - non-critical, use dns-prefetch only */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* YouTube - for iframe, use dns-prefetch */}
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        
        {/* Mobile optimization - prevent layout shift */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta name="theme-color" content="#2a2273" />
        {/* Google Tag Manager - placed as high in <head> as possible */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TVF5X55K');
          `}
        </Script>
        {/* Google Analytics 4 - keep GA4 via gtag; can also be managed via GTM if desired */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-1WZ6ETL5GR"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-1WZ6ETL5GR');
          `}
        </Script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) - immediately after opening <body> */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TVF5X55K"
              height="0" width="0" style="display:none;visibility:hidden"></iframe>
            `,
          }}
        />
        <ReactQueryClientProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <main>{children}</main>
          </TooltipProvider>
        </ReactQueryClientProvider>
        {/* Zoho SalesIQ chatbot widget - loaded after page is interactive */}
        <Script id="zsiq-init" strategy="afterInteractive">
          {`window.$zoho=window.$zoho || {};$zoho.salesiq=$zoho.salesiq||{ready:function(){}}`}
        </Script>
        <Script
          id="zsiqscript"
          src="https://salesiq.zohopublic.com/widget?wc=siq552498784fd12a0133dd92b74bac529520573f8dc546601075130cfee568405d9a756a2eb4968d571f1b577ed8e25ae8"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

