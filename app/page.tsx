import { WorldClock } from "@/components/world-clock";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-6xl mx-auto">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight" style={{ textWrap: "balance" }}>
            World Clock
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compare times across multiple time zones
          </p>
          <p className="text-xs text-muted-foreground/60 mt-0.5">
            Synchronized with Google&apos;s public time service backed by atomic clocks
          </p>
        </div>
        <ThemeToggle />
      </header>
      <WorldClock />
    </main>
  );
}
