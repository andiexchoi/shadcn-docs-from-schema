"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Inline Select wrappers (no components/ui/select.tsx present in project)
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

interface TimezoneGroup {
  label: string;
  timezones: TimezoneOption[];
}

const TIMEZONE_GROUPS: TimezoneGroup[] = [
  {
    label: "Americas",
    timezones: [
      { value: "America/Anchorage", label: "Alaska", offset: "UTC−9" },
      { value: "America/Los_Angeles", label: "Pacific time", offset: "UTC−8" },
      { value: "America/Denver", label: "Mountain time", offset: "UTC−7" },
      { value: "America/Phoenix", label: "Arizona (no DST)", offset: "UTC−7" },
      { value: "America/Chicago", label: "Central time", offset: "UTC−6" },
      { value: "America/New_York", label: "Eastern time", offset: "UTC−5" },
      { value: "America/Halifax", label: "Atlantic time", offset: "UTC−4" },
      { value: "America/St_Johns", label: "Newfoundland", offset: "UTC−3:30" },
      { value: "America/Sao_Paulo", label: "Brasília", offset: "UTC−3" },
      { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", offset: "UTC−3" },
      { value: "America/Santiago", label: "Santiago", offset: "UTC−3" },
      { value: "America/Bogota", label: "Bogotá", offset: "UTC−5" },
      { value: "America/Lima", label: "Lima", offset: "UTC−5" },
      { value: "America/Mexico_City", label: "Mexico City", offset: "UTC−6" },
      { value: "America/Toronto", label: "Toronto", offset: "UTC−5" },
      { value: "America/Vancouver", label: "Vancouver", offset: "UTC−8" },
    ],
  },
  {
    label: "Europe & Africa",
    timezones: [
      { value: "Atlantic/Azores", label: "Azores", offset: "UTC−1" },
      { value: "Europe/London", label: "London (GMT)", offset: "UTC+0" },
      { value: "Europe/Lisbon", label: "Lisbon", offset: "UTC+0" },
      { value: "Europe/Dublin", label: "Dublin", offset: "UTC+0" },
      { value: "Europe/Paris", label: "Paris", offset: "UTC+1" },
      { value: "Europe/Berlin", label: "Berlin", offset: "UTC+1" },
      { value: "Europe/Rome", label: "Rome", offset: "UTC+1" },
      { value: "Europe/Madrid", label: "Madrid", offset: "UTC+1" },
      { value: "Europe/Amsterdam", label: "Amsterdam", offset: "UTC+1" },
      { value: "Europe/Brussels", label: "Brussels", offset: "UTC+1" },
      { value: "Europe/Stockholm", label: "Stockholm", offset: "UTC+1" },
      { value: "Europe/Warsaw", label: "Warsaw", offset: "UTC+1" },
      { value: "Europe/Athens", label: "Athens", offset: "UTC+2" },
      { value: "Europe/Helsinki", label: "Helsinki", offset: "UTC+2" },
      { value: "Europe/Bucharest", label: "Bucharest", offset: "UTC+2" },
      { value: "Africa/Cairo", label: "Cairo", offset: "UTC+2" },
      { value: "Africa/Johannesburg", label: "Johannesburg", offset: "UTC+2" },
      { value: "Europe/Moscow", label: "Moscow", offset: "UTC+3" },
      { value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+3" },
      { value: "Africa/Lagos", label: "Lagos", offset: "UTC+1" },
      { value: "Africa/Accra", label: "Accra", offset: "UTC+0" },
      { value: "Africa/Casablanca", label: "Casablanca", offset: "UTC+0" },
    ],
  },
  {
    label: "Asia & Middle East",
    timezones: [
      { value: "Asia/Dubai", label: "Dubai", offset: "UTC+4" },
      { value: "Asia/Tehran", label: "Tehran", offset: "UTC+3:30" },
      { value: "Asia/Karachi", label: "Karachi", offset: "UTC+5" },
      { value: "Asia/Kolkata", label: "Kolkata", offset: "UTC+5:30" },
      { value: "Asia/Colombo", label: "Colombo", offset: "UTC+5:30" },
      { value: "Asia/Dhaka", label: "Dhaka", offset: "UTC+6" },
      { value: "Asia/Rangoon", label: "Yangon", offset: "UTC+6:30" },
      { value: "Asia/Bangkok", label: "Bangkok", offset: "UTC+7" },
      { value: "Asia/Jakarta", label: "Jakarta", offset: "UTC+7" },
      { value: "Asia/Singapore", label: "Singapore", offset: "UTC+8" },
      { value: "Asia/Hong_Kong", label: "Hong Kong", offset: "UTC+8" },
      { value: "Asia/Shanghai", label: "Shanghai", offset: "UTC+8" },
      { value: "Asia/Taipei", label: "Taipei", offset: "UTC+8" },
      { value: "Asia/Manila", label: "Manila", offset: "UTC+8" },
      { value: "Asia/Seoul", label: "Seoul", offset: "UTC+9" },
      { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+9" },
      { value: "Asia/Riyadh", label: "Riyadh", offset: "UTC+3" },
      { value: "Asia/Beirut", label: "Beirut", offset: "UTC+2" },
      { value: "Asia/Jerusalem", label: "Jerusalem", offset: "UTC+2" },
      { value: "Asia/Almaty", label: "Almaty", offset: "UTC+6" },
      { value: "Asia/Tashkent", label: "Tashkent", offset: "UTC+5" },
      { value: "Asia/Kabul", label: "Kabul", offset: "UTC+4:30" },
    ],
  },
  {
    label: "Pacific & Oceania",
    timezones: [
      { value: "Australia/Perth", label: "Perth", offset: "UTC+8" },
      { value: "Australia/Darwin", label: "Darwin", offset: "UTC+9:30" },
      { value: "Australia/Adelaide", label: "Adelaide", offset: "UTC+9:30" },
      { value: "Australia/Brisbane", label: "Brisbane", offset: "UTC+10" },
      { value: "Australia/Sydney", label: "Sydney", offset: "UTC+10" },
      { value: "Australia/Melbourne", label: "Melbourne", offset: "UTC+10" },
      { value: "Pacific/Auckland", label: "Auckland", offset: "UTC+12" },
      { value: "Pacific/Fiji", label: "Fiji", offset: "UTC+12" },
      { value: "Pacific/Honolulu", label: "Honolulu", offset: "UTC−10" },
      { value: "Pacific/Guam", label: "Guam", offset: "UTC+10" },
      { value: "Pacific/Tongatapu", label: "Tonga", offset: "UTC+13" },
    ],
  },
];

// ---------------------------------------------------------------------------
// TimezoneSelector component
// ---------------------------------------------------------------------------

export interface TimezoneSelectorProps {
  /** The currently selected IANA timezone string. */
  value?: string;
  /** Called with the new IANA timezone string when selection changes. */
  onValueChange?: (value: string) => void;
  /** Default value for uncontrolled usage. */
  defaultValue?: string;
  /** Label displayed above the selector. Defaults to "Timezone". */
  label?: string;
  /** Whether to show the UTC offset next to each option label. */
  showOffset?: boolean;
  /** Whether the selector is disabled. */
  disabled?: boolean;
  /** Additional class names for the trigger button. */
  className?: string;
  /** Unique id used to link the label and trigger for accessibility. */
  id?: string;
  /** aria-invalid state for validation error signalling. */
  "aria-invalid"?: boolean | "true" | "false";
}

export function TimezoneSelector({
  value,
  onValueChange,
  defaultValue,
  label = "Timezone",
  showOffset = true,
  disabled = false,
  className,
  id,
  "aria-invalid": ariaInvalid,
}: TimezoneSelectorProps) {
  const triggerId = id ?? React.useId();

  // Flatten all timezones for display value lookup
  const allTimezones = React.useMemo(
    () => TIMEZONE_GROUPS.flatMap((g) => g.timezones),
    []
  );

  const selectedOption = React.useMemo(
    () => allTimezones.find((tz) => tz.value === value),
    [allTimezones, value]
  );

  const formatLabel = (option: TimezoneOption) =>
    showOffset ? `${option.label} (${option.offset})` : option.label;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={triggerId}>{label}</Label>
      <Select
        value={value}
        onValueChange={onValueChange}
        defaultValue={defaultValue}
        disabled={disabled}
      >
        <SelectTrigger
          id={triggerId}
          className={cn("w-full", className)}
          aria-invalid={ariaInvalid}
        >
          <SelectValue placeholder="Timezone">
            {selectedOption ? formatLabel(selectedOption) : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent position="popper">
          {TIMEZONE_GROUPS.map((group, groupIndex) => (
            <React.Fragment key={group.label}>
              {groupIndex > 0 && <SelectSeparator />}
              <SelectGroup>
                <SelectLabel>{group.label}</SelectLabel>
                {group.timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    {formatLabel(tz)}
                  </SelectItem>
                ))}
              </SelectGroup>
            </React.Fragment>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}