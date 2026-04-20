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
    description: "Billed every month. Cancel any time.",
  },
  {
    value: "yearly",
    label: "Yearly",
    description: "Billed once per year. Save up to 20%.",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Set your own billing interval in days.",
  },
];

export function BillingCycleSelector({
  value,
  onValueChange,
  defaultValue = "monthly",
}: BillingCycleSelectorProps) {
  const [customDays, setCustomDays] = React.useState<string>("");
  const legendId = React.useId();

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<BillingCycle>(defaultValue);
  const selectedValue = isControlled ? value : internalValue;

  function handleValueChange(next: string) {
    const nextCycle = next as BillingCycle;
    if (!isControlled) {
      setInternalValue(nextCycle);
    }
    onValueChange?.(nextCycle);
  }

  return (
    <fieldset className="border-0 m-0 p-0">
      <legend
        id={legendId}
        className="text-sm font-semibold text-foreground mb-3"
      >
        Billing cycle
      </legend>

      <RadioGroupPrimitive.Root
        value={selectedValue}
        onValueChange={handleValueChange}
        aria-labelledby={legendId}
        orientation="vertical"
        className="flex flex-col gap-3"
      >
        {options.map((option) => {
          const itemId = `billing-cycle-${option.value}`;
          const descId = `billing-cycle-${option.value}-desc`;
          const isSelected = selectedValue === option.value;

          return (
            <div
              key={option.value}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 transition-colors cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:bg-muted/50"
              )}
              onClick={() => handleValueChange(option.value)}
            >
              <RadioGroupPrimitive.Item
                id={itemId}
                value={option.value}
                aria-describedby={descId}
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>

              <div className="flex flex-col gap-1 flex-1">
                <Label
                  htmlFor={itemId}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {option.label}
                </Label>
                <p
                  id={descId}
                  className="text-xs text-muted-foreground"
                >
                  {option.description}
                </p>

                {option.value === "custom" && isSelected && (
                  <div className="mt-3 flex flex-col gap-1.5">
                    <Label
                      htmlFor="billing-cycle-custom-days"
                      className="text-xs font-medium text-foreground"
                    >
                      Interval (days)
                    </Label>
                    <Input
                      id="billing-cycle-custom-days"
                      type="number"
                      min={1}
                      placeholder="e.g. 14"
                      value={customDays}
                      onChange={(e) => setCustomDays(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 w-36 text-sm"
                    />
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