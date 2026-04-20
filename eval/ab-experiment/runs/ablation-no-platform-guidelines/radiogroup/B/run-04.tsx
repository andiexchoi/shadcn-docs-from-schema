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

type BillingCycle = (typeof options)[number]["value"];

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
        aria-labelledby={legendId}
        orientation="vertical"
        className="flex flex-col gap-3"
      >
        {options.map((option) => {
          const itemId = `billing-cycle-${option.value}`;
          const descId = `billing-cycle-${option.value}-desc`;
          const isSelected = selected === option.value;

          return (
            <div
              key={option.value}
              className={cn(
                "flex flex-col rounded-lg border px-4 py-3 transition-colors",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-3">
                <RadioGroupPrimitive.Item
                  id={itemId}
                  value={option.value}
                  aria-describedby={descId}
                  className={cn(
                    "h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  )}
                >
                  <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                    <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                  </RadioGroupPrimitive.Indicator>
                </RadioGroupPrimitive.Item>

                <Label
                  htmlFor={itemId}
                  className="cursor-pointer font-medium text-sm leading-none"
                >
                  {option.label}
                </Label>
              </div>

              <p
                id={descId}
                className="mt-1 ml-7 text-xs text-muted-foreground"
              >
                {option.description}
              </p>

              {option.value === "custom" && isSelected && (
                <div className="mt-3 ml-7 flex flex-col gap-1.5">
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
                    className="h-8 w-32 text-sm"
                  />
                </div>
              )}
            </div>
          );
        })}
      </RadioGroupPrimitive.Root>

      {selected && (
        <p className="mt-4 text-xs text-muted-foreground">
          {selected === "monthly" && "Your card will be charged every 30 days."}
          {selected === "yearly" &&
            "Your card will be charged once per year at renewal."}
          {selected === "custom" &&
            customDays
              ? `Your card will be charged every ${customDays} day${Number(customDays) === 1 ? "" : "s"}.`
              : selected === "custom"
              ? "Enter a custom interval above."
              : null}
        </p>
      )}
    </fieldset>
  );
}