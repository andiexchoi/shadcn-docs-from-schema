"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Inline Select wrappers (no components/ui/select.tsx installed)
// ---------------------------------------------------------------------------

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

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
      <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "@media (prefers-reduced-motion: reduce) { animate-none }",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
        <ChevronDown className="h-4 w-4 rotate-180" />
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
// Timezone data
// ---------------------------------------------------------------------------

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
  region: string;
}

const TIMEZONES: TimezoneOption[] = [
  // Americas
  { value: "Pacific/Honolulu", label: "Hawaii", offset: "UTC−10:00", region: "Americas" },
  { value: "America/Anchorage", label: "Alaska", offset: "UTC−09:00", region: "Americas" },
  { value: "America/Los_Angeles", label: "Pacific time (US & Canada)", offset: "UTC−08:00", region: "Americas" },
  { value: "America/Denver", label: "Mountain time (US & Canada)", offset: "UTC−07:00", region: "Americas" },
  { value: "America/Phoenix", label: "Arizona", offset: "UTC−07:00", region: "Americas" },
  { value: "America/Chicago", label: "Central time (US & Canada)", offset: "UTC−06:00", region: "Americas" },
  { value: "America/Mexico_City", label: "Mexico City", offset: "UTC−06:00", region: "Americas" },
  { value: "America/New_York", label: "Eastern time (US & Canada)", offset: "UTC−05:00", region: "Americas" },
  { value: "America/Bogota", label: "Bogota", offset: "UTC−05:00", region: "Americas" },
  { value: "America/Caracas", label: "Caracas", offset: "UTC−04:00", region: "Americas" },
  { value: "America/Halifax", label: "Atlantic time (Canada)", offset: "UTC−04:00", region: "Americas" },
  { value: "America/Sao_Paulo", label: "Brasilia", offset: "UTC−03:00", region: "Americas" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", offset: "UTC−03:00", region: "Americas" },
  { value: "Atlantic/South_Georgia", label: "Mid-Atlantic", offset: "UTC−02:00", region: "Americas" },
  { value: "Atlantic/Azores", label: "Azores", offset: "UTC−01:00", region: "Americas" },
  // Europe & Africa
  { value: "UTC", label: "UTC", offset: "UTC±00:00", region: "Europe & Africa" },
  { value: "Europe/London", label: "London", offset: "UTC±00:00", region: "Europe & Africa" },
  { value: "Europe/Lisbon", label: "Lisbon", offset: "UTC±00:00", region: "Europe & Africa" },
  { value: "Africa/Casablanca", label: "Casablanca", offset: "UTC+01:00", region: "Europe & Africa" },
  { value: "Europe/Paris", label: "Paris", offset: "UTC+01:00", region: "Europe & Africa" },
  { value: "Europe/Berlin", label: "Berlin", offset: "UTC+01:00", region: "Europe & Africa" },
  { value: "Europe/Rome", label: "Rome", offset: "UTC+01:00", region: "Europe & Africa" },
  { value: "Europe/Amsterdam", label: "Amsterdam", offset: "UTC+01:00", region: "Europe & Africa" },
  { value: "Africa/Lagos", label: "Lagos", offset: "UTC+01:00", region: "Europe & Africa" },
  { value: "Europe/Athens", label: "Athens", offset: "UTC+02:00", region: "Europe & Africa" },
  { value: "Europe/Helsinki", label: "Helsinki", offset: "UTC+02:00", region: "Europe & Africa" },
  { value: "Africa/Cairo", label: "Cairo", offset: "UTC+02:00", region: "Europe & Africa" },
  { value: "Africa/Johannesburg", label: "Pretoria", offset: "UTC+02:00", region: "Europe & Africa" },
  { value: "Europe/Moscow", label: "Moscow", offset: "UTC+03:00", region: "Europe & Africa" },
  { value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+03:00", region: "Europe & Africa" },
  // Middle East & Asia
  { value: "Asia/Tehran", label: "Tehran", offset: "UTC+03:30", region: "Middle East & Asia" },
  { value: "Asia/Dubai", label: "Dubai", offset: "UTC+04:00", region: "Middle East & Asia" },
  { value: "Asia/Baku", label: "Baku", offset: "UTC+04:00", region: "Middle East & Asia" },
  { value: "Asia/Kabul", label: "Kabul", offset: "UTC+04:30", region: "Middle East & Asia" },
  { value: "Asia/Karachi", label: "Karachi", offset: "UTC+05:00", region: "Middle East & Asia" },
  { value: "Asia/Tashkent", label: "Tashkent", offset: "UTC+05:00", region: "Middle East & Asia" },
  { value: "Asia/Kolkata", label: "Mumbai, New Delhi", offset: "UTC+05:30", region: "Middle East & Asia" },
  { value: "Asia/Kathmandu", label: "Kathmandu", offset: "UTC+05:45", region: "Middle East & Asia" },
  { value: "Asia/Dhaka", label: "Dhaka", offset: "UTC+06:00", region: "Middle East & Asia" },
  { value: "Asia/Yangon", label: "Yangon", offset: "UTC+06:30", region: "Middle East & Asia" },
  { value: "Asia/Bangkok", label: "Bangkok", offset: "UTC+07:00", region: "Middle East & Asia" },
  { value: "Asia/Jakarta", label: "Jakarta", offset: "UTC+07:00", region: "Middle East & Asia" },
  { value: "Asia/Shanghai", label: "Beijing, Shanghai", offset: "UTC+08:00", region: "Middle East & Asia" },
  { value: "Asia/Singapore", label: "Singapore", offset: "UTC+08:00", region: "Middle East & Asia" },
  { value: "Asia/Hong_Kong", label: "Hong Kong", offset: "UTC+08:00", region: "Middle East & Asia" },
  { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+09:00", region: "Middle East & Asia" },
  { value: "Asia/Seoul", label: "Seoul", offset: "UTC+09:00", region: "Middle East & Asia" },
  { value: "Australia/Darwin", label: "Darwin", offset: "UTC+09:30", region: "Pacific & Oceania" },
  // Pacific & Oceania
  { value: "Australia/Brisbane", label: "Brisbane", offset: "UTC+10:00", region: "Pacific & Oceania" },
  { value: "Australia/Sydney", label: "Sydney, Melbourne", offset: "UTC+10:00", region: "Pacific & Oceania" },
  { value: "Pacific/Guam", label: "Guam", offset: "UTC+10:00", region: "Pacific & Oceania" },
  { value: "Australia/Adelaide", label: "Adelaide", offset: "UTC+10:30", region: "Pacific & Oceania" },
  { value: "Pacific/Noumea", label: "New Caledonia", offset: "UTC+11:00", region: "Pacific & Oceania" },
  { value: "Pacific/Auckland", label: "Auckland, Wellington", offset: "UTC+12:00", region: "Pacific & Oceania" },
  { value: "Pacific/Fiji", label: "Fiji", offset: "UTC+12:00", region: "Pacific & Oceania" },
  { value: "Pacific/Apia", label: "Samoa", offset: "UTC+13:00", region: "Pacific & Oceania" },
];

// Group timezones by region
const TIMEZONE_GROUPS = TIMEZONES.reduce<Record<string, TimezoneOption[]>>(
  (acc, tz) => {
    if (!acc[tz.region]) acc[tz.region] = [];
    acc[tz.region].push(tz);
    return acc;
  },
  {}
);

const REGION_ORDER = [
  "Americas",
  "Europe & Africa",
  "Middle East & Asia",
  "Pacific & Oceania",
];

// ---------------------------------------------------------------------------
// Helper: get current local timezone value
// ---------------------------------------------------------------------------

function getLocalTimezoneValue(): string {
  try {
    const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const found = TIMEZONES.find((tz) => tz.value === local);
    return found ? found.value : "UTC";
  } catch {
    return "UTC";
  }
}

// ---------------------------------------------------------------------------
// TimezoneSelectorProps
// ---------------------------------------------------------------------------

export interface TimezoneSelectorProps {
  /** Controlled value (IANA timezone string, e.g. "America/New_York") */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Called when the user selects a timezone */
  onValueChange?: (value: string) => void;
  /** Label text shown above the select trigger */
  label?: string;
  /** ID used to associate the label and trigger */
  id?: string;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Whether the field is in an invalid state */
  invalid?: boolean;
  /** Additional class name applied to the wrapper div */
  className?: string;
  /** Placeholder text shown when no value is selected */
  placeholder?: string;
}

// ---------------------------------------------------------------------------
// TimezoneSelector component
// ---------------------------------------------------------------------------

export function TimezoneSelector({
  value,
  defaultValue,
  onValueChange,
  label = "Timezone",
  id = "timezone-selector",
  disabled = false,
  invalid = false,
  className,
  placeholder = "Timezone",
}: TimezoneSelectorProps) {
  // For uncontrolled usage we track the current value locally to display the
  // offset badge next to the trigger label.
  const [internalValue, setInternalValue] = React.useState<string>(
    defaultValue ?? getLocalTimezoneValue()
  );

  const selectedValue = value ?? internalValue;

  const selectedTz = TIMEZONES.find((tz) => tz.value === selectedValue);

  function handleValueChange(newValue: string) {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label
        htmlFor={id}
        className={cn(
          "text-sm font-medium",
          invalid && "text-destructive",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {label}
      </Label>

      <Select
        value={selectedValue}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          className={cn(
            "w-full",
            invalid &&
              "border-destructive focus:ring-destructive aria-[invalid=true]:border-destructive"
          )}
          aria-invalid={invalid ? "true" : undefined}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
            <SelectValue placeholder={placeholder}>
              {selectedTz ? (
                <span className="flex items-center gap-2 min-w-0">
                  <span className="truncate">{selectedTz.label}</span>
                  <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground">
                    {selectedTz.offset}
                  </span>
                </span>
              ) : null}
            </SelectValue>
          </span>
        </SelectTrigger>

        <SelectContent position="popper">
          {REGION_ORDER.map((region, regionIndex) => {
            const options = TIMEZONE_GROUPS[region];
            if (!options) return null;
            return (
              <React.Fragment key={region}>
                {regionIndex > 0 && <SelectSeparator />}
                <SelectGroup>
                  <SelectLabel>{region}</SelectLabel>
                  {options.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      <span className="flex items-center justify-between gap-4 w-full">
                        <span className="truncate">{tz.label}</span>
                        <span className="shrink-0 font-mono text-xs text-muted-foreground">
                          {tz.offset}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </React.Fragment>
            );
          })}
        </SelectContent>
      </Select>

      {invalid && (
        <p className="text-xs text-destructive" role="alert">
          Please select a valid timezone.
        </p>
      )}
    </div>
  );
}