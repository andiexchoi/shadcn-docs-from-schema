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
] as const;

type BillingCycle = "monthly" | "yearly" | "custom";

export function BillingCycleSelector() {
  const [selected, setSelected] = React.useState<BillingCycle>("monthly");
  const [customDays, setCustomDays] = React.useState<string>("");
  const legendId = React.useId();

  return (
    <fieldset className="border-0 m-0 p-0">
      <legend
        id={legendId}
        className="text-sm font-semibold text-foreground mb-4"
      >
        Billing cycle
      </legend>

      <RadioGroupPrimitive.Root
        value={selected}
        onValueChange={(val) => setSelected(val as BillingCycle)}
        orientation="vertical"
        aria-labelledby={legendId}
        className="flex flex-col gap-3"
      >
        {options.map(({ value, label, description }) => {
          const itemId = `billing-cycle-${value}`;
          const isSelected = selected === value;

          return (
            <div key={value}>
              <div
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-4 transition-colors cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-muted/50"
                )}
              >
                <RadioGroupPrimitive.Item
                  id={itemId}
                  value={value}
                  className={cn(
                    "mt-0.5 h-4 w-4 shrink-0 rounded-full border ring-offset-background",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    isSelected
                      ? "border-primary"
                      : "border-muted-foreground"
                  )}
                >
                  <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                    <span className="block h-2 w-2 rounded-full bg-primary" />
                  </RadioGroupPrimitive.Indicator>
                </RadioGroupPrimitive.Item>

                <div className="flex flex-col gap-0.5 flex-1">
                  <Label
                    htmlFor={itemId}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>

                {value === "yearly" && (
                  <span className="ml-auto shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                    Save 20%
                  </span>
                )}
              </div>

              {value === "custom" && isSelected && (
                <div className="mt-3 ml-7 flex flex-col gap-2">
                  <Label
                    htmlFor="custom-days"
                    className="text-sm font-medium text-foreground"
                  >
                    Interval (in days)
                  </Label>
                  <Input
                    id="custom-days"
                    type="number"
                    min={1}
                    placeholder="e.g. 90"
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                    className="max-w-[160px]"
                  />
                  {customDays && Number(customDays) < 1 && (
                    <p className="text-xs text-destructive">
                      Interval must be at least 1 day.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </RadioGroupPrimitive.Root>

      <div className="mt-6 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
        {selected === "monthly" && (
          <p>
            You will be charged on the same date each month. Cancel anytime.
          </p>
        )}
        {selected === "yearly" && (
          <p>
            You will be charged once per year. Your subscription renews
            automatically on the anniversary date.
          </p>
        )}
        {selected === "custom" && (
          <p>
            You will be billed every{" "}
            <strong className="text-foreground">
              {customDays ? `${customDays} day${Number(customDays) === 1 ? "" : "s"}` : "— days"}
            </strong>
            . Set an interval above to continue.
          </p>
        )}
      </div>
    </fieldset>
  );
}