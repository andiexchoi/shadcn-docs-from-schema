"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
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
    if (cycle !== "custom") {
      setCustomError("");
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
    if (raw === "" || isNaN(days) || days <= 0) {
      setCustomError("Please enter a valid number of days (greater than 0).");
    } else if (days > 3650) {
      setCustomError("Maximum allowed value is 3650 days.");
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
        description: "Choose your own billing interval",
      },
    ];

  return (
    <div className={cn("w-full max-w-md space-y-4", className)}>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Billing Cycle</h2>
        <p className="text-sm text-muted-foreground">
          Select how often you'd like to be billed.
        </p>
      </div>

      <RadioGroupPrimitive.Root
        value={selected}
        onValueChange={handleValueChange}
        className="space-y-3"
      >
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <div key={option.value}>
              <Label
                htmlFor={option.value}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-background"
                )}
              >
                <RadioGroupPrimitive.Item
                  id={option.value}
                  value={option.value}
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0 rounded-full border border-primary shadow",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                >
                  <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </RadioGroupPrimitive.Indicator>
                </RadioGroupPrimitive.Item>

                <div className="flex-1 space-y-0.5">
                  <span className="block text-sm font-medium leading-none">
                    {option.label}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {option.description}
                  </span>
                </div>

                {option.value === "yearly" && (
                  <span className="self-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    Save 20%
                  </span>
                )}
              </Label>

              {option.value === "custom" && isSelected && (
                <div className="mt-2 space-y-2 rounded-xl border border-border bg-muted/40 px-4 py-3">
                  <Label
                    htmlFor="custom-days"
                    className="text-sm font-medium text-foreground"
                  >
                    Number of days per cycle
                  </Label>
                  <Input
                    id="custom-days"
                    type="number"
                    min={1}
                    max={3650}
                    value={customDays}
                    onChange={handleCustomDaysChange}
                    placeholder="e.g. 30"
                    className={cn(
                      "w-full",
                      customError
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    )}
                  />
                  {customError ? (
                    <p className="text-xs text-destructive">{customError}</p>
                  ) : (
                    customDays && (
                      <p className="text-xs text-muted-foreground">
                        You will be billed every{" "}
                        <span className="font-semibold text-foreground">
                          {customDays}
                        </span>{" "}
                        day{parseInt(customDays, 10) !== 1 ? "s" : ""}.
                      </p>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </RadioGroupPrimitive.Root>
    </div>
  );
}