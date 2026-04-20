"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type BillingCycle = "monthly" | "yearly" | "custom";

const options: { value: BillingCycle; label: string; description: string }[] = [
  {
    value: "monthly",
    label: "Monthly",
    description: "Billed every month. Cancel anytime.",
  },
  {
    value: "yearly",
    label: "Yearly",
    description: "Billed once a year. Save up to 20%.",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Set your own billing interval.",
  },
];

export function BillingCycleSelector() {
  const [cycle, setCycle] = React.useState<BillingCycle>("monthly");
  const [customDays, setCustomDays] = React.useState<string>("");
  const legendId = React.useId();

  return (
    <fieldset className="border-0 p-0 m-0 min-w-0">
      <legend
        id={legendId}
        className="text-sm font-semibold text-foreground mb-3"
      >
        Billing cycle
      </legend>

      <RadioGroupPrimitive.Root
        value={cycle}
        onValueChange={(val) => setCycle(val as BillingCycle)}
        aria-labelledby={legendId}
        orientation="vertical"
        className="flex flex-col gap-3"
      >
        {options.map((option) => {
          const itemId = `billing-cycle-${option.value}`;
          const descId = `billing-cycle-${option.value}-desc`;
          const isSelected = cycle === option.value;

          return (
            <div
              key={option.value}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 transition-colors cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary/50 hover:bg-muted/30"
              )}
              onClick={() => setCycle(option.value)}
            >
              <RadioGroupPrimitive.Item
                id={itemId}
                value={option.value}
                aria-describedby={descId}
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                )}
              >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                  <span className="block h-2 w-2 rounded-full bg-primary-foreground" />
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
                  className="text-xs text-muted-foreground leading-snug"
                >
                  {option.description}
                </p>

                {option.value === "custom" && isSelected && (
                  <div className="mt-3 flex flex-col gap-1.5">
                    <Label
                      htmlFor="custom-days"
                      className="text-xs font-medium text-foreground"
                    >
                      Interval (days)
                    </Label>
                    <Input
                      id="custom-days"
                      type="number"
                      min={1}
                      placeholder="e.g. 90"
                      value={customDays}
                      onChange={(e) => setCustomDays(e.target.value)}
                      className="h-8 w-40 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                    {customDays !== "" &&
                      (Number(customDays) < 1 || !Number.isInteger(Number(customDays))) && (
                        <p className="text-xs text-destructive" role="alert">
                          Please enter a whole number greater than 0.
                        </p>
                      )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </RadioGroupPrimitive.Root>

      <div className="mt-4 rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
        {cycle === "monthly" && (
          <span>
            You will be billed <strong className="text-foreground">every month</strong>.
          </span>
        )}
        {cycle === "yearly" && (
          <span>
            You will be billed <strong className="text-foreground">once per year</strong>.
          </span>
        )}
        {cycle === "custom" && (
          <span>
            You will be billed every{" "}
            <strong className="text-foreground">
              {customDays && Number(customDays) > 0
                ? `${customDays} day${Number(customDays) === 1 ? "" : "s"}`
                : "— days"}
            </strong>
            .
          </span>
        )}
      </div>
    </fieldset>
  );
}