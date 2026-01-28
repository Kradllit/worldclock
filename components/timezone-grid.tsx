"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  TimezoneConfig,
  TimeRange,
  getHourInTimezone,
  formatHourShort,
  getDayName,
  getCurrentHour,
} from "@/lib/timezones";
import { cn } from "@/lib/utils";

interface TimezoneGridProps {
  timezones: TimezoneConfig[];
  selectedRange: TimeRange | null;
  onRangeChange: (range: TimeRange | null) => void;
  referenceTimezone: TimezoneConfig;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const CELL_HEIGHT = 32;

export function TimezoneGrid({
  timezones,
  selectedRange,
  onRangeChange,
  referenceTimezone,
}: TimezoneGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [currentHour, setCurrentHour] = useState<number>(
    getCurrentHour(referenceTimezone.timezone)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHour(getCurrentHour(referenceTimezone.timezone));
    }, 60000);
    return () => clearInterval(interval);
  }, [referenceTimezone.timezone]);

  const handleMouseDown = useCallback(
    (hour: number) => {
      setIsDragging(true);
      setDragStart(hour);
      onRangeChange({ startHour: hour, endHour: hour });
    },
    [onRangeChange]
  );

  const handleMouseMove = useCallback(
    (hour: number) => {
      if (isDragging && dragStart !== null) {
        const start = Math.min(dragStart, hour);
        const end = Math.max(dragStart, hour);
        onRangeChange({ startHour: start, endHour: end });
      }
    },
    [isDragging, dragStart, onRangeChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  const isInRange = (hour: number) => {
    if (!selectedRange) return false;
    return hour >= selectedRange.startHour && hour <= selectedRange.endHour;
  };

  return (
    <div className="relative">
      {selectedRange && (
        <div className="absolute -top-8 right-0 z-10 flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">
            {formatHourShort(selectedRange.startHour)} –{" "}
            {formatHourShort(selectedRange.endHour)}
          </span>
          <button
            onClick={() => onRangeChange(null)}
            className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            aria-label="Clear selection"
          >
            ×
          </button>
        </div>
      )}
      <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
        <div
          ref={gridRef}
          className="min-w-full select-none"
          style={{ touchAction: "manipulation" }}
        >
          {/* Header row */}
          <div className="sticky top-0 z-10 flex border-b bg-background">
            <div className="w-16 shrink-0 border-r p-2 text-xs font-medium text-muted-foreground">
              {referenceTimezone.label}
            </div>
            {timezones.map((tz) => (
              <div
                key={tz.id}
                className="min-w-[100px] flex-1 border-r p-2 text-center text-xs font-medium last:border-r-0"
              >
                {tz.city}
              </div>
            ))}
          </div>

          {/* Hour rows */}
          {HOURS.map((hour) => {
            const isCurrentHour = hour === currentHour;
            const inRange = isInRange(hour);

            return (
              <div
                key={hour}
                className={cn(
                  "flex border-b last:border-b-0 transition-colors",
                  isCurrentHour && "bg-primary/5"
                )}
                style={{ height: CELL_HEIGHT }}
                onMouseDown={() => handleMouseDown(hour)}
                onMouseEnter={() => handleMouseMove(hour)}
              >
                {/* Reference timezone hour label */}
                <div
                  className="w-16 shrink-0 border-r p-1 text-xs flex items-center justify-center text-muted-foreground"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {formatHourShort(hour)}
                </div>

                {/* Timezone columns */}
                {timezones.map((tz) => {
                  const { hour: targetHour, dayOffset } = getHourInTimezone(
                    referenceTimezone.timezone,
                    tz.timezone,
                    hour
                  );
                  return (
                    <div
                      key={tz.id}
                      className={cn(
                        "min-w-[100px] flex-1 border-r p-1 text-xs flex items-center justify-center gap-1 last:border-r-0 cursor-pointer transition-colors text-muted-foreground",
                        inRange && "bg-blue-200 dark:bg-blue-800/50 text-foreground",
                        isCurrentHour && !inRange && "bg-primary/5"
                      )}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      <span>
                        {formatHourShort(targetHour)}
                      </span>
                      {dayOffset !== 0 && (
                        <span className="text-[10px] text-orange-600 dark:text-orange-400 font-medium">
                          {getDayName(dayOffset)}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
