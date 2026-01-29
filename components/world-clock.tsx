"use client";

import { useState, useEffect, useCallback } from "react";
import { TimezoneCard } from "./timezone-card";
import { TimezoneSelector } from "./timezone-selector";
import { TimezoneGrid } from "./timezone-grid";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  TimezoneConfig,
  TimeRange,
  TIMEZONES,
  getDefaultTimezoneIds,
  getTimezoneById,
} from "@/lib/timezones";
import { syncTime } from "@/lib/time-sync";

const STORAGE_KEY = "worldclock-timezones";
const FORMAT_KEY = "worldclock-24h";
const MIN_TIMEZONES = 2;
const MAX_TIMEZONES = 6;

function loadSavedTimezones(): TimezoneConfig[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const ids: string[] = JSON.parse(saved);
      const timezones = ids
        .map((id) => getTimezoneById(id))
        .filter((tz): tz is TimezoneConfig => tz !== undefined);

      if (timezones.length >= MIN_TIMEZONES) {
        return timezones;
      }
    }
  } catch {
    // Ignore parse errors
  }

  return getDefaultTimezoneIds().map((id) => getTimezoneById(id)).filter(
    (tz): tz is TimezoneConfig => tz !== undefined
  );
}

function saveTimezones(timezones: TimezoneConfig[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(timezones.map((tz) => tz.id)));
}

export function WorldClock() {
  const [timezones, setTimezones] = useState<TimezoneConfig[]>([]);
  const [selectedRange, setSelectedRange] = useState<TimeRange | null>(null);
  const [use24h, setUse24h] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    syncTime();
    setTimezones(loadSavedTimezones());
    try {
      const saved = localStorage.getItem(FORMAT_KEY);
      if (saved !== null) setUse24h(JSON.parse(saved));
    } catch {}
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && timezones.length > 0) {
      saveTimezones(timezones);
    }
  }, [timezones, isLoaded]);

  const handleAddTimezone = useCallback((timezone: TimezoneConfig) => {
    setTimezones((prev) => {
      if (prev.length >= MAX_TIMEZONES) return prev;
      if (prev.some((tz) => tz.id === timezone.id)) return prev;
      return [...prev, timezone];
    });
  }, []);

  const handleToggle24h = useCallback(() => {
    setUse24h((prev) => {
      const next = !prev;
      localStorage.setItem(FORMAT_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const handleRemoveTimezone = useCallback((timezoneId: string) => {
    setTimezones((prev) => {
      if (prev.length <= MIN_TIMEZONES) return prev;
      return prev.filter((tz) => tz.id !== timezoneId);
    });
  }, []);

  if (!isLoaded) {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[140px] w-[180px] animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
        <div className="h-[400px] animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  const referenceTimezone = timezones[0];
  const canRemove = timezones.length > MIN_TIMEZONES;

  return (
    <div className="space-y-6 mb-32">
      {/* Controls */}
      <div className="flex items-center gap-3">
        <TimezoneSelector
          selectedTimezones={timezones}
          onAdd={handleAddTimezone}
          maxTimezones={MAX_TIMEZONES}
        />
        <div className="flex items-center rounded-lg border bg-card p-0.5">
          <Button
            variant={use24h ? "ghost" : "secondary"}
            size="sm"
            className="h-7 px-2.5 text-xs"
            onClick={!use24h ? undefined : handleToggle24h}
            aria-pressed={!use24h}
          >
            12h
          </Button>
          <Button
            variant={use24h ? "secondary" : "ghost"}
            size="sm"
            className="h-7 px-2.5 text-xs"
            onClick={use24h ? undefined : handleToggle24h}
            aria-pressed={use24h}
          >
            24h
          </Button>
        </div>
      </div>

      {/* Timezone cards */}
      <div className="flex flex-wrap items-start gap-4">
        {timezones.map((tz, index) => (
          <TimezoneCard
            key={tz.id}
            timezone={tz}
            referenceTimezone={index > 0 ? referenceTimezone : undefined}
            onRemove={() => handleRemoveTimezone(tz.id)}
            canRemove={canRemove}
            use24h={use24h}
          />
        ))}
      </div>

      <Separator />

      {/* Timezone comparison grid */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">
          Hourly Comparison
          <span className="ml-2 text-xs font-normal">
            (click and drag to select a time range)
          </span>
        </h2>
        <TimezoneGrid
          timezones={timezones}
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
          referenceTimezone={referenceTimezone}
          use24h={use24h}
        />
      </div>
    </div>
  );
}
