"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Radix Select wrappers (local, no shadcn dialog dependency)
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
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "@media (prefers-reduced-motion: reduce) { animation: none !important; }",
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
  { value: "America/Los_Angeles", label: "Pacific time", offset: "UTC−08:00", region: "Americas" },
  { value: "America/Denver", label: "Mountain time", offset: "UTC−07:00", region: "Americas" },
  { value: "America/Phoenix", label: "Mountain time (no DST)", offset: "UTC−07:00", region: "Americas" },
  { value: "America/Chicago", label: "Central time", offset: "UTC−06:00", region: "Americas" },
  { value: "America/Mexico_City", label: "Mexico City", offset: "UTC−06:00", region: "Americas" },
  { value: "America/New_York", label: "Eastern time", offset: "UTC−05:00", region: "Americas" },
  { value: "America/Toronto", label: "Toronto", offset: "UTC−05:00", region: "Americas" },
  { value: "America/Bogota", label: "Bogotá", offset: "UTC−05:00", region: "Americas" },
  { value: "America/Lima", label: "Lima", offset: "UTC−05:00", region: "Americas" },
  { value: "America/Caracas", label: "Caracas", offset: "UTC−04:00", region: "Americas" },
  { value: "America/Halifax", label: "Halifax", offset: "UTC−04:00", region: "Americas" },
  { value: "America/Santiago", label: "Santiago", offset: "UTC−04:00", region: "Americas" },
  { value: "America/Sao_Paulo", label: "São Paulo", offset: "UTC−03:00", region: "Americas" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", offset: "UTC−03:00", region: "Americas" },
  { value: "America/St_Johns", label: "Newfoundland", offset: "UTC−03:30", region: "Americas" },
  // Europe & Africa
  { value: "Atlantic/Azores", label: "Azores", offset: "UTC−01:00", region: "Europe & Africa" },
  { value: "Europe/London", label: "London", offset: "UTC+00:00", region: "Europe & Africa" },
  { value: "Africa/Abidjan", label: "Abidjan", offset: "UTC+00:00", region: "Europe & Africa" },
  { value: "Europe/Paris", label: "Paris", offset: "UTC+01:00", region: "Europe & Africa" },
  { value: "Europe/Berlin", label: "Berlin", offset: "UTC+01:00", region: "Europe & Africa" },
  { value: "Europe/Madrid", label: "Madrid", offset: "UTC+01:00", region: "Europe & Africa" },
  { value: "Africa/Lagos", label: "Lagos", offset: "UTC+01:00", region: "Europe & Africa" },
  { value: "Europe/Helsinki", label: "Helsinki", offset: "UTC+02:00", region: "Europe & Africa" },
  { value: "Europe/Athens", label: "Athens", offset: "UTC+02:00", region: "Europe & Africa" },
  { value: "Africa/Cairo", label: "Cairo", offset: "UTC+02:00", region: "Europe & Africa" },
  { value: "Africa/Johannesburg", label: "Johannesburg", offset: "UTC+02:00", region: "Europe & Africa" },
  { value: "Europe/Moscow", label: "Moscow", offset: "UTC+03:00", region: "Europe & Africa" },
  { value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+03:00", region: "Europe & Africa" },
  // Asia & Oceania
  { value: "Asia/Dubai", label: "Dubai", offset: "UTC+04:00", region: "Asia & Oceania" },
  { value: "Asia/Baku", label: "Baku", offset: "UTC+04:00", region: "Asia & Oceania" },
  { value: "Asia/Kabul", label: "Kabul", offset: "UTC+04:30", region: "Asia & Oceania" },
  { value: "Asia/Karachi", label: "Karachi", offset: "UTC+05:00", region: "Asia & Oceania" },
  { value: "Asia/Tashkent", label: "Tashkent", offset: "UTC+05:00", region: "Asia & Oceania" },
  { value: "Asia/Kolkata", label: "India", offset: "UTC+05:30", region: "Asia & Oceania" },
  { value: "Asia/Kathmandu", label: "Kathmandu", offset: "UTC+05:45", region: "Asia & Oceania" },
  { value: "Asia/Dhaka", label: "Dhaka", offset: "UTC+06:00", region: "Asia & Oceania" },
  { value: "Asia/Almaty", label: "Almaty", offset: "UTC+06:00", region: "Asia & Oceania" },
  { value: "Asia/Rangoon", label: "Yangon", offset: "UTC+06:30", region: "Asia & Oceania" },
  { value: "Asia/Bangkok", label: "Bangkok", offset: "UTC+07:00", region: "Asia & Oceania" },
  { value: "Asia/Jakarta", label: "Jakarta", offset: "UTC+07:00", region: "Asia & Oceania" },
  { value: "Asia/Shanghai", label: "Shanghai", offset: "UTC+08:00", region: "Asia & Oceania" },
  { value: "Asia/Singapore", label: "Singapore", offset: "UTC+08:00", region: "Asia & Oceania" },
  { value: "Asia/Hong_Kong", label: "Hong Kong", offset: "UTC+08:00", region: "Asia & Oceania" },
  { value: "Asia/Taipei", label: "Taipei", offset: "UTC+08:00", region: "Asia & Oceania" },
  { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur", offset: "UTC+08:00", region: "Asia & Oceania" },
  { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+09:00", region: "Asia & Oceania" },
  { value: "Asia/Seoul", label: "Seoul", offset: "UTC+09:00", region: "Asia & Oceania" },
  { value: "Australia/Adelaide", label: "Adelaide", offset: "UTC+09:30", region: "Asia & Oceania" },
  { value: "Australia/Sydney", label: "Sydney", offset: "UTC+10:00", region: "Asia & Oceania" },
  { value: "Australia/Melbourne", label: "Melbourne", offset: "UTC+10:00", region: "Asia & Oceania" },
  { value: "Pacific/Auckland", label: "Auckland", offset: "UTC+12:00", region: "Asia & Oceania" },
  { value: "Pacific/Fiji", label: "Fiji", offset: "UTC+12:00", region: "Asia & Oceania" },
];

const REGIONS = Array.from(new Set(TIMEZONES.map((tz) => tz.region)));

// ---------------------------------------------------------------------------
// TimezoneSelectorProps
// ---------------------------------------------------------------------------

export interface TimezoneSelectorProps {
  /** The currently selected timezone value (IANA name, e.g. "America/New_York"). */
  value?: string;
  /** Callback fired when the user picks a timezone. */
  onValueChange?: (value: string) => void;
  /** Label shown above the selector. Defaults to "Timezone". */
  label?: string;
  /** Placeholder shown when no value is selected. */
  placeholder?: string;
  /** Whether the selector is disabled. */
  disabled?: boolean;
  /** Whether the selector is in an invalid/error state. */
  invalid?: boolean;
  /** Error message shown below the selector when invalid is true. */
  errorMessage?: string;
  /** Additional class names applied to the trigger element. */
  className?: string;
  /** HTML id used to link the label and trigger. Auto-generated if omitted. */
  id?: string;
}

// ---------------------------------------------------------------------------
// TimezoneSelector component
// ---------------------------------------------------------------------------

let idCounter = 0;

export function TimezoneSelector({
  value,
  onValueChange,
  label = "Timezone",
  placeholder = "Timezone",
  disabled = false,
  invalid = false,
  errorMessage,
  className,
  id: idProp,
}: TimezoneSelectorProps) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const errorId = `${id}-error`;

  const selectedOption = value
    ? TIMEZONES.find((tz) => tz.value === value)
    : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className={cn(invalid && "text-destructive")}>
        {label}
      </Label>

      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          className={cn("w-full", invalid && "border-destructive focus:ring-destructive", className)}
          aria-invalid={invalid ? "true" : undefined}
          aria-describedby={invalid && errorMessage ? errorId : undefined}
        >
          <SelectValue placeholder={placeholder}>
            {selectedOption
              ? `${selectedOption.label} (${selectedOption.offset})`
              : undefined}
          </SelectValue>
        </SelectTrigger>

        <SelectContent position="popper">
          {REGIONS.map((region, regionIndex) => {
            const regionTimezones = TIMEZONES.filter((tz) => tz.region === region);
            return (
              <React.Fragment key={region}>
                {regionIndex > 0 && <SelectSeparator />}
                <SelectGroup>
                  <SelectLabel>{region}</SelectLabel>
                  {regionTimezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      <span className="flex items-center justify-between gap-4 w-full">
                        <span>{tz.label}</span>
                        <span className="text-muted-foreground tabular-nums text-xs">
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

      {invalid && errorMessage && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}