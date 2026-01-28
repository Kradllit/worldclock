"use client";

import { useState, useEffect, useCallback } from "react";
import { TimezoneCard } from "./timezone-card";
import { TimezoneSelector } from "./timezone-selector";
import { TimezoneGrid } from "./timezone-grid";
import { Separator } from "@/components/ui/separator";
import {
  TimezoneConfig,
  TimeRange,
  TIMEZONES,
  DEFAULT_TIMEZONE_IDS,
  getTimezoneById,
} from "@/lib/timezones";

const STORAGE_KEY = "worldclock-timezones";
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

  return DEFAULT_TIMEZONE_IDS.map((id) => getTimezoneById(id)).filter(
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimezones(loadSavedTimezones());
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
    <div className="space-y-6">
      {/* Add timezone control */}
      <TimezoneSelector
        selectedTimezones={timezones}
        onAdd={handleAddTimezone}
        maxTimezones={MAX_TIMEZONES}
      />

      {/* Timezone cards */}
      <div className="flex flex-wrap items-start gap-4">
        {timezones.map((tz, index) => (
          <TimezoneCard
            key={tz.id}
            timezone={tz}
            referenceTimezone={index > 0 ? referenceTimezone : undefined}
            onRemove={() => handleRemoveTimezone(tz.id)}
            canRemove={canRemove}
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
        />
      </div>
    </div>
  );
}
