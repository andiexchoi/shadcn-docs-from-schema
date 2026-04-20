"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp, Globe, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TIMEZONES: { label: string; value: string; offset: string }[] = [
  { label: "International Date Line West", value: "Etc/GMT+12", offset: "UTC-12:00" },
  { label: "Midway Island, Samoa", value: "Pacific/Midway", offset: "UTC-11:00" },
  { label: "Hawaii", value: "Pacific/Honolulu", offset: "UTC-10:00" },
  { label: "Alaska", value: "America/Anchorage", offset: "UTC-09:00" },
  { label: "Pacific Time (US & Canada)", value: "America/Los_Angeles", offset: "UTC-08:00" },
  { label: "Tijuana, Baja California", value: "America/Tijuana", offset: "UTC-08:00" },
  { label: "Arizona", value: "America/Phoenix", offset: "UTC-07:00" },
  { label: "Mountain Time (US & Canada)", value: "America/Denver", offset: "UTC-07:00" },
  { label: "Chihuahua, La Paz, Mazatlan", value: "America/Chihuahua", offset: "UTC-07:00" },
  { label: "Central Time (US & Canada)", value: "America/Chicago", offset: "UTC-06:00" },
  { label: "Central America", value: "America/Guatemala", offset: "UTC-06:00" },
  { label: "Guadalajara, Mexico City, Monterrey", value: "America/Mexico_City", offset: "UTC-06:00" },
  { label: "Saskatchewan", value: "America/Regina", offset: "UTC-06:00" },
  { label: "Eastern Time (US & Canada)", value: "America/New_York", offset: "UTC-05:00" },
  { label: "Bogota, Lima, Quito", value: "America/Bogota", offset: "UTC-05:00" },
  { label: "Indiana (East)", value: "America/Indiana/Indianapolis", offset: "UTC-05:00" },
  { label: "Atlantic Time (Canada)", value: "America/Halifax", offset: "UTC-04:00" },
  { label: "Caracas, La Paz", value: "America/Caracas", offset: "UTC-04:00" },
  { label: "Santiago", value: "America/Santiago", offset: "UTC-04:00" },
  { label: "Newfoundland", value: "America/St_Johns", offset: "UTC-03:30" },
  { label: "Brasilia", value: "America/Sao_Paulo", offset: "UTC-03:00" },
  { label: "Buenos Aires, Georgetown", value: "America/Argentina/Buenos_Aires", offset: "UTC-03:00" },
  { label: "Greenland", value: "America/Godthab", offset: "UTC-03:00" },
  { label: "Mid-Atlantic", value: "Atlantic/South_Georgia", offset: "UTC-02:00" },
  { label: "Azores", value: "Atlantic/Azores", offset: "UTC-01:00" },
  { label: "Cape Verde Is.", value: "Atlantic/Cape_Verde", offset: "UTC-01:00" },
  { label: "Dublin, Edinburgh, Lisbon, London", value: "Europe/London", offset: "UTC+00:00" },
  { label: "Monrovia, Reykjavik", value: "Atlantic/Reykjavik", offset: "UTC+00:00" },
  { label: "Casablanca", value: "Africa/Casablanca", offset: "UTC+00:00" },
  { label: "Amsterdam, Berlin, Bern, Rome, Stockholm", value: "Europe/Berlin", offset: "UTC+01:00" },
  { label: "Brussels, Copenhagen, Madrid, Paris", value: "Europe/Paris", offset: "UTC+01:00" },
  { label: "Belgrade, Bratislava, Budapest, Ljubljana", value: "Europe/Belgrade", offset: "UTC+01:00" },
  { label: "Sarajevo, Skopje, Warsaw, Zagreb", value: "Europe/Warsaw", offset: "UTC+01:00" },
  { label: "West Central Africa", value: "Africa/Lagos", offset: "UTC+01:00" },
  { label: "Athens, Bucharest, Istanbul", value: "Europe/Athens", offset: "UTC+02:00" },
  { label: "Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius", value: "Europe/Helsinki", offset: "UTC+02:00" },
  { label: "Cairo", value: "Africa/Cairo", offset: "UTC+02:00" },
  { label: "Harare, Pretoria", value: "Africa/Harare", offset: "UTC+02:00" },
  { label: "Jerusalem", value: "Asia/Jerusalem", offset: "UTC+02:00" },
  { label: "Baghdad", value: "Asia/Baghdad", offset: "UTC+03:00" },
  { label: "Kuwait, Riyadh", value: "Asia/Riyadh", offset: "UTC+03:00" },
  { label: "Moscow, St. Petersburg, Volgograd", value: "Europe/Moscow", offset: "UTC+03:00" },
  { label: "Nairobi", value: "Africa/Nairobi", offset: "UTC+03:00" },
  { label: "Tehran", value: "Asia/Tehran", offset: "UTC+03:30" },
  { label: "Abu Dhabi, Muscat", value: "Asia/Muscat", offset: "UTC+04:00" },
  { label: "Baku, Tbilisi, Yerevan", value: "Asia/Baku", offset: "UTC+04:00" },
  { label: "Kabul", value: "Asia/Kabul", offset: "UTC+04:30" },
  { label: "Yekaterinburg", value: "Asia/Yekaterinburg", offset: "UTC+05:00" },
  { label: "Islamabad, Karachi, Tashkent", value: "Asia/Karachi", offset: "UTC+05:00" },
  { label: "Chennai, Kolkata, Mumbai, New Delhi", value: "Asia/Kolkata", offset: "UTC+05:30" },
  { label: "Sri Jayawardenepura", value: "Asia/Colombo", offset: "UTC+05:30" },
  { label: "Kathmandu", value: "Asia/Kathmandu", offset: "UTC+05:45" },
  { label: "Almaty, Novosibirsk", value: "Asia/Almaty", offset: "UTC+06:00" },
  { label: "Astana, Dhaka", value: "Asia/Dhaka", offset: "UTC+06:00" },
  { label: "Rangoon", value: "Asia/Rangoon", offset: "UTC+06:30" },
  { label: "Bangkok, Hanoi, Jakarta", value: "Asia/Bangkok", offset: "UTC+07:00" },
  { label: "Krasnoyarsk", value: "Asia/Krasnoyarsk", offset: "UTC+07:00" },
  { label: "Beijing, Chongqing, Hong Kong, Urumqi", value: "Asia/Shanghai", offset: "UTC+08:00" },
  { label: "Kuala Lumpur, Singapore", value: "Asia/Singapore", offset: "UTC+08:00" },
  { label: "Irkutsk, Ulaan Bataar", value: "Asia/Irkutsk", offset: "UTC+08:00" },
  { label: "Perth", value: "Australia/Perth", offset: "UTC+08:00" },
  { label: "Taipei", value: "Asia/Taipei", offset: "UTC+08:00" },
  { label: "Osaka, Sapporo, Tokyo", value: "Asia/Tokyo", offset: "UTC+09:00" },
  { label: "Seoul", value: "Asia/Seoul", offset: "UTC+09:00" },
  { label: "Yakutsk", value: "Asia/Yakutsk", offset: "UTC+09:00" },
  { label: "Adelaide", value: "Australia/Adelaide", offset: "UTC+09:30" },
  { label: "Darwin", value: "Australia/Darwin", offset: "UTC+09:30" },
  { label: "Brisbane", value: "Australia/Brisbane", offset: "UTC+10:00" },
  { label: "Canberra, Melbourne, Sydney", value: "Australia/Sydney", offset: "UTC+10:00" },
  { label: "Hobart", value: "Australia/Hobart", offset: "UTC+10:00" },
  { label: "Guam, Port Moresby", value: "Pacific/Guam", offset: "UTC+10:00" },
  { label: "Vladivostok", value: "Asia/Vladivostok", offset: "UTC+10:00" },
  { label: "Magadan, Solomon Is., New Caledonia", value: "Asia/Magadan", offset: "UTC+11:00" },
  { label: "Auckland, Wellington", value: "Pacific/Auckland", offset: "UTC+12:00" },
  { label: "Fiji, Kamchatka, Marshall Is.", value: "Pacific/Fiji", offset: "UTC+12:00" },
  { label: "Nuku'alofa", value: "Pacific/Tongatapu", offset: "UTC+13:00" },
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
  const generatedId = React.useId();
  const selectorId = id ?? generatedId;

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return TIMEZONES;
    return TIMEZONES.filter(
      (tz) =>
        tz.label.toLowerCase().includes(q) ||
        tz.value.toLowerCase().includes(q) ||
        tz.offset.toLowerCase().includes(q)
    );
  }, [search]);

  const selected = TIMEZONES.find((tz) => tz.value === value);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 0);
    } else {
      setSearch("");
    }
  }, [open]);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label htmlFor={selectorId} className="text-sm font-medium">
          {label}
        </Label>
      )}
      <SelectPrimitive.Root
        value={value}
        onValueChange={onChange}
        open={open}
        onOpenChange={setOpen}
        disabled={disabled}
      >
        <SelectPrimitive.Trigger
          id={selectorId}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "[&>span]:line-clamp-1"
          )}
        >
          <span className="flex items-center gap-2 text-left">
            <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
            {selected ? (
              <span>
                <span className="font-medium">{selected.label}</span>
                <span className="ml-1.5 text-muted-foreground text-xs">
                  {selected.offset}
                </span>
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
              "relative z-50 min-w-[var(--radix-select-trigger-width)] max-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
            )}
            position="popper"
            sideOffset={4}
          >
            {/* Search box */}
            <div className="flex items-center border-b px-3 py-2 gap-2 sticky top-0 bg-popover z-10">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="Search timezones..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <SelectPrimitive.ScrollUpButton className="flex cursor-default items-center justify-center py-1 text-muted-foreground">
              <ChevronUp className="h-4 w-4" />
            </SelectPrimitive.ScrollUpButton>

            <SelectPrimitive.Viewport className="max-h-64 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  No timezones found.
                </div>
              ) : (
                filtered.map((tz) => (
                  <SelectPrimitive.Item
                    key={tz.value}
                    value={tz.value}
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-3 text-sm outline-none",
                      "focus:bg-accent focus:text-accent-foreground",
                      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    )}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      <SelectPrimitive.ItemIndicator>
                        <Check className="h-4 w-4" />
                      </SelectPrimitive.ItemIndicator>
                    </span>
                    <div className="flex flex-col min-w-0">
                      <SelectPrimitive.ItemText>
                        {tz.label}
                      </SelectPrimitive.ItemText>
                      <span className="text-xs text-muted-foreground">
                        {tz.offset} — {tz.value}
                      </span>
                    </div>
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
    </div>
  );
}