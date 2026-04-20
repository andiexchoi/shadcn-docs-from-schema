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
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const TIMEZONE_GROUPS: {
  label: string;
  timezones: { value: string; label: string; offset: string }[];
}[] = [
  {
    label: "Americas",
    timezones: [
      { value: "America/New_York", label: "Eastern Time", offset: "UTC−5/−4" },
      { value: "America/Chicago", label: "Central Time", offset: "UTC−6/−5" },
      { value: "America/Denver", label: "Mountain Time", offset: "UTC−7/−6" },
      {
        value: "America/Los_Angeles",
        label: "Pacific Time",
        offset: "UTC−8/−7",
      },
      { value: "America/Anchorage", label: "Alaska Time", offset: "UTC−9/−8" },
      { value: "Pacific/Honolulu", label: "Hawaii Time", offset: "UTC−10" },
      {
        value: "America/Sao_Paulo",
        label: "Brasília Time",
        offset: "UTC−3/−2",
      },
      {
        value: "America/Argentina/Buenos_Aires",
        label: "Argentina Time",
        offset: "UTC−3",
      },
      { value: "America/Toronto", label: "Eastern Time (CA)", offset: "UTC−5/−4" },
      { value: "America/Vancouver", label: "Pacific Time (CA)", offset: "UTC−8/−7" },
      { value: "America/Mexico_City", label: "Central Time (MX)", offset: "UTC−6/−5" },
    ],
  },
  {
    label: "Europe & Africa",
    timezones: [
      {
        value: "Europe/London",
        label: "Greenwich Mean Time",
        offset: "UTC+0/+1",
      },
      {
        value: "Europe/Paris",
        label: "Central European Time",
        offset: "UTC+1/+2",
      },
      {
        value: "Europe/Berlin",
        label: "Central European Time",
        offset: "UTC+1/+2",
      },
      {
        value: "Europe/Moscow",
        label: "Moscow Standard Time",
        offset: "UTC+3",
      },
      {
        value: "Europe/Istanbul",
        label: "Turkey Time",
        offset: "UTC+3",
      },
      { value: "Africa/Cairo", label: "Eastern European Time", offset: "UTC+2" },
      { value: "Africa/Nairobi", label: "East Africa Time", offset: "UTC+3" },
      { value: "Africa/Johannesburg", label: "South Africa Time", offset: "UTC+2" },
    ],
  },
  {
    label: "Asia & Pacific",
    timezones: [
      { value: "Asia/Dubai", label: "Gulf Standard Time", offset: "UTC+4" },
      { value: "Asia/Kolkata", label: "India Standard Time", offset: "UTC+5:30" },
      { value: "Asia/Dhaka", label: "Bangladesh Time", offset: "UTC+6" },
      { value: "Asia/Bangkok", label: "Indochina Time", offset: "UTC+7" },
      {
        value: "Asia/Shanghai",
        label: "China Standard Time",
        offset: "UTC+8",
      },
      {
        value: "Asia/Singapore",
        label: "Singapore Time",
        offset: "UTC+8",
      },
      { value: "Asia/Tokyo", label: "Japan Standard Time", offset: "UTC+9" },
      {
        value: "Asia/Seoul",
        label: "Korea Standard Time",
        offset: "UTC+9",
      },
      {
        value: "Australia/Sydney",
        label: "Australian Eastern Time",
        offset: "UTC+10/+11",
      },
      {
        value: "Pacific/Auckland",
        label: "New Zealand Time",
        offset: "UTC+12/+13",
      },
    ],
  },
  {
    label: "UTC",
    timezones: [
      { value: "UTC", label: "Coordinated Universal Time", offset: "UTC+0" },
    ],
  },
];

export interface TimezoneSelectorProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  id?: string;
  className?: string;
  triggerClassName?: string;
  "aria-invalid"?: boolean;
  required?: boolean;
}

export function TimezoneSelector({
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  placeholder = "Timezone",
  label,
  id,
  className,
  triggerClassName,
  "aria-invalid": ariaInvalid,
  required,
}: TimezoneSelectorProps) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label
          htmlFor={selectId}
          className={cn(
            "text-sm font-medium leading-none",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          {label}
          {required && (
            <span className="ml-1 text-destructive" aria-hidden="true">
              *
            </span>
          )}
        </Label>
      )}
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={selectId}
          aria-invalid={ariaInvalid}
          aria-required={required}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            ariaInvalid &&
              "border-destructive focus:ring-destructive",
            triggerClassName
          )}
        >
          <SelectValue placeholder={placeholder}>
            {value
              ? (() => {
                  for (const group of TIMEZONE_GROUPS) {
                    const tz = group.timezones.find((t) => t.value === value);
                    if (tz) {
                      return (
                        <span className="flex items-center gap-2 truncate">
                          <span className="truncate">{tz.label}</span>
                          <span className="shrink-0 text-muted-foreground">
                            {tz.offset}
                          </span>
                        </span>
                      );
                    }
                  }
                  return value;
                })()
              : undefined}
          </SelectValue>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </SelectTrigger>

        <SelectContent
          className={cn(
            "relative z-50 max-h-80 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
          position="popper"
          sideOffset={4}
        >
          <div className="overflow-y-auto max-h-80 p-1">
            {TIMEZONE_GROUPS.map((group, groupIndex) => (
              <React.Fragment key={group.label}>
                {groupIndex > 0 && (
                  <div className="-mx-1 my-1 h-px bg-muted" role="separator" aria-orientation="horizontal" />
                )}
                <SelectGroup>
                  <SelectLabel className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    {group.label}
                  </SelectLabel>
                  {group.timezones.map((tz) => (
                    <SelectItem
                      key={tz.value}
                      value={tz.value}
                      className={cn(
                        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
                        "focus:bg-accent focus:text-accent-foreground",
                        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      )}
                    >
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        <SelectItemIndicator>
                          <Check className="h-4 w-4" />
                        </SelectItemIndicator>
                      </span>
                      <span className="flex items-center justify-between gap-4 w-full">
                        <span className="truncate">{tz.label}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {tz.offset}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </React.Fragment>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}

// Re-export SelectItemIndicator from radix since it's used inline
import { SelectItemIndicator } from "@radix-ui/react-select";