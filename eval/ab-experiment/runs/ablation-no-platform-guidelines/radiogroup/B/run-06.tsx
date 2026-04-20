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
    description: "Billed once per month",
  },
  {
    value: "yearly",
    label: "Yearly",
    description: "Billed once per year — save up to 20%",
  },
  {
    value: "custom",
    label: "Custom interval",
    description: "Specify your own billing period",
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
  const legendId = React.useId();

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  function handleValueChange(next: string) {
    const nextCycle = next as BillingCycle;
    if (!isControlled) {
      setInternalValue(nextCycle);
    }
    onValueChange?.(nextCycle);
  }

  return (
    <fieldset
      className="border-0 m-0 p-0"
      aria-labelledby={legendId}
    >
      <legend
        id={legendId}
        className="text-sm font-semibold text-foreground mb-3"
      >
        Billing cycle
      </legend>

      <RadioGroupPrimitive.Root
        role="radiogroup"
        aria-labelledby={legendId}
        value={currentValue}
        onValueChange={handleValueChange}
        orientation="vertical"
        className="flex flex-col gap-3"
      >
        {options.map((option) => {
          const itemId = `billing-cycle-${option.value}`;
          const descId = `billing-cycle-${option.value}-desc`;
          const isSelected = currentValue === option.value;

          return (
            <div
              key={option.value}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 transition-colors cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary/50 hover:bg-muted/40"
              )}
              onClick={() => handleValueChange(option.value)}
            >
              <RadioGroupPrimitive.Item
                id={itemId}
                value={option.value}
                aria-describedby={descId}
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0 rounded-full border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors",
                  isSelected
                    ? "border-primary"
                    : "border-muted-foreground"
                )}
              >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                  <span className="block h-2 w-2 rounded-full bg-primary" />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>

              <div className="flex-1 min-w-0">
                <Label
                  htmlFor={itemId}
                  className="text-sm font-medium text-foreground cursor-pointer leading-none"
                >
                  {option.label}
                </Label>
                <p
                  id={descId}
                  className="mt-1 text-xs text-muted-foreground"
                >
                  {option.description}
                </p>

                {option.value === "custom" && isSelected && (
                  <div
                    className="mt-3 flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      id="custom-days-input"
                      type="number"
                      min={1}
                      placeholder="e.g. 14"
                      value={customDays}
                      onChange={(e) => setCustomDays(e.target.value)}
                      className="w-28 h-8 text-sm"
                      aria-label="Number of days in custom billing cycle"
                    />
                    <Label
                      htmlFor="custom-days-input"
                      className="text-sm text-muted-foreground cursor-default"
                    >
                      days
                    </Label>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </RadioGroupPrimitive.Root>
    </fieldset>
  );
}