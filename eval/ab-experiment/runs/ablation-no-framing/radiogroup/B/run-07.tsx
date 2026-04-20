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
] as const;

type BillingValue = (typeof options)[number]["value"];

interface BillingCycleSelectorProps {
  defaultValue?: BillingValue;
  value?: BillingValue;
  onValueChange?: (value: BillingValue) => void;
  disabled?: boolean;
}

export function BillingCycleSelector({
  defaultValue = "monthly",
  value,
  onValueChange,
  disabled = false,
}: BillingCycleSelectorProps) {
  const [customDays, setCustomDays] = React.useState<string>("");
  const legendId = React.useId();

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<BillingValue>(
    defaultValue
  );
  const selectedValue = isControlled ? value : internalValue;

  const handleValueChange = (next: string) => {
    const typedNext = next as BillingValue;
    if (!isControlled) {
      setInternalValue(typedNext);
    }
    onValueChange?.(typedNext);
  };

  return (
    <fieldset
      aria-labelledby={legendId}
      className="border-0 m-0 p-0"
      disabled={disabled}
    >
      <legend
        id={legendId}
        className="text-sm font-semibold text-foreground mb-3"
      >
        Billing cycle
      </legend>

      <RadioGroupPrimitive.Root
        value={selectedValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        aria-labelledby={legendId}
        className="flex flex-col gap-3"
      >
        {options.map((option) => {
          const itemId = `billing-cycle-${option.value}`;
          const descId = `billing-cycle-${option.value}-desc`;
          const isSelected = selectedValue === option.value;

          return (
            <div key={option.value}>
              <label
                htmlFor={itemId}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors",
                  "hover:bg-muted/50",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-background",
                  disabled && "cursor-not-allowed opacity-50"
                )}
              >
                <RadioGroupPrimitive.Item
                  id={itemId}
                  value={option.value}
                  aria-describedby={descId}
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0 rounded-full border border-primary",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  )}
                >
                  <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                    <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                  </RadioGroupPrimitive.Indicator>
                </RadioGroupPrimitive.Item>

                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-sm font-medium leading-none text-foreground">
                    {option.label}
                  </span>
                  <span
                    id={descId}
                    className="text-xs text-muted-foreground leading-snug"
                  >
                    {option.description}
                  </span>
                </div>
              </label>

              {option.value === "custom" && isSelected && (
                <div className="mt-2 ml-11 flex flex-col gap-1.5">
                  <Label
                    htmlFor="billing-cycle-custom-days"
                    className="text-xs font-medium text-foreground"
                  >
                    Interval in days
                  </Label>
                  <Input
                    id="billing-cycle-custom-days"
                    type="number"
                    min={1}
                    max={365}
                    placeholder="e.g. 90"
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                    disabled={disabled}
                    className="h-8 w-40 text-sm"
                  />
                  {customDays && (
                    <p className="text-xs text-muted-foreground">
                      Billed every{" "}
                      <span className="font-medium text-foreground">
                        {customDays}
                      </span>{" "}
                      {Number(customDays) === 1 ? "day" : "days"}
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