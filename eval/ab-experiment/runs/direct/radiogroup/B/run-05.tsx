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
  disabled?: boolean;
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
      <div className="h-2 w-2 rounded-full bg-primary-foreground" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";

const legendId = "billing-cycle-legend";

export function BillingCycleSelector({
  defaultValue = "monthly",
  value,
  onValueChange,
  disabled = false,
  className,
}: BillingCycleSelectorProps) {
  const [internalValue, setInternalValue] = React.useState<BillingCycle>(
    value ?? defaultValue
  );
  const [customDays, setCustomDays] = React.useState<string>("");
  const [customError, setCustomError] = React.useState<string>("");

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const handleValueChange = (next: string) => {
    const cycle = next as BillingCycle;
    if (!isControlled) {
      setInternalValue(cycle);
    }
    onValueChange?.(cycle);
    if (cycle !== "custom") {
      setCustomError("");
    }
  };

  const handleCustomDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setCustomDays(raw);
    const num = parseInt(raw, 10);
    if (raw === "") {
      setCustomError("Please enter a number of days.");
    } else if (isNaN(num) || num < 1) {
      setCustomError("Enter a whole number greater than 0.");
    } else {
      setCustomError("");
    }
  };

  return (
    <fieldset
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm w-full max-w-sm",
        className
      )}
      disabled={disabled}
    >
      <legend
        id={legendId}
        className="mb-4 text-sm font-semibold text-foreground px-1"
      >
        Billing cycle
      </legend>

      <RadioGroup
        value={selectedValue}
        onValueChange={handleValueChange}
        aria-labelledby={legendId}
        disabled={disabled}
      >
        {/* Monthly */}
        <div className="flex items-start gap-3">
          <RadioGroupItem value="monthly" id="billing-monthly" />
          <div className="flex flex-col gap-0.5">
            <Label
              htmlFor="billing-monthly"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Monthly
            </Label>
            <p className="text-xs text-muted-foreground">
              Billed once per month
            </p>
          </div>
        </div>

        {/* Yearly */}
        <div className="flex items-start gap-3">
          <RadioGroupItem value="yearly" id="billing-yearly" />
          <div className="flex flex-col gap-0.5">
            <Label
              htmlFor="billing-yearly"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Yearly
            </Label>
            <p className="text-xs text-muted-foreground">
              Billed once per year — save up to 20%
            </p>
          </div>
        </div>

        {/* Custom */}
        <div className="flex items-start gap-3">
          <RadioGroupItem
            value="custom"
            id="billing-custom"
            aria-invalid={
              selectedValue === "custom" && customError !== ""
                ? "true"
                : undefined
            }
          />
          <div className="flex flex-col gap-1.5 flex-1">
            <Label
              htmlFor="billing-custom"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Custom
            </Label>
            <p className="text-xs text-muted-foreground">
              Set your own billing interval in days
            </p>

            {selectedValue === "custom" && (
              <div className="mt-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Input
                    id="billing-custom-days"
                    type="number"
                    min={1}
                    placeholder="e.g. 14"
                    value={customDays}
                    onChange={handleCustomDaysChange}
                    disabled={disabled}
                    aria-label="Number of days for custom billing cycle"
                    aria-describedby={
                      customError ? "billing-custom-error" : undefined
                    }
                    aria-invalid={customError ? "true" : undefined}
                    className={cn(
                      "h-8 w-28 text-sm",
                      customError &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
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
        </div>
      </RadioGroup>

      {/* Summary footer */}
      <div className="mt-6 rounded-lg bg-muted px-4 py-3 text-xs text-muted-foreground">
        {selectedValue === "monthly" && (
          <span>
            <span className="font-medium text-foreground">Monthly</span> billing
            selected. You will be invoiced every 30 days.
          </span>
        )}
        {selectedValue === "yearly" && (
          <span>
            <span className="font-medium text-foreground">Yearly</span> billing
            selected. You will be invoiced once per year.
          </span>
        )}
        {selectedValue === "custom" && (
          <span>
            <span className="font-medium text-foreground">Custom</span> billing
            selected.{" "}
            {customDays && !customError
              ? `You will be invoiced every ${customDays} day${
                  customDays === "1" ? "" : "s"
                }.`
              : "Enter the number of days above to configure your interval."}
          </span>
        )}
      </div>
    </fieldset>
  );
}