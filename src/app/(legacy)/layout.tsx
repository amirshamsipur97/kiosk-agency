import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SiteBackground from "@/components/background/SiteBackground";
import Preloader from "@/components/Preloader";

/**
 * Chrome for the pre-2026 inner pages (services, industries, packages, …).
 * The homepage now lives outside this group and ships its own shell, so all of
 * the old furniture — preloader, WebGL background, header, footer — is scoped
 * here rather than in the root layout.
 */
export default function LegacyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="legacy-shell relative flex min-h-full flex-col">
      <Preloader />
      <SiteBackground />
      {/* Soft fade from the hero down into pure black for the rest of the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[88vh] z-[1]"
        style={{
          background: "linear-gradient(to bottom, rgba(0,0,0,0) 0, #000 900px)",
        }}
      />
      <Header />
      <main className="relative z-10 flex-1">{children}</main>
      <Footer />
    </div>
  );
}
