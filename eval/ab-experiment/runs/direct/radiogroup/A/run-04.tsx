"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type BillingCycle = "monthly" | "yearly" | "custom";

interface BillingCycleSelectorProps {
  value?: BillingCycle;
  onChange?: (value: BillingCycle, customDays?: number) => void;
  defaultValue?: BillingCycle;
}

export function BillingCycleSelector({
  value: controlledValue,
  onChange,
  defaultValue = "monthly",
}: BillingCycleSelectorProps) {
  const [internalValue, setInternalValue] = React.useState<BillingCycle>(
    controlledValue ?? defaultValue
  );
  const [customDays, setCustomDays] = React.useState<string>("30");
  const [customDaysError, setCustomDaysError] = React.useState<string>("");

  const selectedValue = controlledValue ?? internalValue;

  const handleValueChange = (val: string) => {
    const cycle = val as BillingCycle;
    setInternalValue(cycle);
    if (cycle !== "custom") {
      setCustomDaysError("");
      onChange?.(cycle);
    } else {
      const days = parseInt(customDays, 10);
      onChange?.(cycle, isNaN(days) ? undefined : days);
    }
  };

  const handleCustomDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setCustomDays(raw);
    const days = parseInt(raw, 10);
    if (!raw || isNaN(days) || days < 1) {
      setCustomDaysError("Please enter a valid number of days (minimum 1).");
      onChange?.("custom", undefined);
    } else if (days > 3650) {
      setCustomDaysError("Maximum allowed is 3650 days.");
      onChange?.("custom", undefined);
    } else {
      setCustomDaysError("");
      onChange?.("custom", days);
    }
  };

  const options: { value: BillingCycle; label: string; description: string }[] =
    [
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
        description: "Define your own billing interval in days.",
      },
    ];

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-gray-900">Billing Cycle</h2>
        <p className="text-sm text-gray-500">
          Choose how often you want to be billed.
        </p>
      </div>

      <RadioGroupPrimitive.Root
        value={selectedValue}
        onValueChange={handleValueChange}
        className="space-y-3"
        aria-label="Billing Cycle"
      >
        {options.map((option) => (
          <div key={option.value}>
            <Label
              htmlFor={`billing-${option.value}`}
              className={cn(
                "flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all",
                selectedValue === option.value
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50"
              )}
            >
              <RadioGroupPrimitive.Item
                id={`billing-${option.value}`}
                value={option.value}
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                  selectedValue === option.value
                    ? "border-indigo-600 bg-indigo-600"
                    : "border-gray-400 bg-white"
                )}
              >
                <RadioGroupPrimitive.Indicator className="block h-2 w-2 rounded-full bg-white" />
              </RadioGroupPrimitive.Item>

              <div className="flex-1 space-y-0.5">
                <span
                  className={cn(
                    "block text-sm font-semibold",
                    selectedValue === option.value
                      ? "text-indigo-700"
                      : "text-gray-900"
                  )}
                >
                  {option.label}
                </span>
                <span className="block text-sm text-gray-500">
                  {option.description}
                </span>
              </div>

              {option.value === "yearly" && (
                <span className="self-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  Save 20%
                </span>
              )}
            </Label>

            {option.value === "custom" && selectedValue === "custom" && (
              <div className="mt-3 ml-9 space-y-1.5">
                <Label
                  htmlFor="custom-days-input"
                  className="text-sm font-medium text-gray-700"
                >
                  Number of days
                </Label>
                <Input
                  id="custom-days-input"
                  type="number"
                  min={1}
                  max={3650}
                  value={customDays}
                  onChange={handleCustomDaysChange}
                  placeholder="e.g. 90"
                  className={cn(
                    "w-40",
                    customDaysError
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  )}
                />
                {customDaysError ? (
                  <p className="text-xs text-red-600">{customDaysError}</p>
                ) : (
                  customDays && (
                    <p className="text-xs text-gray-500">
                      Billed every{" "}
                      <span className="font-medium text-gray-700">
                        {customDays}
                      </span>{" "}
                      days.
                    </p>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </RadioGroupPrimitive.Root>
    </div>
  );
}