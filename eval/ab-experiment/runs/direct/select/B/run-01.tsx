"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Timezone data
// ---------------------------------------------------------------------------

interface TimezoneEntry {
  value: string;
  label: string;
  offset: string;
  region: string;
}

const TIMEZONES: TimezoneEntry[] = [
  // Africa
  { value: "Africa/Abidjan", label: "Abidjan", offset: "UTC+0", region: "Africa" },
  { value: "Africa/Cairo", label: "Cairo", offset: "UTC+2", region: "Africa" },
  { value: "Africa/Johannesburg", label: "Johannesburg", offset: "UTC+2", region: "Africa" },
  { value: "Africa/Lagos", label: "Lagos", offset: "UTC+1", region: "Africa" },
  { value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+3", region: "Africa" },
  // Americas
  { value: "America/Anchorage", label: "Anchorage", offset: "UTC-9", region: "Americas" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", offset: "UTC-3", region: "Americas" },
  { value: "America/Bogota", label: "Bogotá", offset: "UTC-5", region: "Americas" },
  { value: "America/Chicago", label: "Chicago (CT)", offset: "UTC-6", region: "Americas" },
  { value: "America/Denver", label: "Denver (MT)", offset: "UTC-7", region: "Americas" },
  { value: "America/Halifax", label: "Halifax (AT)", offset: "UTC-4", region: "Americas" },
  { value: "America/Lima", label: "Lima", offset: "UTC-5", region: "Americas" },
  { value: "America/Los_Angeles", label: "Los Angeles (PT)", offset: "UTC-8", region: "Americas" },
  { value: "America/Mexico_City", label: "Mexico City", offset: "UTC-6", region: "Americas" },
  { value: "America/New_York", label: "New York (ET)", offset: "UTC-5", region: "Americas" },
  { value: "America/Phoenix", label: "Phoenix (MST)", offset: "UTC-7", region: "Americas" },
  { value: "America/Santiago", label: "Santiago", offset: "UTC-4", region: "Americas" },
  { value: "America/Sao_Paulo", label: "São Paulo", offset: "UTC-3", region: "Americas" },
  { value: "America/St_Johns", label: "St. John's (NST)", offset: "UTC-3:30", region: "Americas" },
  { value: "America/Toronto", label: "Toronto (ET)", offset: "UTC-5", region: "Americas" },
  { value: "America/Vancouver", label: "Vancouver (PT)", offset: "UTC-8", region: "Americas" },
  // Asia
  { value: "Asia/Bangkok", label: "Bangkok", offset: "UTC+7", region: "Asia" },
  { value: "Asia/Colombo", label: "Colombo", offset: "UTC+5:30", region: "Asia" },
  { value: "Asia/Dubai", label: "Dubai", offset: "UTC+4", region: "Asia" },
  { value: "Asia/Hong_Kong", label: "Hong Kong", offset: "UTC+8", region: "Asia" },
  { value: "Asia/Jakarta", label: "Jakarta", offset: "UTC+7", region: "Asia" },
  { value: "Asia/Karachi", label: "Karachi", offset: "UTC+5", region: "Asia" },
  { value: "Asia/Kolkata", label: "Kolkata", offset: "UTC+5:30", region: "Asia" },
  { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur", offset: "UTC+8", region: "Asia" },
  { value: "Asia/Manila", label: "Manila", offset: "UTC+8", region: "Asia" },
  { value: "Asia/Seoul", label: "Seoul", offset: "UTC+9", region: "Asia" },
  { value: "Asia/Shanghai", label: "Shanghai", offset: "UTC+8", region: "Asia" },
  { value: "Asia/Singapore", label: "Singapore", offset: "UTC+8", region: "Asia" },
  { value: "Asia/Taipei", label: "Taipei", offset: "UTC+8", region: "Asia" },
  { value: "Asia/Tehran", label: "Tehran", offset: "UTC+3:30", region: "Asia" },
  { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+9", region: "Asia" },
  // Atlantic
  { value: "Atlantic/Azores", label: "Azores", offset: "UTC-1", region: "Atlantic" },
  { value: "Atlantic/Reykjavik", label: "Reykjavik", offset: "UTC+0", region: "Atlantic" },
  // Australia
  { value: "Australia/Adelaide", label: "Adelaide", offset: "UTC+9:30", region: "Australia" },
  { value: "Australia/Brisbane", label: "Brisbane", offset: "UTC+10", region: "Australia" },
  { value: "Australia/Darwin", label: "Darwin", offset: "UTC+9:30", region: "Australia" },
  { value: "Australia/Melbourne", label: "Melbourne", offset: "UTC+11", region: "Australia" },
  { value: "Australia/Perth", label: "Perth", offset: "UTC+8", region: "Australia" },
  { value: "Australia/Sydney", label: "Sydney", offset: "UTC+11", region: "Australia" },
  // Europe
  { value: "Europe/Amsterdam", label: "Amsterdam", offset: "UTC+1", region: "Europe" },
  { value: "Europe/Athens", label: "Athens", offset: "UTC+2", region: "Europe" },
  { value: "Europe/Berlin", label: "Berlin", offset: "UTC+1", region: "Europe" },
  { value: "Europe/Brussels", label: "Brussels", offset: "UTC+1", region: "Europe" },
  { value: "Europe/Budapest", label: "Budapest", offset: "UTC+1", region: "Europe" },
  { value: "Europe/Copenhagen", label: "Copenhagen", offset: "UTC+1", region: "Europe" },
  { value: "Europe/Dublin", label: "Dublin", offset: "UTC+0", region: "Europe" },
  { value: "Europe/Helsinki", label: "Helsinki", offset: "UTC+2", region: "Europe" },
  { value: "Europe/Istanbul", label: "Istanbul", offset: "UTC+3", region: "Europe" },
  { value: "Europe/Lisbon", label: "Lisbon", offset: "UTC+0", region: "Europe" },
  { value: "Europe/London", label: "London (GMT)", offset: "UTC+0", region: "Europe" },
  { value: "Europe/Madrid", label: "Madrid", offset: "UTC+1", region: "Europe" },
  { value: "Europe/Moscow", label: "Moscow", offset: "UTC+3", region: "Europe" },
  { value: "Europe/Oslo", label: "Oslo", offset: "UTC+1", region: "Europe" },
  { value: "Europe/Paris", label: "Paris", offset: "UTC+1", region: "Europe" },
  { value: "Europe/Prague", label: "Prague", offset: "UTC+1", region: "Europe" },
  { value: "Europe/Rome", label: "Rome", offset: "UTC+1", region: "Europe" },
  { value: "Europe/Stockholm", label: "Stockholm", offset: "UTC+1", region: "Europe" },
  { value: "Europe/Vienna", label: "Vienna", offset: "UTC+1", region: "Europe" },
  { value: "Europe/Warsaw", label: "Warsaw", offset: "UTC+1", region: "Europe" },
  { value: "Europe/Zurich", label: "Zurich", offset: "UTC+1", region: "Europe" },
  // Pacific
  { value: "Pacific/Auckland", label: "Auckland", offset: "UTC+13", region: "Pacific" },
  { value: "Pacific/Fiji", label: "Fiji", offset: "UTC+12", region: "Pacific" },
  { value: "Pacific/Guam", label: "Guam", offset: "UTC+10", region: "Pacific" },
  { value: "Pacific/Honolulu", label: "Honolulu (HST)", offset: "UTC-10", region: "Pacific" },
  { value: "Pacific/Midway", label: "Midway", offset: "UTC-11", region: "Pacific" },
  // UTC
  { value: "UTC", label: "UTC", offset: "UTC+0", region: "UTC" },
];

const REGIONS = Array.from(new Set(TIMEZONES.map((tz) => tz.region)));

// ---------------------------------------------------------------------------
// Local shadcn-style Select primitives
// ---------------------------------------------------------------------------

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
      "placeholder:text-muted-foreground",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "[&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
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
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "motion-reduce:transition-none motion-reduce:animate-none",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
        <ChevronUp className="h-4 w-4" />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
        <ChevronDown className="h-4 w-4" />
      </SelectPrimitive.ScrollDownButton>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
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
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
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
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = "SelectSeparator";

// ---------------------------------------------------------------------------
// TimezoneSelectorProps
// ---------------------------------------------------------------------------

export interface TimezoneSelectorProps {
  /** The currently selected IANA timezone string (controlled). */
  value?: string;
  /** Callback fired when the user picks a new timezone. */
  onValueChange?: (value: string) => void;
  /** Default value for uncontrolled usage. */
  defaultValue?: string;
  /** Label shown above the trigger. */
  label?: string;
  /** Placeholder text shown when no timezone is selected. */
  placeholder?: string;
  /** Disable the entire control. */
  disabled?: boolean;
  /** Mark the control as invalid. */
  invalid?: boolean;
  /** Additional class names applied to the trigger. */
  className?: string;
  /** Id used to associate label and trigger. Defaults to a generated id. */
  id?: string;
}

// ---------------------------------------------------------------------------
// TimezoneSelector
// ---------------------------------------------------------------------------

export function TimezoneSelector({
  value,
  onValueChange,
  defaultValue,
  label = "Timezone",
  placeholder = "Select timezone",
  disabled = false,
  invalid = false,
  className,
  id: idProp,
}: TimezoneSelectorProps) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;

  // Build a map: region → timezone entries
  const byRegion = React.useMemo(() => {
    const map = new Map<string, TimezoneEntry[]>();
    for (const tz of TIMEZONES) {
      if (!map.has(tz.region)) map.set(tz.region, []);
      map.get(tz.region)!.push(tz);
    }
    return map;
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="flex items-center gap-1.5">
        <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        {label}
      </Label>

      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          className={cn("w-full", className)}
          aria-invalid={invalid ? "true" : undefined}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent position="popper">
          {REGIONS.map((region, regionIndex) => {
            const entries = byRegion.get(region) ?? [];
            return (
              <React.Fragment key={region}>
                {regionIndex > 0 && <SelectSeparator />}
                <SelectPrimitive.Group>
                  <SelectLabel>{region}</SelectLabel>
                  {entries.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      <span className="flex items-center justify-between gap-4 w-full">
                        <span>{tz.label}</span>
                        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                          {tz.offset}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectPrimitive.Group>
              </React.Fragment>
            );
          })}
        </SelectContent>
      </SelectPrimitive.Root>

      {invalid && (
        <p className="text-sm text-destructive" role="alert">
          Please select a valid timezone.
        </p>
      )}
    </div>
  );
}