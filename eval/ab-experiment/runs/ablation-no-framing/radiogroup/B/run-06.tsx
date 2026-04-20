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
    className={cn("grid gap-2", className)}
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
      "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span className="h-2 w-2 rounded-full bg-primary block" />
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
    value ?? defaultValue
  );

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const handleValueChange = (next: string) => {
    const typedNext = next as BillingCycle;
    if (!isControlled) {
      setInternalValue(typedNext);
    }
    onValueChange?.(typedNext);
  };

  const legendId = React.useId();
  const customInputId = React.useId();

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
        className="px-1 text-sm font-semibold text-foreground mb-4"
      >
        Billing cycle
      </legend>

      <RadioGroup
        value={selectedValue}
        onValueChange={handleValueChange}
        aria-labelledby={legendId}
        disabled={disabled}
        className="gap-3"
      >
        {/* Monthly */}
        <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
          <RadioGroupItem value="monthly" id="billing-monthly" className="mt-0.5 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <Label
              htmlFor="billing-monthly"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Monthly
            </Label>
            <p className="text-xs text-muted-foreground">
              Billed every month, cancel anytime
            </p>
          </div>
        </div>

        {/* Yearly */}
        <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
          <RadioGroupItem value="yearly" id="billing-yearly" className="mt-0.5 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <Label
              htmlFor="billing-yearly"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Yearly
            </Label>
            <p className="text-xs text-muted-foreground">
              Billed once a year — save up to 20%
            </p>
          </div>
          <span className="ml-auto shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
            Save 20%
          </span>
        </div>

        {/* Custom */}
        <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
          <RadioGroupItem value="custom" id="billing-custom" className="mt-0.5 shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1">
            <Label
              htmlFor="billing-custom"
              className="text-sm font-medium leading-none cursor-pointer"
            >
              Custom
            </Label>
            <p className="text-xs text-muted-foreground">
              Define your own billing interval
            </p>
            {selectedValue === "custom" && (
              <div className="mt-2 flex items-center gap-2">
                <Label
                  htmlFor={customInputId}
                  className="text-xs text-muted-foreground shrink-0"
                >
                  Every
                </Label>
                <Input
                  id={customInputId}
                  type="number"
                  min={1}
                  max={365}
                  placeholder="30"
                  value={customDays}
                  onChange={(e) => setCustomDays(e.target.value)}
                  className="h-7 w-20 text-xs"
                  aria-label="Number of days for custom billing cycle"
                />
                <span className="text-xs text-muted-foreground">days</span>
              </div>
            )}
          </div>
        </div>
      </RadioGroup>

      {/* Summary footer */}
      <div className="mt-4 rounded-lg bg-muted px-4 py-3">
        <p className="text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Selected: </span>
          {selectedValue === "monthly" && "Monthly billing"}
          {selectedValue === "yearly" && "Yearly billing (20% discount applied)"}
          {selectedValue === "custom" &&
            (customDays
              ? `Custom billing every ${customDays} day${Number(customDays) !== 1 ? "s" : ""}`
              : "Custom billing — enter an interval above")}
        </p>
      </div>
    </fieldset>
  );
}