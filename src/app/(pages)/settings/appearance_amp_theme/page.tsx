import { HeaderSection } from "@/components/custom/header-section";
import { SunMoon } from "lucide-react";
import ThemeSwapper from "./components/theme-swapper";

export default function ApearenceAmpTheme() {
  return (
    <main className="relative h-full w-full place-items-center py-4 px-12 md:px-6">
      <section className="max-w-256 w-full min-h-full space-y-6">
        <h1 className="text-2xl font-extralight text-muted-foreground">
          Appearence & Theme
        </h1>

        <section className="space-y-12">
          <HeaderSection
            header={
              <span className="flex gap-2 items-center">
                <SunMoon className="size-4" />
                <p>Theme Swapper</p>
              </span>
            }
          >
            <ThemeSwapper />
          </HeaderSection>
        </section>
      </section>
    </main>
  );
}

// TODO;
