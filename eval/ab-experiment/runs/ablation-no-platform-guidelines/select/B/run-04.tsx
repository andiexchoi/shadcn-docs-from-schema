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
  // Americas
  { value: "America/New_York", label: "Eastern Time", group: "Americas", offset: "UTC−5/−4" },
  { value: "America/Chicago", label: "Central Time", group: "Americas", offset: "UTC−6/−5" },
  { value: "America/Denver", label: "Mountain Time", group: "Americas", offset: "UTC−7/−6" },
  { value: "America/Los_Angeles", label: "Pacific Time", group: "Americas", offset: "UTC−8/−7" },
  { value: "America/Anchorage", label: "Alaska Time", group: "Americas", offset: "UTC−9/−8" },
  { value: "Pacific/Honolulu", label: "Hawaii Time", group: "Americas", offset: "UTC−10" },
  { value: "America/Phoenix", label: "Arizona Time", group: "Americas", offset: "UTC−7" },
  { value: "America/Toronto", label: "Toronto", group: "Americas", offset: "UTC−5/−4" },
  { value: "America/Vancouver", label: "Vancouver", group: "Americas", offset: "UTC−8/−7" },
  { value: "America/Sao_Paulo", label: "São Paulo", group: "Americas", offset: "UTC−3" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", group: "Americas", offset: "UTC−3" },
  { value: "America/Mexico_City", label: "Mexico City", group: "Americas", offset: "UTC−6/−5" },
  { value: "America/Bogota", label: "Bogotá", group: "Americas", offset: "UTC−5" },
  { value: "America/Lima", label: "Lima", group: "Americas", offset: "UTC−5" },
  { value: "America/Santiago", label: "Santiago", group: "Americas", offset: "UTC−4/−3" },
  // Europe
  { value: "Europe/London", label: "London", group: "Europe", offset: "UTC+0/+1" },
  { value: "Europe/Dublin", label: "Dublin", group: "Europe", offset: "UTC+0/+1" },
  { value: "Europe/Lisbon", label: "Lisbon", group: "Europe", offset: "UTC+0/+1" },
  { value: "Europe/Paris", label: "Paris", group: "Europe", offset: "UTC+1/+2" },
  { value: "Europe/Berlin", label: "Berlin", group: "Europe", offset: "UTC+1/+2" },
  { value: "Europe/Rome", label: "Rome", group: "Europe", offset: "UTC+1/+2" },
  { value: "Europe/Madrid", label: "Madrid", group: "Europe", offset: "UTC+1/+2" },
  { value: "Europe/Amsterdam", label: "Amsterdam", group: "Europe", offset: "UTC+1/+2" },
  { value: "Europe/Brussels", label: "Brussels", group: "Europe", offset: "UTC+1/+2" },
  { value: "Europe/Zurich", label: "Zurich", group: "Europe", offset: "UTC+1/+2" },
  { value: "Europe/Stockholm", label: "Stockholm", group: "Europe", offset: "UTC+1/+2" },
  { value: "Europe/Warsaw", label: "Warsaw", group: "Europe", offset: "UTC+1/+2" },
  { value: "Europe/Prague", label: "Prague", group: "Europe", offset: "UTC+1/+2" },
  { value: "Europe/Vienna", label: "Vienna", group: "Europe", offset: "UTC+1/+2" },
  { value: "Europe/Helsinki", label: "Helsinki", group: "Europe", offset: "UTC+2/+3" },
  { value: "Europe/Athens", label: "Athens", group: "Europe", offset: "UTC+2/+3" },
  { value: "Europe/Bucharest", label: "Bucharest", group: "Europe", offset: "UTC+2/+3" },
  { value: "Europe/Kiev", label: "Kyiv", group: "Europe", offset: "UTC+2/+3" },
  { value: "Europe/Moscow", label: "Moscow", group: "Europe", offset: "UTC+3" },
  { value: "Europe/Istanbul", label: "Istanbul", group: "Europe", offset: "UTC+3" },
  // Africa
  { value: "Africa/Cairo", label: "Cairo", group: "Africa", offset: "UTC+2" },
  { value: "Africa/Johannesburg", label: "Johannesburg", group: "Africa", offset: "UTC+2" },
  { value: "Africa/Lagos", label: "Lagos", group: "Africa", offset: "UTC+1" },
  { value: "Africa/Nairobi", label: "Nairobi", group: "Africa", offset: "UTC+3" },
  { value: "Africa/Casablanca", label: "Casablanca", group: "Africa", offset: "UTC+1" },
  { value: "Africa/Accra", label: "Accra", group: "Africa", offset: "UTC+0" },
  // Asia
  { value: "Asia/Dubai", label: "Dubai", group: "Asia", offset: "UTC+4" },
  { value: "Asia/Karachi", label: "Karachi", group: "Asia", offset: "UTC+5" },
  { value: "Asia/Kolkata", label: "Kolkata", group: "Asia", offset: "UTC+5:30" },
  { value: "Asia/Dhaka", label: "Dhaka", group: "Asia", offset: "UTC+6" },
  { value: "Asia/Bangkok", label: "Bangkok", group: "Asia", offset: "UTC+7" },
  { value: "Asia/Jakarta", label: "Jakarta", group: "Asia", offset: "UTC+7" },
  { value: "Asia/Singapore", label: "Singapore", group: "Asia", offset: "UTC+8" },
  { value: "Asia/Shanghai", label: "Shanghai", group: "Asia", offset: "UTC+8" },
  { value: "Asia/Hong_Kong", label: "Hong Kong", group: "Asia", offset: "UTC+8" },
  { value: "Asia/Taipei", label: "Taipei", group: "Asia", offset: "UTC+8" },
  { value: "Asia/Seoul", label: "Seoul", group: "Asia", offset: "UTC+9" },
  { value: "Asia/Tokyo", label: "Tokyo", group: "Asia", offset: "UTC+9" },
  { value: "Asia/Riyadh", label: "Riyadh", group: "Asia", offset: "UTC+3" },
  { value: "Asia/Baghdad", label: "Baghdad", group: "Asia", offset: "UTC+3" },
  { value: "Asia/Tehran", label: "Tehran", group: "Asia", offset: "UTC+3:30" },
  { value: "Asia/Kabul", label: "Kabul", group: "Asia", offset: "UTC+4:30" },
  { value: "Asia/Colombo", label: "Colombo", group: "Asia", offset: "UTC+5:30" },
  { value: "Asia/Kathmandu", label: "Kathmandu", group: "Asia", offset: "UTC+5:45" },
  { value: "Asia/Rangoon", label: "Yangon", group: "Asia", offset: "UTC+6:30" },
  { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur", group: "Asia", offset: "UTC+8" },
  { value: "Asia/Manila", label: "Manila", group: "Asia", offset: "UTC+8" },
  { value: "Asia/Vladivostok", label: "Vladivostok", group: "Asia", offset: "UTC+10" },
  // Pacific
  { value: "Australia/Sydney", label: "Sydney", group: "Pacific", offset: "UTC+10/+11" },
  { value: "Australia/Melbourne", label: "Melbourne", group: "Pacific", offset: "UTC+10/+11" },
  { value: "Australia/Brisbane", label: "Brisbane", group: "Pacific", offset: "UTC+10" },
  { value: "Australia/Perth", label: "Perth", group: "Pacific", offset: "UTC+8" },
  { value: "Australia/Adelaide", label: "Adelaide", group: "Pacific", offset: "UTC+9:30/+10:30" },
  { value: "Pacific/Auckland", label: "Auckland", group: "Pacific", offset: "UTC+12/+13" },
  { value: "Pacific/Fiji", label: "Fiji", group: "Pacific", offset: "UTC+12" },
  { value: "Pacific/Guam", label: "Guam", group: "Pacific", offset: "UTC+10" },
  // UTC
  { value: "UTC", label: "UTC", group: "UTC / Other", offset: "UTC+0" },
];

const GROUPS = ["Americas", "Europe", "Africa", "Asia", "Pacific", "UTC / Other"] as const;

// ---------------------------------------------------------------------------
// Local Radix Select primitives (no shadcn wrapper installed)
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
      "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
      "[&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

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
SelectScrollUpButton.displayName = "SelectScrollUpButton";

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
SelectScrollDownButton.displayName = "SelectScrollDownButton";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
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
SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide", className)}
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
// TimezoneSelector component
// ---------------------------------------------------------------------------

export interface TimezoneSelectorProps {
  /** The currently selected timezone IANA value (controlled). */
  value?: string;
  /** Called with the new IANA timezone string when the user picks one. */
  onValueChange?: (value: string) => void;
  /** Default value for uncontrolled usage. */
  defaultValue?: string;
  /** Visible label rendered above the trigger. */
  label?: string;
  /** Placeholder shown when no timezone is selected. */
  placeholder?: string;
  /** Whether the selector is disabled. */
  disabled?: boolean;
  /** Marks the field as invalid for validation states. */
  invalid?: boolean;
  /** Additional class names applied to the trigger. */
  className?: string;
  /** ID used to link label → trigger. */
  id?: string;
}

export function TimezoneSelector({
  value,
  onValueChange,
  defaultValue,
  label = "Timezone",
  placeholder = "Timezone",
  disabled = false,
  invalid = false,
  className,
  id = "timezone-selector",
}: TimezoneSelectorProps) {
  const groupedOptions = React.useMemo(() => {
    return GROUPS.map((group) => ({
      group,
      options: TIMEZONE_OPTIONS.filter((tz) => tz.group === group),
    }));
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label htmlFor={id} className={cn(invalid && "text-destructive")}>
          {label}
        </Label>
      )}

      <SelectPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        defaultValue={defaultValue}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          aria-invalid={invalid || undefined}
          className={cn("w-full", className)}
        >
          <SelectPrimitive.Value placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent position="popper">
          {groupedOptions.map((g, groupIndex) => (
            <React.Fragment key={g.group}>
              {groupIndex > 0 && <SelectSeparator />}
              <SelectPrimitive.Group>
                <SelectLabel>{g.group}</SelectLabel>
                {g.options.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    <span className="flex items-center justify-between gap-4 w-full">
                      <span>{tz.label}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">{tz.offset}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectPrimitive.Group>
            </React.Fragment>
          ))}
        </SelectContent>
      </SelectPrimitive.Root>

      {invalid && (
        <p className="text-xs text-destructive" role="alert">
          Please select a valid timezone.
        </p>
      )}
    </div>
  );
}