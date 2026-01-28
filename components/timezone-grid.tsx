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
const CELL_HEIGHT = 40;

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
  const [currentMinute, setCurrentMinute] = useState<number>(
    new Date().getMinutes()
  );

  useEffect(() => {
    const updateTime = () => {
      setCurrentHour(getCurrentHour(referenceTimezone.timezone));
      setCurrentMinute(new Date().getMinutes());
    };
    const interval = setInterval(updateTime, 60000);
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

  // Calculate the position of the "now" line (header height + hours * cell height + minute offset)
  const headerHeight = 48;
  const nowLinePosition = headerHeight + (currentHour * CELL_HEIGHT) + (currentMinute / 60) * CELL_HEIGHT;

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
            className="text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-1"
            aria-label="Clear selection"
          >
            ×
          </button>
        </div>
      )}
      <ScrollArea className="w-full whitespace-nowrap rounded-xl border bg-card">
        <div
          ref={gridRef}
          className="min-w-full select-none relative"
          style={{ touchAction: "manipulation" }}
        >
          {/* Current time indicator line */}
          <div
            className="absolute left-0 right-0 z-20 pointer-events-none flex items-center"
            style={{ top: nowLinePosition }}
          >
            <div className="w-14 flex justify-end pr-1">
              <div className="w-2 h-2 rounded-full bg-fuchsia-500" />
            </div>
            <div className="flex-1 h-[2px] bg-fuchsia-500" />
          </div>

          {/* Header row */}
          <div className="sticky top-0 z-10 flex bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80" style={{ height: headerHeight }}>
            <div className="w-14 shrink-0 p-3 text-xs font-medium text-muted-foreground flex items-center justify-center">

            </div>
            {timezones.map((tz) => (
              <div
                key={tz.id}
                className="min-w-[90px] flex-1 p-3 text-center flex flex-col items-center justify-center"
              >
                <span className="text-xs font-semibold text-foreground">{tz.city}</span>
                <span className="text-[10px] text-muted-foreground">{tz.label}</span>
              </div>
            ))}
          </div>

          {/* Hour rows */}
          {HOURS.map((hour) => {
            const inRange = isInRange(hour);

            return (
              <div
                key={hour}
                className={cn(
                  "flex transition-colors",
                  inRange && "bg-pink-100 dark:bg-pink-900/40"
                )}
                style={{ height: CELL_HEIGHT }}
                onMouseDown={() => handleMouseDown(hour)}
                onMouseEnter={() => handleMouseMove(hour)}
              >
                {/* Reference timezone hour label */}
                <div
                  className="w-14 shrink-0 px-2 text-xs flex items-center justify-end text-muted-foreground"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {formatHourShort(hour)}
                </div>

                {/* Timezone columns */}
                {timezones.map((tz, index) => {
                  const { hour: targetHour, dayOffset } = getHourInTimezone(
                    referenceTimezone.timezone,
                    tz.timezone,
                    hour
                  );
                  return (
                    <div
                      key={tz.id}
                      className={cn(
                        "min-w-[90px] flex-1 px-2 text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-colors",
                        inRange
                          ? "text-pink-700 dark:text-pink-300 font-medium"
                          : "text-foreground/70 hover:text-foreground hover:bg-muted/50",
                        index > 0 && "border-l border-border/50"
                      )}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      <span>{formatHourShort(targetHour)}</span>
                      {dayOffset !== 0 && (
                        <span className="text-[10px] text-orange-500 dark:text-orange-400 font-semibold">
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
