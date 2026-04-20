"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type BillingCycle = "monthly" | "yearly" | "custom";

interface BillingCycleSelectorProps {
  defaultValue?: BillingCycle;
  value?: BillingCycle;
  onValueChange?: (value: BillingCycle) => void;
  className?: string;
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    className={cn("flex flex-col gap-3", className)}
    {...props}
    ref={ref}
  />
));
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      "aspect-square h-4 w-4 shrink-0 rounded-full border border-primary text-primary shadow",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <div className="h-2 w-2 rounded-full bg-white" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";

export function BillingCycleSelector({
  defaultValue = "monthly",
  value,
  onValueChange,
  className,
}: BillingCycleSelectorProps) {
  const [internalValue, setInternalValue] = React.useState<BillingCycle>(
    value ?? defaultValue
  );
  const [customDays, setCustomDays] = React.useState<string>("");
  const [customError, setCustomError] = React.useState<string>("");

  const controlled = value !== undefined;
  const selectedValue = controlled ? value : internalValue;

  const legendId = React.useId();

  function handleValueChange(next: string) {
    const cycle = next as BillingCycle;
    if (!controlled) setInternalValue(cycle);
    onValueChange?.(cycle);
    if (cycle !== "custom") {
      setCustomError("");
    }
  }

  function handleCustomDaysChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setCustomDays(raw);
    const num = Number(raw);
    if (raw === "" || isNaN(num) || !Number.isInteger(num) || num < 1) {
      setCustomError("Enter a whole number of days (minimum 1).");
    } else if (num > 365) {
      setCustomError("Custom cycle cannot exceed 365 days.");
    } else {
      setCustomError("");
    }
  }

  const options: { value: BillingCycle; label: string; description: string }[] =
    [
      {
        value: "monthly",
        label: "Monthly",
        description: "Billed once every 30 days.",
      },
      {
        value: "yearly",
        label: "Yearly",
        description: "Billed once per year. Save up to 20%.",
      },
      {
        value: "custom",
        label: "Custom",
        description: "Set your own billing interval in days.",
      },
    ];

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <fieldset className="border-0 m-0 p-0">
        <legend
          id={legendId}
          className="text-sm font-semibold text-foreground mb-4"
        >
          Billing cycle
        </legend>

        <RadioGroup
          aria-labelledby={legendId}
          value={selectedValue}
          onValueChange={handleValueChange}
          className="gap-3"
        >
          {options.map((option) => {
            const itemId = `billing-cycle-${option.value}`;
            const descId = `billing-cycle-${option.value}-desc`;
            return (
              <div key={option.value}>
                <div
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-4 transition-colors",
                    selectedValue === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:bg-muted/40"
                  )}
                >
                  <RadioGroupItem
                    id={itemId}
                    value={option.value}
                    aria-describedby={descId}
                    className="mt-0.5"
                  />
                  <div className="flex flex-col gap-0.5 min-w-0">
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

                    {option.value === "custom" &&
                      selectedValue === "custom" && (
                        <div className="mt-3 flex flex-col gap-1.5">
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
                            placeholder="e.g. 14"
                            value={customDays}
                            onChange={handleCustomDaysChange}
                            aria-invalid={customError ? true : undefined}
                            aria-describedby={
                              customError ? "custom-days-error" : undefined
                            }
                            className={cn(
                              "h-8 text-sm",
                              customError &&
                                "border-destructive focus-visible:ring-destructive"
                            )}
                          />
                          {customError && (
                            <p
                              id="custom-days-error"
                              role="alert"
                              className="text-xs text-destructive"
                            >
                              {customError}
                            </p>
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            );
          })}
        </RadioGroup>
      </fieldset>

      {selectedValue && (
        <p className="mt-4 text-xs text-muted-foreground">
          {selectedValue === "monthly" && "Your card will be charged monthly."}
          {selectedValue === "yearly" &&
            "Your card will be charged once per year."}
          {selectedValue === "custom" &&
            customDays &&
            !customError &&
            `Your card will be charged every ${customDays} day${Number(customDays) === 1 ? "" : "s"}.`}
        </p>
      )}
    </div>
  );
}