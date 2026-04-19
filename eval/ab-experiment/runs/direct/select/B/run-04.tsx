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
// Timezone data grouped by region
// ---------------------------------------------------------------------------

interface TimezoneEntry {
  value: string;
  label: string;
  offset: string;
}

interface TimezoneGroup {
  region: string;
  zones: TimezoneEntry[];
}

const TIMEZONE_GROUPS: TimezoneGroup[] = [
  {
    region: "Americas",
    zones: [
      { value: "America/New_York", label: "Eastern time (New York)", offset: "UTC−5/−4" },
      { value: "America/Chicago", label: "Central time (Chicago)", offset: "UTC−6/−5" },
      { value: "America/Denver", label: "Mountain time (Denver)", offset: "UTC−7/−6" },
      { value: "America/Phoenix", label: "Mountain time – no DST (Phoenix)", offset: "UTC−7" },
      { value: "America/Los_Angeles", label: "Pacific time (Los Angeles)", offset: "UTC−8/−7" },
      { value: "America/Anchorage", label: "Alaska time (Anchorage)", offset: "UTC−9/−8" },
      { value: "Pacific/Honolulu", label: "Hawaii time (Honolulu)", offset: "UTC−10" },
      { value: "America/Toronto", label: "Eastern time (Toronto)", offset: "UTC−5/−4" },
      { value: "America/Vancouver", label: "Pacific time (Vancouver)", offset: "UTC−8/−7" },
      { value: "America/Sao_Paulo", label: "Brasília time (São Paulo)", offset: "UTC−3/−2" },
      { value: "America/Argentina/Buenos_Aires", label: "Argentina time (Buenos Aires)", offset: "UTC−3" },
      { value: "America/Mexico_City", label: "Central time (Mexico City)", offset: "UTC−6/−5" },
      { value: "America/Bogota", label: "Colombia time (Bogotá)", offset: "UTC−5" },
      { value: "America/Lima", label: "Peru time (Lima)", offset: "UTC−5" },
      { value: "America/Santiago", label: "Chile time (Santiago)", offset: "UTC−4/−3" },
    ],
  },
  {
    region: "Europe",
    zones: [
      { value: "UTC", label: "Coordinated Universal Time (UTC)", offset: "UTC±0" },
      { value: "Europe/London", label: "Greenwich Mean Time (London)", offset: "UTC+0/+1" },
      { value: "Europe/Dublin", label: "Irish Standard Time (Dublin)", offset: "UTC+0/+1" },
      { value: "Europe/Lisbon", label: "Western European time (Lisbon)", offset: "UTC+0/+1" },
      { value: "Europe/Paris", label: "Central European time (Paris)", offset: "UTC+1/+2" },
      { value: "Europe/Berlin", label: "Central European time (Berlin)", offset: "UTC+1/+2" },
      { value: "Europe/Madrid", label: "Central European time (Madrid)", offset: "UTC+1/+2" },
      { value: "Europe/Rome", label: "Central European time (Rome)", offset: "UTC+1/+2" },
      { value: "Europe/Amsterdam", label: "Central European time (Amsterdam)", offset: "UTC+1/+2" },
      { value: "Europe/Stockholm", label: "Central European time (Stockholm)", offset: "UTC+1/+2" },
      { value: "Europe/Warsaw", label: "Central European time (Warsaw)", offset: "UTC+1/+2" },
      { value: "Europe/Athens", label: "Eastern European time (Athens)", offset: "UTC+2/+3" },
      { value: "Europe/Helsinki", label: "Eastern European time (Helsinki)", offset: "UTC+2/+3" },
      { value: "Europe/Istanbul", label: "Turkey time (Istanbul)", offset: "UTC+3" },
      { value: "Europe/Moscow", label: "Moscow time (Moscow)", offset: "UTC+3" },
      { value: "Europe/Kiev", label: "Eastern European time (Kyiv)", offset: "UTC+2/+3" },
    ],
  },
  {
    region: "Africa",
    zones: [
      { value: "Africa/Abidjan", label: "Greenwich Mean Time (Abidjan)", offset: "UTC+0" },
      { value: "Africa/Lagos", label: "West Africa time (Lagos)", offset: "UTC+1" },
      { value: "Africa/Cairo", label: "Eastern European time (Cairo)", offset: "UTC+2" },
      { value: "Africa/Johannesburg", label: "South Africa time (Johannesburg)", offset: "UTC+2" },
      { value: "Africa/Nairobi", label: "East Africa time (Nairobi)", offset: "UTC+3" },
      { value: "Africa/Casablanca", label: "Western European time (Casablanca)", offset: "UTC+0/+1" },
      { value: "Africa/Addis_Ababa", label: "East Africa time (Addis Ababa)", offset: "UTC+3" },
      { value: "Africa/Dar_es_Salaam", label: "East Africa time (Dar es Salaam)", offset: "UTC+3" },
    ],
  },
  {
    region: "Asia",
    zones: [
      { value: "Asia/Dubai", label: "Gulf Standard Time (Dubai)", offset: "UTC+4" },
      { value: "Asia/Karachi", label: "Pakistan time (Karachi)", offset: "UTC+5" },
      { value: "Asia/Kolkata", label: "India Standard Time (Kolkata)", offset: "UTC+5:30" },
      { value: "Asia/Dhaka", label: "Bangladesh time (Dhaka)", offset: "UTC+6" },
      { value: "Asia/Rangoon", label: "Myanmar time (Yangon)", offset: "UTC+6:30" },
      { value: "Asia/Bangkok", label: "Indochina time (Bangkok)", offset: "UTC+7" },
      { value: "Asia/Jakarta", label: "Western Indonesia time (Jakarta)", offset: "UTC+7" },
      { value: "Asia/Singapore", label: "Singapore time (Singapore)", offset: "UTC+8" },
      { value: "Asia/Shanghai", label: "China Standard Time (Shanghai)", offset: "UTC+8" },
      { value: "Asia/Taipei", label: "China Standard Time (Taipei)", offset: "UTC+8" },
      { value: "Asia/Hong_Kong", label: "Hong Kong time (Hong Kong)", offset: "UTC+8" },
      { value: "Asia/Seoul", label: "Korea Standard Time (Seoul)", offset: "UTC+9" },
      { value: "Asia/Tokyo", label: "Japan Standard Time (Tokyo)", offset: "UTC+9" },
      { value: "Asia/Riyadh", label: "Arabia Standard Time (Riyadh)", offset: "UTC+3" },
      { value: "Asia/Tehran", label: "Iran Standard Time (Tehran)", offset: "UTC+3:30/+4:30" },
      { value: "Asia/Baku", label: "Azerbaijan time (Baku)", offset: "UTC+4" },
      { value: "Asia/Tashkent", label: "Uzbekistan time (Tashkent)", offset: "UTC+5" },
      { value: "Asia/Almaty", label: "Alma-Ata time (Almaty)", offset: "UTC+6" },
      { value: "Asia/Kathmandu", label: "Nepal time (Kathmandu)", offset: "UTC+5:45" },
      { value: "Asia/Colombo", label: "Sri Lanka time (Colombo)", offset: "UTC+5:30" },
    ],
  },
  {
    region: "Australia & Pacific",
    zones: [
      { value: "Australia/Perth", label: "Australian Western time (Perth)", offset: "UTC+8" },
      { value: "Australia/Darwin", label: "Australian Central time (Darwin)", offset: "UTC+9:30" },
      { value: "Australia/Adelaide", label: "Australian Central time (Adelaide)", offset: "UTC+9:30/+10:30" },
      { value: "Australia/Brisbane", label: "Australian Eastern time (Brisbane)", offset: "UTC+10" },
      { value: "Australia/Sydney", label: "Australian Eastern time (Sydney)", offset: "UTC+10/+11" },
      { value: "Australia/Melbourne", label: "Australian Eastern time (Melbourne)", offset: "UTC+10/+11" },
      { value: "Pacific/Auckland", label: "New Zealand time (Auckland)", offset: "UTC+12/+13" },
      { value: "Pacific/Fiji", label: "Fiji time (Fiji)", offset: "UTC+12/+13" },
      { value: "Pacific/Guam", label: "Chamorro time (Guam)", offset: "UTC+10" },
      { value: "Pacific/Tahiti", label: "Tahiti time (Tahiti)", offset: "UTC−10" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Flat lookup for display
// ---------------------------------------------------------------------------

const TIMEZONE_MAP = new Map<string, TimezoneEntry>(
  TIMEZONE_GROUPS.flatMap((g) => g.zones.map((z) => [z.value, z]))
);

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

export interface TimezoneSelectorProps {
  /** Controlled value – IANA timezone string, e.g. "America/New_York". */
  value?: string;
  /** Default value for uncontrolled usage. */
  defaultValue?: string;
  /** Called with the new IANA timezone string when the selection changes. */
  onValueChange?: (value: string) => void;
  /** Label displayed above the selector. Defaults to "Timezone". */
  label?: string;
  /** Whether the selector is disabled. */
  disabled?: boolean;
  /** Class name applied to the outer wrapper div. */
  className?: string;
  /** Unique id used to associate the label. Auto-generated if omitted. */
  id?: string;
}

// ---------------------------------------------------------------------------
// Radix SelectItem wrapper with checkmark
// ---------------------------------------------------------------------------

const TzSelectItem = React.forwardRef<
  React.ElementRef<typeof SelectItem>,
  React.ComponentPropsWithoutRef<typeof SelectItem> & { offset: string }
>(({ children, offset, className, ...props }, ref) => (
  <SelectItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectItemIndicator>
        <Check className="h-4 w-4" />
      </SelectItemIndicator>
    </span>
    <span className="flex-1 truncate">{children}</span>
    <span className="ml-3 shrink-0 text-xs text-muted-foreground tabular-nums">
      {offset}
    </span>
  </SelectItem>
));
TzSelectItem.displayName = "TzSelectItem";

// Pull out the indicator from the Radix namespace
const { ItemIndicator: SelectItemIndicator } = {
  ItemIndicator: (SelectItem as unknown as { Indicator: React.FC<{ children: React.ReactNode }> })
    .Indicator,
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

let idCounter = 0;

export function TimezoneSelector({
  value,
  defaultValue,
  onValueChange,
  label = "Timezone",
  disabled = false,
  className,
  id: idProp,
}: TimezoneSelectorProps) {
  const [internalId] = React.useState<string>(
    () => idProp ?? `timezone-selector-${++idCounter}`
  );

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={internalId}>{label}</Label>

      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={internalId}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&>span]:flex [&>span]:items-center [&>span]:gap-2"
          )}
        >
          <SelectValue placeholder="Select a timezone…">
            {value || defaultValue
              ? (() => {
                  const tz = TIMEZONE_MAP.get((value ?? defaultValue)!);
                  return tz ? (
                    <span className="flex items-center gap-2 truncate">
                      <span className="truncate">{tz.label}</span>
                      <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                        {tz.offset}
                      </span>
                    </span>
                  ) : null;
                })()
              : null}
          </SelectValue>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </SelectTrigger>

        <SelectContent
          className={cn(
            "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
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
          <div className="w-full overflow-y-auto" style={{ maxHeight: "min(24rem, 60vh)" }}>
            <SelectViewport className="p-1">
              {TIMEZONE_GROUPS.map((group, groupIndex) => (
                <React.Fragment key={group.region}>
                  {groupIndex > 0 && (
                    <SelectSeparator className="-mx-1 my-1 h-px bg-muted" />
                  )}
                  <SelectGroup>
                    <SelectLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      {group.region}
                    </SelectLabel>
                    {group.zones.map((zone) => (
                      <TzSelectItem
                        key={zone.value}
                        value={zone.value}
                        offset={zone.offset}
                      >
                        {zone.label}
                      </TzSelectItem>
                    ))}
                  </SelectGroup>
                </React.Fragment>
              ))}
            </SelectViewport>
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Re-export Radix sub-components used above so the file is self-contained
// ---------------------------------------------------------------------------

const {
  Root: _Select,
  Trigger: _SelectTrigger,
  Value: _SelectValue,
  Content: _SelectContent,
  Viewport: SelectViewport,
  Group: _SelectGroup,
  Label: _SelectLabel,
  Item: _SelectItem,
  Separator: SelectSeparator,
} = Select as unknown as {
  Root: typeof Select;
  Trigger: typeof SelectTrigger;
  Value: typeof SelectValue;
  Content: typeof SelectContent;
  Viewport: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  Group: typeof SelectGroup;
  Label: typeof SelectLabel;
  Item: typeof SelectItem;
  Separator: React.FC<React.HTMLAttributes<HTMLDivElement>>;
};