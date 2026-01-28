"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TimezoneConfig,
  formatTimeLarge,
  formatAmPm,
  formatDate,
  getTimeDifference,
} from "@/lib/timezones";

interface TimezoneCardProps {
  timezone: TimezoneConfig;
  referenceTimezone?: TimezoneConfig;
  onRemove?: () => void;
  canRemove?: boolean;
}

export function TimezoneCard({
  timezone,
  referenceTimezone,
  onRemove,
  canRemove = true,
}: TimezoneCardProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeDiff =
    referenceTimezone && referenceTimezone.id !== timezone.id
      ? getTimeDifference(referenceTimezone.timezone, timezone.timezone)
      : null;

  return (
    <Card className="relative min-w-[180px]">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">{timezone.city}</h3>
              <Badge variant="secondary" className="text-xs">
                {timezone.label}
              </Badge>
            </div>
            {timeDiff && (
              <span className="text-xs text-muted-foreground">{timeDiff}</span>
            )}
          </div>
          {canRemove && onRemove && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              onClick={onRemove}
              aria-label={`Remove ${timezone.city}`}
            >
              ×
            </Button>
          )}
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          <span
            className="text-4xl font-light tracking-tight"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {formatTimeLarge(currentTime, timezone.timezone)}
          </span>
          <span className="text-lg text-muted-foreground">
            {formatAmPm(currentTime, timezone.timezone)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {formatDate(currentTime, timezone.timezone)}
        </p>
      </CardContent>
    </Card>
  );
}
