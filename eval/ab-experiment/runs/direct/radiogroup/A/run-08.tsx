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

const options: { value: BillingCycle; label: string; description: string }[] = [
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

export function BillingCycleSelector({
  defaultValue = "monthly",
  onChange,
}: BillingCycleSelectorProps) {
  const [selected, setSelected] = React.useState<BillingCycle>(defaultValue);
  const [customDays, setCustomDays] = React.useState<string>("30");
  const [customError, setCustomError] = React.useState<string>("");

  const handleValueChange = (value: string) => {
    const cycle = value as BillingCycle;
    setSelected(cycle);
    if (cycle !== "custom") {
      setCustomError("");
      onChange?.(cycle);
    } else {
      const days = parseInt(customDays, 10);
      if (!isNaN(days) && days > 0) {
        onChange?.(cycle, days);
      }
    }
  };

  const handleCustomDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setCustomDays(raw);
    const days = parseInt(raw, 10);
    if (raw === "" || isNaN(days) || days <= 0) {
      setCustomError("Please enter a valid number of days greater than 0.");
    } else {
      setCustomError("");
      onChange?.("custom", days);
    }
  };

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
        onValueChange={handleValueChange}
        className="space-y-3"
        aria-label="Billing cycle"
      >
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <div key={option.value}>
              <RadioGroup.Item
                value={option.value}
                id={`billing-${option.value}`}
                className="sr-only peer"
              />
              <Label
                htmlFor={`billing-${option.value}`}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all",
                  "hover:border-primary/60 hover:bg-accent",
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-background"
                )}
              >
                {/* Custom radio indicator */}
                <span
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isSelected
                      ? "border-primary"
                      : "border-muted-foreground"
                  )}
                >
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </span>

                <div className="flex-1 space-y-0.5">
                  <p
                    className={cn(
                      "text-sm font-medium leading-none",
                      isSelected ? "text-primary" : "text-foreground"
                    )}
                  >
                    {option.label}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>

                {option.value === "yearly" && (
                  <span className="ml-auto shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                    Save 20%
                  </span>
                )}
              </Label>

              {/* Custom interval input */}
              {option.value === "custom" && isSelected && (
                <div className="mt-2 space-y-1 rounded-b-lg border border-t-0 border-primary/30 bg-primary/5 px-4 pb-4 pt-3">
                  <Label
                    htmlFor="custom-days"
                    className="text-sm font-medium text-foreground"
                  >
                    Billing interval (days)
                  </Label>
                  <Input
                    id="custom-days"
                    type="number"
                    min={1}
                    value={customDays}
                    onChange={handleCustomDaysChange}
                    placeholder="e.g. 14"
                    className={cn(
                      "mt-1 w-full",
                      customError ? "border-destructive focus-visible:ring-destructive" : ""
                    )}
                  />
                  {customError ? (
                    <p className="text-xs text-destructive">{customError}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Your billing cycle will repeat every{" "}
                      <span className="font-medium text-foreground">
                        {parseInt(customDays, 10) > 0
                          ? `${customDays} days`
                          : "— days"}
                      </span>
                      .
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </RadioGroup.Root>
    </div>
  );
}

export default BillingCycleSelector;