"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const TIMEZONE_GROUPS: { label: string; timezones: { value: string; label: string; offset: string }[] }[] = [
  {
    label: "Americas",
    timezones: [
      { value: "America/New_York", label: "Eastern Time", offset: "UTC−5/−4" },
      { value: "America/Chicago", label: "Central Time", offset: "UTC−6/−5" },
      { value: "America/Denver", label: "Mountain Time", offset: "UTC−7/−6" },
      { value: "America/Phoenix", label: "Phoenix", offset: "UTC−7" },
      { value: "America/Los_Angeles", label: "Pacific Time", offset: "UTC−8/−7" },
      { value: "America/Anchorage", label: "Alaska Time", offset: "UTC−9/−8" },
      { value: "Pacific/Honolulu", label: "Hawaii Time", offset: "UTC−10" },
      { value: "America/Toronto", label: "Toronto", offset: "UTC−5/−4" },
      { value: "America/Vancouver", label: "Vancouver", offset: "UTC−8/−7" },
      { value: "America/Sao_Paulo", label: "São Paulo", offset: "UTC−3/−2" },
      { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", offset: "UTC−3" },
      { value: "America/Mexico_City", label: "Mexico City", offset: "UTC−6/−5" },
      { value: "America/Bogota", label: "Bogotá", offset: "UTC−5" },
      { value: "America/Lima", label: "Lima", offset: "UTC−5" },
      { value: "America/Santiago", label: "Santiago", offset: "UTC−4/−3" },
    ],
  },
  {
    label: "Europe",
    timezones: [
      { value: "UTC", label: "UTC", offset: "UTC+0" },
      { value: "Europe/London", label: "London", offset: "UTC+0/+1" },
      { value: "Europe/Dublin", label: "Dublin", offset: "UTC+0/+1" },
      { value: "Europe/Lisbon", label: "Lisbon", offset: "UTC+0/+1" },
      { value: "Europe/Paris", label: "Paris", offset: "UTC+1/+2" },
      { value: "Europe/Berlin", label: "Berlin", offset: "UTC+1/+2" },
      { value: "Europe/Rome", label: "Rome", offset: "UTC+1/+2" },
      { value: "Europe/Madrid", label: "Madrid", offset: "UTC+1/+2" },
      { value: "Europe/Amsterdam", label: "Amsterdam", offset: "UTC+1/+2" },
      { value: "Europe/Brussels", label: "Brussels", offset: "UTC+1/+2" },
      { value: "Europe/Vienna", label: "Vienna", offset: "UTC+1/+2" },
      { value: "Europe/Warsaw", label: "Warsaw", offset: "UTC+1/+2" },
      { value: "Europe/Stockholm", label: "Stockholm", offset: "UTC+1/+2" },
      { value: "Europe/Helsinki", label: "Helsinki", offset: "UTC+2/+3" },
      { value: "Europe/Athens", label: "Athens", offset: "UTC+2/+3" },
      { value: "Europe/Bucharest", label: "Bucharest", offset: "UTC+2/+3" },
      { value: "Europe/Kiev", label: "Kyiv", offset: "UTC+2/+3" },
      { value: "Europe/Moscow", label: "Moscow", offset: "UTC+3" },
      { value: "Europe/Istanbul", label: "Istanbul", offset: "UTC+3" },
    ],
  },
  {
    label: "Africa & Middle East",
    timezones: [
      { value: "Africa/Cairo", label: "Cairo", offset: "UTC+2" },
      { value: "Africa/Lagos", label: "Lagos", offset: "UTC+1" },
      { value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+3" },
      { value: "Africa/Johannesburg", label: "Johannesburg", offset: "UTC+2" },
      { value: "Asia/Riyadh", label: "Riyadh", offset: "UTC+3" },
      { value: "Asia/Dubai", label: "Dubai", offset: "UTC+4" },
      { value: "Asia/Tel_Aviv", label: "Tel Aviv", offset: "UTC+2/+3" },
    ],
  },
  {
    label: "Asia & Pacific",
    timezones: [
      { value: "Asia/Karachi", label: "Karachi", offset: "UTC+5" },
      { value: "Asia/Kolkata", label: "Kolkata", offset: "UTC+5:30" },
      { value: "Asia/Dhaka", label: "Dhaka", offset: "UTC+6" },
      { value: "Asia/Bangkok", label: "Bangkok", offset: "UTC+7" },
      { value: "Asia/Jakarta", label: "Jakarta", offset: "UTC+7" },
      { value: "Asia/Singapore", label: "Singapore", offset: "UTC+8" },
      { value: "Asia/Shanghai", label: "Shanghai", offset: "UTC+8" },
      { value: "Asia/Hong_Kong", label: "Hong Kong", offset: "UTC+8" },
      { value: "Asia/Taipei", label: "Taipei", offset: "UTC+8" },
      { value: "Asia/Seoul", label: "Seoul", offset: "UTC+9" },
      { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+9" },
      { value: "Australia/Perth", label: "Perth", offset: "UTC+8" },
      { value: "Australia/Adelaide", label: "Adelaide", offset: "UTC+9:30/+10:30" },
      { value: "Australia/Sydney", label: "Sydney", offset: "UTC+10/+11" },
      { value: "Australia/Melbourne", label: "Melbourne", offset: "UTC+10/+11" },
      { value: "Pacific/Auckland", label: "Auckland", offset: "UTC+12/+13" },
      { value: "Pacific/Fiji", label: "Fiji", offset: "UTC+12" },
    ],
  },
];

const ALL_TIMEZONES = TIMEZONE_GROUPS.flatMap((g) => g.timezones);

export interface TimezoneSelectorProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  label?: string;
  placeholder?: string;
  id?: string;
  className?: string;
}

export function TimezoneSelector({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  invalid = false,
  label = "Timezone",
  placeholder = "Select a timezone",
  id = "timezone-selector",
  className,
}: TimezoneSelectorProps) {
  const [search, setSearch] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);

  const normalizedSearch = search.toLowerCase().trim();

  const filteredGroups = React.useMemo(() => {
    if (!normalizedSearch) return TIMEZONE_GROUPS;
    return TIMEZONE_GROUPS.map((group) => ({
      ...group,
      timezones: group.timezones.filter(
        (tz) =>
          tz.label.toLowerCase().includes(normalizedSearch) ||
          tz.value.toLowerCase().includes(normalizedSearch) ||
          tz.offset.toLowerCase().includes(normalizedSearch)
      ),
    })).filter((group) => group.timezones.length > 0);
  }, [normalizedSearch]);

  const selectedTimezone = React.useMemo(() => {
    const v = value ?? defaultValue;
    return v ? ALL_TIMEZONES.find((tz) => tz.value === v) : undefined;
  }, [value, defaultValue]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSearch("");
    } else {
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>
      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        onOpenChange={handleOpenChange}
      >
        <SelectPrimitive.Trigger
          id={id}
          aria-invalid={invalid ? true : undefined}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm ring-offset-background",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[placeholder]:text-muted-foreground",
            invalid
              ? "border-destructive focus:ring-destructive"
              : "border-input",
            "gap-2"
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Globe
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-muted-foreground"
            />
            <SelectPrimitive.Value placeholder={placeholder}>
              {selectedTimezone ? (
                <span className="flex items-center gap-2 min-w-0">
                  <span className="truncate">{selectedTimezone.label}</span>
                  <span className="text-muted-foreground shrink-0 text-xs">
                    {selectedTimezone.offset}
                  </span>
                </span>
              ) : undefined}
            </SelectPrimitive.Value>
          </span>
          <SelectPrimitive.Icon asChild>
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-muted-foreground"
            />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "relative z-50 min-w-[12rem] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
              "@media (prefers-reduced-motion: reduce) { animation: none !important; }"
            )}
            position="popper"
            sideOffset={4}
          >
            {/* Search box — not a SelectItem, handled via onKeyDown intercept */}
            <div className="p-2 border-b">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  // Prevent Radix type-ahead from hijacking printable keys
                  e.stopPropagation();
                  if (e.key === "Escape") {
                    setSearch("");
                  }
                }}
                placeholder="Search timezones…"
                className={cn(
                  "w-full rounded-sm border border-input bg-background px-2 py-1.5 text-sm outline-none",
                  "placeholder:text-muted-foreground",
                  "focus:ring-1 focus:ring-ring"
                )}
                aria-label="Search timezones"
                autoComplete="off"
              />
            </div>

            <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1 text-muted-foreground">
              <ChevronUp aria-hidden="true" className="h-4 w-4" />
            </SelectPrimitive.ScrollUpButton>

            <SelectPrimitive.Viewport className="max-h-64 overflow-y-auto p-1">
              {filteredGroups.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No timezones found.
                </div>
              ) : (
                filteredGroups.map((group, groupIdx) => (
                  <React.Fragment key={group.label}>
                    {groupIdx > 0 && (
                      <SelectPrimitive.Separator className="my-1 h-px bg-muted" />
                    )}
                    <SelectPrimitive.Group>
                      <SelectPrimitive.Label className="px-2 py-1.5 text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                        {group.label}
                      </SelectPrimitive.Label>
                      {group.timezones.map((tz) => (
                        <SelectPrimitive.Item
                          key={tz.value}
                          value={tz.value}
                          className={cn(
                            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
                            "focus:bg-accent focus:text-accent-foreground",
                            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                            "gap-2"
                          )}
                        >
                          <SelectPrimitive.ItemIndicator asChild>
                            <Check
                              aria-hidden="true"
                              className="h-3.5 w-3.5 shrink-0 text-primary"
                            />
                          </SelectPrimitive.ItemIndicator>
                          {/* Spacer when not selected so text aligns */}
                          <span
                            aria-hidden="true"
                            className="group-data-[state=checked]:hidden h-3.5 w-3.5 shrink-0"
                          />
                          <SelectPrimitive.ItemText>
                            <span className="flex items-center justify-between gap-4 w-full">
                              <span>{tz.label}</span>
                              <span className="text-xs text-muted-foreground shrink-0">
                                {tz.offset}
                              </span>
                            </span>
                          </SelectPrimitive.ItemText>
                        </SelectPrimitive.Item>
                      ))}
                    </SelectPrimitive.Group>
                  </React.Fragment>
                ))
              )}
            </SelectPrimitive.Viewport>

            <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1 text-muted-foreground">
              <ChevronDown aria-hidden="true" className="h-4 w-4" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {invalid && (
        <p className="text-xs text-destructive" role="alert">
          Please select a valid timezone.
        </p>
      )}
    </div>
  );
}