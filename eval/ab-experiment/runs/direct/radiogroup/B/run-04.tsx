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
      "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span className="block h-2 w-2 rounded-full bg-primary-foreground" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";

type BillingCycle = "monthly" | "yearly" | "custom";

interface BillingCycleSelectorProps {
  defaultValue?: BillingCycle;
  value?: BillingCycle;
  onValueChange?: (value: BillingCycle) => void;
  className?: string;
}

export function BillingCycleSelector({
  defaultValue = "monthly",
  value,
  onValueChange,
  className,
}: BillingCycleSelectorProps) {
  const [customDays, setCustomDays] = React.useState<string>("");
  const legendId = React.useId();
  const monthlyId = React.useId();
  const yearlyId = React.useId();
  const customId = React.useId();
  const customInputId = React.useId();
  const customDescId = React.useId();

  const selectedValue = value;

  const handleValueChange = (val: string) => {
    onValueChange?.(val as BillingCycle);
  };

  const isControlled = value !== undefined;
  const isCustomSelected = isControlled
    ? value === "custom"
    : selectedValue === "custom";

  const [internalValue, setInternalValue] = React.useState<BillingCycle>(
    defaultValue
  );

  const resolvedValue = isControlled ? value : internalValue;
  const isCustomActive = resolvedValue === "custom";

  const handleChange = (val: string) => {
    if (!isControlled) {
      setInternalValue(val as BillingCycle);
    }
    onValueChange?.(val as BillingCycle);
  };

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
          value={resolvedValue}
          onValueChange={handleChange}
          className="gap-3"
        >
          {/* Monthly */}
          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
            <RadioGroupItem value="monthly" id={monthlyId} className="mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <Label
                htmlFor={monthlyId}
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                Monthly
              </Label>
              <p className="text-xs text-muted-foreground">
                Billed once every month
              </p>
            </div>
          </div>

          {/* Yearly */}
          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
            <RadioGroupItem value="yearly" id={yearlyId} className="mt-0.5" />
            <div className="flex flex-col gap-0.5">
              <Label
                htmlFor={yearlyId}
                className="text-sm font-medium text-foreground cursor-pointer"
              >
                Yearly
              </Label>
              <p className="text-xs text-muted-foreground">
                Billed once every year — save up to 20%
              </p>
            </div>
          </div>

          {/* Custom */}
          <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:bg-accent/40 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
            <RadioGroupItem value="custom" id={customId} className="mt-0.5" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex flex-col gap-0.5">
                <Label
                  htmlFor={customId}
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  Custom
                </Label>
                <p className="text-xs text-muted-foreground">
                  Define your own billing interval in days
                </p>
              </div>

              {isCustomActive && (
                <div className="flex flex-col gap-1.5 mt-1">
                  <Label
                    htmlFor={customInputId}
                    className="text-xs font-medium text-foreground"
                  >
                    Interval length
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id={customInputId}
                      type="number"
                      min={1}
                      max={365}
                      placeholder="e.g. 90"
                      value={customDays}
                      onChange={(e) => setCustomDays(e.target.value)}
                      aria-describedby={customDescId}
                      className="h-8 w-28 text-sm"
                    />
                    <span className="text-sm text-muted-foreground">days</span>
                  </div>
                  <p id={customDescId} className="text-xs text-muted-foreground">
                    Enter a value between 1 and 365.
                  </p>
                </div>
              )}
            </div>
          </div>
        </RadioGroup>
      </fieldset>
    </div>
  );
}