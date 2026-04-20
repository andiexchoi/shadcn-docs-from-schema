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
    ref={ref}
    className={cn("flex flex-col gap-3", className)}
    {...props}
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
      "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span className="block h-2 w-2 rounded-full bg-primary" />
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
  const legendId = React.useId();
  const [customDays, setCustomDays] = React.useState<string>("");
  const [customError, setCustomError] = React.useState<string>("");

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<BillingCycle>(
    defaultValue
  );
  const selectedValue = isControlled ? value : internalValue;

  const handleValueChange = (next: string) => {
    const nextCycle = next as BillingCycle;
    if (!isControlled) {
      setInternalValue(nextCycle);
    }
    onValueChange?.(nextCycle);
    if (nextCycle !== "custom") {
      setCustomError("");
    }
  };

  const handleCustomDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setCustomDays(raw);
    const parsed = parseInt(raw, 10);
    if (raw === "" || isNaN(parsed) || parsed < 1) {
      setCustomError("Enter a number of days greater than 0.");
    } else {
      setCustomError("");
    }
  };

  const options: { value: BillingCycle; label: string; description: string }[] =
    [
      {
        value: "monthly",
        label: "Monthly",
        description: "Billed once every calendar month.",
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
    <fieldset
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm",
        className
      )}
    >
      <legend
        id={legendId}
        className="mb-4 text-base font-semibold text-foreground"
      >
        Billing cycle
      </legend>

      <RadioGroup
        aria-labelledby={legendId}
        value={selectedValue}
        onValueChange={handleValueChange}
      >
        {options.map((option) => {
          const itemId = `billing-cycle-${option.value}`;
          const descId = `billing-cycle-${option.value}-desc`;
          const isSelected = selectedValue === option.value;

          return (
            <div key={option.value}>
              <div
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:bg-muted/50"
                )}
              >
                <RadioGroupItem
                  value={option.value}
                  id={itemId}
                  aria-describedby={descId}
                  className="mt-0.5 shrink-0"
                />
                <div className="flex flex-col gap-0.5">
                  <Label
                    htmlFor={itemId}
                    className="cursor-pointer text-sm font-medium leading-none text-foreground"
                  >
                    {option.label}
                  </Label>
                  <p
                    id={descId}
                    className="text-xs text-muted-foreground"
                  >
                    {option.description}
                  </p>
                </div>
              </div>

              {option.value === "custom" && isSelected && (
                <div className="mt-2 px-4">
                  <div className="flex flex-col gap-1.5">
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
                      placeholder="e.g. 14"
                      value={customDays}
                      onChange={handleCustomDaysChange}
                      aria-invalid={customError ? "true" : undefined}
                      aria-describedby={
                        customError ? "custom-days-error" : undefined
                      }
                      className={cn(
                        "h-8 w-40 text-sm",
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
                </div>
              )}
            </div>
          );
        })}
      </RadioGroup>
    </fieldset>
  );
}