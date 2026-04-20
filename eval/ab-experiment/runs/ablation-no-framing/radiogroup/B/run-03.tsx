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
  const [selected, setSelected] = React.useState<string>("monthly");
  const [customDays, setCustomDays] = React.useState<string>("");
  const [customError, setCustomError] = React.useState<string>("");

  function handleValueChange(value: string) {
    setSelected(value);
    if (value !== "custom") {
      setCustomError("");
    }
  }

  function handleCustomDaysChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setCustomDays(raw);
    const parsed = parseInt(raw, 10);
    if (raw === "") {
      setCustomError("Please enter a number of days.");
    } else if (isNaN(parsed) || parsed < 1) {
      setCustomError("Enter a whole number greater than 0.");
    } else {
      setCustomError("");
    }
  }

  return (
    <div className="w-full max-w-md space-y-4">
      <fieldset className="space-y-1">
        <legend
          id="billing-cycle-legend"
          className="text-base font-semibold text-foreground mb-3 block"
        >
          Billing cycle
        </legend>

        <RadioGroupPrimitive.Root
          value={selected}
          onValueChange={handleValueChange}
          aria-labelledby="billing-cycle-legend"
          className="space-y-2"
        >
          {options.map((option) => {
            const isCustom = option.value === "custom";
            const isSelected = selected === option.value;

            return (
              <div
                key={option.value}
                className={cn(
                  "rounded-lg border px-4 py-3 transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-primary/40"
                )}
              >
                <div className="flex items-start gap-3">
                  <RadioGroupPrimitive.Item
                    id={`billing-${option.value}`}
                    value={option.value}
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    )}
                  >
                    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                    </RadioGroupPrimitive.Indicator>
                  </RadioGroupPrimitive.Item>

                  <div className="flex-1 space-y-0.5">
                    <Label
                      htmlFor={`billing-${option.value}`}
                      className="cursor-pointer text-sm font-medium leading-none"
                    >
                      {option.label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>

                    {isCustom && isSelected && (
                      <div className="mt-3 space-y-1">
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
                          placeholder="e.g. 90"
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
                            role="alert"
                            className="text-xs text-destructive"
                          >
                            {customError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {option.value === "yearly" && (
                    <span className="ml-auto shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                      Save 20%
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </RadioGroupPrimitive.Root>
      </fieldset>

      <div className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
        {selected === "monthly" && (
          <span>
            You will be billed <strong className="text-foreground">monthly</strong>.
          </span>
        )}
        {selected === "yearly" && (
          <span>
            You will be billed <strong className="text-foreground">once per year</strong> at a discounted rate.
          </span>
        )}
        {selected === "custom" && (
          <span>
            You will be billed every{" "}
            <strong className="text-foreground">
              {customDays && !customError ? `${customDays} days` : "— days"}
            </strong>
            .
          </span>
        )}
      </div>
    </div>
  );
}