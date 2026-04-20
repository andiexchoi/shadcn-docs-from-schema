"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const TIMEZONE_GROUPS: { label: string; zones: { value: string; label: string }[] }[] = [
  {
    label: "Africa",
    zones: [
      { value: "Africa/Abidjan", label: "Abidjan (GMT+0)" },
      { value: "Africa/Cairo", label: "Cairo (GMT+2)" },
      { value: "Africa/Johannesburg", label: "Johannesburg (GMT+2)" },
      { value: "Africa/Lagos", label: "Lagos (GMT+1)" },
      { value: "Africa/Nairobi", label: "Nairobi (GMT+3)" },
    ],
  },
  {
    label: "Americas",
    zones: [
      { value: "America/Anchorage", label: "Anchorage (GMT-9)" },
      { value: "America/Chicago", label: "Chicago (GMT-6)" },
      { value: "America/Denver", label: "Denver (GMT-7)" },
      { value: "America/Los_Angeles", label: "Los Angeles (GMT-8)" },
      { value: "America/Mexico_City", label: "Mexico City (GMT-6)" },
      { value: "America/New_York", label: "New York (GMT-5)" },
      { value: "America/Phoenix", label: "Phoenix (GMT-7)" },
      { value: "America/Sao_Paulo", label: "São Paulo (GMT-3)" },
      { value: "America/Toronto", label: "Toronto (GMT-5)" },
      { value: "America/Vancouver", label: "Vancouver (GMT-8)" },
    ],
  },
  {
    label: "Asia",
    zones: [
      { value: "Asia/Bangkok", label: "Bangkok (GMT+7)" },
      { value: "Asia/Dubai", label: "Dubai (GMT+4)" },
      { value: "Asia/Hong_Kong", label: "Hong Kong (GMT+8)" },
      { value: "Asia/Jakarta", label: "Jakarta (GMT+7)" },
      { value: "Asia/Kolkata", label: "Kolkata (GMT+5:30)" },
      { value: "Asia/Seoul", label: "Seoul (GMT+9)" },
      { value: "Asia/Shanghai", label: "Shanghai (GMT+8)" },
      { value: "Asia/Singapore", label: "Singapore (GMT+8)" },
      { value: "Asia/Tokyo", label: "Tokyo (GMT+9)" },
    ],
  },
  {
    label: "Atlantic",
    zones: [
      { value: "Atlantic/Reykjavik", label: "Reykjavik (GMT+0)" },
    ],
  },
  {
    label: "Australia",
    zones: [
      { value: "Australia/Adelaide", label: "Adelaide (GMT+9:30)" },
      { value: "Australia/Brisbane", label: "Brisbane (GMT+10)" },
      { value: "Australia/Melbourne", label: "Melbourne (GMT+11)" },
      { value: "Australia/Perth", label: "Perth (GMT+8)" },
      { value: "Australia/Sydney", label: "Sydney (GMT+11)" },
    ],
  },
  {
    label: "Europe",
    zones: [
      { value: "Europe/Amsterdam", label: "Amsterdam (GMT+1)" },
      { value: "Europe/Berlin", label: "Berlin (GMT+1)" },
      { value: "Europe/Istanbul", label: "Istanbul (GMT+3)" },
      { value: "Europe/London", label: "London (GMT+0)" },
      { value: "Europe/Madrid", label: "Madrid (GMT+1)" },
      { value: "Europe/Moscow", label: "Moscow (GMT+3)" },
      { value: "Europe/Paris", label: "Paris (GMT+1)" },
      { value: "Europe/Rome", label: "Rome (GMT+1)" },
      { value: "Europe/Zurich", label: "Zurich (GMT+1)" },
    ],
  },
  {
    label: "Pacific",
    zones: [
      { value: "Pacific/Auckland", label: "Auckland (GMT+13)" },
      { value: "Pacific/Honolulu", label: "Honolulu (GMT-10)" },
    ],
  },
  {
    label: "UTC",
    zones: [
      { value: "UTC", label: "UTC (GMT+0)" },
    ],
  },
];

// ── Local Select primitives ───────────────────────────────────────────────────

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
      "placeholder:text-muted-foreground",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "aria-invalid:border-destructive aria-invalid:ring-destructive/30",
      "[&>span]:line-clamp-1",
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

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
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
    className={cn("flex cursor-default items-center justify-center py-1", className)}
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
      position={position}
      className={cn(
        "relative z-50 max-h-72 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
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
    className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)}
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
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      "focus:bg-accent focus:text-accent-foreground",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
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

// ── TimezoneSelector ──────────────────────────────────────────────────────────

export interface TimezoneSelectorProps {
  /** Controlled value — an IANA timezone string, e.g. "America/New_York" */
  value?: string;
  /** Called when the user picks a timezone */
  onValueChange?: (value: string) => void;
  /** Default value when uncontrolled */
  defaultValue?: string;
  /** Whether the selector is disabled */
  disabled?: boolean;
  /** Mark the field as invalid */
  invalid?: boolean;
  /** Label text rendered above the trigger */
  label?: string;
  /** Helper or error text rendered below the trigger */
  helperText?: string;
  /** Custom class applied to the trigger element */
  className?: string;
  /** Custom id for the trigger (auto-generated if omitted) */
  id?: string;
}

export function TimezoneSelector({
  value,
  onValueChange,
  defaultValue,
  disabled = false,
  invalid = false,
  label,
  helperText,
  className,
  id: idProp,
}: TimezoneSelectorProps) {
  const generatedId = React.useId();
  const id = idProp ?? generatedId;
  const helperId = `${id}-helper`;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <Label htmlFor={id} className={cn(invalid && "text-destructive")}>
          {label}
        </Label>
      )}

      <SelectPrimitive.Root
        value={value}
        onValueChange={onValueChange}
        defaultValue={defaultValue}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          className={cn("w-full", className)}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={helperText ? helperId : undefined}
        >
          <SelectPrimitive.Value placeholder="Timezone" />
        </SelectTrigger>

        <SelectContent position="popper">
          {TIMEZONE_GROUPS.map((group, groupIndex) => (
            <React.Fragment key={group.label}>
              {groupIndex > 0 && <SelectSeparator />}
              <SelectPrimitive.Group>
                <SelectLabel>{group.label}</SelectLabel>
                {group.zones.map((zone) => (
                  <SelectItem key={zone.value} value={zone.value}>
                    {zone.label}
                  </SelectItem>
                ))}
              </SelectPrimitive.Group>
            </React.Fragment>
          ))}
        </SelectContent>
      </SelectPrimitive.Root>

      {helperText && (
        <p
          id={helperId}
          className={cn(
            "text-xs",
            invalid ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {helperText}
        </p>
      )}
    </div>
  );
}