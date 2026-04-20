"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const options = [
  {
    value: "monthly",
    label: "Monthly",
    description: "Billed once every month",
  },
  {
    value: "yearly",
    label: "Yearly",
    description: "Billed once every year",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Set your own billing interval",
  },
] as const;

type BillingCycle = "monthly" | "yearly" | "custom";

interface BillingCycleSelectorProps {
  defaultValue?: BillingCycle;
  value?: BillingCycle;
  onValueChange?: (value: BillingCycle) => void;
  className?: string;
}

export function BillingCycleSelector({
  defaultValue = "monthly",
  value,
  onValueChange,
  className,
}: BillingCycleSelectorProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<BillingCycle>(
    defaultValue
  );
  const [customDays, setCustomDays] = React.useState<string>("");
  const [customError, setCustomError] = React.useState<string>("");

  const currentValue = isControlled ? value : internalValue;

  function handleValueChange(next: string) {
    const typed = next as BillingCycle;
    if (!isControlled) {
      setInternalValue(typed);
    }
    onValueChange?.(typed);
    if (typed !== "custom") {
      setCustomError("");
    }
  }

  function handleCustomDaysChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setCustomDays(raw);
    const parsed = parseInt(raw, 10);
    if (raw === "" || isNaN(parsed) || parsed < 1) {
      setCustomError("Enter a valid number of days (minimum 1).");
    } else {
      setCustomError("");
    }
  }

  const legendId = React.useId();
  const customInputId = React.useId();
  const customErrorId = React.useId();

  return (
    <fieldset
      className={cn(
        "border-0 m-0 p-0 min-w-0",
        className
      )}
      aria-labelledby={legendId}
    >
      <legend
        id={legendId}
        className="text-sm font-semibold text-foreground mb-3"
      >
        Billing cycle
      </legend>

      <RadioGroupPrimitive.Root
        value={currentValue}
        onValueChange={handleValueChange}
        orientation="vertical"
        aria-labelledby={legendId}
        className="flex flex-col gap-3"
      >
        {options.map((option) => {
          const itemId = `billing-cycle-${option.value}`;
          const isSelected = currentValue === option.value;

          return (
            <div key={option.value} className="flex flex-col gap-2">
              <div
                className={cn(
                  "flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:bg-muted/50"
                )}
                onClick={() => handleValueChange(option.value)}
              >
                <RadioGroupPrimitive.Item
                  id={itemId}
                  value={option.value}
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0 rounded-full border border-primary shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    isSelected ? "border-primary" : "border-muted-foreground"
                  )}
                  aria-invalid={
                    option.value === "custom" && customError !== ""
                      ? "true"
                      : undefined
                  }
                  aria-describedby={
                    option.value === "custom" && customError !== ""
                      ? customErrorId
                      : undefined
                  }
                >
                  <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                    <span className="block h-2 w-2 rounded-full bg-primary" />
                  </RadioGroupPrimitive.Indicator>
                </RadioGroupPrimitive.Item>

                <div className="flex flex-col gap-0.5">
                  <Label
                    htmlFor={itemId}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {option.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>

              {option.value === "custom" && isSelected && (
                <div className="ml-7 flex flex-col gap-1.5">
                  <Label
                    htmlFor={customInputId}
                    className="text-xs font-medium text-foreground"
                  >
                    Billing interval (days)
                  </Label>
                  <Input
                    id={customInputId}
                    type="number"
                    min={1}
                    placeholder="e.g. 90"
                    value={customDays}
                    onChange={handleCustomDaysChange}
                    aria-invalid={customError !== "" ? "true" : undefined}
                    aria-describedby={
                      customError !== "" ? customErrorId : undefined
                    }
                    className={cn(
                      "h-8 w-40 text-sm",
                      customError !== ""
                        ? "border-destructive focus-visible:ring-destructive"
                        : ""
                    )}
                  />
                  {customError !== "" && (
                    <p
                      id={customErrorId}
                      className="text-xs text-destructive"
                      role="alert"
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