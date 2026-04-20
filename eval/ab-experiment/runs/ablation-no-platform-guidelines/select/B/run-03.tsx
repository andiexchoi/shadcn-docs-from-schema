"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Timezone data grouped by region
// ---------------------------------------------------------------------------

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

interface TimezoneGroup {
  region: string;
  options: TimezoneOption[];
}

const TIMEZONE_GROUPS: TimezoneGroup[] = [
  {
    region: "Africa",
    options: [
      { value: "Africa/Abidjan", label: "Abidjan", offset: "UTC+0" },
      { value: "Africa/Cairo", label: "Cairo", offset: "UTC+2" },
      { value: "Africa/Johannesburg", label: "Johannesburg", offset: "UTC+2" },
      { value: "Africa/Lagos", label: "Lagos", offset: "UTC+1" },
      { value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+3" },
    ],
  },
  {
    region: "Americas",
    options: [
      { value: "America/Anchorage", label: "Anchorage", offset: "UTC−9" },
      { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", offset: "UTC−3" },
      { value: "America/Chicago", label: "Chicago (CT)", offset: "UTC−6" },
      { value: "America/Denver", label: "Denver (MT)", offset: "UTC−7" },
      { value: "America/Los_Angeles", label: "Los Angeles (PT)", offset: "UTC−8" },
      { value: "America/Mexico_City", label: "Mexico City", offset: "UTC−6" },
      { value: "America/New_York", label: "New York (ET)", offset: "UTC−5" },
      { value: "America/Phoenix", label: "Phoenix", offset: "UTC−7" },
      { value: "America/Sao_Paulo", label: "São Paulo", offset: "UTC−3" },
      { value: "America/Toronto", label: "Toronto", offset: "UTC−5" },
      { value: "America/Vancouver", label: "Vancouver", offset: "UTC−8" },
    ],
  },
  {
    region: "Asia",
    options: [
      { value: "Asia/Bangkok", label: "Bangkok", offset: "UTC+7" },
      { value: "Asia/Dubai", label: "Dubai", offset: "UTC+4" },
      { value: "Asia/Hong_Kong", label: "Hong Kong", offset: "UTC+8" },
      { value: "Asia/Jakarta", label: "Jakarta", offset: "UTC+7" },
      { value: "Asia/Karachi", label: "Karachi", offset: "UTC+5" },
      { value: "Asia/Kolkata", label: "Kolkata", offset: "UTC+5:30" },
      { value: "Asia/Seoul", label: "Seoul", offset: "UTC+9" },
      { value: "Asia/Shanghai", label: "Shanghai", offset: "UTC+8" },
      { value: "Asia/Singapore", label: "Singapore", offset: "UTC+8" },
      { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+9" },
    ],
  },
  {
    region: "Atlantic",
    options: [
      { value: "Atlantic/Azores", label: "Azores", offset: "UTC−1" },
      { value: "Atlantic/Cape_Verde", label: "Cape Verde", offset: "UTC−1" },
      { value: "Atlantic/Reykjavik", label: "Reykjavik", offset: "UTC+0" },
    ],
  },
  {
    region: "Australia & Pacific",
    options: [
      { value: "Australia/Adelaide", label: "Adelaide", offset: "UTC+9:30" },
      { value: "Australia/Brisbane", label: "Brisbane", offset: "UTC+10" },
      { value: "Australia/Melbourne", label: "Melbourne", offset: "UTC+11" },
      { value: "Australia/Perth", label: "Perth", offset: "UTC+8" },
      { value: "Australia/Sydney", label: "Sydney", offset: "UTC+11" },
      { value: "Pacific/Auckland", label: "Auckland", offset: "UTC+13" },
      { value: "Pacific/Fiji", label: "Fiji", offset: "UTC+12" },
      { value: "Pacific/Honolulu", label: "Honolulu", offset: "UTC−10" },
    ],
  },
  {
    region: "Europe",
    options: [
      { value: "Europe/Amsterdam", label: "Amsterdam", offset: "UTC+1" },
      { value: "Europe/Athens", label: "Athens", offset: "UTC+2" },
      { value: "Europe/Berlin", label: "Berlin", offset: "UTC+1" },
      { value: "Europe/Brussels", label: "Brussels", offset: "UTC+1" },
      { value: "Europe/Budapest", label: "Budapest", offset: "UTC+1" },
      { value: "Europe/Copenhagen", label: "Copenhagen", offset: "UTC+1" },
      { value: "Europe/Dublin", label: "Dublin", offset: "UTC+0" },
      { value: "Europe/Helsinki", label: "Helsinki", offset: "UTC+2" },
      { value: "Europe/Istanbul", label: "Istanbul", offset: "UTC+3" },
      { value: "Europe/Lisbon", label: "Lisbon", offset: "UTC+0" },
      { value: "Europe/London", label: "London", offset: "UTC+0" },
      { value: "Europe/Madrid", label: "Madrid", offset: "UTC+1" },
      { value: "Europe/Moscow", label: "Moscow", offset: "UTC+3" },
      { value: "Europe/Oslo", label: "Oslo", offset: "UTC+1" },
      { value: "Europe/Paris", label: "Paris", offset: "UTC+1" },
      { value: "Europe/Prague", label: "Prague", offset: "UTC+1" },
      { value: "Europe/Rome", label: "Rome", offset: "UTC+1" },
      { value: "Europe/Stockholm", label: "Stockholm", offset: "UTC+1" },
      { value: "Europe/Warsaw", label: "Warsaw", offset: "UTC+1" },
      { value: "Europe/Zurich", label: "Zurich", offset: "UTC+1" },
    ],
  },
  {
    region: "UTC",
    options: [
      { value: "UTC", label: "UTC", offset: "UTC+0" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Radix Select primitives (local wrappers)
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
// TimezoneSelector public API
// ---------------------------------------------------------------------------

export interface TimezoneSelectorProps {
  /** The currently selected IANA timezone string (controlled). */
  value?: string;
  /** Default value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the new IANA timezone string when the user makes a selection. */
  onValueChange?: (value: string) => void;
  /** Visible label rendered above the trigger. Defaults to "Timezone". */
  label?: string;
  /** Placeholder text shown inside the trigger when nothing is selected. */
  placeholder?: string;
  /** Disables the entire select. */
  disabled?: boolean;
  /** Marks the field as invalid and applies an error style. */
  invalid?: boolean;
  /** Error message rendered below the trigger when `invalid` is true. */
  errorMessage?: string;
  /** Additional class names applied to the wrapping div. */
  className?: string;
  /** Additional class names applied to the trigger button. */
  triggerClassName?: string;
  /** ID used to associate the label with the trigger for accessibility. */
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
  errorMessage,
  className,
  triggerClassName,
  id = "timezone-selector",
}: TimezoneSelectorProps) {
  const errorId = `${id}-error`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>

      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          aria-invalid={invalid ? "true" : undefined}
          aria-describedby={invalid && errorMessage ? errorId : undefined}
          className={cn(
            "w-full",
            invalid && "border-destructive focus:ring-destructive",
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent position="popper">
          {TIMEZONE_GROUPS.map((group, groupIndex) => (
            <React.Fragment key={group.region}>
              {groupIndex > 0 && <SelectSeparator />}
              <SelectGroup>
                <SelectLabel>{group.region}</SelectLabel>
                {group.options.map((tz) => (
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
          ))}
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