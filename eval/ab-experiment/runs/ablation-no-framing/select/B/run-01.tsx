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
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", offset: "UTC−3", region: "Americas" },
  { value: "America/Bogota", label: "Bogotá", offset: "UTC−5", region: "Americas" },
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
  { value: "Atlantic/Reykjavik", label: "Reykjavik", offset: "UTC+0", region: "Atlantic" },
  // Australia
  { value: "Australia/Adelaide", label: "Adelaide", offset: "UTC+9:30", region: "Australia" },
  { value: "Australia/Brisbane", label: "Brisbane", offset: "UTC+10", region: "Australia" },
  { value: "Australia/Melbourne", label: "Melbourne", offset: "UTC+10", region: "Australia" },
  { value: "Australia/Perth", label: "Perth", offset: "UTC+8", region: "Australia" },
  { value: "Australia/Sydney", label: "Sydney", offset: "UTC+10", region: "Australia" },
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
  { value: "Pacific/Auckland", label: "Auckland", offset: "UTC+12", region: "Pacific" },
  { value: "Pacific/Fiji", label: "Fiji", offset: "UTC+12", region: "Pacific" },
  { value: "Pacific/Honolulu", label: "Honolulu", offset: "UTC−10", region: "Pacific" },
  // UTC
  { value: "UTC", label: "UTC", offset: "UTC+0", region: "UTC" },
];

const REGIONS = Array.from(new Set(TIMEZONES.map((tz) => tz.region)));

// ---------------------------------------------------------------------------
// Local Select sub-components (built from Radix primitives)
// ---------------------------------------------------------------------------

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
      <ChevronDown className="h-4 w-4 opacity-50" aria-hidden="true" />
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
  </SelectPortal>
));
SelectContent.displayName = "SelectContent";

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider", className)}
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

// ---------------------------------------------------------------------------
// TimezoneSelector public API
// ---------------------------------------------------------------------------

export interface TimezoneSelectorProps {
  /** Controlled value — IANA timezone string e.g. "America/New_York" */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Called when the user picks a timezone */
  onValueChange?: (value: string) => void;
  /** Label rendered above the trigger */
  label?: string;
  /** Placeholder text shown when nothing is selected */
  placeholder?: string;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Whether the field is in an invalid / error state */
  invalid?: boolean;
  /** Error message displayed below the trigger when invalid */
  errorMessage?: string;
  /** Additional className applied to the trigger */
  className?: string;
  /** Id used to link the label and trigger */
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
  errorMessage,
  className,
  id = "timezone-selector",
}: TimezoneSelectorProps) {
  // Determine whether component is controlled
  const isControlled = value !== undefined;

  const selectProps = isControlled
    ? { value, onValueChange }
    : { defaultValue, onValueChange };

  // Derive the current display label for the trigger (used in aria-label)
  const selectedOption = TIMEZONES.find((tz) => tz.value === (isControlled ? value : undefined));

  return (
    <div className="flex flex-col gap-1.5" data-invalid={invalid || undefined}>
      <Label
        htmlFor={id}
        className={cn(invalid && "text-destructive")}
      >
        {label}
      </Label>

      <SelectRoot disabled={disabled} {...selectProps}>
        <SelectTrigger
          id={id}
          className={cn(
            "w-full",
            invalid && "border-destructive ring-destructive focus:ring-destructive",
            className
          )}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid && errorMessage ? `${id}-error` : undefined}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <SelectValue placeholder={placeholder}>
              {selectedOption
                ? `${selectedOption.label} (${selectedOption.offset})`
                : undefined}
            </SelectValue>
          </span>
        </SelectTrigger>

        <SelectContent position="popper">
          {REGIONS.map((region, regionIndex) => {
            const items = TIMEZONES.filter((tz) => tz.region === region);
            return (
              <React.Fragment key={region}>
                {regionIndex > 0 && <SelectSeparator />}
                <SelectGroup>
                  <SelectLabel>{region}</SelectLabel>
                  {items.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      <span className="flex items-center justify-between gap-4 w-full">
                        <span>{tz.label}</span>
                        <span className="text-xs text-muted-foreground tabular-nums">
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
        <p
          id={`${id}-error`}
          className="text-sm text-destructive"
          role="alert"
          aria-live="polite"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Demo / default export
// ---------------------------------------------------------------------------

export default function TimezoneSelectorDemo() {
  const [controlled, setControlled] = React.useState<string>("Europe/London");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Timezone selector</h1>
          <p className="text-sm text-muted-foreground">
            Reusable component built with Radix Select + shadcn/ui.
          </p>
        </div>

        {/* Uncontrolled */}
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Uncontrolled
          </p>
          <TimezoneSelector
            id="tz-uncontrolled"
            defaultValue="America/New_York"
            onValueChange={(v) => console.log("uncontrolled picked:", v)}
          />
        </section>

        {/* Controlled */}
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Controlled — current: <span className="font-mono">{controlled}</span>
          </p>
          <TimezoneSelector
            id="tz-controlled"
            label="Meeting timezone"
            value={controlled}
            onValueChange={setControlled}
          />
        </section>

        {/* Disabled */}
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Disabled
          </p>
          <TimezoneSelector
            id="tz-disabled"
            label="Timezone (read-only)"
            value="Asia/Tokyo"
            disabled
          />
        </section>

        {/* Invalid */}
        <section className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Invalid state
          </p>
          <TimezoneSelector
            id="tz-invalid"
            label="Preferred timezone"
            placeholder="Select a timezone"
            invalid
            errorMessage="Please select a timezone to continue."
          />
        </section>
      </div>
    </div>
  );
}