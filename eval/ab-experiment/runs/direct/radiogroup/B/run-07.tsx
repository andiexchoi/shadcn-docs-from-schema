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
  const [customDays, setCustomDays] = React.useState<string>("");
  const [customError, setCustomError] = React.useState<string>("");

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<BillingCycle>(
    defaultValue
  );
  const selectedValue = isControlled ? value : internalValue;

  const handleValueChange = (next: string) => {
    const cycle = next as BillingCycle;
    if (!isControlled) setInternalValue(cycle);
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
      setCustomError("Enter the number of days.");
    } else if (isNaN(num) || num < 1) {
      setCustomError("Enter a number greater than 0.");
    } else if (num > 365) {
      setCustomError("Enter a number no greater than 365.");
    } else {
      setCustomError("");
    }
  };

  const legendId = React.useId();

  return (
    <fieldset className={cn("border-0 p-0 m-0", className)}>
      <legend
        id={legendId}
        className="text-sm font-semibold text-foreground mb-3"
      >
        Billing cycle
      </legend>

      <RadioGroup
        aria-labelledby={legendId}
        value={selectedValue}
        onValueChange={handleValueChange}
      >
        {/* Monthly */}
        <div className="flex items-start gap-3">
          <RadioGroupItem value="monthly" id="billing-monthly" />
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="billing-monthly" className="font-medium leading-none cursor-pointer">
              Monthly
            </Label>
            <p className="text-xs text-muted-foreground">
              Billed once every month
            </p>
          </div>
        </div>

        {/* Yearly */}
        <div className="flex items-start gap-3">
          <RadioGroupItem value="yearly" id="billing-yearly" />
          <div className="flex flex-col gap-0.5">
            <Label htmlFor="billing-yearly" className="font-medium leading-none cursor-pointer">
              Yearly
            </Label>
            <p className="text-xs text-muted-foreground">
              Billed once every year — save up to 20%
            </p>
          </div>
        </div>

        {/* Custom */}
        <div className="flex items-start gap-3">
          <RadioGroupItem
            value="custom"
            id="billing-custom"
            aria-invalid={selectedValue === "custom" && customError !== "" ? true : undefined}
          />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="billing-custom" className="font-medium leading-none cursor-pointer">
              Custom
            </Label>
            <p className="text-xs text-muted-foreground">
              Set a custom billing interval in days
            </p>

            {selectedValue === "custom" && (
              <div className="mt-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Input
                    id="billing-custom-days"
                    type="number"
                    min={1}
                    max={365}
                    placeholder="e.g. 90"
                    value={customDays}
                    onChange={handleCustomDaysChange}
                    aria-invalid={customError !== "" ? true : undefined}
                    aria-describedby={
                      customError ? "billing-custom-error" : undefined
                    }
                    className={cn(
                      "h-8 w-28 text-sm",
                      customError &&
                        "border-destructive focus-visible:ring-destructive"
                    )}
                  />
                  <Label
                    htmlFor="billing-custom-days"
                    className="text-sm text-muted-foreground"
                  >
                    days
                  </Label>
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
    </fieldset>
  );
}