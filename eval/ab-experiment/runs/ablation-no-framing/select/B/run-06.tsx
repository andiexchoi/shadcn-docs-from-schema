"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check, Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const TIMEZONE_GROUPS: { label: string; zones: { value: string; label: string }[] }[] = [
  {
    label: "Americas",
    zones: [
      { value: "America/Anchorage", label: "Alaska (AKST/AKDT)" },
      { value: "America/Chicago", label: "Central Time (CT)" },
      { value: "America/Denver", label: "Mountain Time (MT)" },
      { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
      { value: "America/New_York", label: "Eastern Time (ET)" },
      { value: "America/Phoenix", label: "Arizona (MST)" },
      { value: "America/Halifax", label: "Atlantic Time (AT)" },
      { value: "America/St_Johns", label: "Newfoundland (NST)" },
      { value: "America/Sao_Paulo", label: "Brasília (BRT)" },
      { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires (ART)" },
      { value: "America/Bogota", label: "Colombia (COT)" },
      { value: "America/Lima", label: "Peru (PET)" },
      { value: "America/Mexico_City", label: "Mexico City (CST)" },
      { value: "America/Toronto", label: "Toronto (ET)" },
      { value: "America/Vancouver", label: "Vancouver (PT)" },
    ],
  },
  {
    label: "Europe",
    zones: [
      { value: "Europe/Amsterdam", label: "Amsterdam (CET/CEST)" },
      { value: "Europe/Athens", label: "Athens (EET/EEST)" },
      { value: "Europe/Berlin", label: "Berlin (CET/CEST)" },
      { value: "Europe/Brussels", label: "Brussels (CET/CEST)" },
      { value: "Europe/Budapest", label: "Budapest (CET/CEST)" },
      { value: "Europe/Copenhagen", label: "Copenhagen (CET/CEST)" },
      { value: "Europe/Dublin", label: "Dublin (GMT/IST)" },
      { value: "Europe/Helsinki", label: "Helsinki (EET/EEST)" },
      { value: "Europe/Istanbul", label: "Istanbul (TRT)" },
      { value: "Europe/Lisbon", label: "Lisbon (WET/WEST)" },
      { value: "Europe/London", label: "London (GMT/BST)" },
      { value: "Europe/Madrid", label: "Madrid (CET/CEST)" },
      { value: "Europe/Moscow", label: "Moscow (MSK)" },
      { value: "Europe/Oslo", label: "Oslo (CET/CEST)" },
      { value: "Europe/Paris", label: "Paris (CET/CEST)" },
      { value: "Europe/Prague", label: "Prague (CET/CEST)" },
      { value: "Europe/Rome", label: "Rome (CET/CEST)" },
      { value: "Europe/Stockholm", label: "Stockholm (CET/CEST)" },
      { value: "Europe/Warsaw", label: "Warsaw (CET/CEST)" },
      { value: "Europe/Zurich", label: "Zurich (CET/CEST)" },
    ],
  },
  {
    label: "Africa",
    zones: [
      { value: "Africa/Cairo", label: "Cairo (EET)" },
      { value: "Africa/Casablanca", label: "Casablanca (WET)" },
      { value: "Africa/Johannesburg", label: "Johannesburg (SAST)" },
      { value: "Africa/Lagos", label: "Lagos (WAT)" },
      { value: "Africa/Nairobi", label: "Nairobi (EAT)" },
    ],
  },
  {
    label: "Asia",
    zones: [
      { value: "Asia/Bangkok", label: "Bangkok (ICT)" },
      { value: "Asia/Colombo", label: "Colombo (IST)" },
      { value: "Asia/Dhaka", label: "Dhaka (BST)" },
      { value: "Asia/Dubai", label: "Dubai (GST)" },
      { value: "Asia/Ho_Chi_Minh", label: "Ho Chi Minh (ICT)" },
      { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)" },
      { value: "Asia/Jakarta", label: "Jakarta (WIB)" },
      { value: "Asia/Karachi", label: "Karachi (PKT)" },
      { value: "Asia/Kathmandu", label: "Kathmandu (NPT)" },
      { value: "Asia/Kolkata", label: "Mumbai / Kolkata (IST)" },
      { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur (MYT)" },
      { value: "Asia/Manila", label: "Manila (PST)" },
      { value: "Asia/Riyadh", label: "Riyadh (AST)" },
      { value: "Asia/Seoul", label: "Seoul (KST)" },
      { value: "Asia/Shanghai", label: "Shanghai (CST)" },
      { value: "Asia/Singapore", label: "Singapore (SGT)" },
      { value: "Asia/Taipei", label: "Taipei (CST)" },
      { value: "Asia/Tehran", label: "Tehran (IRST)" },
      { value: "Asia/Tashkent", label: "Tashkent (UZT)" },
      { value: "Asia/Tokyo", label: "Tokyo (JST)" },
      { value: "Asia/Yangon", label: "Yangon (MMT)" },
    ],
  },
  {
    label: "Pacific",
    zones: [
      { value: "Pacific/Auckland", label: "Auckland (NZST/NZDT)" },
      { value: "Pacific/Fiji", label: "Fiji (FJT)" },
      { value: "Pacific/Guam", label: "Guam (ChST)" },
      { value: "Pacific/Honolulu", label: "Hawaii (HST)" },
      { value: "Pacific/Midway", label: "Midway (SST)" },
      { value: "Pacific/Port_Moresby", label: "Port Moresby (PGT)" },
      { value: "Pacific/Tongatapu", label: "Tonga (TOT)" },
    ],
  },
  {
    label: "Australia",
    zones: [
      { value: "Australia/Adelaide", label: "Adelaide (ACST/ACDT)" },
      { value: "Australia/Brisbane", label: "Brisbane (AEST)" },
      { value: "Australia/Darwin", label: "Darwin (ACST)" },
      { value: "Australia/Melbourne", label: "Melbourne (AEST/AEDT)" },
      { value: "Australia/Perth", label: "Perth (AWST)" },
      { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
    ],
  },
  {
    label: "UTC / Other",
    zones: [
      { value: "UTC", label: "UTC (Coordinated Universal Time)" },
      { value: "Etc/GMT+12", label: "UTC−12:00" },
      { value: "Etc/GMT+11", label: "UTC−11:00" },
      { value: "Etc/GMT+10", label: "UTC−10:00" },
      { value: "Etc/GMT+9", label: "UTC−09:00" },
      { value: "Etc/GMT+8", label: "UTC−08:00" },
      { value: "Etc/GMT-1", label: "UTC+01:00" },
      { value: "Etc/GMT-2", label: "UTC+02:00" },
      { value: "Etc/GMT-3", label: "UTC+03:00" },
      { value: "Etc/GMT-4", label: "UTC+04:00" },
      { value: "Etc/GMT-5", label: "UTC+05:00" },
      { value: "Etc/GMT-6", label: "UTC+06:00" },
      { value: "Etc/GMT-7", label: "UTC+07:00" },
      { value: "Etc/GMT-8", label: "UTC+08:00" },
      { value: "Etc/GMT-9", label: "UTC+09:00" },
      { value: "Etc/GMT-10", label: "UTC+10:00" },
      { value: "Etc/GMT-11", label: "UTC+11:00" },
      { value: "Etc/GMT-12", label: "UTC+12:00" },
    ],
  },
];

function getAllZones() {
  return TIMEZONE_GROUPS.flatMap((g) => g.zones);
}

function findZoneLabel(value: string): string {
  return getAllZones().find((z) => z.value === value)?.label ?? value;
}

export interface TimezoneSelectorProps {
  /** Controlled value */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Called when the user selects a timezone */
  onValueChange?: (value: string) => void;
  /** Label text rendered above the trigger */
  label?: string;
  /** Placeholder text shown when nothing is selected */
  placeholder?: string;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Whether the field is in an invalid/error state */
  invalid?: boolean;
  /** Error message shown below the trigger when invalid */
  errorMessage?: string;
  /** Additional class names applied to the wrapper div */
  className?: string;
  /** Width applied to the trigger; defaults to "w-full" */
  triggerWidth?: string;
  /** Unique id used to associate label + trigger */
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
  triggerWidth = "w-full",
  id = "timezone-selector",
}: TimezoneSelectorProps) {
  const errorId = `${id}-error`;

  const selectProps = value !== undefined
    ? { value, onValueChange }
    : { defaultValue, onValueChange };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label
        htmlFor={id}
        className={cn(
          "text-sm font-medium",
          disabled && "opacity-50 cursor-not-allowed",
          invalid && "text-destructive"
        )}
      >
        {label}
      </Label>

      <SelectPrimitive.Root disabled={disabled} {...selectProps}>
        <SelectPrimitive.Trigger
          id={id}
          aria-invalid={invalid ? "true" : undefined}
          aria-describedby={invalid && errorMessage ? errorId : undefined}
          className={cn(
            triggerWidth,
            "flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2 text-sm shadow-sm",
            "ring-offset-background transition-colors",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2",
            invalid
              ? "border-destructive focus:ring-destructive data-[state=open]:ring-destructive"
              : "border-input hover:border-muted-foreground/60"
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Globe
              className="h-4 w-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <SelectPrimitive.Value placeholder={placeholder} />
          </span>
          <ChevronDown
            className="h-4 w-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={6}
            className={cn(
              "relative z-50 max-h-[min(360px,var(--radix-select-content-available-height))]",
              triggerWidth,
              "min-w-[var(--radix-select-trigger-width)]",
              "overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
              "@media (prefers-reduced-motion: reduce) { animation: none !important; }"
            )}
          >
            <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1 text-muted-foreground">
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            </SelectPrimitive.ScrollUpButton>

            <SelectPrimitive.Viewport className="p-1">
              {TIMEZONE_GROUPS.map((group, groupIdx) => (
                <React.Fragment key={group.label}>
                  {groupIdx > 0 && (
                    <SelectPrimitive.Separator className="my-1 h-px bg-border" />
                  )}
                  <SelectPrimitive.Group>
                    <SelectPrimitive.Label className="px-2 py-1.5 text-xs font-semibold text-muted-foreground tracking-wide uppercase select-none">
                      {group.label}
                    </SelectPrimitive.Label>
                    {group.zones.map((zone) => (
                      <SelectPrimitive.Item
                        key={zone.value}
                        value={zone.value}
                        className={cn(
                          "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-3 text-sm outline-none",
                          "transition-colors",
                          "focus:bg-accent focus:text-accent-foreground",
                          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        )}
                      >
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          <SelectPrimitive.ItemIndicator>
                            <Check className="h-4 w-4" aria-hidden="true" />
                          </SelectPrimitive.ItemIndicator>
                        </span>
                        <SelectPrimitive.ItemText>
                          {zone.label}
                        </SelectPrimitive.ItemText>
                      </SelectPrimitive.Item>
                    ))}
                  </SelectPrimitive.Group>
                </React.Fragment>
              ))}
            </SelectPrimitive.Viewport>

            <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1 text-muted-foreground">
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {invalid && errorMessage && (
        <p
          id={errorId}
          role="alert"
          className="text-sm font-medium text-destructive"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default TimezoneSelector;