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

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const legendId = React.useId();

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
    const num = Number(raw);
    if (raw === "" || !Number.isInteger(num) || num < 1) {
      setCustomError("Enter a whole number of days (minimum 1).");
    } else {
      setCustomError("");
    }
  };

  const options: { id: string; value: BillingCycle; label: string; description: string }[] = [
    {
      id: "billing-monthly",
      value: "monthly",
      label: "Monthly",
      description: "Billed once every month.",
    },
    {
      id: "billing-yearly",
      value: "yearly",
      label: "Yearly",
      description: "Billed once per year. Save up to 20%.",
    },
    {
      id: "billing-custom",
      value: "custom",
      label: "Custom",
      description: "Set your own billing interval in days.",
    },
  ];

  return (
    <fieldset className={cn("border-0 m-0 p-0", className)}>
      <legend
        id={legendId}
        className="text-sm font-semibold text-foreground mb-4"
      >
        Billing cycle
      </legend>

      <RadioGroup
        value={selectedValue}
        onValueChange={handleValueChange}
        aria-labelledby={legendId}
      >
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          const isCustom = option.value === "custom";

          return (
            <div
              key={option.value}
              className={cn(
                "flex flex-col rounded-lg border px-4 py-3 transition-colors",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  id={option.id}
                  value={option.value}
                />
                <div className="flex flex-col">
                  <Label
                    htmlFor={option.id}
                    className="cursor-pointer text-sm font-medium leading-none"
                  >
                    {option.label}
                  </Label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>

              {isCustom && isSelected && (
                <div className="mt-3 ml-7 flex flex-col gap-1">
                  <Label
                    htmlFor="billing-custom-days"
                    className="text-xs font-medium text-foreground"
                  >
                    Number of days
                  </Label>
                  <Input
                    id="billing-custom-days"
                    type="number"
                    min={1}
                    step={1}
                    placeholder="e.g. 90"
                    value={customDays}
                    onChange={handleCustomDaysChange}
                    aria-invalid={customError ? true : undefined}
                    aria-describedby={
                      customError ? "billing-custom-error" : undefined
                    }
                    className={cn(
                      "h-8 w-36 text-sm",
                      customError && "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  {customError && (
                    <p
                      id="billing-custom-error"
                      role="alert"
                      className="text-xs text-destructive"
                    >
                      {customError}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </RadioGroup>
    </fieldset>
  );
}