"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type BillingCycle = "monthly" | "yearly" | "custom";

interface BillingCycleSelectorProps {
  value?: BillingCycle;
  onValueChange?: (value: BillingCycle) => void;
  defaultValue?: BillingCycle;
}

const options: { value: BillingCycle; label: string; description: string }[] = [
  {
    value: "monthly",
    label: "Monthly",
    description: "Billed every month. Cancel anytime.",
  },
  {
    value: "yearly",
    label: "Yearly",
    description: "Billed once per year. Save up to 20%.",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Set your own billing interval.",
  },
];

export function BillingCycleSelector({
  value,
  onValueChange,
  defaultValue = "monthly",
}: BillingCycleSelectorProps) {
  const [internalValue, setInternalValue] = React.useState<BillingCycle>(
    value ?? defaultValue
  );
  const [customDays, setCustomDays] = React.useState<string>("");
  const [customError, setCustomError] = React.useState<string>("");

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const legendId = React.useId();

  function handleValueChange(next: string) {
    const nextCycle = next as BillingCycle;
    if (!isControlled) {
      setInternalValue(nextCycle);
    }
    onValueChange?.(nextCycle);
    if (nextCycle !== "custom") {
      setCustomError("");
    }
  }

  function handleCustomDaysChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setCustomDays(raw);
    const num = Number(raw);
    if (raw === "" || !Number.isInteger(num) || num < 1) {
      setCustomError("Enter a whole number of days (1 or more).");
    } else {
      setCustomError("");
    }
  }

  const customInputId = React.useId();
  const customErrorId = React.useId();

  return (
    <fieldset
      className="border-0 m-0 p-0"
      aria-labelledby={legendId}
    >
      <legend
        id={legendId}
        className="text-base font-semibold text-foreground mb-4"
      >
        Billing cycle
      </legend>

      <RadioGroupPrimitive.Root
        value={selectedValue}
        onValueChange={handleValueChange}
        orientation="vertical"
        aria-labelledby={legendId}
        className="flex flex-col gap-3"
      >
        {options.map((option) => {
          const itemId = `billing-cycle-${option.value}`;
          const descId = `billing-cycle-${option.value}-desc`;
          const isSelected = selectedValue === option.value;

          return (
            <div key={option.value} className="flex flex-col gap-2">
              <div
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-4 transition-colors cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:bg-muted/50"
                )}
              >
                <RadioGroupPrimitive.Item
                  id={itemId}
                  value={option.value}
                  aria-describedby={descId}
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  )}
                >
                  <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                    <span className="block h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                  </RadioGroupPrimitive.Indicator>
                </RadioGroupPrimitive.Item>

                <div className="flex flex-col gap-0.5 flex-1">
                  <Label
                    htmlFor={itemId}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p
                    id={descId}
                    className="text-sm text-muted-foreground"
                  >
                    {option.description}
                  </p>
                </div>
              </div>

              {option.value === "custom" && isSelected && (
                <div className="ml-7 flex flex-col gap-1.5">
                  <Label htmlFor={customInputId} className="text-sm font-medium">
                    Interval (days)
                  </Label>
                  <Input
                    id={customInputId}
                    type="number"
                    min={1}
                    step={1}
                    placeholder="e.g. 14"
                    value={customDays}
                    onChange={handleCustomDaysChange}
                    aria-invalid={customError ? "true" : undefined}
                    aria-describedby={customError ? customErrorId : undefined}
                    className={cn(
                      "max-w-[180px]",
                      customError && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {customError && (
                    <p
                      id={customErrorId}
                      role="alert"
                      className="text-sm text-destructive"
                    >
                      {customError}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </RadioGroupPrimitive.Root>
    </fieldset>
  );
}