"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const billingOptions = [
  {
    value: "monthly",
    label: "Monthly",
    description: "Billed every month",
  },
  {
    value: "yearly",
    label: "Yearly",
    description: "Billed once per year",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Set your own billing interval",
  },
] as const;

type BillingCycle = "monthly" | "yearly" | "custom";

export function BillingCycleSelector() {
  const [selected, setSelected] = React.useState<BillingCycle>("monthly");
  const [customDays, setCustomDays] = React.useState<string>("");
  const [customError, setCustomError] = React.useState<string>("");

  function handleValueChange(value: string) {
    setSelected(value as BillingCycle);
    if (value !== "custom") {
      setCustomError("");
    }
  }

  function handleCustomDaysChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setCustomDays(raw);
    const parsed = Number(raw);
    if (raw === "") {
      setCustomError("Please enter a number of days.");
    } else if (!Number.isInteger(parsed) || parsed < 1) {
      setCustomError("Enter a whole number of 1 or more.");
    } else {
      setCustomError("");
    }
  }

  return (
    <fieldset className="border-0 p-0 m-0">
      <legend
        id="billing-cycle-legend"
        className="text-sm font-semibold text-foreground mb-4"
      >
        Billing cycle
      </legend>

      <RadioGroupPrimitive.Root
        value={selected}
        onValueChange={handleValueChange}
        aria-labelledby="billing-cycle-legend"
        className="flex flex-col gap-3"
      >
        {billingOptions.map((option) => {
          const isCustom = option.value === "custom";
          const isSelected = selected === option.value;
          const hasError = isCustom && isSelected && customError !== "";

          return (
            <div
              key={option.value}
              className={cn(
                "flex flex-col gap-2 rounded-lg border p-4 transition-colors",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-3">
                <RadioGroupPrimitive.Item
                  id={`billing-${option.value}`}
                  value={option.value}
                  aria-invalid={hasError ? true : undefined}
                  className={cn(
                    "h-4 w-4 shrink-0 rounded-full border border-primary shadow",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  )}
                >
                  <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                    <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                  </RadioGroupPrimitive.Indicator>
                </RadioGroupPrimitive.Item>

                <div className="flex flex-col">
                  <Label
                    htmlFor={`billing-${option.value}`}
                    className="text-sm font-medium cursor-pointer leading-none"
                  >
                    {option.label}
                  </Label>
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {option.description}
                  </span>
                </div>
              </div>

              {isCustom && isSelected && (
                <div className="mt-1 pl-7 flex flex-col gap-1.5">
                  <Label
                    htmlFor="custom-days-input"
                    className="text-xs font-medium text-muted-foreground"
                  >
                    Billing interval (days)
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
                      "h-8 text-sm w-40",
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
          );
        })}
      </RadioGroupPrimitive.Root>

      {selected !== "custom" && (
        <p className="mt-4 text-xs text-muted-foreground">
          {selected === "monthly"
            ? "Your card will be charged on the same date each month."
            : "Save up to 20% compared to monthly billing."}
        </p>
      )}
    </fieldset>
  );
}