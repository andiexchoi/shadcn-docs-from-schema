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
  const [customError, setCustomError] = React.useState<string>("");

  const handleValueChange = (value: string) => {
    const cycle = value as BillingCycle;
    setSelected(cycle);
    if (cycle !== "custom") {
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
    if (isNaN(days) || days <= 0) {
      setCustomError("Please enter a positive number of days.");
    } else {
      setCustomError("");
      onChange?.("custom", days);
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
        description: "Billed once a year — save up to 20%",
      },
      {
        value: "custom",
        label: "Custom",
        description: "Choose your own billing interval",
      },
    ];

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">Billing Cycle</h2>
        <p className="text-sm text-muted-foreground">
          Select how often you'd like to be billed.
        </p>
      </div>

      <RadioGroup.Root
        value={selected}
        onValueChange={handleValueChange}
        className="space-y-3"
        aria-label="Billing cycle"
      >
        {options.map((option) => (
          <div key={option.value}>
            <RadioGroup.Item
              value={option.value}
              id={`billing-${option.value}`}
              className="peer sr-only"
            />
            <Label
              htmlFor={`billing-${option.value}`}
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-all",
                "hover:bg-accent hover:text-accent-foreground",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2",
                selected === option.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border bg-background text-foreground"
              )}
            >
              {/* Custom radio indicator */}
              <span
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  selected === option.value
                    ? "border-primary"
                    : "border-muted-foreground"
                )}
              >
                {selected === option.value && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </span>

              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium leading-none">
                  {option.label}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    selected === option.value
                      ? "text-primary/80"
                      : "text-muted-foreground"
                  )}
                >
                  {option.description}
                </span>
              </div>
            </Label>

            {/* Custom days input — shown only when custom is selected */}
            {option.value === "custom" && selected === "custom" && (
              <div className="mt-2 space-y-1 px-4">
                <Label
                  htmlFor="custom-days"
                  className="text-xs font-medium text-muted-foreground"
                >
                  Number of days
                </Label>
                <Input
                  id="custom-days"
                  type="number"
                  min={1}
                  value={customDays}
                  onChange={handleCustomDaysChange}
                  placeholder="e.g. 30"
                  className={cn(
                    "h-8 text-sm",
                    customError ? "border-destructive focus-visible:ring-destructive" : ""
                  )}
                />
                {customError && (
                  <p className="text-xs text-destructive">{customError}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </RadioGroup.Root>

      {/* Summary */}
      <div className="rounded-md bg-muted px-4 py-3 text-sm text-muted-foreground">
        {selected === "monthly" && (
          <span>
            You are on a <strong className="text-foreground">Monthly</strong>{" "}
            billing cycle.
          </span>
        )}
        {selected === "yearly" && (
          <span>
            You are on a <strong className="text-foreground">Yearly</strong>{" "}
            billing cycle.
          </span>
        )}
        {selected === "custom" && (
          <span>
            You are on a{" "}
            <strong className="text-foreground">
              Custom ({customDays || "?"}-day)
            </strong>{" "}
            billing cycle.
          </span>
        )}
      </div>
    </div>
  );
}

export default BillingCycleSelector;