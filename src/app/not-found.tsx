import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-32 text-center">
      <div>
        <p className="font-display text-7xl font-semibold text-accent md:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-semibold md:text-3xl">
          This page doesn&apos;t exist
        </h1>
        <p className="mx-auto mt-3 max-w-md text-mist">
          The page you&apos;re looking for may have moved. Let&apos;s get you
          back to building.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/">Back Home</Button>
          <Button href="/contact" variant="ghost">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
