"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TIMEZONES, TimezoneConfig } from "@/lib/timezones";
import { cn } from "@/lib/utils";

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
  const [open, setOpen] = useState(false);

  const availableTimezones = TIMEZONES.filter(
    (tz) => !selectedTimezones.some((selected) => selected.id === tz.id)
  );

  const canAdd = selectedTimezones.length < maxTimezones;

  if (!canAdd || availableTimezones.length === 0) {
    return null;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Add timezone"
          className="w-[200px] justify-between"
        >
          <span className="flex items-center gap-2">
            <Search className="h-4 w-4 shrink-0 opacity-50" />
            Add timezone…
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search city…" />
          <CommandList>
            <CommandEmpty>No city found.</CommandEmpty>
            <CommandGroup>
              {availableTimezones.map((tz) => (
                <CommandItem
                  key={tz.id}
                  value={`${tz.city} ${tz.label} ${tz.timezone}`}
                  onSelect={() => {
                    onAdd(tz);
                    setOpen(false);
                  }}
                >
                  <span className="flex-1">{tz.city}</span>
                  <span className="text-muted-foreground text-xs">
                    {tz.label}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
