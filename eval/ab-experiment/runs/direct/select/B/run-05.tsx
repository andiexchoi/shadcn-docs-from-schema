"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const TIMEZONE_GROUPS: { label: string; timezones: { value: string; label: string; offset: string }[] }[] = [
  {
    label: "Africa",
    timezones: [
      { value: "Africa/Abidjan", label: "Abidjan", offset: "UTC+0" },
      { value: "Africa/Cairo", label: "Cairo", offset: "UTC+2" },
      { value: "Africa/Johannesburg", label: "Johannesburg", offset: "UTC+2" },
      { value: "Africa/Lagos", label: "Lagos", offset: "UTC+1" },
      { value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+3" },
    ],
  },
  {
    label: "Americas",
    timezones: [
      { value: "America/Anchorage", label: "Anchorage", offset: "UTC−9" },
      { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", offset: "UTC−3" },
      { value: "America/Chicago", label: "Chicago (Central)", offset: "UTC−6" },
      { value: "America/Denver", label: "Denver (Mountain)", offset: "UTC−7" },
      { value: "America/Los_Angeles", label: "Los Angeles (Pacific)", offset: "UTC−8" },
      { value: "America/Mexico_City", label: "Mexico City", offset: "UTC−6" },
      { value: "America/New_York", label: "New York (Eastern)", offset: "UTC−5" },
      { value: "America/Phoenix", label: "Phoenix", offset: "UTC−7" },
      { value: "America/Sao_Paulo", label: "São Paulo", offset: "UTC−3" },
      { value: "America/Toronto", label: "Toronto", offset: "UTC−5" },
      { value: "America/Vancouver", label: "Vancouver", offset: "UTC−8" },
    ],
  },
  {
    label: "Asia",
    timezones: [
      { value: "Asia/Bangkok", label: "Bangkok", offset: "UTC+7" },
      { value: "Asia/Colombo", label: "Colombo", offset: "UTC+5:30" },
      { value: "Asia/Dubai", label: "Dubai", offset: "UTC+4" },
      { value: "Asia/Hong_Kong", label: "Hong Kong", offset: "UTC+8" },
      { value: "Asia/Jakarta", label: "Jakarta", offset: "UTC+7" },
      { value: "Asia/Karachi", label: "Karachi", offset: "UTC+5" },
      { value: "Asia/Kolkata", label: "Kolkata", offset: "UTC+5:30" },
      { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur", offset: "UTC+8" },
      { value: "Asia/Manila", label: "Manila", offset: "UTC+8" },
      { value: "Asia/Seoul", label: "Seoul", offset: "UTC+9" },
      { value: "Asia/Shanghai", label: "Shanghai", offset: "UTC+8" },
      { value: "Asia/Singapore", label: "Singapore", offset: "UTC+8" },
      { value: "Asia/Tehran", label: "Tehran", offset: "UTC+3:30" },
      { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+9" },
    ],
  },
  {
    label: "Australia & Pacific",
    timezones: [
      { value: "Australia/Adelaide", label: "Adelaide", offset: "UTC+9:30" },
      { value: "Australia/Brisbane", label: "Brisbane", offset: "UTC+10" },
      { value: "Australia/Melbourne", label: "Melbourne", offset: "UTC+11" },
      { value: "Australia/Perth", label: "Perth", offset: "UTC+8" },
      { value: "Australia/Sydney", label: "Sydney", offset: "UTC+11" },
      { value: "Pacific/Auckland", label: "Auckland", offset: "UTC+13" },
      { value: "Pacific/Honolulu", label: "Honolulu", offset: "UTC−10" },
    ],
  },
  {
    label: "Europe",
    timezones: [
      { value: "Europe/Amsterdam", label: "Amsterdam", offset: "UTC+1" },
      { value: "Europe/Athens", label: "Athens", offset: "UTC+2" },
      { value: "Europe/Berlin", label: "Berlin", offset: "UTC+1" },
      { value: "Europe/Dublin", label: "Dublin", offset: "UTC+0" },
      { value: "Europe/Helsinki", label: "Helsinki", offset: "UTC+2" },
      { value: "Europe/Istanbul", label: "Istanbul", offset: "UTC+3" },
      { value: "Europe/Lisbon", label: "Lisbon", offset: "UTC+0" },
      { value: "Europe/London", label: "London", offset: "UTC+0" },
      { value: "Europe/Madrid", label: "Madrid", offset: "UTC+1" },
      { value: "Europe/Moscow", label: "Moscow", offset: "UTC+3" },
      { value: "Europe/Paris", label: "Paris", offset: "UTC+1" },
      { value: "Europe/Rome", label: "Rome", offset: "UTC+1" },
      { value: "Europe/Stockholm", label: "Stockholm", offset: "UTC+1" },
      { value: "Europe/Warsaw", label: "Warsaw", offset: "UTC+1" },
      { value: "Europe/Zurich", label: "Zurich", offset: "UTC+1" },
    ],
  },
  {
    label: "UTC",
    timezones: [
      { value: "UTC", label: "UTC", offset: "UTC+0" },
    ],
  },
];

/* ---------- Radix primitives wrapped locally ---------- */

const SelectRoot = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

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
      <ChevronDown className="h-4 w-4 opacity-50" />
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
        "motion-reduce:animate-none motion-reduce:transition-none",
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

/* ---------- Public component ---------- */

export interface TimezoneSelectorProps {
  /** The currently selected timezone value (IANA string, e.g. "America/New_York"). */
  value?: string;
  /** Called when the user selects a new timezone. */
  onValueChange?: (value: string) => void;
  /** Label text rendered above the trigger. Defaults to "Timezone". */
  label?: string;
  /** Placeholder text shown when no value is selected. */
  placeholder?: string;
  /** Disables the entire selector. */
  disabled?: boolean;
  /** Marks the field as invalid. */
  invalid?: boolean;
  /** Optional error message shown below the trigger when `invalid` is true. */
  errorMessage?: string;
  /** Additional class names applied to the wrapping div. */
  className?: string;
}

export function TimezoneSelector({
  value,
  onValueChange,
  label = "Timezone",
  placeholder = "Select a timezone",
  disabled = false,
  invalid = false,
  errorMessage,
  className,
}: TimezoneSelectorProps) {
  const triggerId = React.useId();
  const errorId = React.useId();

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={triggerId} className="flex items-center gap-1.5 text-sm font-medium">
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        {label}
      </Label>

      <SelectRoot value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={triggerId}
          aria-invalid={invalid ? "true" : undefined}
          aria-describedby={invalid && errorMessage ? errorId : undefined}
          className={cn(
            invalid && "border-destructive ring-destructive focus:ring-destructive"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent position="popper">
          {TIMEZONE_GROUPS.map((group, groupIndex) => (
            <React.Fragment key={group.label}>
              {groupIndex > 0 && <SelectSeparator />}
              <SelectGroup>
                <SelectLabel>{group.label}</SelectLabel>
                {group.timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    <span className="flex items-center justify-between gap-6 w-full">
                      <span>{tz.label}</span>
                      <span className="text-xs tabular-nums text-muted-foreground">{tz.offset}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </React.Fragment>
          ))}
        </SelectContent>
      </SelectRoot>

      {invalid && errorMessage && (
        <p id={errorId} className="text-xs text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}