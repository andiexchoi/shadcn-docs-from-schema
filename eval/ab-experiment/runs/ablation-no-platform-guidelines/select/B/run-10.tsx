"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Radix-backed Select primitives (no shadcn dialog wrapper needed)
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
SelectTrigger.displayName = "SelectTrigger";

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
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
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
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

// ---------------------------------------------------------------------------
// Timezone data
// ---------------------------------------------------------------------------

interface TimezoneRegion {
  label: string;
  timezones: { value: string; label: string; offset: string }[];
}

const TIMEZONE_REGIONS: TimezoneRegion[] = [
  {
    label: "Americas",
    timezones: [
      { value: "America/New_York", label: "New York", offset: "UTC−5/−4" },
      { value: "America/Chicago", label: "Chicago", offset: "UTC−6/−5" },
      { value: "America/Denver", label: "Denver", offset: "UTC−7/−6" },
      { value: "America/Phoenix", label: "Phoenix", offset: "UTC−7" },
      { value: "America/Los_Angeles", label: "Los Angeles", offset: "UTC−8/−7" },
      { value: "America/Anchorage", label: "Anchorage", offset: "UTC−9/−8" },
      { value: "Pacific/Honolulu", label: "Honolulu", offset: "UTC−10" },
      { value: "America/Toronto", label: "Toronto", offset: "UTC−5/−4" },
      { value: "America/Vancouver", label: "Vancouver", offset: "UTC−8/−7" },
      { value: "America/Mexico_City", label: "Mexico City", offset: "UTC−6/−5" },
      { value: "America/Sao_Paulo", label: "São Paulo", offset: "UTC−3" },
      { value: "America/Buenos_Aires", label: "Buenos Aires", offset: "UTC−3" },
      { value: "America/Bogota", label: "Bogotá", offset: "UTC−5" },
      { value: "America/Lima", label: "Lima", offset: "UTC−5" },
      { value: "America/Santiago", label: "Santiago", offset: "UTC−4/−3" },
      { value: "America/Caracas", label: "Caracas", offset: "UTC−4" },
    ],
  },
  {
    label: "Europe",
    timezones: [
      { value: "Europe/London", label: "London", offset: "UTC+0/+1" },
      { value: "Europe/Dublin", label: "Dublin", offset: "UTC+0/+1" },
      { value: "Europe/Lisbon", label: "Lisbon", offset: "UTC+0/+1" },
      { value: "Europe/Paris", label: "Paris", offset: "UTC+1/+2" },
      { value: "Europe/Berlin", label: "Berlin", offset: "UTC+1/+2" },
      { value: "Europe/Rome", label: "Rome", offset: "UTC+1/+2" },
      { value: "Europe/Madrid", label: "Madrid", offset: "UTC+1/+2" },
      { value: "Europe/Amsterdam", label: "Amsterdam", offset: "UTC+1/+2" },
      { value: "Europe/Brussels", label: "Brussels", offset: "UTC+1/+2" },
      { value: "Europe/Zurich", label: "Zurich", offset: "UTC+1/+2" },
      { value: "Europe/Stockholm", label: "Stockholm", offset: "UTC+1/+2" },
      { value: "Europe/Oslo", label: "Oslo", offset: "UTC+1/+2" },
      { value: "Europe/Copenhagen", label: "Copenhagen", offset: "UTC+1/+2" },
      { value: "Europe/Helsinki", label: "Helsinki", offset: "UTC+2/+3" },
      { value: "Europe/Athens", label: "Athens", offset: "UTC+2/+3" },
      { value: "Europe/Warsaw", label: "Warsaw", offset: "UTC+1/+2" },
      { value: "Europe/Prague", label: "Prague", offset: "UTC+1/+2" },
      { value: "Europe/Budapest", label: "Budapest", offset: "UTC+1/+2" },
      { value: "Europe/Bucharest", label: "Bucharest", offset: "UTC+2/+3" },
      { value: "Europe/Kiev", label: "Kyiv", offset: "UTC+2/+3" },
      { value: "Europe/Moscow", label: "Moscow", offset: "UTC+3" },
      { value: "Europe/Istanbul", label: "Istanbul", offset: "UTC+3" },
    ],
  },
  {
    label: "Africa",
    timezones: [
      { value: "Africa/Cairo", label: "Cairo", offset: "UTC+2" },
      { value: "Africa/Johannesburg", label: "Johannesburg", offset: "UTC+2" },
      { value: "Africa/Lagos", label: "Lagos", offset: "UTC+1" },
      { value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+3" },
      { value: "Africa/Casablanca", label: "Casablanca", offset: "UTC+1" },
      { value: "Africa/Accra", label: "Accra", offset: "UTC+0" },
      { value: "Africa/Algiers", label: "Algiers", offset: "UTC+1" },
      { value: "Africa/Tunis", label: "Tunis", offset: "UTC+1" },
    ],
  },
  {
    label: "Asia",
    timezones: [
      { value: "Asia/Dubai", label: "Dubai", offset: "UTC+4" },
      { value: "Asia/Riyadh", label: "Riyadh", offset: "UTC+3" },
      { value: "Asia/Baghdad", label: "Baghdad", offset: "UTC+3" },
      { value: "Asia/Tehran", label: "Tehran", offset: "UTC+3:30" },
      { value: "Asia/Karachi", label: "Karachi", offset: "UTC+5" },
      { value: "Asia/Kolkata", label: "Kolkata", offset: "UTC+5:30" },
      { value: "Asia/Colombo", label: "Colombo", offset: "UTC+5:30" },
      { value: "Asia/Dhaka", label: "Dhaka", offset: "UTC+6" },
      { value: "Asia/Yangon", label: "Yangon", offset: "UTC+6:30" },
      { value: "Asia/Bangkok", label: "Bangkok", offset: "UTC+7" },
      { value: "Asia/Jakarta", label: "Jakarta", offset: "UTC+7" },
      { value: "Asia/Singapore", label: "Singapore", offset: "UTC+8" },
      { value: "Asia/Hong_Kong", label: "Hong Kong", offset: "UTC+8" },
      { value: "Asia/Shanghai", label: "Shanghai", offset: "UTC+8" },
      { value: "Asia/Taipei", label: "Taipei", offset: "UTC+8" },
      { value: "Asia/Seoul", label: "Seoul", offset: "UTC+9" },
      { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+9" },
      { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur", offset: "UTC+8" },
      { value: "Asia/Almaty", label: "Almaty", offset: "UTC+6" },
      { value: "Asia/Tashkent", label: "Tashkent", offset: "UTC+5" },
      { value: "Asia/Baku", label: "Baku", offset: "UTC+4" },
      { value: "Asia/Yerevan", label: "Yerevan", offset: "UTC+4" },
      { value: "Asia/Tbilisi", label: "Tbilisi", offset: "UTC+4" },
      { value: "Asia/Jerusalem", label: "Jerusalem", offset: "UTC+2/+3" },
      { value: "Asia/Beirut", label: "Beirut", offset: "UTC+2/+3" },
      { value: "Asia/Amman", label: "Amman", offset: "UTC+2/+3" },
      { value: "Asia/Kuwait", label: "Kuwait", offset: "UTC+3" },
      { value: "Asia/Muscat", label: "Muscat", offset: "UTC+4" },
    ],
  },
  {
    label: "Pacific",
    timezones: [
      { value: "Pacific/Auckland", label: "Auckland", offset: "UTC+12/+13" },
      { value: "Pacific/Fiji", label: "Fiji", offset: "UTC+12" },
      { value: "Pacific/Guam", label: "Guam", offset: "UTC+10" },
      { value: "Pacific/Port_Moresby", label: "Port Moresby", offset: "UTC+10" },
      { value: "Pacific/Tongatapu", label: "Tongatapu", offset: "UTC+13" },
      { value: "Pacific/Apia", label: "Apia", offset: "UTC+13" },
    ],
  },
  {
    label: "Australia",
    timezones: [
      { value: "Australia/Perth", label: "Perth", offset: "UTC+8" },
      { value: "Australia/Darwin", label: "Darwin", offset: "UTC+9:30" },
      { value: "Australia/Adelaide", label: "Adelaide", offset: "UTC+9:30/+10:30" },
      { value: "Australia/Brisbane", label: "Brisbane", offset: "UTC+10" },
      { value: "Australia/Sydney", label: "Sydney", offset: "UTC+10/+11" },
      { value: "Australia/Melbourne", label: "Melbourne", offset: "UTC+10/+11" },
      { value: "Australia/Hobart", label: "Hobart", offset: "UTC+10/+11" },
    ],
  },
  {
    label: "UTC",
    timezones: [
      { value: "UTC", label: "UTC", offset: "UTC+0" },
      { value: "Etc/GMT+12", label: "GMT−12", offset: "UTC−12" },
      { value: "Etc/GMT+11", label: "GMT−11", offset: "UTC−11" },
      { value: "Etc/GMT+10", label: "GMT−10", offset: "UTC−10" },
      { value: "Etc/GMT+9", label: "GMT−9", offset: "UTC−9" },
      { value: "Etc/GMT+8", label: "GMT−8", offset: "UTC−8" },
      { value: "Etc/GMT+7", label: "GMT−7", offset: "UTC−7" },
      { value: "Etc/GMT+6", label: "GMT−6", offset: "UTC−6" },
      { value: "Etc/GMT+5", label: "GMT−5", offset: "UTC−5" },
      { value: "Etc/GMT+4", label: "GMT−4", offset: "UTC−4" },
      { value: "Etc/GMT+3", label: "GMT−3", offset: "UTC−3" },
      { value: "Etc/GMT+2", label: "GMT−2", offset: "UTC−2" },
      { value: "Etc/GMT+1", label: "GMT−1", offset: "UTC−1" },
      { value: "Etc/GMT-1", label: "GMT+1", offset: "UTC+1" },
      { value: "Etc/GMT-2", label: "GMT+2", offset: "UTC+2" },
      { value: "Etc/GMT-3", label: "GMT+3", offset: "UTC+3" },
      { value: "Etc/GMT-4", label: "GMT+4", offset: "UTC+4" },
      { value: "Etc/GMT-5", label: "GMT+5", offset: "UTC+5" },
      { value: "Etc/GMT-6", label: "GMT+6", offset: "UTC+6" },
      { value: "Etc/GMT-7", label: "GMT+7", offset: "UTC+7" },
      { value: "Etc/GMT-8", label: "GMT+8", offset: "UTC+8" },
      { value: "Etc/GMT-9", label: "GMT+9", offset: "UTC+9" },
      { value: "Etc/GMT-10", label: "GMT+10", offset: "UTC+10" },
      { value: "Etc/GMT-11", label: "GMT+11", offset: "UTC+11" },
      { value: "Etc/GMT-12", label: "GMT+12", offset: "UTC+12" },
    ],
  },
];

// Flat list for search filtering
const ALL_TIMEZONES = TIMEZONE_REGIONS.flatMap((r) =>
  r.timezones.map((tz) => ({ ...tz, region: r.label }))
);

// ---------------------------------------------------------------------------
// TimezoneSelector component
// ---------------------------------------------------------------------------

export interface TimezoneSelectorProps {
  /** Currently selected timezone IANA value (controlled) */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Called when a new timezone is selected */
  onValueChange?: (value: string) => void;
  /** Label text rendered above the selector */
  label?: string;
  /** Placeholder text shown when no timezone is selected */
  placeholder?: string;
  /** Disables the entire selector */
  disabled?: boolean;
  /** Marks the field as invalid for validation styling */
  invalid?: boolean;
  /** Additional class names applied to the SelectTrigger */
  className?: string;
  /** Id for the trigger element (auto-generated if omitted) */
  id?: string;
}

let idCounter = 0;

export function TimezoneSelector({
  value,
  defaultValue,
  onValueChange,
  label = "Timezone",
  placeholder = "Timezone",
  disabled = false,
  invalid = false,
  className,
  id: idProp,
}: TimezoneSelectorProps) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;

  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const trimmed = search.trim().toLowerCase();

  const filteredRegions = React.useMemo(() => {
    if (!trimmed) return TIMEZONE_REGIONS;
    return TIMEZONE_REGIONS.reduce<TimezoneRegion[]>((acc, region) => {
      const matched = region.timezones.filter(
        (tz) =>
          tz.label.toLowerCase().includes(trimmed) ||
          tz.value.toLowerCase().includes(trimmed) ||
          tz.offset.toLowerCase().includes(trimmed) ||
          region.label.toLowerCase().includes(trimmed)
      );
      if (matched.length > 0) acc.push({ ...region, timezones: matched });
      return acc;
    }, []);
  }, [trimmed]);

  const selectedLabel = React.useMemo(() => {
    if (!value) return undefined;
    const found = ALL_TIMEZONES.find((tz) => tz.value === value);
    if (!found) return value;
    return `${found.label} (${found.offset})`;
  }, [value]);

  // Reset search when dropdown closes
  const handleOpenChange = React.useCallback((next: boolean) => {
    setOpen(next);
    if (!next) setSearch("");
  }, []);

  return (
    <div className="flex flex-col gap-1.5">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        open={open}
        onOpenChange={handleOpenChange}
      >
        <SelectTrigger
          id={id}
          className={cn("w-full", className)}
          aria-invalid={invalid ? true : undefined}
          data-invalid={invalid ? true : undefined}
        >
          <SelectValue placeholder={placeholder}>
            {selectedLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent position="popper">
          {/* Search input */}
          <div className="flex items-center border-b px-3 pb-2 pt-1">
            <input
              className="flex h-8 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search timezones…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              // Prevent select keyboard navigation from stealing focus
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>

          {filteredRegions.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No timezones found.
            </p>
          )}

          {filteredRegions.map((region, regionIdx) => (
            <React.Fragment key={region.label}>
              {regionIdx > 0 && <SelectSeparator />}
              <SelectGroup>
                <SelectLabel>{region.label}</SelectLabel>
                {region.timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>
                    <span className="flex items-center justify-between gap-4">
                      <span>{tz.label}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
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
    </div>
  );
}