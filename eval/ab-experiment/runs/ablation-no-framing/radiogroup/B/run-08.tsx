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
      "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
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

type BillingCycle = "monthly" | "yearly" | "custom";

interface BillingCycleSelectorProps {
  defaultValue?: BillingCycle;
  value?: BillingCycle;
  onValueChange?: (value: BillingCycle) => void;
  disabled?: boolean;
  className?: string;
}

const options: { value: BillingCycle; label: string; description: string }[] =
  [
    {
      value: "monthly",
      label: "Monthly",
      description: "Billed every month. Cancel anytime.",
    },
    {
      value: "yearly",
      label: "Yearly",
      description: "Billed once per year. Save up to 20%.",
    },
    {
      value: "custom",
      label: "Custom",
      description: "Set your own billing interval.",
    },
  ];

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
    if (raw === "") {
      setCustomError("Please enter a number of days.");
    } else if (isNaN(parsed) || parsed < 1) {
      setCustomError("Must be at least 1 day.");
    } else if (parsed > 365) {
      setCustomError("Must be 365 days or fewer.");
    } else {
      setCustomError("");
    }
  };

  const legendId = React.useId();

  return (
    <fieldset
      className={cn("border-0 m-0 p-0", className)}
      aria-labelledby={legendId}
    >
      <legend
        id={legendId}
        className="text-base font-semibold text-foreground mb-4"
      >
        Billing cycle
      </legend>

      <RadioGroup
        defaultValue={isControlled ? undefined : defaultValue}
        value={isControlled ? value : internalValue}
        onValueChange={handleValueChange}
        disabled={disabled}
        aria-labelledby={legendId}
        className="gap-3"
      >
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          const isCustom = option.value === "custom";

          return (
            <div key={option.value}>
              <div
                className={cn(
                  "flex items-start gap-4 rounded-lg border p-4 transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:bg-muted/50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <RadioGroupItem
                  value={option.value}
                  id={option.value}
                  className="mt-0.5 shrink-0"
                  aria-invalid={
                    isCustom && isSelected && customError !== ""
                      ? true
                      : undefined
                  }
                />
                <div className="flex flex-col gap-1 flex-1">
                  <Label
                    htmlFor={option.value}
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

                  {isCustom && isSelected && (
                    <div className="mt-3 flex flex-col gap-1.5">
                      <Label
                        htmlFor="custom-days"
                        className="text-xs font-medium text-foreground"
                      >
                        Number of days
                      </Label>
                      <Input
                        id="custom-days"
                        type="number"
                        min={1}
                        max={365}
                        placeholder="e.g. 90"
                        value={customDays}
                        onChange={handleCustomDaysChange}
                        disabled={disabled}
                        aria-invalid={customError !== "" ? true : undefined}
                        aria-describedby={
                          customError !== "" ? "custom-days-error" : undefined
                        }
                        className={cn(
                          "h-8 w-40 text-sm",
                          customError !== "" &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {customError !== "" && (
                        <p
                          id="custom-days-error"
                          className="text-xs text-destructive"
                          role="alert"
                        >
                          {customError}
                        </p>
                      )}
                      {customDays !== "" &&
                        customError === "" &&
                        parseInt(customDays, 10) >= 1 && (
                          <p className="text-xs text-muted-foreground">
                            You will be billed every{" "}
                            <span className="font-medium text-foreground">
                              {parseInt(customDays, 10)}{" "}
                              {parseInt(customDays, 10) === 1 ? "day" : "days"}
                            </span>
                            .
                          </p>
                        )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </fieldset>
  );
}