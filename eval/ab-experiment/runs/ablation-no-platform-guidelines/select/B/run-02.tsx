"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const TIMEZONES: { group: string; zones: { value: string; label: string }[] }[] =
  [
    {
      group: "UTC",
      zones: [{ value: "UTC", label: "UTC" }],
    },
    {
      group: "Americas",
      zones: [
        { value: "America/New_York", label: "Eastern Time (ET)" },
        { value: "America/Chicago", label: "Central Time (CT)" },
        { value: "America/Denver", label: "Mountain Time (MT)" },
        { value: "America/Phoenix", label: "Mountain Time – Arizona" },
        { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
        { value: "America/Anchorage", label: "Alaska Time (AKT)" },
        { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
        { value: "America/Toronto", label: "Toronto" },
        { value: "America/Vancouver", label: "Vancouver" },
        { value: "America/Chicago", label: "Chicago" },
        { value: "America/Mexico_City", label: "Mexico City" },
        { value: "America/Bogota", label: "Bogotá" },
        { value: "America/Lima", label: "Lima" },
        { value: "America/Santiago", label: "Santiago" },
        { value: "America/Sao_Paulo", label: "São Paulo" },
        { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires" },
      ],
    },
    {
      group: "Europe",
      zones: [
        { value: "Europe/London", label: "London (GMT)" },
        { value: "Europe/Dublin", label: "Dublin" },
        { value: "Europe/Lisbon", label: "Lisbon" },
        { value: "Europe/Paris", label: "Paris (CET)" },
        { value: "Europe/Berlin", label: "Berlin" },
        { value: "Europe/Rome", label: "Rome" },
        { value: "Europe/Madrid", label: "Madrid" },
        { value: "Europe/Amsterdam", label: "Amsterdam" },
        { value: "Europe/Stockholm", label: "Stockholm" },
        { value: "Europe/Warsaw", label: "Warsaw" },
        { value: "Europe/Helsinki", label: "Helsinki" },
        { value: "Europe/Athens", label: "Athens" },
        { value: "Europe/Istanbul", label: "Istanbul" },
        { value: "Europe/Kiev", label: "Kyiv" },
        { value: "Europe/Moscow", label: "Moscow" },
      ],
    },
    {
      group: "Africa",
      zones: [
        { value: "Africa/Cairo", label: "Cairo" },
        { value: "Africa/Lagos", label: "Lagos" },
        { value: "Africa/Nairobi", label: "Nairobi" },
        { value: "Africa/Johannesburg", label: "Johannesburg" },
        { value: "Africa/Casablanca", label: "Casablanca" },
        { value: "Africa/Accra", label: "Accra" },
      ],
    },
    {
      group: "Asia",
      zones: [
        { value: "Asia/Dubai", label: "Dubai (GST)" },
        { value: "Asia/Karachi", label: "Karachi (PKT)" },
        { value: "Asia/Kolkata", label: "India (IST)" },
        { value: "Asia/Dhaka", label: "Dhaka (BST)" },
        { value: "Asia/Yangon", label: "Yangon (MMT)" },
        { value: "Asia/Bangkok", label: "Bangkok (ICT)" },
        { value: "Asia/Jakarta", label: "Jakarta (WIB)" },
        { value: "Asia/Singapore", label: "Singapore (SGT)" },
        { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur" },
        { value: "Asia/Shanghai", label: "China (CST)" },
        { value: "Asia/Hong_Kong", label: "Hong Kong" },
        { value: "Asia/Taipei", label: "Taipei" },
        { value: "Asia/Tokyo", label: "Tokyo (JST)" },
        { value: "Asia/Seoul", label: "Seoul (KST)" },
        { value: "Asia/Riyadh", label: "Riyadh" },
        { value: "Asia/Tehran", label: "Tehran" },
        { value: "Asia/Tashkent", label: "Tashkent" },
        { value: "Asia/Almaty", label: "Almaty" },
      ],
    },
    {
      group: "Pacific",
      zones: [
        { value: "Pacific/Auckland", label: "Auckland (NZST)" },
        { value: "Pacific/Fiji", label: "Fiji" },
        { value: "Pacific/Guam", label: "Guam (ChST)" },
        { value: "Pacific/Port_Moresby", label: "Port Moresby" },
        { value: "Pacific/Pago_Pago", label: "Pago Pago (SST)" },
      ],
    },
    {
      group: "Australia",
      zones: [
        { value: "Australia/Perth", label: "Perth (AWST)" },
        { value: "Australia/Darwin", label: "Darwin (ACST)" },
        { value: "Australia/Brisbane", label: "Brisbane (AEST)" },
        { value: "Australia/Adelaide", label: "Adelaide (ACST)" },
        { value: "Australia/Sydney", label: "Sydney (AEDT)" },
        { value: "Australia/Melbourne", label: "Melbourne" },
        { value: "Australia/Hobart", label: "Hobart" },
      ],
    },
  ];

/* ─── Local Select primitives ──────────────────────────────────────────── */

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
      <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
        <ChevronUp className="h-4 w-4" />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
        <ChevronDown className="h-4 w-4" />
      </SelectPrimitive.ScrollDownButton>
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

/* ─── TimezoneSelectorProps ────────────────────────────────────────────── */

export interface TimezoneSelectorProps {
  /** Controlled value — an IANA timezone string e.g. "America/New_York" */
  value?: string;
  /** Called when the user selects a timezone */
  onValueChange?: (value: string) => void;
  /** Uncontrolled default value */
  defaultValue?: string;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Label shown above the trigger */
  label?: string;
  /** id used to wire <label> and trigger together */
  id?: string;
  /** Additional class applied to the trigger */
  className?: string;
  /** aria-invalid — pass true when the field fails validation */
  invalid?: boolean;
}

/* ─── TimezoneSelector ─────────────────────────────────────────────────── */

export function TimezoneSelector({
  value,
  onValueChange,
  defaultValue,
  disabled = false,
  label = "Timezone",
  id = "timezone-selector",
  className,
  invalid = false,
}: TimezoneSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5 w-[280px]">
      <Label htmlFor={id}>{label}</Label>

      <SelectPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        defaultValue={defaultValue}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          className={cn(className)}
          aria-invalid={invalid ? true : undefined}
        >
          <SelectPrimitive.Value placeholder="Timezone" />
        </SelectTrigger>

        <SelectContent position="popper">
          {TIMEZONES.map((section, sectionIdx) => (
            <React.Fragment key={section.group}>
              {sectionIdx > 0 && <SelectSeparator />}
              <SelectPrimitive.Group>
                <SelectLabel>{section.group}</SelectLabel>
                {section.zones.map((zone) => (
                  <SelectItem key={`${section.group}-${zone.value}-${zone.label}`} value={zone.value}>
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectPrimitive.Group>
            </React.Fragment>
          ))}
        </SelectContent>
      </SelectPrimitive.Root>

      {invalid && (
        <p className="text-sm text-destructive" role="alert">
          Please select a valid timezone.
        </p>
      )}
    </div>
  );
}