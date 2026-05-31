import Link from "next/link";
import { nav, site } from "@/lib/site";
import Button from "@/components/ui/Button";

const columns = nav.filter((n) =>
  ["Services", "Industries", "Case Studies", "Packages"].includes(n.label)
);

export default function Footer() {
  return (
    <footer className="relative z-10 bg-surface/40">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Link href="/" className="font-display text-2xl font-bold">
              KIOSK<span className="text-accent">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">
              {site.tagline}
            </p>
            <div className="mt-6">
              <Button href="/contact" className="px-5 py-2.5">
                Book A Strategy Call
              </Button>
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-fog">
                  Info
                </h3>
                <ul className="space-y-2 text-sm text-mist">
                  {site.phones.map((phone) => (
                    <li key={phone}>
                      <a
                        href={`tel:${phone.replace(/\s/g, "")}`}
                        className="transition-colors hover:text-paper"
                      >
                        {phone}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a
                      href={`mailto:${site.email}`}
                      className="transition-colors hover:text-paper"
                    >
                      {site.email}
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-fog">
                  Address
                </h3>
                <p className="text-sm leading-relaxed text-mist">
                  {site.address.line1}
                  <br />
                  {site.address.line2}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.href}>
                <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-fog">
                  {col.label}
                </h3>
                <ul className="space-y-2.5">
                  {col.children?.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        className="text-sm text-mist transition-colors hover:text-paper"
                      >
                        {c.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-line pt-8 text-sm text-fog sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.fullName}. CR No: {site.crNumber}.
            All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href={`mailto:${site.email}`} className="hover:text-paper">
              {site.email}
            </a>
            <a
              href={site.websiteUrl}
              className="hover:text-paper"
              target="_blank"
              rel="noopener noreferrer"
            >
              {site.website}
            </a>
            <span>{site.location}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
