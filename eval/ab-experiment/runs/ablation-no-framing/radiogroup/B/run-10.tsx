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
      "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <div className="h-2 w-2 rounded-full bg-primary" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";

type BillingCycle = "monthly" | "yearly" | "custom";

interface BillingCycleSelectorProps {
  defaultValue?: BillingCycle;
  value?: BillingCycle;
  onValueChange?: (value: BillingCycle) => void;
  disabled?: boolean;
  className?: string;
}

export function BillingCycleSelector({
  defaultValue = "monthly",
  value,
  onValueChange,
  disabled = false,
  className,
}: BillingCycleSelectorProps) {
  const [customDays, setCustomDays] = React.useState<string>("");
  const [internalValue, setInternalValue] = React.useState<BillingCycle>(
    defaultValue
  );

  const isControlled = value !== undefined;
  const selectedCycle = isControlled ? value : internalValue;

  const handleValueChange = (next: string) => {
    const typed = next as BillingCycle;
    if (!isControlled) {
      setInternalValue(typed);
    }
    onValueChange?.(typed);
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
        description: "Billed once a year — save up to 20%",
      },
      {
        value: "custom",
        label: "Custom",
        description: "Set your own billing interval",
      },
    ];

  return (
    <fieldset
      className={cn("border-0 p-0 m-0", className)}
      disabled={disabled}
    >
      <legend
        id="billing-cycle-legend"
        className="mb-4 text-base font-semibold text-foreground"
      >
        Billing cycle
      </legend>

      <RadioGroup
        defaultValue={isControlled ? undefined : defaultValue}
        value={isControlled ? value : undefined}
        onValueChange={handleValueChange}
        disabled={disabled}
        aria-labelledby="billing-cycle-legend"
        className="gap-3"
      >
        {options.map((option) => {
          const isSelected = selectedCycle === option.value;

          return (
            <div
              key={option.value}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 transition-colors",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:bg-muted/50",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <RadioGroupItem
                value={option.value}
                id={`billing-${option.value}`}
                className="mt-0.5 shrink-0"
                disabled={disabled}
              />
              <div className="flex flex-col gap-1 flex-1">
                <Label
                  htmlFor={`billing-${option.value}`}
                  className={cn(
                    "text-sm font-medium leading-none cursor-pointer",
                    disabled && "cursor-not-allowed"
                  )}
                >
                  {option.label}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {option.description}
                </p>

                {option.value === "custom" && isSelected && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex flex-col gap-1.5">
                      <Label
                        htmlFor="custom-days-input"
                        className="text-xs font-medium text-foreground"
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
                          disabled={disabled}
                          className="h-8 w-32 text-sm"
                        />
                        <span className="text-xs text-muted-foreground">
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