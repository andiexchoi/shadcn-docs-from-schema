"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check, Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const TIMEZONES: { group: string; zones: { value: string; label: string; offset: string }[] }[] = [
  {
    group: "Americas",
    zones: [
      { value: "America/New_York", label: "New York", offset: "UTC−5/−4" },
      { value: "America/Chicago", label: "Chicago", offset: "UTC−6/−5" },
      { value: "America/Denver", label: "Denver", offset: "UTC−7/−6" },
      { value: "America/Los_Angeles", label: "Los Angeles", offset: "UTC−8/−7" },
      { value: "America/Anchorage", label: "Anchorage", offset: "UTC−9/−8" },
      { value: "America/Honolulu", label: "Honolulu", offset: "UTC−10" },
      { value: "America/Toronto", label: "Toronto", offset: "UTC−5/−4" },
      { value: "America/Vancouver", label: "Vancouver", offset: "UTC−8/−7" },
      { value: "America/Mexico_City", label: "Mexico City", offset: "UTC−6/−5" },
      { value: "America/Sao_Paulo", label: "São Paulo", offset: "UTC−3" },
      { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", offset: "UTC−3" },
      { value: "America/Bogota", label: "Bogotá", offset: "UTC−5" },
      { value: "America/Lima", label: "Lima", offset: "UTC−5" },
      { value: "America/Santiago", label: "Santiago", offset: "UTC−4/−3" },
    ],
  },
  {
    group: "Europe",
    zones: [
      { value: "Europe/London", label: "London", offset: "UTC+0/+1" },
      { value: "Europe/Dublin", label: "Dublin", offset: "UTC+0/+1" },
      { value: "Europe/Lisbon", label: "Lisbon", offset: "UTC+0/+1" },
      { value: "Europe/Paris", label: "Paris", offset: "UTC+1/+2" },
      { value: "Europe/Berlin", label: "Berlin", offset: "UTC+1/+2" },
      { value: "Europe/Rome", label: "Rome", offset: "UTC+1/+2" },
      { value: "Europe/Madrid", label: "Madrid", offset: "UTC+1/+2" },
      { value: "Europe/Amsterdam", label: "Amsterdam", offset: "UTC+1/+2" },
      { value: "Europe/Brussels", label: "Brussels", offset: "UTC+1/+2" },
      { value: "Europe/Zurich", label: "Zurich", offset: "UTC+1/+2" },
      { value: "Europe/Stockholm", label: "Stockholm", offset: "UTC+1/+2" },
      { value: "Europe/Oslo", label: "Oslo", offset: "UTC+1/+2" },
      { value: "Europe/Copenhagen", label: "Copenhagen", offset: "UTC+1/+2" },
      { value: "Europe/Helsinki", label: "Helsinki", offset: "UTC+2/+3" },
      { value: "Europe/Athens", label: "Athens", offset: "UTC+2/+3" },
      { value: "Europe/Warsaw", label: "Warsaw", offset: "UTC+1/+2" },
      { value: "Europe/Prague", label: "Prague", offset: "UTC+1/+2" },
      { value: "Europe/Budapest", label: "Budapest", offset: "UTC+1/+2" },
      { value: "Europe/Bucharest", label: "Bucharest", offset: "UTC+2/+3" },
      { value: "Europe/Kiev", label: "Kyiv", offset: "UTC+2/+3" },
      { value: "Europe/Moscow", label: "Moscow", offset: "UTC+3" },
      { value: "Europe/Istanbul", label: "Istanbul", offset: "UTC+3" },
    ],
  },
  {
    group: "Africa",
    zones: [
      { value: "Africa/Cairo", label: "Cairo", offset: "UTC+2" },
      { value: "Africa/Johannesburg", label: "Johannesburg", offset: "UTC+2" },
      { value: "Africa/Lagos", label: "Lagos", offset: "UTC+1" },
      { value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+3" },
      { value: "Africa/Casablanca", label: "Casablanca", offset: "UTC+1" },
      { value: "Africa/Accra", label: "Accra", offset: "UTC+0" },
      { value: "Africa/Addis_Ababa", label: "Addis Ababa", offset: "UTC+3" },
      { value: "Africa/Tunis", label: "Tunis", offset: "UTC+1" },
    ],
  },
  {
    group: "Asia",
    zones: [
      { value: "Asia/Dubai", label: "Dubai", offset: "UTC+4" },
      { value: "Asia/Karachi", label: "Karachi", offset: "UTC+5" },
      { value: "Asia/Kolkata", label: "Kolkata", offset: "UTC+5:30" },
      { value: "Asia/Dhaka", label: "Dhaka", offset: "UTC+6" },
      { value: "Asia/Bangkok", label: "Bangkok", offset: "UTC+7" },
      { value: "Asia/Jakarta", label: "Jakarta", offset: "UTC+7" },
      { value: "Asia/Singapore", label: "Singapore", offset: "UTC+8" },
      { value: "Asia/Hong_Kong", label: "Hong Kong", offset: "UTC+8" },
      { value: "Asia/Shanghai", label: "Shanghai", offset: "UTC+8" },
      { value: "Asia/Taipei", label: "Taipei", offset: "UTC+8" },
      { value: "Asia/Seoul", label: "Seoul", offset: "UTC+9" },
      { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+9" },
      { value: "Asia/Riyadh", label: "Riyadh", offset: "UTC+3" },
      { value: "Asia/Tehran", label: "Tehran", offset: "UTC+3:30" },
      { value: "Asia/Baku", label: "Baku", offset: "UTC+4" },
      { value: "Asia/Tashkent", label: "Tashkent", offset: "UTC+5" },
      { value: "Asia/Almaty", label: "Almaty", offset: "UTC+6" },
      { value: "Asia/Yangon", label: "Yangon", offset: "UTC+6:30" },
      { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur", offset: "UTC+8" },
      { value: "Asia/Manila", label: "Manila", offset: "UTC+8" },
    ],
  },
  {
    group: "Pacific",
    zones: [
      { value: "Pacific/Auckland", label: "Auckland", offset: "UTC+12/+13" },
      { value: "Pacific/Fiji", label: "Fiji", offset: "UTC+12" },
      { value: "Pacific/Guam", label: "Guam", offset: "UTC+10" },
      { value: "Pacific/Port_Moresby", label: "Port Moresby", offset: "UTC+10" },
      { value: "Pacific/Tahiti", label: "Tahiti", offset: "UTC−10" },
      { value: "Pacific/Tongatapu", label: "Tongatapu", offset: "UTC+13" },
    ],
  },
  {
    group: "Australia",
    zones: [
      { value: "Australia/Perth", label: "Perth", offset: "UTC+8" },
      { value: "Australia/Darwin", label: "Darwin", offset: "UTC+9:30" },
      { value: "Australia/Adelaide", label: "Adelaide", offset: "UTC+9:30/+10:30" },
      { value: "Australia/Brisbane", label: "Brisbane", offset: "UTC+10" },
      { value: "Australia/Sydney", label: "Sydney", offset: "UTC+10/+11" },
      { value: "Australia/Melbourne", label: "Melbourne", offset: "UTC+10/+11" },
      { value: "Australia/Hobart", label: "Hobart", offset: "UTC+10/+11" },
    ],
  },
  {
    group: "UTC / Other",
    zones: [
      { value: "UTC", label: "UTC", offset: "UTC+0" },
      { value: "Etc/GMT+12", label: "GMT−12", offset: "UTC−12" },
      { value: "Etc/GMT+11", label: "GMT−11", offset: "UTC−11" },
      { value: "Etc/GMT+1", label: "GMT−1", offset: "UTC−1" },
      { value: "Etc/GMT-1", label: "GMT+1", offset: "UTC+1" },
    ],
  },
];

function getCurrentTime(timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: timezone,
    }).format(new Date());
  } catch {
    return "";
  }
}

export interface TimezoneSelectorProps {
  id?: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
}

export function TimezoneSelector({
  id = "timezone-selector",
  label = "Timezone",
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select a timezone",
  disabled = false,
  invalid = false,
  className,
}: TimezoneSelectorProps) {
  const [currentTime, setCurrentTime] = React.useState<string>("");
  const [selectedValue, setSelectedValue] = React.useState<string | undefined>(
    value ?? defaultValue
  );

  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : selectedValue;

  React.useEffect(() => {
    if (!activeValue) return;
    setCurrentTime(getCurrentTime(activeValue));
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime(activeValue));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeValue]);

  const handleValueChange = (newValue: string) => {
    if (!isControlled) {
      setSelectedValue(newValue);
    }
    onValueChange?.(newValue);
  };

  const selectedZone = React.useMemo(() => {
    if (!activeValue) return null;
    for (const group of TIMEZONES) {
      const found = group.zones.find((z) => z.value === activeValue);
      if (found) return found;
    }
    return null;
  }, [activeValue]);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <SelectPrimitive.Root
        value={isControlled ? value : selectedValue}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          id={id}
          aria-invalid={invalid ? "true" : undefined}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            invalid
              ? "border-destructive focus:ring-destructive"
              : "border-input",
            "gap-2"
          )}
        >
          <span className="flex items-center gap-2 min-w-0 flex-1">
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <SelectPrimitive.Value placeholder={placeholder} />
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "relative z-50 max-h-80 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
              "@media (prefers-reduced-motion: reduce) { animation: none !important; }"
            )}
            position="popper"
            sideOffset={4}
          >
            <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1 text-muted-foreground">
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            </SelectPrimitive.ScrollUpButton>

            <SelectPrimitive.Viewport className="p-1">
              {TIMEZONES.map((group, groupIndex) => (
                <React.Fragment key={group.group}>
                  {groupIndex > 0 && (
                    <SelectPrimitive.Separator className="my-1 h-px bg-muted" />
                  )}
                  <SelectPrimitive.Group>
                    <SelectPrimitive.Label className="py-1.5 pl-3 pr-2 text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                      {group.group}
                    </SelectPrimitive.Label>
                    {group.zones.map((zone) => (
                      <SelectPrimitive.Item
                        key={zone.value}
                        value={zone.value}
                        className={cn(
                          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-3 text-sm outline-none",
                          "focus:bg-accent focus:text-accent-foreground",
                          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        )}
                      >
                        <SelectPrimitive.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </SelectPrimitive.ItemIndicator>
                        <span className="flex-1 min-w-0 truncate">
                          {zone.label}
                        </span>
                        <span className="ml-3 text-xs text-muted-foreground tabular-nums shrink-0">
                          {zone.offset}
                        </span>
                      </SelectPrimitive.Item>
                    ))}
                  </SelectPrimitive.Group>
                </React.Fragment>
              ))}
            </SelectPrimitive.Viewport>

            <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1 text-muted-foreground">
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {activeValue && selectedZone && (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-live="polite">
          <span className="font-medium">{selectedZone.offset}</span>
          <span aria-hidden="true">·</span>
          <span>Current time: {currentTime}</span>
        </p>
      )}

      {invalid && (
        <p className="text-xs text-destructive" role="alert">
          Please select a valid timezone.
        </p>
      )}
    </div>
  );
}