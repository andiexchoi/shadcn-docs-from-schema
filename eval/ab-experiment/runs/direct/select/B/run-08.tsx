"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@radix-ui/react-select";
import { ChevronDown, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Timezone data — grouped by region
// ---------------------------------------------------------------------------

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

interface TimezoneGroup {
  group: string;
  options: TimezoneOption[];
}

const TIMEZONE_GROUPS: TimezoneGroup[] = [
  {
    group: "Americas",
    options: [
      { value: "America/Anchorage", label: "Anchorage", offset: "UTC−9" },
      { value: "America/Los_Angeles", label: "Los Angeles (PT)", offset: "UTC−8" },
      { value: "America/Denver", label: "Denver (MT)", offset: "UTC−7" },
      { value: "America/Phoenix", label: "Phoenix", offset: "UTC−7" },
      { value: "America/Chicago", label: "Chicago (CT)", offset: "UTC−6" },
      { value: "America/New_York", label: "New York (ET)", offset: "UTC−5" },
      { value: "America/Halifax", label: "Halifax (AT)", offset: "UTC−4" },
      { value: "America/St_Johns", label: "St. John's (NT)", offset: "UTC−3:30" },
      { value: "America/Sao_Paulo", label: "São Paulo", offset: "UTC−3" },
      { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires", offset: "UTC−3" },
      { value: "America/Bogota", label: "Bogotá", offset: "UTC−5" },
      { value: "America/Mexico_City", label: "Mexico City", offset: "UTC−6" },
      { value: "America/Toronto", label: "Toronto (ET)", offset: "UTC−5" },
      { value: "America/Vancouver", label: "Vancouver (PT)", offset: "UTC−8" },
    ],
  },
  {
    group: "Europe",
    options: [
      { value: "Europe/London", label: "London (GMT/BST)", offset: "UTC+0" },
      { value: "Europe/Lisbon", label: "Lisbon", offset: "UTC+0" },
      { value: "Europe/Paris", label: "Paris (CET)", offset: "UTC+1" },
      { value: "Europe/Berlin", label: "Berlin (CET)", offset: "UTC+1" },
      { value: "Europe/Madrid", label: "Madrid (CET)", offset: "UTC+1" },
      { value: "Europe/Rome", label: "Rome (CET)", offset: "UTC+1" },
      { value: "Europe/Amsterdam", label: "Amsterdam (CET)", offset: "UTC+1" },
      { value: "Europe/Brussels", label: "Brussels (CET)", offset: "UTC+1" },
      { value: "Europe/Zurich", label: "Zurich (CET)", offset: "UTC+1" },
      { value: "Europe/Stockholm", label: "Stockholm (CET)", offset: "UTC+1" },
      { value: "Europe/Athens", label: "Athens (EET)", offset: "UTC+2" },
      { value: "Europe/Helsinki", label: "Helsinki (EET)", offset: "UTC+2" },
      { value: "Europe/Bucharest", label: "Bucharest (EET)", offset: "UTC+2" },
      { value: "Europe/Kiev", label: "Kyiv (EET)", offset: "UTC+2" },
      { value: "Europe/Moscow", label: "Moscow", offset: "UTC+3" },
      { value: "Europe/Istanbul", label: "Istanbul", offset: "UTC+3" },
    ],
  },
  {
    group: "Africa",
    options: [
      { value: "Africa/Abidjan", label: "Abidjan", offset: "UTC+0" },
      { value: "Africa/Lagos", label: "Lagos (WAT)", offset: "UTC+1" },
      { value: "Africa/Cairo", label: "Cairo (EET)", offset: "UTC+2" },
      { value: "Africa/Johannesburg", label: "Johannesburg (SAST)", offset: "UTC+2" },
      { value: "Africa/Nairobi", label: "Nairobi (EAT)", offset: "UTC+3" },
    ],
  },
  {
    group: "Asia",
    options: [
      { value: "Asia/Dubai", label: "Dubai (GST)", offset: "UTC+4" },
      { value: "Asia/Karachi", label: "Karachi (PKT)", offset: "UTC+5" },
      { value: "Asia/Kolkata", label: "Kolkata (IST)", offset: "UTC+5:30" },
      { value: "Asia/Dhaka", label: "Dhaka (BST)", offset: "UTC+6" },
      { value: "Asia/Bangkok", label: "Bangkok (ICT)", offset: "UTC+7" },
      { value: "Asia/Jakarta", label: "Jakarta (WIB)", offset: "UTC+7" },
      { value: "Asia/Singapore", label: "Singapore (SGT)", offset: "UTC+8" },
      { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)", offset: "UTC+8" },
      { value: "Asia/Shanghai", label: "Shanghai (CST)", offset: "UTC+8" },
      { value: "Asia/Taipei", label: "Taipei (CST)", offset: "UTC+8" },
      { value: "Asia/Seoul", label: "Seoul (KST)", offset: "UTC+9" },
      { value: "Asia/Tokyo", label: "Tokyo (JST)", offset: "UTC+9" },
      { value: "Asia/Riyadh", label: "Riyadh (AST)", offset: "UTC+3" },
      { value: "Asia/Tehran", label: "Tehran (IRST)", offset: "UTC+3:30" },
      { value: "Asia/Yekaterinburg", label: "Yekaterinburg", offset: "UTC+5" },
    ],
  },
  {
    group: "Pacific",
    options: [
      { value: "Pacific/Honolulu", label: "Honolulu (HST)", offset: "UTC−10" },
      { value: "Pacific/Pago_Pago", label: "Pago Pago (SST)", offset: "UTC−11" },
      { value: "Pacific/Auckland", label: "Auckland (NZST)", offset: "UTC+12" },
      { value: "Pacific/Fiji", label: "Fiji", offset: "UTC+12" },
      { value: "Pacific/Guam", label: "Guam (ChST)", offset: "UTC+10" },
      { value: "Pacific/Port_Moresby", label: "Port Moresby (PGT)", offset: "UTC+10" },
    ],
  },
  {
    group: "Australia",
    options: [
      { value: "Australia/Perth", label: "Perth (AWST)", offset: "UTC+8" },
      { value: "Australia/Darwin", label: "Darwin (ACST)", offset: "UTC+9:30" },
      { value: "Australia/Adelaide", label: "Adelaide (ACST)", offset: "UTC+9:30" },
      { value: "Australia/Brisbane", label: "Brisbane (AEST)", offset: "UTC+10" },
      { value: "Australia/Sydney", label: "Sydney (AEST)", offset: "UTC+10" },
      { value: "Australia/Melbourne", label: "Melbourne (AEST)", offset: "UTC+10" },
    ],
  },
  {
    group: "UTC",
    options: [{ value: "UTC", label: "UTC", offset: "UTC+0" }],
  },
];

// ---------------------------------------------------------------------------
// Flat list (for lookup)
// ---------------------------------------------------------------------------

const ALL_OPTIONS: TimezoneOption[] = TIMEZONE_GROUPS.flatMap((g) => g.options);

function getLabelForValue(value: string): string {
  const found = ALL_OPTIONS.find((o) => o.value === value);
  return found ? `${found.label} (${found.offset})` : value;
}

// ---------------------------------------------------------------------------
// Custom Radix primitives styling helpers
// ---------------------------------------------------------------------------

const triggerClasses = cn(
  "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
  "placeholder:text-muted-foreground",
  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "data-[invalid]:border-destructive data-[invalid]:ring-destructive",
  "[&[data-placeholder]>span]:text-muted-foreground"
);

const contentClasses = cn(
  "relative z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
  "@media (prefers-reduced-motion: reduce) { animation: none }"
);

const itemClasses = cn(
  "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
  "focus:bg-accent focus:text-accent-foreground",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
);

const groupLabelClasses =
  "py-1.5 pl-2 pr-2 text-xs font-semibold text-muted-foreground";

const separatorClasses = "-mx-1 my-1 h-px bg-muted";

const viewportClasses = "p-1 overflow-y-auto max-h-72";

// ---------------------------------------------------------------------------
// TimezoneSelectorProps
// ---------------------------------------------------------------------------

export interface TimezoneSelectorProps {
  /** Currently selected IANA timezone value */
  value?: string;
  /** Callback when user selects a timezone */
  onValueChange?: (value: string) => void;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Label text shown above the trigger */
  label?: string;
  /** Placeholder text for the trigger */
  placeholder?: string;
  /** Disables the selector */
  disabled?: boolean;
  /** Marks the field as invalid */
  invalid?: boolean;
  /** aria-label for the trigger when no visible label is provided */
  "aria-label"?: string;
  /** Additional class names applied to the trigger */
  className?: string;
  /** id for the trigger element */
  id?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TimezoneSelector({
  value,
  onValueChange,
  defaultValue,
  label = "Timezone",
  placeholder = "Timezone",
  disabled = false,
  invalid = false,
  "aria-label": ariaLabel,
  className,
  id,
}: TimezoneSelectorProps) {
  const triggerId = id ?? React.useId();
  const labelId = `${triggerId}-label`;

  const selectProps = value !== undefined
    ? { value, onValueChange }
    : { defaultValue, onValueChange };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <Label htmlFor={triggerId} id={labelId}>
          {label}
        </Label>
      )}

      <Select disabled={disabled} {...selectProps}>
        <SelectTrigger
          id={triggerId}
          aria-label={!label ? ariaLabel : undefined}
          aria-labelledby={label ? labelId : undefined}
          aria-invalid={invalid ? true : undefined}
          data-invalid={invalid ? "" : undefined}
          className={cn(triggerClasses, className)}
        >
          <SelectValue placeholder={placeholder}>
            {value !== undefined ? getLabelForValue(value) : undefined}
          </SelectValue>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
        </SelectTrigger>

        <SelectContent
          className={contentClasses}
          position="popper"
          sideOffset={4}
        >
          <Select.Viewport className={viewportClasses}>
            {TIMEZONE_GROUPS.map((group, groupIndex) => (
              <React.Fragment key={group.group}>
                {groupIndex > 0 && (
                  <SelectSeparator className={separatorClasses} />
                )}
                <SelectGroup>
                  <SelectLabel className={groupLabelClasses}>
                    {group.group}
                  </SelectLabel>
                  {group.options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className={itemClasses}
                    >
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4" aria-hidden="true" />
                        </Select.ItemIndicator>
                      </span>
                      <Select.ItemText>
                        {option.label}{" "}
                        <span className="text-muted-foreground">
                          ({option.offset})
                        </span>
                      </Select.ItemText>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </React.Fragment>
            ))}
          </Select.Viewport>
        </SelectContent>
      </Select>
    </div>
  );
}