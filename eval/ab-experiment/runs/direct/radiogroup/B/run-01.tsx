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
      "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span className="block h-2 w-2 rounded-full bg-white" />
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
  const customInputId = React.useId();
  const customErrorId = React.useId();

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

    if (raw === "") {
      setCustomError("Please enter a number of days.");
      return;
    }
    const parsed = parseInt(raw, 10);
    if (isNaN(parsed) || parsed <= 0) {
      setCustomError("Enter a positive whole number of days.");
    } else if (parsed > 365) {
      setCustomError("Custom cycle cannot exceed 365 days.");
    } else {
      setCustomError("");
    }
  };

  const options: { value: BillingCycle; label: string; description: string }[] =
    [
      {
        value: "monthly",
        label: "Monthly",
        description: "Billed every 30 days",
      },
      {
        value: "yearly",
        label: "Yearly",
        description: "Billed once a year — save up to 20%",
      },
      {
        value: "custom",
        label: "Custom",
        description: "Choose your own billing interval",
      },
    ];

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <fieldset className="border-0 p-0 m-0">
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
            const itemId = `billing-cycle-${option.value}`;
            const descId = `billing-cycle-desc-${option.value}`;
            const isSelected = selectedValue === option.value;

            return (
              <div key={option.value}>
                <label
                  htmlFor={itemId}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                    "hover:bg-muted/50",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background"
                  )}
                >
                  <RadioGroupItem
                    id={itemId}
                    value={option.value}
                    aria-describedby={descId}
                    className="mt-0.5 shrink-0"
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium leading-none text-foreground">
                      {option.label}
                    </span>
                    <span
                      id={descId}
                      className="text-xs text-muted-foreground"
                    >
                      {option.description}
                    </span>
                  </div>
                </label>

                {option.value === "custom" && isSelected && (
                  <div className="mt-2 ml-7 flex flex-col gap-1.5">
                    <Label
                      htmlFor={customInputId}
                      className="text-xs font-medium text-foreground"
                    >
                      Number of days
                    </Label>
                    <Input
                      id={customInputId}
                      type="number"
                      min={1}
                      max={365}
                      placeholder="e.g. 14"
                      value={customDays}
                      onChange={handleCustomDaysChange}
                      aria-describedby={
                        customError ? customErrorId : undefined
                      }
                      aria-invalid={customError ? true : undefined}
                      className={cn(
                        "h-8 w-36 text-sm",
                        customError &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {customError && (
                      <p
                        id={customErrorId}
                        className="text-xs text-destructive"
                        role="alert"
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
    </div>
  );
}