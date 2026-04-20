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
    className={cn("grid gap-2", className)}
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
}

export function BillingCycleSelector({
  defaultValue = "monthly",
  value,
  onValueChange,
  disabled = false,
}: BillingCycleSelectorProps) {
  const [customDays, setCustomDays] = React.useState<string>("");
  const [internalValue, setInternalValue] = React.useState<BillingCycle>(
    defaultValue
  );

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const handleValueChange = (next: string) => {
    const cycle = next as BillingCycle;
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
      description: "Billed once every month",
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
      description: "Choose your own billing interval",
    },
  ];

  return (
    <fieldset className="space-y-4 border-0 p-0 m-0" disabled={disabled}>
      <legend className="text-sm font-semibold text-foreground mb-3">
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
          const isSelected = selectedValue === option.value;
          return (
            <div
              key={option.value}
              className={cn(
                "flex items-start gap-3 rounded-lg border px-4 py-3 transition-colors cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:bg-muted/50",
                disabled && "cursor-not-allowed opacity-50"
              )}
              onClick={() => {
                if (!disabled) handleValueChange(option.value);
              }}
            >
              <RadioGroupItem
                value={option.value}
                id={option.id}
                className="mt-0.5 shrink-0"
                disabled={disabled}
              />
              <div className="flex-1 min-w-0">
                <Label
                  htmlFor={option.id}
                  className={cn(
                    "text-sm font-medium leading-none cursor-pointer",
                    disabled && "cursor-not-allowed"
                  )}
                >
                  {option.label}
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  {option.description}
                </p>

                {option.value === "custom" && isSelected && (
                  <div
                    className="mt-3 flex items-center gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="custom-days-input"
                        className="text-xs text-muted-foreground whitespace-nowrap"
                      >
                        Every
                      </Label>
                      <Input
                        id="custom-days-input"
                        type="number"
                        min={1}
                        max={365}
                        placeholder="30"
                        value={customDays}
                        onChange={(e) => setCustomDays(e.target.value)}
                        disabled={disabled}
                        className="h-8 w-20 text-sm"
                      />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        days
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {option.value === "yearly" && (
                <span className="ml-auto shrink-0 self-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  Save 20%
                </span>
              )}
            </div>
          );
        })}
      </RadioGroup>

      {selectedValue === "custom" && customDays && Number(customDays) > 0 && (
        <p className="text-xs text-muted-foreground px-1">
          You will be billed every{" "}
          <span className="font-medium text-foreground">{customDays}</span>{" "}
          {Number(customDays) === 1 ? "day" : "days"}.
        </p>
      )}
    </fieldset>
  );
}