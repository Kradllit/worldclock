# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev      # start dev server (localhost:3000)
bun run build    # production build
bun run start    # start production server
bun run lint     # ESLint
```

**Always use `bun` and `bunx` — never `npm`, `npx`, `yarn`, or `pnpm`.**

## Architecture

Real-time timezone comparison app built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, and date-fns-tz.

### Component Hierarchy

`WorldClock` is the sole orchestrator. It owns all state (selected timezones, time range, 24h format preference) and passes it down via props. Children are controlled components with no shared state.

```
app/page.tsx (Server Component)
  └─ WorldClock (client) — state owner
       ├─ TimezoneSelector — popover search to add/remove zones (2–6 zones)
       ├─ TimezoneCard[] — live time per zone, updates every 1s
       └─ TimezoneGrid — 24-row hourly comparison, drag-to-select range, updates every 60s
```

### Time Synchronization

**Never use `new Date()` directly.** Always use `getNow()` from `lib/time-sync.ts`.

On mount, `syncTime()` sends a HEAD request to `https://time.google.com`, reads the `Date` header, and stores the offset from the local clock. `getNow()` applies this offset to `Date.now()`. If the fetch fails, it falls back to the local clock silently.

All formatting and calculation functions in `lib/timezones.ts` use `getNow()` internally.

### Reference Timezone Pattern

The first timezone in the array is the "reference." Grid hours are labeled in the reference timezone, and `TimezoneCard` shows time differences relative to it. `getHourInTimezone()` maps hours from the reference to each target, tracking day offsets when crossing midnight.

### Persistence

localStorage keys:
- `worldclock-timezones` — array of timezone IDs
- `worldclock-24h` — boolean for 12h/24h format

Default timezones are detected from the user's `Intl.DateTimeFormat` locale, falling back to `["sf", "chicago", "kyiv"]`.

### Styling

- Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config.ts`)
- OKLch color variables in `app/globals.css` with light/dark mode via CSS `.dark` class
- shadcn/ui components in `components/ui/` (New York style, neutral base)
- `cn()` helper in `lib/utils.ts` (clsx + tailwind-merge)
- Dark mode managed by `next-themes` ThemeProvider

### Key Conventions

- `"use client"` on all interactive components; root layout stays a Server Component
- Timezone data is a hardcoded array of 140+ cities in `lib/timezones.ts` with `{ id, city, timezone, label, flag }` shape
- Format functions accept optional `use24h` parameter where applicable
- Grid performance: card timers tick at 1s, grid timer ticks at 60s
