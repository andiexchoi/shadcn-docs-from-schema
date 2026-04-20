"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const TIMEZONE_GROUPS: { label: string; zones: { value: string; label: string }[] }[] = [
  {
    label: "Americas",
    zones: [
      { value: "America/New_York", label: "New York (ET)" },
      { value: "America/Chicago", label: "Chicago (CT)" },
      { value: "America/Denver", label: "Denver (MT)" },
      { value: "America/Los_Angeles", label: "Los Angeles (PT)" },
      { value: "America/Anchorage", label: "Anchorage (AKT)" },
      { value: "America/Honolulu", label: "Honolulu (HST)" },
      { value: "America/Toronto", label: "Toronto (ET)" },
      { value: "America/Vancouver", label: "Vancouver (PT)" },
      { value: "America/Mexico_City", label: "Mexico City (CT)" },
      { value: "America/Sao_Paulo", label: "São Paulo (BRT)" },
      { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires (ART)" },
      { value: "America/Bogota", label: "Bogotá (COT)" },
      { value: "America/Lima", label: "Lima (PET)" },
      { value: "America/Santiago", label: "Santiago (CLT)" },
      { value: "America/Caracas", label: "Caracas (VET)" },
    ],
  },
  {
    label: "Europe",
    zones: [
      { value: "Europe/London", label: "London (GMT/BST)" },
      { value: "Europe/Dublin", label: "Dublin (GMT/IST)" },
      { value: "Europe/Lisbon", label: "Lisbon (WET)" },
      { value: "Europe/Paris", label: "Paris (CET)" },
      { value: "Europe/Berlin", label: "Berlin (CET)" },
      { value: "Europe/Madrid", label: "Madrid (CET)" },
      { value: "Europe/Rome", label: "Rome (CET)" },
      { value: "Europe/Amsterdam", label: "Amsterdam (CET)" },
      { value: "Europe/Brussels", label: "Brussels (CET)" },
      { value: "Europe/Zurich", label: "Zurich (CET)" },
      { value: "Europe/Vienna", label: "Vienna (CET)" },
      { value: "Europe/Warsaw", label: "Warsaw (CET)" },
      { value: "Europe/Prague", label: "Prague (CET)" },
      { value: "Europe/Stockholm", label: "Stockholm (CET)" },
      { value: "Europe/Oslo", label: "Oslo (CET)" },
      { value: "Europe/Copenhagen", label: "Copenhagen (CET)" },
      { value: "Europe/Helsinki", label: "Helsinki (EET)" },
      { value: "Europe/Athens", label: "Athens (EET)" },
      { value: "Europe/Bucharest", label: "Bucharest (EET)" },
      { value: "Europe/Kiev", label: "Kyiv (EET)" },
      { value: "Europe/Moscow", label: "Moscow (MSK)" },
      { value: "Europe/Istanbul", label: "Istanbul (TRT)" },
    ],
  },
  {
    label: "Africa",
    zones: [
      { value: "Africa/Cairo", label: "Cairo (EET)" },
      { value: "Africa/Johannesburg", label: "Johannesburg (SAST)" },
      { value: "Africa/Lagos", label: "Lagos (WAT)" },
      { value: "Africa/Nairobi", label: "Nairobi (EAT)" },
      { value: "Africa/Casablanca", label: "Casablanca (WET)" },
      { value: "Africa/Accra", label: "Accra (GMT)" },
      { value: "Africa/Addis_Ababa", label: "Addis Ababa (EAT)" },
      { value: "Africa/Khartoum", label: "Khartoum (CAT)" },
    ],
  },
  {
    label: "Asia",
    zones: [
      { value: "Asia/Dubai", label: "Dubai (GST)" },
      { value: "Asia/Riyadh", label: "Riyadh (AST)" },
      { value: "Asia/Tehran", label: "Tehran (IRST)" },
      { value: "Asia/Karachi", label: "Karachi (PKT)" },
      { value: "Asia/Kolkata", label: "Kolkata (IST)" },
      { value: "Asia/Colombo", label: "Colombo (IST)" },
      { value: "Asia/Dhaka", label: "Dhaka (BST)" },
      { value: "Asia/Yangon", label: "Yangon (MMT)" },
      { value: "Asia/Bangkok", label: "Bangkok (ICT)" },
      { value: "Asia/Jakarta", label: "Jakarta (WIB)" },
      { value: "Asia/Ho_Chi_Minh", label: "Ho Chi Minh (ICT)" },
      { value: "Asia/Singapore", label: "Singapore (SGT)" },
      { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur (MYT)" },
      { value: "Asia/Manila", label: "Manila (PHT)" },
      { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)" },
      { value: "Asia/Taipei", label: "Taipei (CST)" },
      { value: "Asia/Shanghai", label: "Shanghai (CST)" },
      { value: "Asia/Seoul", label: "Seoul (KST)" },
      { value: "Asia/Tokyo", label: "Tokyo (JST)" },
      { value: "Asia/Almaty", label: "Almaty (ALMT)" },
      { value: "Asia/Tashkent", label: "Tashkent (UZT)" },
      { value: "Asia/Baku", label: "Baku (AZT)" },
      { value: "Asia/Tbilisi", label: "Tbilisi (GET)" },
      { value: "Asia/Yerevan", label: "Yerevan (AMT)" },
      { value: "Asia/Nicosia", label: "Nicosia (EET)" },
      { value: "Asia/Jerusalem", label: "Jerusalem (IST)" },
      { value: "Asia/Baghdad", label: "Baghdad (AST)" },
      { value: "Asia/Kuwait", label: "Kuwait (AST)" },
      { value: "Asia/Muscat", label: "Muscat (GST)" },
      { value: "Asia/Kathmandu", label: "Kathmandu (NPT)" },
    ],
  },
  {
    label: "Pacific",
    zones: [
      { value: "Australia/Sydney", label: "Sydney (AEDT)" },
      { value: "Australia/Melbourne", label: "Melbourne (AEDT)" },
      { value: "Australia/Brisbane", label: "Brisbane (AEST)" },
      { value: "Australia/Perth", label: "Perth (AWST)" },
      { value: "Australia/Adelaide", label: "Adelaide (ACDT)" },
      { value: "Pacific/Auckland", label: "Auckland (NZDT)" },
      { value: "Pacific/Fiji", label: "Fiji (FJT)" },
      { value: "Pacific/Guam", label: "Guam (ChST)" },
      { value: "Pacific/Honolulu", label: "Honolulu (HST)" },
      { value: "Pacific/Port_Moresby", label: "Port Moresby (PGT)" },
    ],
  },
  {
    label: "UTC / Other",
    zones: [
      { value: "UTC", label: "UTC" },
      { value: "Etc/GMT+12", label: "GMT-12" },
      { value: "Etc/GMT+11", label: "GMT-11" },
      { value: "Etc/GMT+10", label: "GMT-10" },
      { value: "Etc/GMT+9", label: "GMT-9" },
      { value: "Etc/GMT+8", label: "GMT-8" },
      { value: "Etc/GMT+7", label: "GMT-7" },
      { value: "Etc/GMT+6", label: "GMT-6" },
      { value: "Etc/GMT+5", label: "GMT-5" },
      { value: "Etc/GMT+4", label: "GMT-4" },
      { value: "Etc/GMT+3", label: "GMT-3" },
      { value: "Etc/GMT+2", label: "GMT-2" },
      { value: "Etc/GMT+1", label: "GMT-1" },
      { value: "Etc/GMT-1", label: "GMT+1" },
      { value: "Etc/GMT-2", label: "GMT+2" },
      { value: "Etc/GMT-3", label: "GMT+3" },
      { value: "Etc/GMT-4", label: "GMT+4" },
      { value: "Etc/GMT-5", label: "GMT+5" },
      { value: "Etc/GMT-6", label: "GMT+6" },
      { value: "Etc/GMT-7", label: "GMT+7" },
      { value: "Etc/GMT-8", label: "GMT+8" },
      { value: "Etc/GMT-9", label: "GMT+9" },
      { value: "Etc/GMT-10", label: "GMT+10" },
      { value: "Etc/GMT-11", label: "GMT+11" },
      { value: "Etc/GMT-12", label: "GMT+12" },
    ],
  },
];

function getAllZones() {
  return TIMEZONE_GROUPS.flatMap((g) => g.zones);
}

function getOffsetLabel(tzValue: string): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en", {
      timeZone: tzValue,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(now);
    const offset = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    return offset;
  } catch {
    return "";
  }
}

export interface TimezoneSelectorProps {
  /** Controlled value */
  value?: string;
  /** Default value for uncontrolled usage */
  defaultValue?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Label shown above the trigger */
  label?: string;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Whether the selector is in an invalid state */
  invalid?: boolean;
  /** Custom class for the trigger button */
  className?: string;
  /** ID for the trigger (for external label association) */
  id?: string;
}

export function TimezoneSelector({
  value,
  defaultValue,
  onValueChange,
  label = "Timezone",
  disabled = false,
  invalid = false,
  className,
  id = "timezone-selector",
}: TimezoneSelectorProps) {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const trimmedSearch = search.trim().toLowerCase();

  const filteredGroups = React.useMemo(() => {
    if (!trimmedSearch) return TIMEZONE_GROUPS;
    return TIMEZONE_GROUPS.map((group) => ({
      ...group,
      zones: group.zones.filter(
        (z) =>
          z.label.toLowerCase().includes(trimmedSearch) ||
          z.value.toLowerCase().includes(trimmedSearch)
      ),
    })).filter((group) => group.zones.length > 0);
  }, [trimmedSearch]);

  const allZones = getAllZones();

  const displayLabel = React.useMemo(() => {
    const controlled = value ?? defaultValue;
    if (!controlled) return null;
    const found = allZones.find((z) => z.value === controlled);
    return found ? found.label : controlled;
  }, [value, defaultValue, allZones]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      setSearch("");
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={id}
        className={cn(
          "text-sm font-medium",
          disabled && "opacity-50 cursor-not-allowed",
          invalid && "text-red-600"
        )}
      >
        {label}
      </Label>

      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        open={open}
        onOpenChange={handleOpenChange}
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
            invalid && "border-red-500 focus:ring-red-500",
            className
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <SelectPrimitive.Value placeholder="Select a timezone">
              {displayLabel && (
                <span className="truncate">{displayLabel}</span>
              )}
            </SelectPrimitive.Value>
          </span>
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            className={cn(
              "relative z-50 w-[var(--radix-select-trigger-width)] min-w-[14rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
              "@media (prefers-reduced-motion: reduce) { animation: none !important; }"
            )}
          >
            {/* Search input */}
            <div className="flex items-center border-b px-3 py-2 sticky top-0 bg-popover z-10">
              <input
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Search timezones…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                aria-label="Search timezones"
                autoComplete="off"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="ml-2 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-6 bg-popover cursor-default">
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
            </SelectPrimitive.ScrollUpButton>

            <SelectPrimitive.Viewport className="max-h-72 overflow-auto p-1">
              {filteredGroups.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No timezones found.
                </div>
              ) : (
                filteredGroups.map((group, groupIndex) => (
                  <React.Fragment key={group.label}>
                    {groupIndex > 0 && (
                      <SelectPrimitive.Separator className="-mx-1 my-1 h-px bg-muted" />
                    )}
                    <SelectPrimitive.Group>
                      <SelectPrimitive.Label className="py-1.5 pl-2 pr-2 text-xs font-semibold text-muted-foreground">
                        {group.label}
                      </SelectPrimitive.Label>
                      {group.zones.map((zone) => (
                        <TimezoneItem key={zone.value} zone={zone} />
                      ))}
                    </SelectPrimitive.Group>
                  </React.Fragment>
                ))
              )}
            </SelectPrimitive.Viewport>

            <SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-6 bg-popover cursor-default">
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {invalid && (
        <p className="text-xs text-red-600" role="alert">
          Please select a valid timezone.
        </p>
      )}
    </div>
  );
}

function TimezoneItem({ zone }: { zone: { value: string; label: string } }) {
  const offset = React.useMemo(() => getOffsetLabel(zone.value), [zone.value]);

  return (
    <SelectPrimitive.Item
      value={zone.value}
      className={cn(
        "relative flex w-full cursor-default select-none items-center justify-between rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
        "focus:bg-accent focus:text-accent-foreground",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      )}
    >
      <SelectPrimitive.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <Check className="h-4 w-4" aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText>{zone.label}</SelectPrimitive.ItemText>
      {offset && (
        <span className="ml-2 text-xs text-muted-foreground tabular-nums">
          {offset}
        </span>
      )}
    </SelectPrimitive.Item>
  );
}