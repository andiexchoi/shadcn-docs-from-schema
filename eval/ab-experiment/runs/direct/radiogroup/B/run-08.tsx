"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const cycles = [
  {
    id: "cycle-monthly",
    value: "monthly",
    label: "Monthly",
    description: "Billed every month",
  },
  {
    id: "cycle-yearly",
    value: "yearly",
    label: "Yearly",
    description: "Billed once per year",
  },
  {
    id: "cycle-custom",
    value: "custom",
    label: "Custom",
    description: "Set your own billing interval",
  },
] as const;

type CycleValue = (typeof cycles)[number]["value"];

interface BillingCycleSelectorProps {
  defaultValue?: CycleValue;
  value?: CycleValue;
  onValueChange?: (value: CycleValue) => void;
  className?: string;
}

export function BillingCycleSelector({
  defaultValue = "monthly",
  value,
  onValueChange,
  className,
}: BillingCycleSelectorProps) {
  const legendId = React.useId();
  const [internalValue, setInternalValue] = React.useState<CycleValue>(
    value ?? defaultValue
  );
  const [customDays, setCustomDays] = React.useState<string>("");
  const [customError, setCustomError] = React.useState<string>("");

  const controlled = value !== undefined;
  const selectedValue: CycleValue = controlled ? value : internalValue;

  function handleValueChange(next: string) {
    const nextCycle = next as CycleValue;
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
    if (raw === "" || isNaN(num) || num < 1 || !Number.isInteger(num)) {
      setCustomError("Enter a whole number of days (minimum 1).");
    } else {
      setCustomError("");
    }
  }

  return (
    <div className={cn("w-full max-w-sm space-y-4", className)}>
      <fieldset className="border-0 m-0 p-0">
        <legend
          id={legendId}
          className="text-sm font-semibold text-foreground mb-3"
        >
          Billing cycle
        </legend>

        <RadioGroupPrimitive.Root
          aria-labelledby={legendId}
          value={selectedValue}
          onValueChange={handleValueChange}
          className="flex flex-col gap-3"
        >
          {cycles.map((cycle) => (
            <div key={cycle.value} className="flex items-start gap-3">
              <RadioGroupPrimitive.Item
                id={cycle.id}
                value={cycle.value}
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0 rounded-full border border-input shadow-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                )}
              >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                  <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>

              <div className="flex flex-col gap-0.5 w-full">
                <Label
                  htmlFor={cycle.id}
                  className="cursor-pointer text-sm font-medium leading-none text-foreground"
                >
                  {cycle.label}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {cycle.description}
                </p>

                {cycle.value === "custom" &&
                  selectedValue === "custom" && (
                    <div className="mt-2 space-y-1">
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
                        step={1}
                        placeholder="e.g. 14"
                        value={customDays}
                        onChange={handleCustomDaysChange}
                        aria-describedby={
                          customError ? "custom-days-error" : undefined
                        }
                        aria-invalid={customError ? true : undefined}
                        className={cn(
                          "h-8 text-sm",
                          customError &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {customError && (
                        <p
                          id="custom-days-error"
                          role="alert"
                          className="text-xs text-destructive"
                        >
                          {customError}
                        </p>
                      )}
                    </div>
                  )}
              </div>
            </div>
          ))}
        </RadioGroupPrimitive.Root>
      </fieldset>
    </div>
  );
}