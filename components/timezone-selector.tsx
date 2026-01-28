"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIMEZONES, TimezoneConfig } from "@/lib/timezones";

interface TimezoneSelectorProps {
  selectedTimezones: TimezoneConfig[];
  onAdd: (timezone: TimezoneConfig) => void;
  maxTimezones?: number;
}

export function TimezoneSelector({
  selectedTimezones,
  onAdd,
  maxTimezones = 5,
}: TimezoneSelectorProps) {
  const availableTimezones = TIMEZONES.filter(
    (tz) => !selectedTimezones.some((selected) => selected.id === tz.id)
  );

  const canAdd = selectedTimezones.length < maxTimezones;

  if (!canAdd || availableTimezones.length === 0) {
    return null;
  }

  return (
    <Select
      onValueChange={(value) => {
        const timezone = TIMEZONES.find((tz) => tz.id === value);
        if (timezone) {
          onAdd(timezone);
        }
      }}
    >
      <SelectTrigger className="w-[180px]" aria-label="Add timezone">
        <SelectValue placeholder="Add timezone…" />
      </SelectTrigger>
      <SelectContent>
        {availableTimezones.map((tz) => (
          <SelectItem key={tz.id} value={tz.id}>
            {tz.city} ({tz.label})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
