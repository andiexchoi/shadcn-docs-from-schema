"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Timezone data
// ---------------------------------------------------------------------------

interface TimezoneOption {
  value: string;
  label: string;
  group: string;
  offset: string;
}

const TIMEZONE_OPTIONS: TimezoneOption[] = [
  // Africa
  { value: "Africa/Abidjan", label: "Abidjan", group: "Africa", offset: "UTC+0" },
  { value: "Africa/Accra", label: "Accra", group: "Africa", offset: "UTC+0" },
  { value: "Africa/Cairo", label: "Cairo", group: "Africa", offset: "UTC+2" },
  { value: "Africa/Casablanca", label: "Casablanca", group: "Africa", offset: "UTC+1" },
  { value: "Africa/Johannesburg", label: "Johannesburg", group: "Africa", offset: "UTC+2" },
  { value: "Africa/Lagos", label: "Lagos", group: "Africa", offset: "UTC+1" },
  { value: "Africa/Nairobi", label: "Nairobi", group: "Africa", offset: "UTC+3" },
  // Americas
  { value: "America/Anchorage", label: "Anchorage", group: "Americas", offset: "UTC-9" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", group: "Americas", offset: "UTC-3" },
  { value: "America/Bogota", label: "Bogotá", group: "Americas", offset: "UTC-5" },
  { value: "America/Chicago", label: "Chicago", group: "Americas", offset: "UTC-6" },
  { value: "America/Denver", label: "Denver", group: "Americas", offset: "UTC-7" },
  { value: "America/Halifax", label: "Halifax", group: "Americas", offset: "UTC-4" },
  { value: "America/Lima", label: "Lima", group: "Americas", offset: "UTC-5" },
  { value: "America/Los_Angeles", label: "Los Angeles", group: "Americas", offset: "UTC-8" },
  { value: "America/Mexico_City", label: "Mexico City", group: "Americas", offset: "UTC-6" },
  { value: "America/New_York", label: "New York", group: "Americas", offset: "UTC-5" },
  { value: "America/Phoenix", label: "Phoenix", group: "Americas", offset: "UTC-7" },
  { value: "America/Santiago", label: "Santiago", group: "Americas", offset: "UTC-3" },
  { value: "America/Sao_Paulo", label: "São Paulo", group: "Americas", offset: "UTC-3" },
  { value: "America/Toronto", label: "Toronto", group: "Americas", offset: "UTC-5" },
  { value: "America/Vancouver", label: "Vancouver", group: "Americas", offset: "UTC-8" },
  // Asia
  { value: "Asia/Bangkok", label: "Bangkok", group: "Asia", offset: "UTC+7" },
  { value: "Asia/Colombo", label: "Colombo", group: "Asia", offset: "UTC+5:30" },
  { value: "Asia/Dubai", label: "Dubai", group: "Asia", offset: "UTC+4" },
  { value: "Asia/Hong_Kong", label: "Hong Kong", group: "Asia", offset: "UTC+8" },
  { value: "Asia/Jakarta", label: "Jakarta", group: "Asia", offset: "UTC+7" },
  { value: "Asia/Karachi", label: "Karachi", group: "Asia", offset: "UTC+5" },
  { value: "Asia/Kolkata", label: "Kolkata", group: "Asia", offset: "UTC+5:30" },
  { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur", group: "Asia", offset: "UTC+8" },
  { value: "Asia/Riyadh", label: "Riyadh", group: "Asia", offset: "UTC+3" },
  { value: "Asia/Seoul", label: "Seoul", group: "Asia", offset: "UTC+9" },
  { value: "Asia/Shanghai", label: "Shanghai", group: "Asia", offset: "UTC+8" },
  { value: "Asia/Singapore", label: "Singapore", group: "Asia", offset: "UTC+8" },
  { value: "Asia/Taipei", label: "Taipei", group: "Asia", offset: "UTC+8" },
  { value: "Asia/Tehran", label: "Tehran", group: "Asia", offset: "UTC+3:30" },
  { value: "Asia/Tokyo", label: "Tokyo", group: "Asia", offset: "UTC+9" },
  // Atlantic
  { value: "Atlantic/Reykjavik", label: "Reykjavik", group: "Atlantic", offset: "UTC+0" },
  // Australia
  { value: "Australia/Adelaide", label: "Adelaide", group: "Australia", offset: "UTC+9:30" },
  { value: "Australia/Brisbane", label: "Brisbane", group: "Australia", offset: "UTC+10" },
  { value: "Australia/Melbourne", label: "Melbourne", group: "Australia", offset: "UTC+11" },
  { value: "Australia/Perth", label: "Perth", group: "Australia", offset: "UTC+8" },
  { value: "Australia/Sydney", label: "Sydney", group: "Australia", offset: "UTC+11" },
  // Europe
  { value: "Europe/Amsterdam", label: "Amsterdam", group: "Europe", offset: "UTC+1" },
  { value: "Europe/Athens", label: "Athens", group: "Europe", offset: "UTC+2" },
  { value: "Europe/Berlin", label: "Berlin", group: "Europe", offset: "UTC+1" },
  { value: "Europe/Brussels", label: "Brussels", group: "Europe", offset: "UTC+1" },
  { value: "Europe/Budapest", label: "Budapest", group: "Europe", offset: "UTC+1" },
  { value: "Europe/Copenhagen", label: "Copenhagen", group: "Europe", offset: "UTC+1" },
  { value: "Europe/Dublin", label: "Dublin", group: "Europe", offset: "UTC+0" },
  { value: "Europe/Helsinki", label: "Helsinki", group: "Europe", offset: "UTC+2" },
  { value: "Europe/Istanbul", label: "Istanbul", group: "Europe", offset: "UTC+3" },
  { value: "Europe/Kiev", label: "Kyiv", group: "Europe", offset: "UTC+2" },
  { value: "Europe/Lisbon", label: "Lisbon", group: "Europe", offset: "UTC+0" },
  { value: "Europe/London", label: "London", group: "Europe", offset: "UTC+0" },
  { value: "Europe/Madrid", label: "Madrid", group: "Europe", offset: "UTC+1" },
  { value: "Europe/Moscow", label: "Moscow", group: "Europe", offset: "UTC+3" },
  { value: "Europe/Oslo", label: "Oslo", group: "Europe", offset: "UTC+1" },
  { value: "Europe/Paris", label: "Paris", group: "Europe", offset: "UTC+1" },
  { value: "Europe/Prague", label: "Prague", group: "Europe", offset: "UTC+1" },
  { value: "Europe/Rome", label: "Rome", group: "Europe", offset: "UTC+1" },
  { value: "Europe/Stockholm", label: "Stockholm", group: "Europe", offset: "UTC+1" },
  { value: "Europe/Vienna", label: "Vienna", group: "Europe", offset: "UTC+1" },
  { value: "Europe/Warsaw", label: "Warsaw", group: "Europe", offset: "UTC+1" },
  { value: "Europe/Zurich", label: "Zurich", group: "Europe", offset: "UTC+1" },
  // Pacific
  { value: "Pacific/Auckland", label: "Auckland", group: "Pacific", offset: "UTC+13" },
  { value: "Pacific/Fiji", label: "Fiji", group: "Pacific", offset: "UTC+12" },
  { value: "Pacific/Guam", label: "Guam", group: "Pacific", offset: "UTC+10" },
  { value: "Pacific/Honolulu", label: "Honolulu", group: "Pacific", offset: "UTC-10" },
  { value: "Pacific/Midway", label: "Midway", group: "Pacific", offset: "UTC-11" },
  // UTC
  { value: "UTC", label: "UTC", group: "UTC", offset: "UTC+0" },
];

function groupTimezones(options: TimezoneOption[]): Record<string, TimezoneOption[]> {
  return options.reduce<Record<string, TimezoneOption[]>>((acc, tz) => {
    if (!acc[tz.group]) acc[tz.group] = [];
    acc[tz.group].push(tz);
    return acc;
  }, {});
}

// ---------------------------------------------------------------------------
// Radix Select sub-components (local wrappers)
// ---------------------------------------------------------------------------

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "motion-reduce:transition-none motion-reduce:animate-none",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

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
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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
SelectItem.displayName = SelectPrimitive.Item.displayName;

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
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

// ---------------------------------------------------------------------------
// TimezoneSelector
// ---------------------------------------------------------------------------

export interface TimezoneSelectorProps {
  /** Controlled value (IANA timezone string, e.g. "America/New_York") */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Called when the user selects a timezone */
  onValueChange?: (value: string) => void;
  /** Label text rendered above the trigger */
  label?: string;
  /** Placeholder shown when no timezone is selected */
  placeholder?: string;
  /** Disables the selector */
  disabled?: boolean;
  /** Marks the selector as invalid */
  invalid?: boolean;
  /** Additional class names for the trigger */
  className?: string;
  /** ID used to link the label and trigger */
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
  id = "timezone-selector",
}: TimezoneSelectorProps) {
  const grouped = React.useMemo(() => groupTimezones(TIMEZONE_OPTIONS), []);
  const groupNames = Object.keys(grouped);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label htmlFor={id}>{label}</Label>
      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          className={cn(className, invalid && "border-destructive focus:ring-destructive")}
          aria-invalid={invalid ? "true" : undefined}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper">
          {groupNames.map((group, index) => (
            <React.Fragment key={group}>
              <SelectPrimitive.Group>
                <SelectLabel>{group}</SelectLabel>
                {grouped[group].map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    <span className="flex items-center justify-between gap-6 w-full">
                      <span>{tz.label}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{tz.offset}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectPrimitive.Group>
              {index < groupNames.length - 1 && <SelectSeparator />}
            </React.Fragment>
          ))}
        </SelectContent>
      </SelectPrimitive.Root>
    </div>
  );
}