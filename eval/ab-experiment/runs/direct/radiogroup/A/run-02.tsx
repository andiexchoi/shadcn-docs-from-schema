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

export function BillingCycleSelector({
  defaultValue = "monthly",
  onChange,
  className,
}: BillingCycleSelectorProps) {
  const [selected, setSelected] = React.useState<BillingCycle>(defaultValue);
  const [customDays, setCustomDays] = React.useState<string>("30");
  const [customDaysError, setCustomDaysError] = React.useState<string>("");

  const handleValueChange = (value: string) => {
    const cycle = value as BillingCycle;
    setSelected(cycle);
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

    const parsed = parseInt(raw, 10);
    if (raw === "" || isNaN(parsed)) {
      setCustomDaysError("Please enter a valid number of days.");
      onChange?.("custom", undefined);
    } else if (parsed < 1) {
      setCustomDaysError("Must be at least 1 day.");
      onChange?.("custom", undefined);
    } else if (parsed > 365) {
      setCustomDaysError("Must be 365 days or fewer.");
      onChange?.("custom", undefined);
    } else {
      setCustomDaysError("");
      onChange?.("custom", parsed);
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
        description: "Define your own billing interval",
      },
    ];

  return (
    <div className={cn("w-full max-w-md space-y-3", className)}>
      <p className="text-sm font-semibold text-foreground">Billing Cycle</p>
      <RadioGroup.Root
        value={selected}
        onValueChange={handleValueChange}
        className="flex flex-col gap-3"
        aria-label="Billing cycle"
      >
        {options.map((option) => {
          const isSelected = selected === option.value;
          return (
            <Label
              key={option.value}
              htmlFor={option.value}
              className={cn(
                "flex cursor-pointer items-start gap-4 rounded-xl border-2 p-4 transition-all duration-150",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary/40 hover:bg-muted/50"
              )}
            >
              <RadioGroup.Item
                id={option.value}
                value={option.value}
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isSelected
                    ? "border-primary"
                    : "border-muted-foreground"
                )}
              >
                <RadioGroup.Indicator className="block h-2.5 w-2.5 rounded-full bg-primary" />
              </RadioGroup.Item>

              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium leading-none text-foreground">
                  {option.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {option.description}
                </span>

                {option.value === "custom" && isSelected && (
                  <div
                    className="mt-3 space-y-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Label
                      htmlFor="custom-days-input"
                      className="text-xs font-medium text-foreground"
                    >
                      Number of days
                    </Label>
                    <Input
                      id="custom-days-input"
                      type="number"
                      min={1}
                      max={365}
                      value={customDays}
                      onChange={handleCustomDaysChange}
                      placeholder="e.g. 14"
                      className={cn(
                        "h-8 w-32 text-sm",
                        customDaysError
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      )}
                    />
                    {customDaysError && (
                      <p className="text-xs text-destructive">
                        {customDaysError}
                      </p>
                    )}
                    {!customDaysError && customDays && (
                      <p className="text-xs text-muted-foreground">
                        Billed every{" "}
                        <span className="font-medium text-foreground">
                          {customDays}
                        </span>{" "}
                        day{parseInt(customDays, 10) !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </Label>
          );
        })}
      </RadioGroup.Root>

      <div className="rounded-lg bg-muted px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Currently selected:{" "}
          <span className="font-semibold capitalize text-foreground">
            {selected}
          </span>
          {selected === "custom" &&
            !customDaysError &&
            customDays !== "" &&
            ` — every ${customDays} day${parseInt(customDays, 10) !== 1 ? "s" : ""}`}
        </p>
      </div>
    </div>
  );
}