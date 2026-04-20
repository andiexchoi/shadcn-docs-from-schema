"use client";

import * as React from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type BillingCycle = "monthly" | "yearly" | "custom";

interface BillingCycleSelectorProps {
  defaultValue?: BillingCycle;
  onChange?: (value: BillingCycle, customDays?: number) => void;
  className?: string;
}

export function BillingCycleSelector({
  defaultValue = "monthly",
  onChange,
  className,
}: BillingCycleSelectorProps) {
  const [selected, setSelected] = React.useState<BillingCycle>(defaultValue);
  const [customDays, setCustomDays] = React.useState<string>("30");
  const [customError, setCustomError] = React.useState<string>("");

  const handleValueChange = (value: string) => {
    const cycle = value as BillingCycle;
    setSelected(cycle);
    setCustomError("");
    if (cycle !== "custom") {
      onChange?.(cycle);
    } else {
      const days = parseInt(customDays, 10);
      if (!isNaN(days) && days > 0) {
        onChange?.(cycle, days);
      }
    }
  };

  const handleCustomDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setCustomDays(raw);
    const days = parseInt(raw, 10);
    if (!raw || isNaN(days) || days <= 0) {
      setCustomError("Please enter a valid number of days (> 0).");
    } else {
      setCustomError("");
      onChange?.("custom", days);
    }
  };

  const options: { value: BillingCycle; label: string; description: string }[] =
    [
      {
        value: "monthly",
        label: "Monthly",
        description: "Billed every month",
      },
      {
        value: "yearly",
        label: "Yearly",
        description: "Billed once a year — save up to 20%",
      },
      {
        value: "custom",
        label: "Custom",
        description: "Define your own billing interval",
      },
    ];

  return (
    <div className={cn("w-full max-w-md space-y-3", className)}>
      <p className="text-sm font-semibold text-foreground">Billing Cycle</p>
      <RadioGroup.Root
        value={selected}
        onValueChange={handleValueChange}
        className="space-y-2"
        aria-label="Billing cycle"
      >
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <div key={option.value} className="flex flex-col gap-2">
              <label
                htmlFor={`billing-${option.value}`}
                className={cn(
                  "flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-background hover:bg-muted/50"
                )}
              >
                <RadioGroup.Item
                  id={`billing-${option.value}`}
                  value={option.value}
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isSelected
                      ? "border-primary"
                      : "border-muted-foreground"
                  )}
                >
                  <RadioGroup.Indicator className="block h-2.5 w-2.5 rounded-full bg-primary" />
                </RadioGroup.Item>

                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-primary" : "text-foreground"
                    )}
                  >
                    {option.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </label>

              {option.value === "custom" && isSelected && (
                <div className="ml-9 space-y-1">
                  <Label
                    htmlFor="custom-days-input"
                    className="text-xs font-medium text-foreground"
                  >
                    Number of days
                  </Label>
                  <Input
                    id="custom-days-input"
                    type="number"
                    min={1}
                    value={customDays}
                    onChange={handleCustomDaysChange}
                    placeholder="e.g. 90"
                    className={cn(
                      "h-8 w-32 text-sm",
                      customError && "border-destructive focus-visible:ring-destructive"
                    )}
                    aria-describedby={
                      customError ? "custom-days-error" : undefined
                    }
                  />
                  {customError && (
                    <p
                      id="custom-days-error"
                      className="text-xs text-destructive"
                    >
                      {customError}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </RadioGroup.Root>

      <div className="rounded-md bg-muted px-4 py-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Selected: </span>
          {selected === "custom"
            ? `Custom — every ${customDays || "?"} day${
                parseInt(customDays, 10) === 1 ? "" : "s"
              }`
            : selected.charAt(0).toUpperCase() + selected.slice(1)}
        </p>
      </div>
    </div>
  );
}

export default BillingCycleSelector;