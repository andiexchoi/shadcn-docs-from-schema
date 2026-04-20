"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Radix-based Select primitives (no shadcn/ui Select wrapper installed)
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
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
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
// Timezone data
// ---------------------------------------------------------------------------

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

interface TimezoneRegion {
  region: string;
  timezones: TimezoneOption[];
}

const TIMEZONE_REGIONS: TimezoneRegion[] = [
  {
    region: "Americas",
    timezones: [
      { value: "America/Anchorage", label: "Anchorage", offset: "UTC−09:00" },
      { value: "America/Los_Angeles", label: "Los Angeles (PT)", offset: "UTC−08:00" },
      { value: "America/Denver", label: "Denver (MT)", offset: "UTC−07:00" },
      { value: "America/Phoenix", label: "Phoenix", offset: "UTC−07:00" },
      { value: "America/Chicago", label: "Chicago (CT)", offset: "UTC−06:00" },
      { value: "America/Mexico_City", label: "Mexico City", offset: "UTC−06:00" },
      { value: "America/New_York", label: "New York (ET)", offset: "UTC−05:00" },
      { value: "America/Toronto", label: "Toronto", offset: "UTC−05:00" },
      { value: "America/Bogota", label: "Bogotá", offset: "UTC−05:00" },
      { value: "America/Caracas", label: "Caracas", offset: "UTC−04:00" },
      { value: "America/Halifax", label: "Halifax", offset: "UTC−04:00" },
      { value: "America/Sao_Paulo", label: "São Paulo", offset: "UTC−03:00" },
      { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", offset: "UTC−03:00" },
      { value: "America/St_Johns", label: "St. John's", offset: "UTC−03:30" },
    ],
  },
  {
    region: "Europe & Africa",
    timezones: [
      { value: "Atlantic/Azores", label: "Azores", offset: "UTC−01:00" },
      { value: "UTC", label: "UTC", offset: "UTC+00:00" },
      { value: "Europe/London", label: "London", offset: "UTC+00:00" },
      { value: "Europe/Lisbon", label: "Lisbon", offset: "UTC+00:00" },
      { value: "Africa/Lagos", label: "Lagos", offset: "UTC+01:00" },
      { value: "Europe/Paris", label: "Paris (CET)", offset: "UTC+01:00" },
      { value: "Europe/Berlin", label: "Berlin", offset: "UTC+01:00" },
      { value: "Europe/Rome", label: "Rome", offset: "UTC+01:00" },
      { value: "Africa/Cairo", label: "Cairo", offset: "UTC+02:00" },
      { value: "Europe/Athens", label: "Athens", offset: "UTC+02:00" },
      { value: "Europe/Helsinki", label: "Helsinki", offset: "UTC+02:00" },
      { value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+03:00" },
      { value: "Europe/Moscow", label: "Moscow", offset: "UTC+03:00" },
      { value: "Asia/Tehran", label: "Tehran", offset: "UTC+03:30" },
    ],
  },
  {
    region: "Asia & Pacific",
    timezones: [
      { value: "Asia/Dubai", label: "Dubai", offset: "UTC+04:00" },
      { value: "Asia/Kabul", label: "Kabul", offset: "UTC+04:30" },
      { value: "Asia/Karachi", label: "Karachi", offset: "UTC+05:00" },
      { value: "Asia/Colombo", label: "Colombo", offset: "UTC+05:30" },
      { value: "Asia/Kolkata", label: "Kolkata", offset: "UTC+05:30" },
      { value: "Asia/Kathmandu", label: "Kathmandu", offset: "UTC+05:45" },
      { value: "Asia/Dhaka", label: "Dhaka", offset: "UTC+06:00" },
      { value: "Asia/Rangoon", label: "Yangon", offset: "UTC+06:30" },
      { value: "Asia/Bangkok", label: "Bangkok", offset: "UTC+07:00" },
      { value: "Asia/Jakarta", label: "Jakarta", offset: "UTC+07:00" },
      { value: "Asia/Shanghai", label: "Shanghai", offset: "UTC+08:00" },
      { value: "Asia/Singapore", label: "Singapore", offset: "UTC+08:00" },
      { value: "Asia/Hong_Kong", label: "Hong Kong", offset: "UTC+08:00" },
      { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+09:00" },
      { value: "Asia/Seoul", label: "Seoul", offset: "UTC+09:00" },
      { value: "Australia/Adelaide", label: "Adelaide", offset: "UTC+09:30" },
      { value: "Australia/Darwin", label: "Darwin", offset: "UTC+09:30" },
      { value: "Australia/Sydney", label: "Sydney", offset: "UTC+10:00" },
      { value: "Australia/Brisbane", label: "Brisbane", offset: "UTC+10:00" },
      { value: "Pacific/Auckland", label: "Auckland", offset: "UTC+12:00" },
      { value: "Pacific/Fiji", label: "Fiji", offset: "UTC+12:00" },
    ],
  },
];

// ---------------------------------------------------------------------------
// TimezoneSelector component
// ---------------------------------------------------------------------------

export interface TimezoneSelectorProps {
  /** The currently selected IANA timezone string (controlled). */
  value?: string;
  /** Default value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the new IANA timezone string when the user selects an option. */
  onValueChange?: (value: string) => void;
  /** Label shown above the selector. Defaults to "Timezone". */
  label?: string;
  /** Whether to show the UTC offset alongside the timezone label in the trigger. */
  showOffset?: boolean;
  /** Disables the selector. */
  disabled?: boolean;
  /** Marks the selector as invalid and applies aria-invalid. */
  invalid?: boolean;
  /** Additional class names applied to the SelectTrigger. */
  className?: string;
  /** ID used to associate the label with the trigger for accessibility. */
  id?: string;
}

export function TimezoneSelector({
  value,
  defaultValue,
  onValueChange,
  label = "Timezone",
  showOffset = true,
  disabled = false,
  invalid = false,
  className,
  id = "timezone-selector",
}: TimezoneSelectorProps) {
  // Build a flat lookup map for quick offset retrieval
  const offsetMap = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const region of TIMEZONE_REGIONS) {
      for (const tz of region.timezones) {
        map.set(tz.value, tz.offset);
      }
    }
    return map;
  }, []);

  const renderTriggerText = (val: string | undefined) => {
    if (!val) return null;
    const offset = offsetMap.get(val);
    const regionTz = TIMEZONE_REGIONS.flatMap((r) => r.timezones).find(
      (tz) => tz.value === val
    );
    if (!regionTz) return val;
    return showOffset && offset
      ? `${regionTz.label} (${offset})`
      : regionTz.label;
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          aria-invalid={invalid ? true : undefined}
          className={cn("w-full", invalid && "border-destructive focus:ring-destructive", className)}
        >
          <SelectValue placeholder="Timezone">
            {value ? renderTriggerText(value) : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent position="popper">
          {TIMEZONE_REGIONS.map((region, regionIndex) => (
            <React.Fragment key={region.region}>
              {regionIndex > 0 && <SelectSeparator />}
              <SelectGroup>
                <SelectLabel>{region.region}</SelectLabel>
                {region.timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {showOffset
                      ? `${tz.label} (${tz.offset})`
                      : tz.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </React.Fragment>
          ))}
        </SelectContent>
      </Select>
      {invalid && (
        <p className="text-sm text-destructive" role="alert">
          Please select a valid timezone.
        </p>
      )}
    </div>
  );
}