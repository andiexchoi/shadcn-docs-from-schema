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
    description: "Set your own billing interval",
  },
];

export function BillingCycleSelector() {
  const [selected, setSelected] = React.useState("monthly");
  const [customDays, setCustomDays] = React.useState("");
  const [customError, setCustomError] = React.useState("");

  function handleValueChange(value: string) {
    setSelected(value);
    if (value !== "custom") {
      setCustomError("");
    }
  }

  function handleCustomDaysChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setCustomDays(val);
    const num = Number(val);
    if (val === "" || isNaN(num) || num < 1 || !Number.isInteger(num)) {
      setCustomError("Enter a whole number of days (minimum 1).");
    } else {
      setCustomError("");
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <fieldset className="space-y-2 border-0 p-0 m-0">
        <legend
          id="billing-cycle-legend"
          className="text-base font-semibold text-foreground mb-3"
        >
          Billing cycle
        </legend>

        <RadioGroupPrimitive.Root
          value={selected}
          onValueChange={handleValueChange}
          aria-labelledby="billing-cycle-legend"
          className="flex flex-col gap-3"
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 transition-colors cursor-pointer",
                selected === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:bg-muted/50"
              )}
            >
              <RadioGroupPrimitive.Item
                id={`billing-${option.value}`}
                value={option.value}
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                )}
              >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                  <span className="h-2 w-2 rounded-full bg-primary-foreground block" />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>

              <div className="flex-1 space-y-1">
                <Label
                  htmlFor={`billing-${option.value}`}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {option.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>

                {option.value === "custom" && selected === "custom" && (
                  <div className="mt-3 space-y-1">
                    <Label
                      htmlFor="custom-days-input"
                      className="text-xs font-medium text-muted-foreground"
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
                      aria-invalid={customError ? true : undefined}
                      aria-describedby={
                        customError ? "custom-days-error" : undefined
                      }
                      className={cn(
                        "h-8 w-36 text-sm",
                        customError &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {customError && (
                      <p
                        id="custom-days-error"
                        className="text-xs text-destructive"
                        role="alert"
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

      <div className="mt-6 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Selected: </span>
        {selected === "custom"
          ? customDays && !customError
            ? `Custom — every ${customDays} day${Number(customDays) === 1 ? "" : "s"}`
            : "Custom (enter a number of days above)"
          : options.find((o) => o.value === selected)?.label}
      </div>
    </div>
  );
}