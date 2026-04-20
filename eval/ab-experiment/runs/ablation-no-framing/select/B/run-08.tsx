"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Timezone data
// ---------------------------------------------------------------------------

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
  group: string;
}

const TIMEZONE_OPTIONS: TimezoneOption[] = [
  // Africa
  { value: "Africa/Abidjan", label: "Abidjan", offset: "UTC+0", group: "Africa" },
  { value: "Africa/Cairo", label: "Cairo", offset: "UTC+2", group: "Africa" },
  { value: "Africa/Johannesburg", label: "Johannesburg", offset: "UTC+2", group: "Africa" },
  { value: "Africa/Lagos", label: "Lagos", offset: "UTC+1", group: "Africa" },
  { value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+3", group: "Africa" },
  // Americas
  { value: "America/Anchorage", label: "Anchorage", offset: "UTC-9", group: "Americas" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", offset: "UTC-3", group: "Americas" },
  { value: "America/Bogota", label: "Bogota", offset: "UTC-5", group: "Americas" },
  { value: "America/Chicago", label: "Chicago (CT)", offset: "UTC-6", group: "Americas" },
  { value: "America/Denver", label: "Denver (MT)", offset: "UTC-7", group: "Americas" },
  { value: "America/Halifax", label: "Halifax (AT)", offset: "UTC-4", group: "Americas" },
  { value: "America/Los_Angeles", label: "Los Angeles (PT)", offset: "UTC-8", group: "Americas" },
  { value: "America/Mexico_City", label: "Mexico City", offset: "UTC-6", group: "Americas" },
  { value: "America/New_York", label: "New York (ET)", offset: "UTC-5", group: "Americas" },
  { value: "America/Phoenix", label: "Phoenix", offset: "UTC-7", group: "Americas" },
  { value: "America/Sao_Paulo", label: "São Paulo", offset: "UTC-3", group: "Americas" },
  { value: "America/Toronto", label: "Toronto (ET)", offset: "UTC-5", group: "Americas" },
  { value: "America/Vancouver", label: "Vancouver (PT)", offset: "UTC-8", group: "Americas" },
  // Asia
  { value: "Asia/Bangkok", label: "Bangkok", offset: "UTC+7", group: "Asia" },
  { value: "Asia/Colombo", label: "Colombo", offset: "UTC+5:30", group: "Asia" },
  { value: "Asia/Dubai", label: "Dubai", offset: "UTC+4", group: "Asia" },
  { value: "Asia/Hong_Kong", label: "Hong Kong", offset: "UTC+8", group: "Asia" },
  { value: "Asia/Jakarta", label: "Jakarta", offset: "UTC+7", group: "Asia" },
  { value: "Asia/Karachi", label: "Karachi", offset: "UTC+5", group: "Asia" },
  { value: "Asia/Kolkata", label: "Kolkata", offset: "UTC+5:30", group: "Asia" },
  { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur", offset: "UTC+8", group: "Asia" },
  { value: "Asia/Manila", label: "Manila", offset: "UTC+8", group: "Asia" },
  { value: "Asia/Seoul", label: "Seoul", offset: "UTC+9", group: "Asia" },
  { value: "Asia/Shanghai", label: "Shanghai", offset: "UTC+8", group: "Asia" },
  { value: "Asia/Singapore", label: "Singapore", offset: "UTC+8", group: "Asia" },
  { value: "Asia/Taipei", label: "Taipei", offset: "UTC+8", group: "Asia" },
  { value: "Asia/Tehran", label: "Tehran", offset: "UTC+3:30", group: "Asia" },
  { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+9", group: "Asia" },
  // Atlantic
  { value: "Atlantic/Azores", label: "Azores", offset: "UTC-1", group: "Atlantic" },
  { value: "Atlantic/Reykjavik", label: "Reykjavik", offset: "UTC+0", group: "Atlantic" },
  // Australia
  { value: "Australia/Adelaide", label: "Adelaide", offset: "UTC+9:30", group: "Australia" },
  { value: "Australia/Brisbane", label: "Brisbane", offset: "UTC+10", group: "Australia" },
  { value: "Australia/Melbourne", label: "Melbourne", offset: "UTC+10", group: "Australia" },
  { value: "Australia/Perth", label: "Perth", offset: "UTC+8", group: "Australia" },
  { value: "Australia/Sydney", label: "Sydney", offset: "UTC+10", group: "Australia" },
  // Europe
  { value: "Europe/Amsterdam", label: "Amsterdam", offset: "UTC+1", group: "Europe" },
  { value: "Europe/Athens", label: "Athens", offset: "UTC+2", group: "Europe" },
  { value: "Europe/Berlin", label: "Berlin", offset: "UTC+1", group: "Europe" },
  { value: "Europe/Brussels", label: "Brussels", offset: "UTC+1", group: "Europe" },
  { value: "Europe/Budapest", label: "Budapest", offset: "UTC+1", group: "Europe" },
  { value: "Europe/Copenhagen", label: "Copenhagen", offset: "UTC+1", group: "Europe" },
  { value: "Europe/Dublin", label: "Dublin", offset: "UTC+0", group: "Europe" },
  { value: "Europe/Helsinki", label: "Helsinki", offset: "UTC+2", group: "Europe" },
  { value: "Europe/Istanbul", label: "Istanbul", offset: "UTC+3", group: "Europe" },
  { value: "Europe/Lisbon", label: "Lisbon", offset: "UTC+0", group: "Europe" },
  { value: "Europe/London", label: "London", offset: "UTC+0", group: "Europe" },
  { value: "Europe/Madrid", label: "Madrid", offset: "UTC+1", group: "Europe" },
  { value: "Europe/Moscow", label: "Moscow", offset: "UTC+3", group: "Europe" },
  { value: "Europe/Oslo", label: "Oslo", offset: "UTC+1", group: "Europe" },
  { value: "Europe/Paris", label: "Paris", offset: "UTC+1", group: "Europe" },
  { value: "Europe/Prague", label: "Prague", offset: "UTC+1", group: "Europe" },
  { value: "Europe/Rome", label: "Rome", offset: "UTC+1", group: "Europe" },
  { value: "Europe/Stockholm", label: "Stockholm", offset: "UTC+1", group: "Europe" },
  { value: "Europe/Warsaw", label: "Warsaw", offset: "UTC+1", group: "Europe" },
  { value: "Europe/Zurich", label: "Zurich", offset: "UTC+1", group: "Europe" },
  // Pacific
  { value: "Pacific/Auckland", label: "Auckland", offset: "UTC+12", group: "Pacific" },
  { value: "Pacific/Fiji", label: "Fiji", offset: "UTC+12", group: "Pacific" },
  { value: "Pacific/Guam", label: "Guam", offset: "UTC+10", group: "Pacific" },
  { value: "Pacific/Honolulu", label: "Honolulu", offset: "UTC-10", group: "Pacific" },
  { value: "Pacific/Midway", label: "Midway", offset: "UTC-11", group: "Pacific" },
  // UTC
  { value: "UTC", label: "UTC", offset: "UTC+0", group: "UTC" },
];

const GROUP_ORDER = ["UTC", "Americas", "Europe", "Africa", "Asia", "Australia", "Pacific", "Atlantic"];

function groupTimezones(options: TimezoneOption[]): Record<string, TimezoneOption[]> {
  const grouped: Record<string, TimezoneOption[]> = {};
  for (const tz of options) {
    if (!grouped[tz.group]) grouped[tz.group] = [];
    grouped[tz.group].push(tz);
  }
  return grouped;
}

// ---------------------------------------------------------------------------
// Local Select primitives (styled)
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
      <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
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
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-xs font-semibold text-muted-foreground tracking-wide uppercase", className)}
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
// TimezoneSelector component
// ---------------------------------------------------------------------------

export interface TimezoneSelectorProps {
  /** Controlled value — IANA timezone string e.g. "America/New_York" */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Called with the new IANA timezone string on selection */
  onValueChange?: (value: string) => void;
  /** Label text shown above the trigger */
  label?: string;
  /** Placeholder text shown when no value is selected */
  placeholder?: string;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Whether the field is in an error / invalid state */
  invalid?: boolean;
  /** Additional class names applied to the trigger */
  className?: string;
  /** ID passed to the trigger; auto-generated if omitted */
  id?: string;
}

export function TimezoneSelector({
  value,
  defaultValue,
  onValueChange,
  label = "Timezone",
  placeholder = "Select a timezone",
  disabled = false,
  invalid = false,
  className,
  id: externalId,
}: TimezoneSelectorProps) {
  const generatedId = React.useId();
  const id = externalId ?? generatedId;

  const grouped = React.useMemo(() => groupTimezones(TIMEZONE_OPTIONS), []);

  // Determine what to show in the trigger when a value is selected
  const selectedOption = React.useMemo(
    () => TIMEZONE_OPTIONS.find((tz) => tz.value === value),
    [value]
  );

  const selectProps = value !== undefined
    ? { value, onValueChange }
    : { defaultValue, onValueChange };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <Label htmlFor={id} className="text-sm font-medium leading-none">
        {label}
      </Label>

      <SelectPrimitive.Root disabled={disabled} {...selectProps}>
        <SelectTrigger
          id={id}
          aria-invalid={invalid ? "true" : undefined}
          className={cn(
            invalid && "border-destructive focus:ring-destructive",
            className
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Globe
              className="h-4 w-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <SelectPrimitive.Value placeholder={placeholder}>
              {selectedOption ? (
                <span className="flex items-center gap-2 min-w-0">
                  <span className="truncate">{selectedOption.label}</span>
                  <span className="shrink-0 text-muted-foreground text-xs">
                    {selectedOption.offset}
                  </span>
                </span>
              ) : undefined}
            </SelectPrimitive.Value>
          </span>
        </SelectTrigger>

        <SelectContent position="popper">
          {GROUP_ORDER.filter((g) => grouped[g]).map((group, groupIndex) => (
            <React.Fragment key={group}>
              {groupIndex > 0 && <SelectSeparator />}
              <SelectPrimitive.Group>
                <SelectLabel>{group}</SelectLabel>
                {grouped[group].map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    <span className="flex items-center justify-between gap-4 w-full">
                      <span>{tz.label}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {tz.offset}
                      </span>
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