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
    const val = e.target.value;
    setCustomDays(val);
    const days = parseInt(val, 10);
    if (val === "" || isNaN(days) || days <= 0) {
      setCustomError("Please enter a valid number of days (minimum 1).");
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
        description: "Set your own billing interval",
      },
    ];

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">Billing Cycle</h2>
        <p className="text-sm text-gray-500">
          Choose how often you'd like to be billed.
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
                "flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all",
                "hover:bg-gray-50",
                selected === option.value
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 bg-white"
              )}
            >
              {/* Custom radio indicator */}
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  selected === option.value
                    ? "border-indigo-600"
                    : "border-gray-300"
                )}
              >
                {selected === option.value && (
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                )}
              </span>

              <div className="flex-1 space-y-0.5">
                <span
                  className={cn(
                    "block text-sm font-medium",
                    selected === option.value
                      ? "text-indigo-700"
                      : "text-gray-800"
                  )}
                >
                  {option.label}
                </span>
                <span className="block text-xs text-gray-500">
                  {option.description}
                </span>
              </div>

              {option.value === "yearly" && (
                <span className="ml-auto shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                  Best value
                </span>
              )}
            </Label>

            {/* Custom days input — shown only when custom is selected */}
            {option.value === "custom" && selected === "custom" && (
              <div className="mt-2 ml-4 space-y-1 rounded-md border border-indigo-100 bg-indigo-50/60 p-3">
                <Label
                  htmlFor="custom-days"
                  className="text-xs font-medium text-gray-700"
                >
                  Number of days per cycle
                </Label>
                <Input
                  id="custom-days"
                  type="number"
                  min={1}
                  value={customDays}
                  onChange={handleCustomDaysChange}
                  placeholder="e.g. 14"
                  className={cn(
                    "h-8 text-sm",
                    customError ? "border-red-400 focus-visible:ring-red-400" : ""
                  )}
                />
                {customError && (
                  <p className="text-xs text-red-500">{customError}</p>
                )}
                {!customError && customDays && (
                  <p className="text-xs text-gray-500">
                    You'll be billed every{" "}
                    <span className="font-medium text-indigo-600">
                      {customDays} day{parseInt(customDays) !== 1 ? "s" : ""}
                    </span>
                    .
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </RadioGroup.Root>
    </div>
  );
}