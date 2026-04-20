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
    const parsed = parseInt(raw, 10);
    if (!raw || isNaN(parsed) || parsed <= 0) {
      setCustomError("Please enter a positive number of days.");
    } else {
      setCustomError("");
      onChange?.("custom", parsed);
    }
  };

  const options: { value: BillingCycle; label: string; description: string }[] =
    [
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
        description: "Set your own billing interval in days",
      },
    ];

  return (
    <div className="w-full max-w-md space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Billing Cycle</h2>
        <p className="text-sm text-gray-500">
          Choose how often you want to be billed.
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
              className="sr-only peer"
            />
            <Label
              htmlFor={`billing-${option.value}`}
              className={cn(
                "flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-all",
                "hover:border-primary/60 hover:bg-gray-50",
                selected === option.value
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 bg-white"
              )}
            >
              {/* Custom radio indicator */}
              <span
                className={cn(
                  "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  selected === option.value
                    ? "border-primary"
                    : "border-gray-400"
                )}
              >
                {selected === option.value && (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                )}
              </span>

              <div className="flex flex-col gap-0.5">
                <span
                  className={cn(
                    "text-sm font-medium",
                    selected === option.value
                      ? "text-primary"
                      : "text-gray-800"
                  )}
                >
                  {option.label}
                </span>
                <span className="text-xs text-gray-500">
                  {option.description}
                </span>
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup.Root>

      {selected === "custom" && (
        <div className="space-y-1.5 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
          <Label htmlFor="custom-days" className="text-sm font-medium text-gray-700">
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
              "w-full",
              customError ? "border-red-500 focus-visible:ring-red-500" : ""
            )}
          />
          {customError ? (
            <p className="text-xs text-red-500">{customError}</p>
          ) : (
            <p className="text-xs text-gray-400">
              You will be billed every{" "}
              <span className="font-medium text-gray-600">{customDays || "?"}</span>{" "}
              day{customDays === "1" ? "" : "s"}.
            </p>
          )}
        </div>
      )}

      <div className="rounded-md bg-gray-100 px-4 py-3 text-sm text-gray-600">
        <span className="font-medium">Selected: </span>
        {selected === "custom"
          ? `Custom — every ${customDays || "?"} day${customDays === "1" ? "" : "s"}`
          : selected.charAt(0).toUpperCase() + selected.slice(1)}
      </div>
    </div>
  );
}

export default BillingCycleSelector;