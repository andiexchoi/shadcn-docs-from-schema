"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const options = [
  {
    value: "monthly",
    label: "Monthly",
    description: "Billed every month",
  },
  {
    value: "yearly",
    label: "Yearly",
    description: "Billed once a year — save 20%",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Set your own billing interval",
  },
] as const;

type BillingCycle = (typeof options)[number]["value"];

interface BillingCycleSelectorProps {
  defaultValue?: BillingCycle;
  value?: BillingCycle;
  onValueChange?: (value: BillingCycle) => void;
  disabled?: boolean;
}

export function BillingCycleSelector({
  defaultValue = "monthly",
  value,
  onValueChange,
  disabled = false,
}: BillingCycleSelectorProps) {
  const legendId = React.useId();

  return (
    <fieldset
      className="border-0 m-0 p-0"
      aria-labelledby={legendId}
      disabled={disabled}
    >
      <legend
        id={legendId}
        className="text-sm font-semibold text-foreground mb-3"
      >
        Billing cycle
      </legend>

      <RadioGroupPrimitive.Root
        defaultValue={defaultValue}
        value={value}
        onValueChange={onValueChange as (value: string) => void}
        disabled={disabled}
        aria-labelledby={legendId}
        className="flex flex-col gap-3"
      >
        {options.map((option) => (
          <div
            key={option.value}
            className={cn(
              "flex items-start gap-3 rounded-lg border border-border bg-background p-4 transition-colors",
              "hover:bg-accent hover:border-accent-foreground/20",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <RadioGroupPrimitive.Item
              id={`billing-cycle-${option.value}`}
              value={option.value}
              disabled={disabled}
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0 rounded-full border border-primary shadow",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              )}
            >
              <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                <span className="block h-1.5 w-1.5 rounded-full bg-white" />
              </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>

            <div className="flex flex-col gap-0.5 leading-none">
              <Label
                htmlFor={`billing-cycle-${option.value}`}
                className={cn(
                  "text-sm font-medium text-foreground cursor-pointer",
                  disabled && "cursor-not-allowed"
                )}
              >
                {option.label}
              </Label>
              <p className="text-xs text-muted-foreground">
                {option.description}
              </p>
            </div>
          </div>
        ))}
      </RadioGroupPrimitive.Root>
    </fieldset>
  );
}