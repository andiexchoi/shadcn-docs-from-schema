"use client";

import * as React from "react";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type BillingCycle = "monthly" | "yearly" | "custom";

interface BillingCycleSelectorProps {
  defaultValue?: BillingCycle;
  onChange?: (value: BillingCycle, customDays?: number) => void;
}

export function BillingCycleSelector({
  defaultValue = "monthly",
  onChange,
}: BillingCycleSelectorProps) {
  const [selected, setSelected] = React.useState<BillingCycle>(defaultValue);
  const [customDays, setCustomDays] = React.useState<string>("30");

  const handleValueChange = (value: BillingCycle) => {
    setSelected(value);
    onChange?.(
      value,
      value === "custom" ? parseInt(customDays, 10) : undefined
    );
  };

  const handleCustomDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomDays(val);
    if (selected === "custom") {
      onChange?.("custom", parseInt(val, 10));
    }
  };

  const options: { value: BillingCycle; label: string; description: string }[] =
    [
      {
        value: "monthly",
        label: "Monthly",
        description: "Billed every month",
      },
      {
        value: "yearly",
        label: "Yearly",
        description: "Billed once a year · Save up to 20%",
      },
      {
        value: "custom",
        label: "Custom",
        description: "Set your own billing interval",
      },
    ];

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Billing Cycle</h2>
        <p className="text-sm text-muted-foreground">
          Choose how often you'd like to be billed.
        </p>
      </div>

      <RadioGroup.Root
        value={selected}
        onValueChange={(v) => handleValueChange(v as BillingCycle)}
        className="space-y-3"
        aria-label="Billing cycle"
      >
        {options.map((option) => (
          <div key={option.value}>
            <RadioGroup.Item
              value={option.value}
              id={`billing-${option.value}`}
              className="sr-only peer"
            />
            <Label
              htmlFor={`billing-${option.value}`}
              className={cn(
                "flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all",
                "hover:border-primary/60 hover:bg-accent",
                selected === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background"
              )}
            >
              {/* Custom radio indicator */}
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  selected === option.value
                    ? "border-primary"
                    : "border-muted-foreground"
                )}
              >
                {selected === option.value && (
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                )}
              </span>

              <div className="flex-1 space-y-0.5">
                <p
                  className={cn(
                    "font-medium leading-none",
                    selected === option.value
                      ? "text-primary"
                      : "text-foreground"
                  )}
                >
                  {option.label}
                </p>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>

                {option.value === "custom" && selected === "custom" && (
                  <div
                    className="mt-3 flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Input
                      id="custom-days-input"
                      type="number"
                      min={1}
                      max={365}
                      value={customDays}
                      onChange={handleCustomDaysChange}
                      className="h-8 w-24 text-sm"
                      aria-label="Custom billing interval in days"
                    />
                    <span className="text-sm text-muted-foreground">days</span>
                  </div>
                )}
              </div>

              {option.value === "yearly" && (
                <span className="ml-auto shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Save 20%
                </span>
              )}
            </Label>
          </div>
        ))}
      </RadioGroup.Root>

      <div className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
        {selected === "monthly" && (
          <span>
            You will be charged <strong>every month</strong> on the same date.
          </span>
        )}
        {selected === "yearly" && (
          <span>
            You will be charged <strong>once a year</strong>. Enjoy a 20%
            discount!
          </span>
        )}
        {selected === "custom" && (
          <span>
            You will be charged every{" "}
            <strong>
              {parseInt(customDays, 10) > 0 ? customDays : "—"} day
              {parseInt(customDays, 10) !== 1 ? "s" : ""}
            </strong>
            .
          </span>
        )}
      </div>
    </div>
  );
}

export default BillingCycleSelector;