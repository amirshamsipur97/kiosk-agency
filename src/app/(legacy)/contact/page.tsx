import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/contact/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact",
  description:
    "Let's build your next growth system. Book a consultation, message us on WhatsApp, or send an inquiry.",
};

const channels = [
  { label: "Email us", value: site.email, href: `mailto:${site.email}` },
  { label: "Website", value: site.website, href: site.websiteUrl },
  {
    label: "WhatsApp",
    value: site.whatsapp,
    href: `https://wa.me/${site.whatsapp.replace(/[^0-9]/g, "")}`,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's build your next growth system"
        description="Book a consultation and we'll map the system your business needs — strategy, build, and scale."
      />

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={120} className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-semibold">
              Other ways to reach us
            </h2>

            {/* Call lines */}
            <div className="rounded-2xl border border-line bg-surface p-6">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-fog">
                Call us
              </span>
              <div className="mt-3 space-y-2">
                {site.phones.map((phone, i) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="group flex items-baseline gap-3 transition-colors hover:text-accent"
                  >
                    <span className="text-xs text-fog">
                      Line {i + 1}
                    </span>
                    <span className="font-display text-lg">{phone}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick channels */}
            {channels.map((c) => (
              <a
                key={c.label}
                href={c.href}
                className="group rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent/40 hover:bg-surface-2"
              >
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-fog">
                  {c.label}
                </span>
                <p className="mt-2 font-display text-lg transition-colors group-hover:text-accent">
                  {c.value}
                </p>
              </a>
            ))}

            {/* Office address */}
            <div className="rounded-2xl border border-line bg-surface p-6">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-fog">
                Office
              </span>
              <p className="mt-2 font-display text-lg leading-snug">
                {site.address.line1}
                <br />
                {site.address.line2}
              </p>
              <p className="mt-3 text-sm text-fog">CR No: {site.crNumber}</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
