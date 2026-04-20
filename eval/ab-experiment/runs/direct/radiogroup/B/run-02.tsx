"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const cycles = [
  {
    value: "monthly",
    label: "Monthly",
    description: "Billed every month",
  },
  {
    value: "yearly",
    label: "Yearly",
    description: "Billed once per year",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Set your own billing interval",
  },
] as const;

type CycleValue = (typeof cycles)[number]["value"];

export function BillingCycleSelector() {
  const [selected, setSelected] = React.useState<CycleValue>("monthly");
  const [customDays, setCustomDays] = React.useState<string>("");
  const [customError, setCustomError] = React.useState<string>("");

  const legendId = React.useId();

  function handleValueChange(value: string) {
    setSelected(value as CycleValue);
    if (value !== "custom") {
      setCustomError("");
    }
  }

  function handleCustomDaysChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setCustomDays(raw);

    if (raw === "") {
      setCustomError("Please enter the number of days.");
    } else {
      const n = Number(raw);
      if (!Number.isInteger(n) || n < 1) {
        setCustomError("Enter a whole number greater than 0.");
      } else {
        setCustomError("");
      }
    }
  }

  return (
    <div className="w-full max-w-sm space-y-4">
      <fieldset className="space-y-1 border-0 p-0 m-0">
        <legend
          id={legendId}
          className="text-sm font-semibold text-foreground mb-3"
        >
          Billing cycle
        </legend>

        <RadioGroupPrimitive.Root
          value={selected}
          onValueChange={handleValueChange}
          aria-labelledby={legendId}
          className="flex flex-col gap-3"
        >
          {cycles.map((cycle) => {
            const itemId = `billing-cycle-${cycle.value}`;
            const descId = `billing-cycle-${cycle.value}-desc`;
            const isCustom = cycle.value === "custom";
            const hasError = isCustom && selected === "custom" && !!customError;

            return (
              <div key={cycle.value} className="flex flex-col gap-1.5">
                <div className="flex items-start gap-3">
                  <RadioGroupPrimitive.Item
                    id={itemId}
                    value={cycle.value}
                    aria-describedby={descId}
                    aria-invalid={hasError ? true : undefined}
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0 rounded-full border border-input shadow-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
                      hasError &&
                        "border-destructive data-[state=checked]:bg-destructive data-[state=checked]:border-destructive"
                    )}
                  >
                    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </RadioGroupPrimitive.Indicator>
                  </RadioGroupPrimitive.Item>

                  <div className="flex flex-col gap-0.5">
                    <Label
                      htmlFor={itemId}
                      className="cursor-pointer text-sm font-medium leading-none"
                    >
                      {cycle.label}
                    </Label>
                    <p
                      id={descId}
                      className="text-xs text-muted-foreground"
                    >
                      {cycle.description}
                    </p>
                  </div>
                </div>

                {isCustom && selected === "custom" && (
                  <div className="ml-7 flex flex-col gap-1">
                    <Label
                      htmlFor="custom-days-input"
                      className="text-xs text-muted-foreground"
                    >
                      Number of days
                    </Label>
                    <Input
                      id="custom-days-input"
                      type="number"
                      min={1}
                      step={1}
                      placeholder="e.g. 14"
                      value={customDays}
                      onChange={handleCustomDaysChange}
                      aria-invalid={hasError}
                      aria-describedby={
                        hasError ? "custom-days-error" : undefined
                      }
                      className={cn(
                        "h-8 w-32 text-sm",
                        hasError &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {hasError && (
                      <p
                        id="custom-days-error"
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
        </RadioGroupPrimitive.Root>
      </fieldset>

      <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
        {selected === "monthly" && (
          <span>
            You will be billed <strong className="text-foreground">every month</strong>.
          </span>
        )}
        {selected === "yearly" && (
          <span>
            You will be billed <strong className="text-foreground">once per year</strong>.
          </span>
        )}
        {selected === "custom" && (
          <span>
            {customDays && !customError ? (
              <>
                You will be billed every{" "}
                <strong className="text-foreground">
                  {customDays} {Number(customDays) === 1 ? "day" : "days"}
                </strong>
                .
              </>
            ) : (
              "Enter a custom billing interval in days."
            )}
          </span>
        )}
      </div>
    </div>
  );
}