"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

// ---------------------------------------------------------------------------
// Radix-based Select wrappers (no shadcn dialog / select component installed)
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
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
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
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "@media (prefers-reduced-motion: reduce) { animation: none !important; }",
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
  region: string;
  zones: TimezoneOption[];
}

const TIMEZONE_GROUPS: TimezoneGroup[] = [
  {
    region: "Americas",
    zones: [
      { value: "America/New_York", label: "New York (Eastern)", offset: "UTC−5/−4" },
      { value: "America/Chicago", label: "Chicago (Central)", offset: "UTC−6/−5" },
      { value: "America/Denver", label: "Denver (Mountain)", offset: "UTC−7/−6" },
      { value: "America/Phoenix", label: "Phoenix (Mountain, no DST)", offset: "UTC−7" },
      { value: "America/Los_Angeles", label: "Los Angeles (Pacific)", offset: "UTC−8/−7" },
      { value: "America/Anchorage", label: "Anchorage (Alaska)", offset: "UTC−9/−8" },
      { value: "Pacific/Honolulu", label: "Honolulu (Hawaii)", offset: "UTC−10" },
      { value: "America/Toronto", label: "Toronto (Eastern)", offset: "UTC−5/−4" },
      { value: "America/Vancouver", label: "Vancouver (Pacific)", offset: "UTC−8/−7" },
      { value: "America/Mexico_City", label: "Mexico City (Central)", offset: "UTC−6/−5" },
      { value: "America/Sao_Paulo", label: "São Paulo (Brasilia)", offset: "UTC−3/−2" },
      { value: "America/Buenos_Aires", label: "Buenos Aires (Argentina)", offset: "UTC−3" },
      { value: "America/Bogota", label: "Bogotá (Colombia)", offset: "UTC−5" },
      { value: "America/Lima", label: "Lima (Peru)", offset: "UTC−5" },
      { value: "America/Santiago", label: "Santiago (Chile)", offset: "UTC−4/−3" },
      { value: "America/Caracas", label: "Caracas (Venezuela)", offset: "UTC−4" },
    ],
  },
  {
    region: "Europe",
    zones: [
      { value: "UTC", label: "UTC (Coordinated Universal Time)", offset: "UTC+0" },
      { value: "Europe/London", label: "London (GMT/BST)", offset: "UTC+0/+1" },
      { value: "Europe/Dublin", label: "Dublin (IST)", offset: "UTC+0/+1" },
      { value: "Europe/Lisbon", label: "Lisbon (WET)", offset: "UTC+0/+1" },
      { value: "Europe/Paris", label: "Paris (CET)", offset: "UTC+1/+2" },
      { value: "Europe/Berlin", label: "Berlin (CET)", offset: "UTC+1/+2" },
      { value: "Europe/Amsterdam", label: "Amsterdam (CET)", offset: "UTC+1/+2" },
      { value: "Europe/Brussels", label: "Brussels (CET)", offset: "UTC+1/+2" },
      { value: "Europe/Madrid", label: "Madrid (CET)", offset: "UTC+1/+2" },
      { value: "Europe/Rome", label: "Rome (CET)", offset: "UTC+1/+2" },
      { value: "Europe/Warsaw", label: "Warsaw (CET)", offset: "UTC+1/+2" },
      { value: "Europe/Stockholm", label: "Stockholm (CET)", offset: "UTC+1/+2" },
      { value: "Europe/Athens", label: "Athens (EET)", offset: "UTC+2/+3" },
      { value: "Europe/Helsinki", label: "Helsinki (EET)", offset: "UTC+2/+3" },
      { value: "Europe/Bucharest", label: "Bucharest (EET)", offset: "UTC+2/+3" },
      { value: "Europe/Istanbul", label: "Istanbul (TRT)", offset: "UTC+3" },
      { value: "Europe/Moscow", label: "Moscow (MSK)", offset: "UTC+3" },
      { value: "Europe/Kiev", label: "Kyiv (EET)", offset: "UTC+2/+3" },
      { value: "Europe/Zurich", label: "Zurich (CET)", offset: "UTC+1/+2" },
      { value: "Europe/Vienna", label: "Vienna (CET)", offset: "UTC+1/+2" },
    ],
  },
  {
    region: "Africa",
    zones: [
      { value: "Africa/Cairo", label: "Cairo (EET)", offset: "UTC+2" },
      { value: "Africa/Johannesburg", label: "Johannesburg (SAST)", offset: "UTC+2" },
      { value: "Africa/Lagos", label: "Lagos (WAT)", offset: "UTC+1" },
      { value: "Africa/Nairobi", label: "Nairobi (EAT)", offset: "UTC+3" },
      { value: "Africa/Casablanca", label: "Casablanca (WET)", offset: "UTC+1" },
      { value: "Africa/Accra", label: "Accra (GMT)", offset: "UTC+0" },
    ],
  },
  {
    region: "Asia",
    zones: [
      { value: "Asia/Dubai", label: "Dubai (GST)", offset: "UTC+4" },
      { value: "Asia/Karachi", label: "Karachi (PKT)", offset: "UTC+5" },
      { value: "Asia/Kolkata", label: "Kolkata (IST)", offset: "UTC+5:30" },
      { value: "Asia/Dhaka", label: "Dhaka (BST)", offset: "UTC+6" },
      { value: "Asia/Bangkok", label: "Bangkok (ICT)", offset: "UTC+7" },
      { value: "Asia/Jakarta", label: "Jakarta (WIB)", offset: "UTC+7" },
      { value: "Asia/Shanghai", label: "Shanghai (CST)", offset: "UTC+8" },
      { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)", offset: "UTC+8" },
      { value: "Asia/Singapore", label: "Singapore (SGT)", offset: "UTC+8" },
      { value: "Asia/Taipei", label: "Taipei (CST)", offset: "UTC+8" },
      { value: "Asia/Seoul", label: "Seoul (KST)", offset: "UTC+9" },
      { value: "Asia/Tokyo", label: "Tokyo (JST)", offset: "UTC+9" },
      { value: "Asia/Riyadh", label: "Riyadh (AST)", offset: "UTC+3" },
      { value: "Asia/Tehran", label: "Tehran (IRST)", offset: "UTC+3:30" },
      { value: "Asia/Baku", label: "Baku (AZT)", offset: "UTC+4" },
      { value: "Asia/Tashkent", label: "Tashkent (UZT)", offset: "UTC+5" },
      { value: "Asia/Almaty", label: "Almaty (ALMT)", offset: "UTC+6" },
      { value: "Asia/Yangon", label: "Yangon (MMT)", offset: "UTC+6:30" },
      { value: "Asia/Colombo", label: "Colombo (SLST)", offset: "UTC+5:30" },
      { value: "Asia/Kathmandu", label: "Kathmandu (NPT)", offset: "UTC+5:45" },
      { value: "Asia/Ulaanbaatar", label: "Ulaanbaatar (ULAT)", offset: "UTC+8" },
      { value: "Asia/Vladivostok", label: "Vladivostok (VLAT)", offset: "UTC+10" },
    ],
  },
  {
    region: "Pacific",
    zones: [
      { value: "Australia/Sydney", label: "Sydney (AEST)", offset: "UTC+10/+11" },
      { value: "Australia/Melbourne", label: "Melbourne (AEST)", offset: "UTC+10/+11" },
      { value: "Australia/Brisbane", label: "Brisbane (AEST, no DST)", offset: "UTC+10" },
      { value: "Australia/Perth", label: "Perth (AWST)", offset: "UTC+8" },
      { value: "Australia/Adelaide", label: "Adelaide (ACST)", offset: "UTC+9:30/+10:30" },
      { value: "Pacific/Auckland", label: "Auckland (NZST)", offset: "UTC+12/+13" },
      { value: "Pacific/Fiji", label: "Fiji (FJT)", offset: "UTC+12" },
      { value: "Pacific/Guam", label: "Guam (ChST)", offset: "UTC+10" },
      { value: "Pacific/Tongatapu", label: "Tongatapu (TOT)", offset: "UTC+13" },
    ],
  },
];

// Build a flat lookup for resolving labels from values
const FLAT_TIMEZONE_MAP: Record<string, TimezoneOption> = {};
for (const group of TIMEZONE_GROUPS) {
  for (const zone of group.zones) {
    FLAT_TIMEZONE_MAP[zone.value] = zone;
  }
}

// ---------------------------------------------------------------------------
// TimezoneSelectorProps
// ---------------------------------------------------------------------------

export interface TimezoneSelectorProps {
  /** The currently selected timezone IANA value (controlled). */
  value?: string;
  /** Default value for uncontrolled usage. */
  defaultValue?: string;
  /** Callback fired when the user selects a new timezone. */
  onValueChange?: (value: string) => void;
  /** Label text shown above the trigger. Defaults to "Timezone". */
  label?: string;
  /** Placeholder shown when no value is selected. */
  placeholder?: string;
  /** Whether the selector is disabled. */
  disabled?: boolean;
  /** Whether the current value is invalid. */
  invalid?: boolean;
  /** Additional class names for the root wrapper. */
  className?: string;
  /** Additional class names for the trigger button. */
  triggerClassName?: string;
  /** ID used for the trigger (auto-generated if omitted). */
  id?: string;
}

// ---------------------------------------------------------------------------
// TimezoneSelector
// ---------------------------------------------------------------------------

let idCounter = 0;
function useId(providedId?: string): string {
  const [id] = React.useState(() => providedId ?? `timezone-selector-${++idCounter}`);
  return providedId ?? id;
}

export function TimezoneSelector({
  value,
  defaultValue,
  onValueChange,
  label = "Timezone",
  placeholder = "Select a timezone",
  disabled = false,
  invalid = false,
  className,
  triggerClassName,
  id: providedId,
}: TimezoneSelectorProps) {
  const id = useId(providedId);

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
          className={cn("w-full", triggerClassName)}
          aria-invalid={invalid ? true : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper">
          {TIMEZONE_GROUPS.map((group, groupIndex) => (
            <React.Fragment key={group.region}>
              {groupIndex > 0 && <SelectSeparator />}
              <SelectGroup>
                <SelectLabel>{group.region}</SelectLabel>
                {group.zones.map((zone) => (
                  <SelectItem key={zone.value} value={zone.value}>
                    <span className="flex items-center justify-between gap-4 w-full">
                      <span>{zone.label}</span>
                      <span className="text-xs text-muted-foreground font-mono shrink-0">
                        {zone.offset}
                      </span>
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </React.Fragment>
          ))}
        </SelectContent>
      </Select>
      {invalid && (
        <p className="text-sm text-destructive" role="alert">
          Please select a valid timezone.
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Convenience hook — resolve a display label from a stored IANA value
// ---------------------------------------------------------------------------

export function useTimezoneLabel(value: string | undefined): string {
  if (!value) return "";
  const zone = FLAT_TIMEZONE_MAP[value];
  return zone ? `${zone.label} (${zone.offset})` : value;
}

// ---------------------------------------------------------------------------
// Re-export flat map for consumers who need the full list
// ---------------------------------------------------------------------------

export { TIMEZONE_GROUPS, FLAT_TIMEZONE_MAP };