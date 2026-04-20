"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

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
    { value: "America/Bogota", label: "Bogota (GMT-5)" },
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
    { value: "Asia/Colombo", label: "Colombo (GMT+5:30)" },
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
    { value: "Atlantic/Reykjavik", label: "Reykjavik (GMT+0)" },
  ]},
  { group: "Australia & Pacific", items: [
    { value: "Australia/Adelaide", label: "Adelaide (GMT+9:30)" },
    { value: "Australia/Brisbane", label: "Brisbane (GMT+10)" },
    { value: "Australia/Melbourne", label: "Melbourne (GMT+10)" },
    { value: "Australia/Perth", label: "Perth (GMT+8)" },
    { value: "Australia/Sydney", label: "Sydney (GMT+10)" },
    { value: "Pacific/Auckland", label: "Auckland (GMT+12)" },
    { value: "Pacific/Fiji", label: "Fiji (GMT+12)" },
    { value: "Pacific/Honolulu", label: "Honolulu (GMT-10)" },
  ]},
  { group: "Europe", items: [
    { value: "Europe/Amsterdam", label: "Amsterdam (GMT+1)" },
    { value: "Europe/Athens", label: "Athens (GMT+2)" },
    { value: "Europe/Berlin", label: "Berlin (GMT+1)" },
    { value: "Europe/Brussels", label: "Brussels (GMT+1)" },
    { value: "Europe/Bucharest", label: "Bucharest (GMT+2)" },
    { value: "Europe/Dublin", label: "Dublin (GMT+0)" },
    { value: "Europe/Helsinki", label: "Helsinki (GMT+2)" },
    { value: "Europe/Istanbul", label: "Istanbul (GMT+3)" },
    { value: "Europe/Lisbon", label: "Lisbon (GMT+0)" },
    { value: "Europe/London", label: "London (GMT+0)" },
    { value: "Europe/Madrid", label: "Madrid (GMT+1)" },
    { value: "Europe/Moscow", label: "Moscow (GMT+3)" },
    { value: "Europe/Paris", label: "Paris (GMT+1)" },
    { value: "Europe/Prague", label: "Prague (GMT+1)" },
    { value: "Europe/Rome", label: "Rome (GMT+1)" },
    { value: "Europe/Stockholm", label: "Stockholm (GMT+1)" },
    { value: "Europe/Vienna", label: "Vienna (GMT+1)" },
    { value: "Europe/Warsaw", label: "Warsaw (GMT+1)" },
    { value: "Europe/Zurich", label: "Zurich (GMT+1)" },
  ]},
  { group: "UTC", items: [
    { value: "UTC", label: "UTC (GMT+0)" },
  ]},
];

function getLocalTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

function findTimezoneLabel(value: string): string | undefined {
  for (const group of TIMEZONES) {
    const found = group.items.find((item) => item.value === value);
    if (found) return found.label;
  }
  return undefined;
}

interface TimezoneSelectorProps {
  id?: string;
  label?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  triggerClassName?: string;
}

export function TimezoneSelector({
  id = "timezone-select",
  label = "Timezone",
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select a timezone",
  disabled = false,
  invalid = false,
  className,
  triggerClassName,
}: TimezoneSelectorProps) {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const resolvedDefault = defaultValue ?? (value === undefined ? getLocalTimezone() : undefined);

  const filteredTimezones = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return TIMEZONES;
    return TIMEZONES.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.value.toLowerCase().includes(q)
      ),
    })).filter((group) => group.items.length > 0);
  }, [search]);

  React.useEffect(() => {
    if (open) {
      // Small delay to ensure the portal is rendered
      const timer = setTimeout(() => {
        searchRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setSearch("");
    }
  }, [open]);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={id}>{label}</Label>

      <SelectPrimitive.Root
        value={value}
        defaultValue={resolvedDefault}
        onValueChange={onValueChange}
        disabled={disabled}
        open={open}
        onOpenChange={setOpen}
      >
        <SelectPrimitive.Trigger
          id={id}
          aria-invalid={invalid ? true : undefined}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2",
            invalid && "border-destructive focus:ring-destructive",
            triggerClassName
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <SelectPrimitive.Value placeholder={placeholder} />
          </span>
          <ChevronDown
            className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            position="popper"
            sideOffset={4}
            className={cn(
              "relative z-50 min-w-[var(--radix-select-trigger-width)] max-h-[min(380px,var(--radix-select-available-height))]",
              "overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
              "@media (prefers-reduced-motion: reduce) { animation: none !important; }"
            )}
          >
            {/* Search box */}
            <div className="sticky top-0 z-10 border-b border-border bg-popover px-2 py-2">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  // Prevent select's type-ahead from interfering
                  e.stopPropagation();
                }}
                placeholder="Search timezones..."
                className={cn(
                  "w-full rounded-sm border border-input bg-background px-2 py-1.5 text-sm outline-none",
                  "placeholder:text-muted-foreground",
                  "focus:ring-1 focus:ring-ring"
                )}
                aria-label="Search timezones"
              />
            </div>

            <SelectPrimitive.Viewport className="p-1">
              {filteredTimezones.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No timezones found
                </div>
              ) : (
                filteredTimezones.map((group) => (
                  <SelectPrimitive.Group key={group.group}>
                    <SelectPrimitive.Label className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {group.group}
                    </SelectPrimitive.Label>
                    {group.items.map((item) => (
                      <SelectPrimitive.Item
                        key={item.value}
                        value={item.value}
                        className={cn(
                          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
                          "focus:bg-accent focus:text-accent-foreground",
                          "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                          "data-[state=checked]:font-medium"
                        )}
                      >
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          <SelectPrimitive.ItemIndicator>
                            <Check className="h-4 w-4" aria-hidden="true" />
                          </SelectPrimitive.ItemIndicator>
                        </span>
                        <SelectPrimitive.ItemText>
                          {item.label}
                        </SelectPrimitive.ItemText>
                      </SelectPrimitive.Item>
                    ))}
                    <SelectPrimitive.Separator className="my-1 h-px bg-border" />
                  </SelectPrimitive.Group>
                ))
              )}
            </SelectPrimitive.Viewport>
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

export type { TimezoneSelectorProps };
export { TIMEZONES, getLocalTimezone, findTimezoneLabel };