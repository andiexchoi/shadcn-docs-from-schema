"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const TIMEZONES = [
  { group: "Africa", items: [
    { value: "Africa/Abidjan", label: "Abidjan (GMT+0)" },
    { value: "Africa/Accra", label: "Accra (GMT+0)" },
    { value: "Africa/Cairo", label: "Cairo (GMT+2)" },
    { value: "Africa/Johannesburg", label: "Johannesburg (GMT+2)" },
    { value: "Africa/Lagos", label: "Lagos (GMT+1)" },
    { value: "Africa/Nairobi", label: "Nairobi (GMT+3)" },
  ]},
  { group: "Americas", items: [
    { value: "America/Anchorage", label: "Anchorage (GMT-9)" },
    { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires (GMT-3)" },
    { value: "America/Bogota", label: "Bogotá (GMT-5)" },
    { value: "America/Chicago", label: "Chicago (GMT-6)" },
    { value: "America/Denver", label: "Denver (GMT-7)" },
    { value: "America/Halifax", label: "Halifax (GMT-4)" },
    { value: "America/Los_Angeles", label: "Los Angeles (GMT-8)" },
    { value: "America/Mexico_City", label: "Mexico City (GMT-6)" },
    { value: "America/New_York", label: "New York (GMT-5)" },
    { value: "America/Phoenix", label: "Phoenix (GMT-7)" },
    { value: "America/Santiago", label: "Santiago (GMT-4)" },
    { value: "America/Sao_Paulo", label: "São Paulo (GMT-3)" },
    { value: "America/Toronto", label: "Toronto (GMT-5)" },
    { value: "America/Vancouver", label: "Vancouver (GMT-8)" },
  ]},
  { group: "Asia", items: [
    { value: "Asia/Bangkok", label: "Bangkok (GMT+7)" },
    { value: "Asia/Dhaka", label: "Dhaka (GMT+6)" },
    { value: "Asia/Dubai", label: "Dubai (GMT+4)" },
    { value: "Asia/Hong_Kong", label: "Hong Kong (GMT+8)" },
    { value: "Asia/Jakarta", label: "Jakarta (GMT+7)" },
    { value: "Asia/Karachi", label: "Karachi (GMT+5)" },
    { value: "Asia/Kolkata", label: "Kolkata (GMT+5:30)" },
    { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur (GMT+8)" },
    { value: "Asia/Manila", label: "Manila (GMT+8)" },
    { value: "Asia/Seoul", label: "Seoul (GMT+9)" },
    { value: "Asia/Shanghai", label: "Shanghai (GMT+8)" },
    { value: "Asia/Singapore", label: "Singapore (GMT+8)" },
    { value: "Asia/Taipei", label: "Taipei (GMT+8)" },
    { value: "Asia/Tehran", label: "Tehran (GMT+3:30)" },
    { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
  ]},
  { group: "Atlantic", items: [
    { value: "Atlantic/Azores", label: "Azores (GMT-1)" },
    { value: "Atlantic/Cape_Verde", label: "Cape Verde (GMT-1)" },
  ]},
  { group: "Australia", items: [
    { value: "Australia/Adelaide", label: "Adelaide (GMT+9:30)" },
    { value: "Australia/Brisbane", label: "Brisbane (GMT+10)" },
    { value: "Australia/Darwin", label: "Darwin (GMT+9:30)" },
    { value: "Australia/Melbourne", label: "Melbourne (GMT+11)" },
    { value: "Australia/Perth", label: "Perth (GMT+8)" },
    { value: "Australia/Sydney", label: "Sydney (GMT+11)" },
  ]},
  { group: "Europe", items: [
    { value: "Europe/Amsterdam", label: "Amsterdam (GMT+1)" },
    { value: "Europe/Athens", label: "Athens (GMT+2)" },
    { value: "Europe/Berlin", label: "Berlin (GMT+1)" },
    { value: "Europe/Brussels", label: "Brussels (GMT+1)" },
    { value: "Europe/Budapest", label: "Budapest (GMT+1)" },
    { value: "Europe/Copenhagen", label: "Copenhagen (GMT+1)" },
    { value: "Europe/Dublin", label: "Dublin (GMT+0)" },
    { value: "Europe/Helsinki", label: "Helsinki (GMT+2)" },
    { value: "Europe/Istanbul", label: "Istanbul (GMT+3)" },
    { value: "Europe/Lisbon", label: "Lisbon (GMT+0)" },
    { value: "Europe/London", label: "London (GMT+0)" },
    { value: "Europe/Madrid", label: "Madrid (GMT+1)" },
    { value: "Europe/Moscow", label: "Moscow (GMT+3)" },
    { value: "Europe/Oslo", label: "Oslo (GMT+1)" },
    { value: "Europe/Paris", label: "Paris (GMT+1)" },
    { value: "Europe/Prague", label: "Prague (GMT+1)" },
    { value: "Europe/Rome", label: "Rome (GMT+1)" },
    { value: "Europe/Stockholm", label: "Stockholm (GMT+1)" },
    { value: "Europe/Vienna", label: "Vienna (GMT+1)" },
    { value: "Europe/Warsaw", label: "Warsaw (GMT+1)" },
    { value: "Europe/Zurich", label: "Zurich (GMT+1)" },
  ]},
  { group: "Pacific", items: [
    { value: "Pacific/Auckland", label: "Auckland (GMT+13)" },
    { value: "Pacific/Fiji", label: "Fiji (GMT+12)" },
    { value: "Pacific/Guam", label: "Guam (GMT+10)" },
    { value: "Pacific/Honolulu", label: "Honolulu (GMT-10)" },
    { value: "Pacific/Midway", label: "Midway (GMT-11)" },
  ]},
  { group: "UTC", items: [
    { value: "UTC", label: "UTC (GMT+0)" },
  ]},
];

export interface TimezoneSelectorProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  label?: string;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function TimezoneSelector({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  invalid = false,
  label = "Timezone",
  placeholder = "Select a timezone",
  className,
  id = "timezone-selector",
}: TimezoneSelectorProps) {
  const isControlled = value !== undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <SelectPrimitive.Root
        {...(isControlled ? { value } : { defaultValue })}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          id={id}
          aria-invalid={invalid ? "true" : undefined}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&>span]:line-clamp-1",
            invalid && "border-destructive focus:ring-destructive"
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Globe
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-muted-foreground"
            />
            <SelectPrimitive.Value placeholder={placeholder} />
          </span>
          <SelectPrimitive.Icon asChild>
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-muted-foreground"
            />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            className={cn(
              "relative z-50 max-h-96 min-w-[8rem] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
              "@media (prefers-reduced-motion: reduce) { animation: none !important; }"
            )}
          >
            <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1 text-muted-foreground">
              <ChevronUp aria-hidden="true" className="h-4 w-4" />
            </SelectPrimitive.ScrollUpButton>

            <SelectPrimitive.Viewport className="p-1">
              {TIMEZONES.map((section, sectionIdx) => (
                <React.Fragment key={section.group}>
                  {sectionIdx > 0 && (
                    <SelectPrimitive.Separator className="-mx-1 my-1 h-px bg-muted" />
                  )}
                  <SelectPrimitive.Group>
                    <SelectPrimitive.Label className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      {section.group}
                    </SelectPrimitive.Label>
                    {section.items.map((tz) => (
                      <SelectPrimitive.Item
                        key={tz.value}
                        value={tz.value}
                        className={cn(
                          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
                          "focus:bg-accent focus:text-accent-foreground",
                          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                        )}
                      >
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          <SelectPrimitive.ItemIndicator>
                            <Check
                              aria-hidden="true"
                              className="h-4 w-4 text-primary"
                            />
                          </SelectPrimitive.ItemIndicator>
                        </span>
                        <SelectPrimitive.ItemText>
                          {tz.label}
                        </SelectPrimitive.ItemText>
                      </SelectPrimitive.Item>
                    ))}
                  </SelectPrimitive.Group>
                </React.Fragment>
              ))}
            </SelectPrimitive.Viewport>

            <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1 text-muted-foreground">
              <ChevronDown aria-hidden="true" className="h-4 w-4" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {invalid && (
        <p className="text-xs text-destructive" role="alert">
          Please select a valid timezone.
        </p>
      )}
    </div>
  );
}