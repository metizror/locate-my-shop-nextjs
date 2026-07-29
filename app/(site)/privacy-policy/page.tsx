import type { Metadata } from "next";
import { pageSeo } from "@/lib/seo";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const metadata: Metadata = pageSeo({
  title: "MSPL Store Locator – Privacy Policy",
  description:
    "Your data matters at StoreLocator.in. Review our Privacy Policy to understand information collection and protection practices.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Privacy Policy", path: "/privacy-policy" }]} />
      <article className="container mx-auto px-4 py-12 lg:py-20 ">
        <header className="mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Your Privacy is our Priority!
          </h1>
        </header>

        <div className="prose prose-neutral max-w-none space-y-10">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">WHO WE ARE?</h2>
            <p className="text-muted-foreground leading-relaxed">
              StoreLocator.in is a technology-driven platform focused on helping businesses
              showcase their store locations clearly and accurately across digital channels. We
              specialize in building smart, scalable store locator solutions that work seamlessly
              across websites, mobile platforms, and online ecosystems.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Our team is dedicated to creating high-performance location-based solutions that
              improve customer experience, increase discoverability, and simplify how users find
              physical stores. Every feature is designed with usability, accuracy, and business
              growth in mind.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We are committed to maintaining the trust of our users and partners by delivering
              reliable, secure, and high-quality services that help businesses strengthen their
              local presence and stand out in competitive markets.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Our website address is{" "}
              <a
                href="https://www.storelocator.in/"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.storelocator.in/
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">SUPPORT</h2>
            <p className="text-muted-foreground leading-relaxed">
              We collect contact information from our users and clients to provide support
              related to the setup, configuration, and use of StoreLocator.in services on their
              websites and platforms. This information helps us assist with implementation,
              resolve technical issues, and respond to support requests efficiently.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We may also retain contact details to communicate with users regarding service
              updates, feature enhancements, important notifications, and any changes to our
              policies. These communications are strictly related to support, service
              functionality, and platform updates.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              ACCESS TO YOUR PERSONAL INFORMATION
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              You have the right to access, review, update, or request deletion of the personal
              information we hold about you. All personal data collected and used by
              StoreLocator.in is limited strictly to you and is handled securely.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              If you wish to modify or remove your personal information, you may contact us at
              any time. We take appropriate measures to protect and secure your personal data
              and do not share it without proper authorization.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              WHAT DO WE DO WITH YOUR INFORMATION?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Your personal information is kept safe with us. We may collect personal details
              such as your name, email address, phone number, and business-related information
              when you interact with our platform.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              When you visit our website, we may automatically receive your device&apos;s internet
              protocol (IP) address to help us understand browser type, operating system, and
              usage behavior. This information assists us in improving platform performance and
              user experience.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              We may also use your contact information to send emails related to service
              updates, policy changes, feature announcements, and important platform-related
              communications.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">CONSENT</h2>
            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">
              How do we get your consent?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              When you provide your personal information while signing up, submitting a request,
              or contacting us, you consent to our collection and use of that information solely
              for the specific purpose for which it was provided. We do not use your personal
              data for any unrelated or unauthorized purpose.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              If we require your personal information for any secondary reason, we will request
              your consent explicitly.
            </p>
            <h3 className="text-lg font-medium text-foreground mt-6 mb-2">
              How can you withdraw your consent?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              If you change your mind, you may withdraw your consent for us to contact you or
              use your personal information at any time by contacting us at:
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              <a href="mailto:hello@metizsoft.com" className="text-primary hover:underline">
                hello@metizsoft.com
              </a>{" "}
              or A-802, Ganesh Plaza, Navrangpura, Ahmedabad – 380009
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">DISCLOSURE</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you violate our Terms and Conditions, we may disclose your personal information
              if required to do so by law, regulation, legal process, or governmental request.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">PAYMENT</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you choose to complete a transaction through a direct payment gateway, we may
              accept online payment methods such as credit or debit cards. Payment-related
              information is processed securely through trusted third-party payment service
              providers and is retained only for as long as necessary to complete the
              transaction.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              All direct payment gateways adhere to PCI-DSS (Payment Card Industry Data Security
              Standard) requirements, as managed by the PCI Security Standards Council, a joint
              effort of brands including Visa, MasterCard, American Express, and Discover.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">THIRD-PARTY SERVICES</h2>
            <p className="text-muted-foreground leading-relaxed">
              Third-party service providers used by StoreLocator.in will collect, use, and
              disclose your information only to the extent necessary to perform the services
              they provide to us.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Certain third-party providers, such as payment gateways and transaction
              processors, have their own privacy policies governing the use of your personal
              information. We recommend reviewing their privacy policies to understand how your
              information is handled by these providers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">LINKS</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you click on links available on our website, you may be redirected to
              external websites that are not operated by StoreLocator.in. We are not responsible
              for the privacy practices or content of such third-party websites and encourage
              you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">SECURITY</h2>
            <p className="text-muted-foreground leading-relaxed">
              We take reasonable and appropriate precautions to protect your personal
              information. We follow industry best practices to ensure that your data is not
              lost, misused, accessed without authorization, disclosed, altered, or destroyed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">COOKIES</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to enhance user experience, analyze
              website traffic, and improve platform functionality. Cookies may store session
              information, user preferences, and anonymous usage data.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              You can choose to disable cookies through your browser settings; however, doing
              so may affect certain features or functionality of the website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">AGE OF CONSENT</h2>
            <p className="text-muted-foreground leading-relaxed">
              By using this website, you represent that you are at least the age of majority in
              your state, country, or province of residence. You also confirm that you have the
              legal capacity to use this site or have given consent for any dependent minors to
              use it under your supervision.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              CHANGES TO THIS PRIVACY POLICY
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify this Privacy Policy at any time. Any changes will
              take effect immediately upon being posted on the website. We encourage you to
              review this page periodically to stay informed about how we protect your
              information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              QUESTIONS AND CONTACT INFORMATION
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you would like to access, correct, amend, or delete any personal information
              we hold about you, or if you wish to register a complaint or seek further
              clarification, please contact us at:
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              A-802, Ganesh Plaza, Navrangpura, Ahmedabad, Gujarat. Code – 380009
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
