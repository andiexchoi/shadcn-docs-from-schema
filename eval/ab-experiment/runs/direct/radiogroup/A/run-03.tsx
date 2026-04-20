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
  className?: string;
}

const cycles: { value: BillingCycle; label: string; description: string }[] = [
  {
    value: "monthly",
    label: "Monthly",
    description: "Billed once every month",
  },
  {
    value: "yearly",
    label: "Yearly",
    description: "Billed once per year — save up to 20%",
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
  className,
}: BillingCycleSelectorProps) {
  const [selected, setSelected] = React.useState<BillingCycle>(defaultValue);
  const [customDays, setCustomDays] = React.useState<string>("30");
  const [customError, setCustomError] = React.useState<string>("");

  const handleValueChange = (value: string) => {
    const cycle = value as BillingCycle;
    setSelected(cycle);
    const days = cycle === "custom" ? parseInt(customDays, 10) : undefined;
    onChange?.(cycle, days);
  };

  const handleCustomDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setCustomDays(raw);

    const parsed = parseInt(raw, 10);
    if (!raw || isNaN(parsed) || parsed < 1) {
      setCustomError("Please enter a valid number of days (minimum 1).");
      onChange?.("custom", undefined);
    } else if (parsed > 365) {
      setCustomError("Maximum custom cycle is 365 days.");
      onChange?.("custom", undefined);
    } else {
      setCustomError("");
      onChange?.("custom", parsed);
    }
  };

  return (
    <div className={cn("w-full max-w-md", className)}>
      <h2 className="mb-1 text-base font-semibold text-foreground">
        Billing Cycle
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Choose how often you'd like to be billed.
      </p>

      <RadioGroup.Root
        value={selected}
        onValueChange={handleValueChange}
        className="flex flex-col gap-3"
        aria-label="Billing cycle"
      >
        {cycles.map((cycle) => {
          const isSelected = selected === cycle.value;

          return (
            <React.Fragment key={cycle.value}>
              <Label
                htmlFor={`billing-${cycle.value}`}
                className={cn(
                  "flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all",
                  "hover:border-primary/60 hover:bg-muted/40",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-background"
                )}
              >
                <RadioGroup.Item
                  id={`billing-${cycle.value}`}
                  value={cycle.value}
                  className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    isSelected
                      ? "border-primary"
                      : "border-muted-foreground/50"
                  )}
                >
                  <RadioGroup.Indicator
                    className={cn(
                      "block h-2 w-2 rounded-full bg-primary transition-transform",
                      "data-[state=checked]:scale-100 scale-0"
                    )}
                  />
                </RadioGroup.Item>

                <div className="flex flex-col gap-0.5">
                  <span
                    className={cn(
                      "text-sm font-medium leading-none",
                      isSelected ? "text-primary" : "text-foreground"
                    )}
                  >
                    {cycle.label}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {cycle.description}
                  </span>
                </div>

                {cycle.value === "yearly" && (
                  <span className="ml-auto self-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Best value
                  </span>
                )}
              </Label>

              {cycle.value === "custom" && isSelected && (
                <div className="ml-8 flex flex-col gap-1.5 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-3">
                  <Label
                    htmlFor="custom-days-input"
                    className="text-xs font-medium text-foreground"
                  >
                    Billing interval (in days)
                  </Label>
                  <Input
                    id="custom-days-input"
                    type="number"
                    min={1}
                    max={365}
                    value={customDays}
                    onChange={handleCustomDaysChange}
                    placeholder="e.g. 90"
                    className={cn(
                      "h-8 w-32 text-sm",
                      customError && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {customError ? (
                    <p className="text-xs text-destructive">{customError}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Billed every{" "}
                      <span className="font-medium text-foreground">
                        {customDays || "—"} days
                      </span>
                    </p>
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </RadioGroup.Root>
    </div>
  );
}

export default BillingCycleSelector;