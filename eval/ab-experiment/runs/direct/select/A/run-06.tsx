"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp, Globe, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TIMEZONES = [
  { value: "Pacific/Midway", label: "Midway Island, Samoa", offset: "UTC-11:00" },
  { value: "Pacific/Honolulu", label: "Hawaii", offset: "UTC-10:00" },
  { value: "America/Anchorage", label: "Alaska", offset: "UTC-09:00" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)", offset: "UTC-08:00" },
  { value: "America/Tijuana", label: "Tijuana, Baja California", offset: "UTC-08:00" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)", offset: "UTC-07:00" },
  { value: "America/Phoenix", label: "Arizona", offset: "UTC-07:00" },
  { value: "America/Chihuahua", label: "Chihuahua, La Paz, Mazatlan", offset: "UTC-07:00" },
  { value: "America/Chicago", label: "Central Time (US & Canada)", offset: "UTC-06:00" },
  { value: "America/Mexico_City", label: "Mexico City, Monterrey", offset: "UTC-06:00" },
  { value: "America/Regina", label: "Saskatchewan", offset: "UTC-06:00" },
  { value: "America/Bogota", label: "Bogota, Lima, Quito", offset: "UTC-05:00" },
  { value: "America/New_York", label: "Eastern Time (US & Canada)", offset: "UTC-05:00" },
  { value: "America/Indiana/Indianapolis", label: "Indiana (East)", offset: "UTC-05:00" },
  { value: "America/Caracas", label: "Caracas, La Paz", offset: "UTC-04:30" },
  { value: "America/Halifax", label: "Atlantic Time (Canada)", offset: "UTC-04:00" },
  { value: "America/Manaus", label: "Manaus", offset: "UTC-04:00" },
  { value: "America/Santiago", label: "Santiago", offset: "UTC-04:00" },
  { value: "America/St_Johns", label: "Newfoundland", offset: "UTC-03:30" },
  { value: "America/Sao_Paulo", label: "Brasilia", offset: "UTC-03:00" },
  { value: "America/Argentina/Buenos_Aires", label: "Buenos Aires, Georgetown", offset: "UTC-03:00" },
  { value: "America/Godthab", label: "Greenland", offset: "UTC-03:00" },
  { value: "America/Montevideo", label: "Montevideo", offset: "UTC-03:00" },
  { value: "Atlantic/South_Georgia", label: "Mid-Atlantic", offset: "UTC-02:00" },
  { value: "Atlantic/Azores", label: "Azores", offset: "UTC-01:00" },
  { value: "Atlantic/Cape_Verde", label: "Cape Verde Is.", offset: "UTC-01:00" },
  { value: "Europe/London", label: "Dublin, Edinburgh, Lisbon, London", offset: "UTC+00:00" },
  { value: "Africa/Monrovia", label: "Monrovia, Reykjavik", offset: "UTC+00:00" },
  { value: "UTC", label: "UTC", offset: "UTC+00:00" },
  { value: "Europe/Amsterdam", label: "Amsterdam, Berlin, Rome, Stockholm", offset: "UTC+01:00" },
  { value: "Europe/Belgrade", label: "Belgrade, Bratislava, Budapest", offset: "UTC+01:00" },
  { value: "Europe/Brussels", label: "Brussels, Copenhagen, Madrid, Paris", offset: "UTC+01:00" },
  { value: "Europe/Sarajevo", label: "Sarajevo, Skopje, Warsaw, Zagreb", offset: "UTC+01:00" },
  { value: "Africa/Lagos", label: "West Central Africa", offset: "UTC+01:00" },
  { value: "Asia/Amman", label: "Amman", offset: "UTC+02:00" },
  { value: "Europe/Athens", label: "Athens, Bucharest, Istanbul", offset: "UTC+02:00" },
  { value: "Asia/Beirut", label: "Beirut", offset: "UTC+02:00" },
  { value: "Africa/Cairo", label: "Cairo", offset: "UTC+02:00" },
  { value: "Africa/Harare", label: "Harare, Pretoria", offset: "UTC+02:00" },
  { value: "Europe/Helsinki", label: "Helsinki, Kyiv, Riga, Sofia", offset: "UTC+02:00" },
  { value: "Asia/Jerusalem", label: "Jerusalem", offset: "UTC+02:00" },
  { value: "Asia/Baghdad", label: "Baghdad", offset: "UTC+03:00" },
  { value: "Asia/Kuwait", label: "Kuwait, Riyadh", offset: "UTC+03:00" },
  { value: "Europe/Moscow", label: "Moscow, St. Petersburg, Volgograd", offset: "UTC+03:00" },
  { value: "Africa/Nairobi", label: "Nairobi", offset: "UTC+03:00" },
  { value: "Asia/Tbilisi", label: "Tbilisi", offset: "UTC+03:00" },
  { value: "Asia/Tehran", label: "Tehran", offset: "UTC+03:30" },
  { value: "Asia/Muscat", label: "Abu Dhabi, Muscat", offset: "UTC+04:00" },
  { value: "Asia/Baku", label: "Baku", offset: "UTC+04:00" },
  { value: "Indian/Mauritius", label: "Port Louis", offset: "UTC+04:00" },
  { value: "Asia/Yerevan", label: "Yerevan", offset: "UTC+04:00" },
  { value: "Asia/Kabul", label: "Kabul", offset: "UTC+04:30" },
  { value: "Asia/Tashkent", label: "Tashkent", offset: "UTC+05:00" },
  { value: "Asia/Karachi", label: "Islamabad, Karachi", offset: "UTC+05:00" },
  { value: "Asia/Kolkata", label: "Chennai, Kolkata, Mumbai, New Delhi", offset: "UTC+05:30" },
  { value: "Asia/Colombo", label: "Sri Jayawardenepura", offset: "UTC+05:30" },
  { value: "Asia/Katmandu", label: "Kathmandu", offset: "UTC+05:45" },
  { value: "Asia/Almaty", label: "Almaty, Novosibirsk", offset: "UTC+06:00" },
  { value: "Asia/Dhaka", label: "Astana, Dhaka", offset: "UTC+06:00" },
  { value: "Asia/Rangoon", label: "Yangon (Rangoon)", offset: "UTC+06:30" },
  { value: "Asia/Bangkok", label: "Bangkok, Hanoi, Jakarta", offset: "UTC+07:00" },
  { value: "Asia/Krasnoyarsk", label: "Krasnoyarsk", offset: "UTC+07:00" },
  { value: "Asia/Hong_Kong", label: "Beijing, Chongqing, Hong Kong, Urumqi", offset: "UTC+08:00" },
  { value: "Asia/Kuala_Lumpur", label: "Kuala Lumpur, Singapore", offset: "UTC+08:00" },
  { value: "Asia/Irkutsk", label: "Irkutsk, Ulaan Bataar", offset: "UTC+08:00" },
  { value: "Australia/Perth", label: "Perth", offset: "UTC+08:00" },
  { value: "Asia/Taipei", label: "Taipei", offset: "UTC+08:00" },
  { value: "Asia/Tokyo", label: "Osaka, Sapporo, Tokyo", offset: "UTC+09:00" },
  { value: "Asia/Seoul", label: "Seoul", offset: "UTC+09:00" },
  { value: "Asia/Yakutsk", label: "Yakutsk", offset: "UTC+09:00" },
  { value: "Australia/Adelaide", label: "Adelaide", offset: "UTC+09:30" },
  { value: "Australia/Darwin", label: "Darwin", offset: "UTC+09:30" },
  { value: "Australia/Brisbane", label: "Brisbane", offset: "UTC+10:00" },
  { value: "Australia/Sydney", label: "Canberra, Melbourne, Sydney", offset: "UTC+10:00" },
  { value: "Pacific/Guam", label: "Guam, Port Moresby", offset: "UTC+10:00" },
  { value: "Australia/Hobart", label: "Hobart", offset: "UTC+10:00" },
  { value: "Asia/Vladivostok", label: "Vladivostok", offset: "UTC+10:00" },
  { value: "Pacific/Noumea", label: "Magadan, Solomon Is., New Caledonia", offset: "UTC+11:00" },
  { value: "Pacific/Auckland", label: "Auckland, Wellington", offset: "UTC+12:00" },
  { value: "Pacific/Fiji", label: "Fiji, Kamchatka, Marshall Is.", offset: "UTC+12:00" },
  { value: "Pacific/Tongatapu", label: "Nuku'alofa", offset: "UTC+13:00" },
];

export interface TimezoneSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function TimezoneSelector({
  value,
  onChange,
  label,
  placeholder = "Select a timezone...",
  disabled = false,
  className,
  id,
}: TimezoneSelectorProps) {
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const filteredTimezones = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return TIMEZONES;
    return TIMEZONES.filter(
      (tz) =>
        tz.label.toLowerCase().includes(q) ||
        tz.value.toLowerCase().includes(q) ||
        tz.offset.toLowerCase().includes(q)
    );
  }, [search]);

  const selectedTimezone = TIMEZONES.find((tz) => tz.value === value);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSearch("");
    } else {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 50);
    }
  };

  const inputId = id ?? React.useId();

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={inputId} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <SelectPrimitive.Root
        value={value}
        onValueChange={onChange}
        open={open}
        onOpenChange={handleOpenChange}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          id={inputId}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&>span]:line-clamp-1"
          )}
        >
          <span className="flex items-center gap-2 truncate">
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
            {selectedTimezone ? (
              <span className="truncate">
                <span className="font-medium">{selectedTimezone.offset}</span>
                <span className="ml-2 text-muted-foreground">{selectedTimezone.label}</span>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className={cn(
              "relative z-50 max-h-[380px] min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
              "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
              "w-[var(--radix-select-trigger-width)]"
            )}
            position="popper"
            sideOffset={4}
          >
            {/* Search */}
            <div className="flex items-center border-b px-3 py-2 gap-2">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Search timezones..."
                className={cn(
                  "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                )}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-muted-foreground hover:text-foreground text-xs"
                  tabIndex={-1}
                >
                  ✕
                </button>
              )}
            </div>

            <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1 text-muted-foreground">
              <ChevronUp className="h-4 w-4" />
            </SelectPrimitive.ScrollUpButton>

            <SelectPrimitive.Viewport className="max-h-[280px] overflow-y-auto p-1">
              {filteredTimezones.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No timezones found.
                </div>
              ) : (
                filteredTimezones.map((tz) => (
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
                        <Check className="h-4 w-4" />
                      </SelectPrimitive.ItemIndicator>
                    </span>
                    <SelectPrimitive.ItemText>
                      <span className="flex items-center gap-2">
                        <span className="w-[80px] shrink-0 font-mono text-xs text-muted-foreground">
                          {tz.offset}
                        </span>
                        <span className="truncate">{tz.label}</span>
                      </span>
                    </SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))
              )}
            </SelectPrimitive.Viewport>

            <SelectPrimitive.ScrollDownButton className="flex cursor-default items-center justify-center py-1 text-muted-foreground">
              <ChevronDown className="h-4 w-4" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {selectedTimezone && (
        <p className="text-xs text-muted-foreground pl-0.5">
          {selectedTimezone.value} &mdash; {selectedTimezone.offset}
        </p>
      )}
    </div>
  );
}

export default TimezoneSelector;