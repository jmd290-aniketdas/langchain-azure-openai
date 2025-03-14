import { OctagonAlert } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative h-screen">
      <section className="size-full flex items-center justify-center gap-6">
        <OctagonAlert className="stroke-3 size-32 stroke-muted" />
        <h1 className="capitalize text-9xl font-extrabold text-muted">
          Not Found
        </h1>
      </section>
    </main>
  );
}
