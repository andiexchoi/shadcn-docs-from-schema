"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface TimezoneGroup {
  label: string;
  timezones: { value: string; label: string; offset: string }[];
}

const TIMEZONE_GROUPS: TimezoneGroup[] = [
  {
    label: "Americas",
    timezones: [
      { value: "America/New_York", label: "Eastern Time", offset: "UTC−5/−4" },
      { value: "America/Chicago", label: "Central Time", offset: "UTC−6/−5" },
      { value: "America/Denver", label: "Mountain Time", offset: "UTC−7/−6" },
      {
        value: "America/Los_Angeles",
        label: "Pacific Time",
        offset: "UTC−8/−7",
      },
      { value: "America/Anchorage", label: "Alaska Time", offset: "UTC−9/−8" },
      {
        value: "Pacific/Honolulu",
        label: "Hawaii Time",
        offset: "UTC−10",
      },
      {
        value: "America/Sao_Paulo",
        label: "Brasília Time",
        offset: "UTC−3/−2",
      },
      {
        value: "America/Argentina/Buenos_Aires",
        label: "Argentina Time",
        offset: "UTC−3",
      },
      { value: "America/Toronto", label: "Toronto", offset: "UTC−5/−4" },
      { value: "America/Vancouver", label: "Vancouver", offset: "UTC−8/−7" },
      { value: "America/Mexico_City", label: "Mexico City", offset: "UTC−6/−5" },
    ],
  },
  {
    label: "Europe",
    timezones: [
      { value: "Europe/London", label: "London", offset: "UTC+0/+1" },
      { value: "Europe/Paris", label: "Paris", offset: "UTC+1/+2" },
      { value: "Europe/Berlin", label: "Berlin", offset: "UTC+1/+2" },
      { value: "Europe/Madrid", label: "Madrid", offset: "UTC+1/+2" },
      { value: "Europe/Rome", label: "Rome", offset: "UTC+1/+2" },
      { value: "Europe/Amsterdam", label: "Amsterdam", offset: "UTC+1/+2" },
      { value: "Europe/Brussels", label: "Brussels", offset: "UTC+1/+2" },
      { value: "Europe/Zurich", label: "Zurich", offset: "UTC+1/+2" },
      { value: "Europe/Stockholm", label: "Stockholm", offset: "UTC+1/+2" },
      { value: "Europe/Oslo", label: "Oslo", offset: "UTC+1/+2" },
      { value: "Europe/Copenhagen", label: "Copenhagen", offset: "UTC+1/+2" },
      { value: "Europe/Helsinki", label: "Helsinki", offset: "UTC+2/+3" },
      { value: "Europe/Warsaw", label: "Warsaw", offset: "UTC+1/+2" },
      { value: "Europe/Prague", label: "Prague", offset: "UTC+1/+2" },
      { value: "Europe/Vienna", label: "Vienna", offset: "UTC+1/+2" },
      { value: "Europe/Budapest", label: "Budapest", offset: "UTC+1/+2" },
      { value: "Europe/Athens", label: "Athens", offset: "UTC+2/+3" },
      { value: "Europe/Bucharest", label: "Bucharest", offset: "UTC+2/+3" },
      { value: "Europe/Kiev", label: "Kyiv", offset: "UTC+2/+3" },
      { value: "Europe/Moscow", label: "Moscow", offset: "UTC+3" },
      { value: "Europe/Istanbul", label: "Istanbul", offset: "UTC+3" },
    ],
  },
  {
    label: "Africa",
    timezones: [
      { value: "Africa/Cairo", label: "Cairo", offset: "UTC+2" },
      { value: "Africa/Johannesburg", label: "Johannesburg", offset: "UTC+2" },
      { value: "Africa/Lagos", label: "Lagos", offset: "UTC+1" },
      { value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+3" },
      { value: "Africa/Casablanca", label: "Casablanca", offset: "UTC+0/+1" },
      { value: "Africa/Accra", label: "Accra", offset: "UTC+0" },
    ],
  },
  {
    label: "Asia",
    timezones: [
      { value: "Asia/Dubai", label: "Dubai", offset: "UTC+4" },
      { value: "Asia/Karachi", label: "Karachi", offset: "UTC+5" },
      { value: "Asia/Kolkata", label: "Kolkata", offset: "UTC+5:30" },
      { value: "Asia/Dhaka", label: "Dhaka", offset: "UTC+6" },
      { value: "Asia/Bangkok", label: "Bangkok", offset: "UTC+7" },
      { value: "Asia/Singapore", label: "Singapore", offset: "UTC+8" },
      { value: "Asia/Shanghai", label: "Shanghai", offset: "UTC+8" },
      { value: "Asia/Hong_Kong", label: "Hong Kong", offset: "UTC+8" },
      { value: "Asia/Taipei", label: "Taipei", offset: "UTC+8" },
      { value: "Asia/Seoul", label: "Seoul", offset: "UTC+9" },
      { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+9" },
      { value: "Asia/Jakarta", label: "Jakarta", offset: "UTC+7" },
      { value: "Asia/Riyadh", label: "Riyadh", offset: "UTC+3" },
      { value: "Asia/Tehran", label: "Tehran", offset: "UTC+3:30/+4:30" },
      { value: "Asia/Colombo", label: "Colombo", offset: "UTC+5:30" },
      { value: "Asia/Kathmandu", label: "Kathmandu", offset: "UTC+5:45" },
      { value: "Asia/Yangon", label: "Yangon", offset: "UTC+6:30" },
      { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur", offset: "UTC+8" },
      { value: "Asia/Manila", label: "Manila", offset: "UTC+8" },
    ],
  },
  {
    label: "Pacific",
    timezones: [
      { value: "Pacific/Auckland", label: "Auckland", offset: "UTC+12/+13" },
      { value: "Pacific/Fiji", label: "Fiji", offset: "UTC+12" },
      { value: "Pacific/Guam", label: "Guam", offset: "UTC+10" },
      { value: "Pacific/Tahiti", label: "Tahiti", offset: "UTC−10" },
    ],
  },
  {
    label: "Australia",
    timezones: [
      {
        value: "Australia/Sydney",
        label: "Sydney",
        offset: "UTC+10/+11",
      },
      {
        value: "Australia/Melbourne",
        label: "Melbourne",
        offset: "UTC+10/+11",
      },
      {
        value: "Australia/Brisbane",
        label: "Brisbane",
        offset: "UTC+10",
      },
      {
        value: "Australia/Perth",
        label: "Perth",
        offset: "UTC+8",
      },
      {
        value: "Australia/Adelaide",
        label: "Adelaide",
        offset: "UTC+9:30/+10:30",
      },
      {
        value: "Australia/Darwin",
        label: "Darwin",
        offset: "UTC+9:30",
      },
    ],
  },
];

function getAllTimezones() {
  return TIMEZONE_GROUPS.flatMap((g) => g.timezones);
}

export interface TimezoneSelectorProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  id?: string;
}

export function TimezoneSelector({
  value,
  defaultValue,
  onValueChange,
  label = "Timezone",
  placeholder = "Timezone",
  disabled = false,
  invalid = false,
  className,
  id: idProp,
}: TimezoneSelectorProps) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;

  const [search, setSearch] = React.useState("");

  const filteredGroups = React.useMemo<TimezoneGroup[]>(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TIMEZONE_GROUPS;
    return TIMEZONE_GROUPS.flatMap((group) => {
      const filtered = group.timezones.filter(
        (tz) =>
          tz.label.toLowerCase().includes(q) ||
          tz.value.toLowerCase().includes(q) ||
          tz.offset.toLowerCase().includes(q)
      );
      return filtered.length > 0 ? [{ ...group, timezones: filtered }] : [];
    });
  }, [search]);

  const allTimezones = getAllTimezones();

  const selectedTimezone = allTimezones.find((tz) => tz.value === value);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </Label>
      )}
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          aria-invalid={invalid ? true : undefined}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[placeholder]:text-muted-foreground",
            invalid && "border-destructive focus:ring-destructive"
          )}
        >
          <SelectValue placeholder={placeholder} asChild={false}>
            {selectedTimezone ? (
              <span className="flex items-center gap-2 truncate">
                <span className="truncate">{selectedTimezone.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {selectedTimezone.offset}
                </span>
              </span>
            ) : undefined}
          </SelectValue>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </SelectTrigger>

        <SelectContent
          className={cn(
            "relative z-50 max-h-80 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            "@media (prefers-reduced-motion: reduce) { animation: none !important; }"
          )}
          position="popper"
          sideOffset={4}
        >
          {/* Search box */}
          <div className="sticky top-0 z-10 border-b border-border bg-popover px-2 py-2">
            <input
              className={cn(
                "flex h-8 w-full rounded-sm border border-input bg-transparent px-2 py-1 text-sm",
                "placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-1 focus:ring-ring"
              )}
              placeholder="Search timezones…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>

          <div className="overflow-y-auto max-h-[260px]">
            {filteredGroups.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No timezones found.
              </div>
            ) : (
              filteredGroups.map((group) => (
                <SelectGroup key={group.label}>
                  <SelectLabel className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {group.label}
                  </SelectLabel>
                  {group.timezones.map((tz) => (
                    <SelectItem
                      key={tz.value}
                      value={tz.value}
                      className={cn(
                        "relative flex cursor-default select-none items-center px-3 py-2 text-sm outline-none",
                        "focus:bg-accent focus:text-accent-foreground",
                        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                        "data-[state=checked]:font-medium"
                      )}
                    >
                      <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
                        <SelectItem.Text />
                      </span>
                      <SelectItemText>
                        <span className="ml-6 flex items-center justify-between gap-4 w-full">
                          <span className="truncate">{tz.label}</span>
                          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                            {tz.offset}
                          </span>
                        </span>
                      </SelectItemText>
                      <SelectItemIndicator className="absolute left-3 flex h-4 w-4 items-center justify-center">
                        <Check className="h-3.5 w-3.5" />
                      </SelectItemIndicator>
                    </SelectItem>
                  ))}
                </SelectGroup>
              ))
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}

// Re-export for convenience
export { TIMEZONE_GROUPS, getAllTimezones };

Hmm, that draft has issues with how I'm using Radix's SelectItem and SelectItemText/SelectItemIndicator. Let me rewrite it cleanly using the proper Radix API imports.

"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─── Timezone data ─────────────────────────────────────────────────────────── */

interface TimezoneEntry {
  value: string;
  label: string;
  offset: string;
}

interface TimezoneGroup {
  region: string;
  timezones: TimezoneEntry[];
}

const TIMEZONE_GROUPS: TimezoneGroup[] = [
  {
    region: "Americas",
    timezones: [
      { value: "America/New_York", label: "Eastern Time", offset: "UTC−5/−4" },
      { value: "America/Chicago", label: "Central Time", offset: "UTC−6/−5" },
      { value: "America/Denver", label: "Mountain Time", offset: "UTC−7/−6" },
      { value: "America/Los_Angeles", label: "Pacific Time", offset: "UTC−8/−7" },
      { value: "America/Anchorage", label: "Alaska Time", offset: "UTC−9/−8" },
      { value: "Pacific/Honolulu", label: "Hawaii Time", offset: "UTC−10" },
      { value: "America/Toronto", label: "Toronto", offset: "UTC−5/−4" },
      { value: "America/Vancouver", label: "Vancouver", offset: "UTC−8/−7" },
      { value: "America/Mexico_City", label: "Mexico City", offset: "UTC−6/−5" },
      { value: "America/Sao_Paulo", label: "Brasília Time", offset: "UTC−3/−2" },
      { value: "America/Argentina/Buenos_Aires", label: "Argentina Time", offset: "UTC−3" },
      { value: "America/Bogota", label: "Bogotá", offset: "UTC−5" },
      { value: "America/Lima", label: "Lima", offset: "UTC−5" },
      { value: "America/Santiago", label: "Santiago", offset: "UTC−4/−3" },
      { value: "America/Caracas", label: "Caracas", offset: "UTC−4" },
    ],
  },
  {
    region: "Europe",
    timezones: [
      { value: "Europe/London", label: "London", offset: "UTC+0/+1" },
      { value: "Europe/Dublin", label: "Dublin", offset: "UTC+0/+1" },
      { value: "Europe/Lisbon", label: "Lisbon", offset: "UTC+0/+1" },
      { value: "Europe/Paris", label: "Paris", offset: "UTC+1/+2" },
      { value: "Europe/Berlin", label: "Berlin", offset: "UTC+1/+2" },
      { value: "Europe/Madrid", label: "Madrid", offset: "UTC+1/+2" },
      { value: "Europe/Rome", label: "Rome", offset: "UTC+1/+2" },
      { value: "Europe/Amsterdam", label: "Amsterdam", offset: "UTC+1/+2" },
      { value: "Europe/Brussels", label: "Brussels", offset: "UTC+1/+2" },
      { value: "Europe/Zurich", label: "Zurich", offset: "UTC+1/+2" },
      { value: "Europe/Stockholm", label: "Stockholm", offset: "UTC+1/+2" },
      { value: "Europe/Oslo", label: "Oslo", offset: "UTC+1/+2" },
      { value: "Europe/Copenhagen", label: "Copenhagen", offset: "UTC+1/+2" },
      { value: "Europe/Helsinki", label: "Helsinki", offset: "UTC+2/+3" },
      { value: "Europe/Warsaw", label: "Warsaw", offset: "UTC+1/+2" },
      { value: "Europe/Prague", label: "Prague", offset: "UTC+1/+2" },
      { value: "Europe/Vienna", label: "Vienna", offset: "UTC+1/+2" },
      { value: "Europe/Budapest", label: "Budapest", offset: "UTC+1/+2" },
      { value: "Europe/Athens", label: "Athens", offset: "UTC+2/+3" },
      { value: "Europe/Bucharest", label: "Bucharest", offset: "UTC+2/+3" },
      { value: "Europe/Kiev", label: "Kyiv", offset: "UTC+2/+3" },
      { value: "Europe/Moscow", label: "Moscow", offset: "UTC+3" },
      { value: "Europe/Istanbul", label: "Istanbul", offset: "UTC+3" },
    ],
  },
  {
    region: "Africa",
    timezones: [
      { value: "Africa/Cairo", label: "Cairo", offset: "UTC+2" },
      { value: "Africa/Johannesburg", label: "Johannesburg", offset: "UTC+2" },
      { value: "Africa/Lagos", label: "Lagos", offset: "UTC+1" },
      { value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+3" },
      { value: "Africa/Casablanca", label: "Casablanca", offset: "UTC+0/+1" },
      { value: "Africa/Accra", label: "Accra", offset: "UTC+0" },
      { value: "Africa/Addis_Ababa", label: "Addis Ababa", offset: "UTC+3" },
      { value: "Africa/Khartoum", label: "Khartoum", offset: "UTC+3" },
      { value: "Africa/Algiers", label: "Algiers", offset: "UTC+1" },
    ],
  },
  {
    region: "Asia",
    timezones: [
      { value: "Asia/Dubai", label: "Dubai", offset: "UTC+4" },
      { value: "Asia/Riyadh", label: "Riyadh", offset: "UTC+3" },
      { value: "Asia/Tehran", label: "Tehran", offset: "UTC+3:30/+4:30" },
      { value: "Asia/Karachi", label: "Karachi", offset: "UTC+5" },
      { value: "Asia/Kolkata", label: "Kolkata", offset: "UTC+5:30" },
      { value: "Asia/Colombo", label: "Colombo", offset: "UTC+5:30" },
      { value: "Asia/Kathmandu", label: "Kathmandu", offset: "UTC+5:45" },
      { value: "Asia/Dhaka", label: "Dhaka", offset: "UTC+6" },
      { value: "Asia/Yangon", label: "Yangon", offset: "UTC+6:30" },
      { value: "Asia/Bangkok", label: "Bangkok", offset: "UTC+7" },
      { value: "Asia/Jakarta", label: "Jakarta", offset: "UTC+7" },
      { value: "Asia/Singapore", label: "Singapore", offset: "UTC+8" },
      { value: "Asia/Shanghai", label: "Shanghai", offset: "UTC+8" },
      { value: "Asia/Hong_Kong", label: "Hong Kong", offset: "UTC+8" },
      { value: "Asia/Taipei", label: "Taipei", offset: "UTC+8" },
      { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur", offset: "UTC+8" },
      { value: "Asia/Manila", label: "Manila", offset: "UTC+8" },
      { value: "Asia/Seoul", label: "Seoul", offset: "UTC+9" },
      { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+9" },
    ],
  },
  {
    region: "Australia & Pacific",
    timezones: [
      { value: "Australia/Perth", label: "Perth", offset: "UTC+8" },
      { value: "Australia/Darwin", label: "Darwin", offset: "UTC+9:30" },
      { value: "Australia/Adelaide", label: "Adelaide", offset: "UTC+9:30/+10:30" },
      { value: "Australia/Brisbane", label: "Brisbane", offset: "UTC+10" },
      { value: "Australia/Sydney", label: "Sydney", offset: "UTC+10/+11" },
      { value: "Australia/Melbourne", label: "Melbourne", offset: "UTC+10/+11" },
      { value: "Pacific/Auckland", label: "Auckland", offset: "UTC+12/+13" },
      { value: "Pacific/Fiji", label: "Fiji", offset: "UTC+12" },
      { value: "Pacific/Guam", label: "Guam", offset: "UTC+10" },
      { value: "Pacific/Tahiti", label: "Tahiti", offset: "UTC−10" },
    ],
  },
];

const ALL_TIMEZONES: TimezoneEntry[] = TIMEZONE_GROUPS.flatMap(
  (g) => g.timezones
);

/* ─── Sub-components ────────────────────────────────────────────────────────── */

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    invalid?: boolean;
  }
>(({ className, children, invalid, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[placeholder]:text-muted-foreground",
      invalid && "border-destructive focus:ring-destructive",
      className
    )}
    aria-invalid={invalid ? true : undefined}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      sideOffset={4}
      className={cn(
        "relative z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md",
        "motion-safe:data-[state=open]:animate-in motion-safe:data-[state=closed]:animate-out",
        "motion-safe:data-[state=closed]:fade-out-0 motion-safe:data-[state=open]:fade-in-0",
        "motion-safe:data-[state=closed]:zoom-out-95 motion-safe:data-[state=open]:zoom-in-95",
        "motion-safe:data-[side=bottom]:slide-in-from-top-2 motion-safe:data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      {children}
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = "SelectContent";

const SelectGroup = SelectPrimitive.Group;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
      className
    )}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center py-2 pl-8 pr-3 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-3.5 w-3.5" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

/* ─── TimezoneSelector ──────────────────────────────────────────────────────── */

export interface TimezoneSelectorProps {
  /** Controlled value (IANA timezone string, e.g. "America/New_York") */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Called with the new IANA timezone string when the selection changes */
  onValueChange?: (value: string) => void;
  /** Visible label rendered above the trigger. Pass an empty string to hide. */
  label?: string;
  /** Placeholder text shown when no timezone is selected */
  placeholder?: string;
  /** Disables the entire control */
  disabled?: boolean;
  /** Shows an error/invalid visual state */
  invalid?: boolean;
  /** Additional className for the outermost wrapper */
  className?: string;
  /** Explicit id for the trigger (auto-generated if omitted) */
  id?: string;
}

export function TimezoneSelector({
  value,
  defaultValue,
  onValueChange,
  label = "Timezone",
  placeholder = "Timezone",
  disabled = false,
  invalid = false,
  className,
  id: idProp,
}: TimezoneSelectorProps) {
  const autoId = React.useId();
  const triggerId = idProp ?? autoId;

  const [search, setSearch] = React.useState("");

  const filteredGroups = React.useMemo<TimezoneGroup[]>(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TIMEZONE_GROUPS;
    return TIMEZONE_GROUPS.reduce<TimezoneGroup[]>((acc, group) => {
      const matches = group.timezones.filter(
        (tz) =>
          tz.label.toLowerCase().includes(q) ||
          tz.value.toLowerCase().includes(q) ||
          tz.offset.toLowerCase().includes(q) ||
          group.region.toLowerCase().includes(q)
      );
      if (matches.length > 0) {
        acc.push({ ...group, timezones: matches });
      }
      return acc;
    }, []);
  }, [search]);

  const selectedEntry = ALL_TIMEZONES.find