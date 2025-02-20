import { ThemeToggle } from "@/components/custom/theme-toggle";

export default function Home() {
  return (
    <main className="h-screen w-screen relative">
      <section className="size-full flex flex-col items-center justify-center gap-3">
        <h1 className="capitalize text-9xl font-extrabold text-muted">
          HOME
        </h1>
        <ThemeToggle />
      </section>
    </main>
  );
}
