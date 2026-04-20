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
      { value: "America/New_York", label: "Eastern Time (ET)" },
      { value: "America/Chicago", label: "Central Time (CT)" },
      { value: "America/Denver", label: "Mountain Time (MT)" },
      { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
      { value: "America/Anchorage", label: "Alaska Time (AKT)" },
      { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
      { value: "America/Sao_Paulo", label: "Brasília Time (BRT)" },
      { value: "America/Argentina/Buenos_Aires", label: "Argentina Time (ART)" },
      { value: "America/Bogota", label: "Colombia Time (COT)" },
      { value: "America/Toronto", label: "Eastern Time – Toronto" },
      { value: "America/Vancouver", label: "Pacific Time – Vancouver" },
      { value: "America/Mexico_City", label: "Central Time – Mexico City" },
    ],
  },
  {
    label: "Europe",
    zones: [
      { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
      { value: "Europe/Dublin", label: "Irish Standard Time (IST)" },
      { value: "Europe/Lisbon", label: "Western European Time (WET)" },
      { value: "Europe/Paris", label: "Central European Time (CET)" },
      { value: "Europe/Berlin", label: "Central European Time – Berlin" },
      { value: "Europe/Rome", label: "Central European Time – Rome" },
      { value: "Europe/Madrid", label: "Central European Time – Madrid" },
      { value: "Europe/Amsterdam", label: "Central European Time – Amsterdam" },
      { value: "Europe/Stockholm", label: "Central European Time – Stockholm" },
      { value: "Europe/Athens", label: "Eastern European Time (EET)" },
      { value: "Europe/Helsinki", label: "Eastern European Time – Helsinki" },
      { value: "Europe/Istanbul", label: "Turkey Time (TRT)" },
      { value: "Europe/Moscow", label: "Moscow Standard Time (MSK)" },
    ],
  },
  {
    label: "Africa",
    zones: [
      { value: "Africa/Cairo", label: "Eastern European Time – Cairo" },
      { value: "Africa/Johannesburg", label: "South Africa Standard Time (SAST)" },
      { value: "Africa/Lagos", label: "West Africa Time (WAT)" },
      { value: "Africa/Nairobi", label: "East Africa Time (EAT)" },
      { value: "Africa/Casablanca", label: "Western European Time – Casablanca" },
    ],
  },
  {
    label: "Asia",
    zones: [
      { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
      { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
      { value: "Asia/Dhaka", label: "Bangladesh Standard Time (BST)" },
      { value: "Asia/Bangkok", label: "Indochina Time (ICT)" },
      { value: "Asia/Singapore", label: "Singapore Standard Time (SGT)" },
      { value: "Asia/Shanghai", label: "China Standard Time (CST)" },
      { value: "Asia/Hong_Kong", label: "Hong Kong Time (HKT)" },
      { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
      { value: "Asia/Seoul", label: "Korea Standard Time (KST)" },
      { value: "Asia/Karachi", label: "Pakistan Standard Time (PKT)" },
      { value: "Asia/Riyadh", label: "Arabia Standard Time (AST)" },
      { value: "Asia/Tehran", label: "Iran Standard Time (IRST)" },
      { value: "Asia/Kabul", label: "Afghanistan Time (AFT)" },
      { value: "Asia/Tashkent", label: "Uzbekistan Time (UZT)" },
      { value: "Asia/Kathmandu", label: "Nepal Time (NPT)" },
      { value: "Asia/Colombo", label: "Sri Lanka Time (SLT)" },
      { value: "Asia/Yangon", label: "Myanmar Time (MMT)" },
      { value: "Asia/Taipei", label: "Taipei Standard Time" },
      { value: "Asia/Jakarta", label: "Western Indonesia Time (WIB)" },
      { value: "Asia/Manila", label: "Philippine Time (PHT)" },
    ],
  },
  {
    label: "Pacific",
    zones: [
      { value: "Pacific/Auckland", label: "New Zealand Standard Time (NZST)" },
      { value: "Pacific/Fiji", label: "Fiji Time (FJT)" },
      { value: "Pacific/Guam", label: "Chamorro Standard Time (ChST)" },
      { value: "Pacific/Tongatapu", label: "Tonga Time (TOT)" },
    ],
  },
  {
    label: "Australia",
    zones: [
      { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
      { value: "Australia/Melbourne", label: "Australian Eastern Time – Melbourne" },
      { value: "Australia/Brisbane", label: "Australian Eastern Standard Time (AEST)" },
      { value: "Australia/Adelaide", label: "Australian Central Time (ACT)" },
      { value: "Australia/Perth", label: "Australian Western Standard Time (AWST)" },
      { value: "Australia/Darwin", label: "Australian Central Standard Time (ACST)" },
    ],
  },
  {
    label: "UTC / Other",
    zones: [
      { value: "UTC", label: "Coordinated Universal Time (UTC)" },
      { value: "Etc/GMT+12", label: "UTC−12:00" },
      { value: "Etc/GMT+11", label: "UTC−11:00" },
      { value: "Etc/GMT+5", label: "UTC−05:00" },
      { value: "Etc/GMT-1", label: "UTC+01:00" },
      { value: "Etc/GMT-5", label: "UTC+05:00" },
      { value: "Etc/GMT-8", label: "UTC+08:00" },
      { value: "Etc/GMT-10", label: "UTC+10:00" },
      { value: "Etc/GMT-12", label: "UTC+12:00" },
      { value: "Etc/GMT-14", label: "UTC+14:00" },
    ],
  },
];

function getOffsetLabel(timezone: string): string {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en", {
      timeZone: timezone,
      timeZoneName: "shortOffset",
    });
    const parts = formatter.formatToParts(now);
    const offset = parts.find((p) => p.type === "timeZoneName")?.value ?? "";
    return offset;
  } catch {
    return "";
  }
}

function getAllZones() {
  return TIMEZONE_GROUPS.flatMap((g) => g.zones);
}

export interface TimezoneSelectorProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  triggerClassName?: string;
  showOffset?: boolean;
}

export function TimezoneSelector({
  value,
  defaultValue,
  onValueChange,
  label = "Timezone",
  placeholder = "Select a timezone",
  disabled = false,
  id,
  className,
  triggerClassName,
  showOffset = true,
}: TimezoneSelectorProps) {
  const generatedId = React.useId();
  const triggerId = id ?? generatedId;

  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const filteredGroups = React.useMemo(() => {
    if (!search.trim()) return TIMEZONE_GROUPS;
    const q = search.toLowerCase();
    return TIMEZONE_GROUPS.map((group) => ({
      ...group,
      zones: group.zones.filter(
        (z) =>
          z.label.toLowerCase().includes(q) ||
          z.value.toLowerCase().includes(q)
      ),
    })).filter((group) => group.zones.length > 0);
  }, [search]);

  const allZones = getAllZones();

  const getDisplayLabel = (val: string | undefined) => {
    if (!val) return null;
    const found = allZones.find((z) => z.value === val);
    return found ? found.label : val;
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={triggerId}>{label}</Label>
      <SelectPrimitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={(val) => {
          onValueChange?.(val);
        }}
        disabled={disabled}
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setSearch("");
        }}
      >
        <SelectPrimitive.Trigger
          id={triggerId}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&>span]:line-clamp-1",
            triggerClassName
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <SelectPrimitive.Value placeholder={placeholder}>
              {value || defaultValue ? (
                <span className="flex items-center gap-1.5 truncate">
                  <span className="truncate">{getDisplayLabel(value)}</span>
                  {showOffset && (value || defaultValue) && (
                    <span className="shrink-0 text-muted-foreground">
                      {getOffsetLabel(value ?? defaultValue ?? "")}
                    </span>
                  )}
                </span>
              ) : undefined}
            </SelectPrimitive.Value>
          </span>
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "relative z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
              "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              "@media (prefers-reduced-motion: reduce) { animation: none !important; }"
            )}
            position="popper"
            sideOffset={4}
          >
            {/* Search input inside content */}
            <div className="sticky top-0 z-10 bg-popover px-2 pt-2 pb-1 border-b">
              <input
                className={cn(
                  "flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm",
                  "placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
                placeholder="Search timezones…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>

            <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1">
              <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </SelectPrimitive.ScrollUpButton>

            <SelectPrimitive.Viewport className="max-h-72 p-1 overflow-y-auto">
              {filteredGroups.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No timezones found.
                </div>
              ) : (
                filteredGroups.map((group, gi) => (
                  <React.Fragment key={group.label}>
                    {gi > 0 && (
                      <SelectPrimitive.Separator className="my-1 h-px bg-muted" />
                    )}
                    <SelectPrimitive.Group>
                      <SelectPrimitive.Label className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {group.label}
                      </SelectPrimitive.Label>
                      {group.zones.map((zone) => (
                        <SelectPrimitive.Item
                          key={zone.value}
                          value={zone.value}
                          className={cn(
                            "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
                            "focus:bg-accent focus:text-accent-foreground",
                            "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                          )}
                        >
                          <SelectPrimitive.ItemIndicator className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          </SelectPrimitive.ItemIndicator>
                          <SelectPrimitive.ItemText>
                            <span className="flex items-center justify-between gap-3 w-full">
                              <span>{zone.label}</span>
                              {showOffset && (
                                <span className="text-xs text-muted-foreground tabular-nums">
                                  {getOffsetLabel(zone.value)}
                                </span>
                              )}
                            </span>
                          </SelectPrimitive.ItemText>
                        </SelectPrimitive.Item>
                      ))}
                    </SelectPrimitive.Group>
                  </React.Fragment>
                ))
              )}
            </SelectPrimitive.Viewport>

            <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1">
              <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  );
}