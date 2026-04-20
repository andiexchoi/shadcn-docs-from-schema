"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
      <div className="h-2.5 w-2.5 rounded-full bg-primary" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";

type BillingCycle = "monthly" | "yearly" | "custom";

interface BillingCycleSelectorProps {
  value?: BillingCycle;
  onValueChange?: (value: BillingCycle) => void;
  defaultValue?: BillingCycle;
}

export function BillingCycleSelector({
  value,
  onValueChange,
  defaultValue = "monthly",
}: BillingCycleSelectorProps) {
  const [internalValue, setInternalValue] = React.useState<BillingCycle>(
    value ?? defaultValue
  );
  const [customDays, setCustomDays] = React.useState<string>("");

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const handleValueChange = (newValue: string) => {
    const cycle = newValue as BillingCycle;
    if (!isControlled) {
      setInternalValue(cycle);
    }
    onValueChange?.(cycle);
  };

  const options: { id: string; value: BillingCycle; label: string; description: string }[] = [
    {
      id: "billing-monthly",
      value: "monthly",
      label: "Monthly",
      description: "Billed every month",
    },
    {
      id: "billing-yearly",
      value: "yearly",
      label: "Yearly",
      description: "Billed once per year — save up to 20%",
    },
    {
      id: "billing-custom",
      value: "custom",
      label: "Custom",
      description: "Set your own billing interval",
    },
  ];

  return (
    <fieldset className="border-0 m-0 p-0">
      <legend
        id="billing-cycle-legend"
        className="text-sm font-semibold text-foreground mb-4"
      >
        Billing cycle
      </legend>

      <RadioGroup
        value={selectedValue}
        onValueChange={handleValueChange}
        aria-labelledby="billing-cycle-legend"
        className="gap-3"
      >
        {options.map((option) => {
          const isSelected = selectedValue === option.value;

          return (
            <div
              key={option.value}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 transition-colors cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:bg-muted/50"
              )}
              onClick={() => handleValueChange(option.value)}
            >
              <RadioGroupItem
                value={option.value}
                id={option.id}
                className="mt-0.5 shrink-0"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex flex-col gap-1 flex-1">
                <Label
                  htmlFor={option.id}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {option.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>

                {option.value === "custom" && isSelected && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex flex-col gap-1.5">
                      <Label
                        htmlFor="custom-days-input"
                        className="text-xs font-medium text-muted-foreground"
                      >
                        Interval in days
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="custom-days-input"
                          type="number"
                          min={1}
                          max={365}
                          placeholder="e.g. 90"
                          value={customDays}
                          onChange={(e) => setCustomDays(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-32 h-8 text-sm"
                          aria-label="Custom billing interval in days"
                        />
                        <span className="text-sm text-muted-foreground">
                          days
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {option.value === "yearly" && (
                <span className="ml-auto shrink-0 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Save 20%
                </span>
              )}
            </div>
          );
        })}
      </RadioGroup>
    </fieldset>
  );
}