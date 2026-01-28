import { WorldClock } from "@/components/world-clock";

export default function Home() {
  return (
    <main className="min-h-screen p-4 sm:p-8 pb-24 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight" style={{ textWrap: "balance" }}>
          World Clock
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compare times across multiple time zones
        </p>
      </header>
      <WorldClock />
    </main>
  );
}
