"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const options = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "custom", label: "Custom" },
] as const;

type BillingCycle = (typeof options)[number]["value"];

interface BillingCycleSelectorProps {
  value?: BillingCycle;
  onValueChange?: (value: BillingCycle) => void;
  defaultValue?: BillingCycle;
}

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

  const controlled = value !== undefined;
  const selectedValue = controlled ? value : internalValue;

  const legendId = React.useId();
  const customInputId = React.useId();
  const customErrorId = React.useId();

  function handleValueChange(next: string) {
    const nextCycle = next as BillingCycle;
    if (!controlled) {
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
      setCustomError("Enter a whole number of days (minimum 1).");
    } else {
      setCustomError("");
    }
  }

  return (
    <fieldset
      className="border border-border rounded-xl p-6 space-y-4 w-full max-w-sm"
      aria-labelledby={legendId}
    >
      <legend
        id={legendId}
        className="text-sm font-semibold text-foreground px-1"
      >
        Billing cycle
      </legend>

      <RadioGroupPrimitive.Root
        role="radiogroup"
        aria-labelledby={legendId}
        value={selectedValue}
        onValueChange={handleValueChange}
        orientation="vertical"
        className="flex flex-col gap-3"
      >
        {options.map((option) => {
          const itemId = `billing-cycle-${option.value}`;
          return (
            <div key={option.value} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <RadioGroupPrimitive.Item
                  id={itemId}
                  value={option.value}
                  className={cn(
                    "h-4 w-4 rounded-full border border-input bg-background",
                    "text-primary shadow-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                  )}
                >
                  <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </RadioGroupPrimitive.Indicator>
                </RadioGroupPrimitive.Item>

                <Label
                  htmlFor={itemId}
                  className="cursor-pointer text-sm font-medium text-foreground"
                >
                  {option.label}
                </Label>

                {option.value === "yearly" && (
                  <span className="ml-auto inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    Save 20%
                  </span>
                )}
              </div>

              {option.value === "custom" && selectedValue === "custom" && (
                <div className="ml-7 flex flex-col gap-1">
                  <Label
                    htmlFor={customInputId}
                    className="text-xs text-muted-foreground"
                  >
                    Number of days
                  </Label>
                  <Input
                    id={customInputId}
                    type="number"
                    min={1}
                    step={1}
                    placeholder="e.g. 90"
                    value={customDays}
                    onChange={handleCustomDaysChange}
                    aria-invalid={customError ? "true" : undefined}
                    aria-describedby={customError ? customErrorId : undefined}
                    className="h-8 w-36 text-sm"
                  />
                  {customError && (
                    <p
                      id={customErrorId}
                      role="alert"
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
      </RadioGroupPrimitive.Root>

      <p className="text-xs text-muted-foreground pt-1">
        {selectedValue === "monthly" && "Billed every month. Cancel anytime."}
        {selectedValue === "yearly" &&
          "Billed once per year. Best value for long-term plans."}
        {selectedValue === "custom" &&
          "Set a custom billing interval in days."}
      </p>
    </fieldset>
  );
}