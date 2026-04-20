"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// ─── Timezone data ───────────────────────────────────────────────────────────

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
  region: string;
}

const TIMEZONES: TimezoneOption[] = [
  // Africa
  { value: "Africa/Abidjan", label: "Abidjan", offset: "UTC+0", region: "Africa" },
  { value: "Africa/Cairo", label: "Cairo", offset: "UTC+2", region: "Africa" },
  { value: "Africa/Johannesburg", label: "Johannesburg", offset: "UTC+2", region: "Africa" },
  { value: "Africa/Lagos", label: "Lagos", offset: "UTC+1", region: "Africa" },
  { value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+3", region: "Africa" },
  // Americas
  { value: "America/Anchorage", label: "Anchorage", offset: "UTC−9", region: "Americas" },
  { value: "America/Bogota", label: "Bogotá", offset: "UTC−5", region: "Americas" },
  { value: "America/Buenos_Aires", label: "Buenos Aires", offset: "UTC−3", region: "Americas" },
  { value: "America/Chicago", label: "Chicago (CT)", offset: "UTC−6", region: "Americas" },
  { value: "America/Denver", label: "Denver (MT)", offset: "UTC−7", region: "Americas" },
  { value: "America/Halifax", label: "Halifax (AT)", offset: "UTC−4", region: "Americas" },
  { value: "America/Los_Angeles", label: "Los Angeles (PT)", offset: "UTC−8", region: "Americas" },
  { value: "America/Mexico_City", label: "Mexico City", offset: "UTC−6", region: "Americas" },
  { value: "America/New_York", label: "New York (ET)", offset: "UTC−5", region: "Americas" },
  { value: "America/Phoenix", label: "Phoenix", offset: "UTC−7", region: "Americas" },
  { value: "America/Santiago", label: "Santiago", offset: "UTC−4", region: "Americas" },
  { value: "America/Sao_Paulo", label: "São Paulo", offset: "UTC−3", region: "Americas" },
  { value: "America/Toronto", label: "Toronto (ET)", offset: "UTC−5", region: "Americas" },
  { value: "America/Vancouver", label: "Vancouver (PT)", offset: "UTC−8", region: "Americas" },
  // Asia
  { value: "Asia/Baghdad", label: "Baghdad", offset: "UTC+3", region: "Asia" },
  { value: "Asia/Bangkok", label: "Bangkok", offset: "UTC+7", region: "Asia" },
  { value: "Asia/Colombo", label: "Colombo", offset: "UTC+5:30", region: "Asia" },
  { value: "Asia/Dhaka", label: "Dhaka", offset: "UTC+6", region: "Asia" },
  { value: "Asia/Dubai", label: "Dubai", offset: "UTC+4", region: "Asia" },
  { value: "Asia/Hong_Kong", label: "Hong Kong", offset: "UTC+8", region: "Asia" },
  { value: "Asia/Jakarta", label: "Jakarta", offset: "UTC+7", region: "Asia" },
  { value: "Asia/Karachi", label: "Karachi", offset: "UTC+5", region: "Asia" },
  { value: "Asia/Kolkata", label: "Kolkata", offset: "UTC+5:30", region: "Asia" },
  { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur", offset: "UTC+8", region: "Asia" },
  { value: "Asia/Manila", label: "Manila", offset: "UTC+8", region: "Asia" },
  { value: "Asia/Riyadh", label: "Riyadh", offset: "UTC+3", region: "Asia" },
  { value: "Asia/Seoul", label: "Seoul", offset: "UTC+9", region: "Asia" },
  { value: "Asia/Shanghai", label: "Shanghai", offset: "UTC+8", region: "Asia" },
  { value: "Asia/Singapore", label: "Singapore", offset: "UTC+8", region: "Asia" },
  { value: "Asia/Taipei", label: "Taipei", offset: "UTC+8", region: "Asia" },
  { value: "Asia/Tehran", label: "Tehran", offset: "UTC+3:30", region: "Asia" },
  { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+9", region: "Asia" },
  // Atlantic
  { value: "Atlantic/Azores", label: "Azores", offset: "UTC−1", region: "Atlantic" },
  { value: "Atlantic/Cape_Verde", label: "Cape Verde", offset: "UTC−1", region: "Atlantic" },
  { value: "Atlantic/Reykjavik", label: "Reykjavik", offset: "UTC+0", region: "Atlantic" },
  // Australia
  { value: "Australia/Adelaide", label: "Adelaide", offset: "UTC+9:30", region: "Australia" },
  { value: "Australia/Brisbane", label: "Brisbane", offset: "UTC+10", region: "Australia" },
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
  { value: "Europe/Kiev", label: "Kyiv", offset: "UTC+2", region: "Europe" },
  { value: "Europe/Lisbon", label: "Lisbon", offset: "UTC+0", region: "Europe" },
  { value: "Europe/London", label: "London", offset: "UTC+0", region: "Europe" },
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
  { value: "Pacific/Honolulu", label: "Honolulu", offset: "UTC−10", region: "Pacific" },
  { value: "Pacific/Midway", label: "Midway", offset: "UTC−11", region: "Pacific" },
  // UTC
  { value: "UTC", label: "UTC", offset: "UTC+0", region: "UTC" },
];

const REGIONS = Array.from(new Set(TIMEZONES.map((tz) => tz.region)));

// ─── Select sub-components (local, built on Radix primitives) ────────────────

const SelectRoot = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectPortal = SelectPrimitive.Portal;

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
      <ChevronDown className="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
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
    <ChevronUp className="h-4 w-4" aria-hidden="true" />
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
    <ChevronDown className="h-4 w-4" aria-hidden="true" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = "SelectScrollDownButton";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPortal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        "@media (prefers-reduced-motion: reduce) { animation: none !important; }",
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
  </SelectPortal>
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
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" aria-hidden="true" />
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

const SelectGroup = SelectPrimitive.Group;

// ─── TimezoneSelector component ──────────────────────────────────────────────

export interface TimezoneSelectorProps {
  /** Controlled value (IANA timezone string, e.g. "America/New_York") */
  value?: string;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Called when the user selects a new timezone */
  onValueChange?: (value: string) => void;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Label shown above the trigger */
  label?: string;
  /** Placeholder text inside the trigger */
  placeholder?: string;
  /** Whether the field is in an invalid / error state */
  invalid?: boolean;
  /** Error message shown below the trigger when invalid */
  errorMessage?: string;
  /** Additional className applied to the trigger */
  className?: string;
  /** ID used to link the label to the trigger for accessibility */
  id?: string;
}

export function TimezoneSelector({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  label = "Timezone",
  placeholder = "Select a timezone",
  invalid = false,
  errorMessage,
  className,
  id = "timezone-selector",
}: TimezoneSelectorProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5" data-invalid={invalid ? true : undefined}>
      <Label htmlFor={id} className={cn(invalid && "text-destructive")}>
        <span className="flex items-center gap-1.5">
          <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
          {label}
        </span>
      </Label>

      <SelectRoot
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          className={cn(
            "w-full",
            invalid && "border-destructive ring-destructive focus:ring-destructive",
            className
          )}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={invalid && errorMessage ? errorId : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent position="popper">
          {REGIONS.map((region, regionIndex) => {
            const tzs = TIMEZONES.filter((tz) => tz.region === region);
            return (
              <React.Fragment key={region}>
                {regionIndex > 0 && <SelectSeparator />}
                <SelectGroup>
                  <SelectLabel>{region}</SelectLabel>
                  {tzs.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      <span className="flex items-center justify-between gap-4">
                        <span>{tz.label}</span>
                        <span className="ml-auto text-xs tabular-nums text-muted-foreground">
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
      </SelectRoot>

      {invalid && errorMessage && (
        <p id={errorId} className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}