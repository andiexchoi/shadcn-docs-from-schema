"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const options = [
  {
    value: "monthly",
    label: "Monthly",
    description: "Billed once every month",
  },
  {
    value: "yearly",
    label: "Yearly",
    description: "Billed once per year — save up to 20%",
  },
  {
    value: "custom",
    label: "Custom",
    description: "Set your own billing interval",
  },
];

export function BillingCycleSelector() {
  const [selected, setSelected] = React.useState("monthly");
  const [customDays, setCustomDays] = React.useState("");
  const [customError, setCustomError] = React.useState("");

  const legendId = React.useId();
  const customInputId = React.useId();
  const customErrorId = React.useId();

  function handleValueChange(value: string) {
    setSelected(value);
    if (value !== "custom") {
      setCustomError("");
    }
  }

  function handleCustomDaysChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setCustomDays(val);
    const num = Number(val);
    if (val === "") {
      setCustomError("Please enter a number of days.");
    } else if (!Number.isInteger(num) || num < 1) {
      setCustomError("Enter a whole number greater than 0.");
    } else if (num > 365) {
      setCustomError("Custom interval cannot exceed 365 days.");
    } else {
      setCustomError("");
    }
  }

  return (
    <div className="w-full max-w-md">
      <fieldset className="border-0 p-0 m-0">
        <legend
          id={legendId}
          className="text-base font-semibold text-foreground mb-4"
        >
          Billing cycle
        </legend>

        <RadioGroupPrimitive.Root
          value={selected}
          onValueChange={handleValueChange}
          aria-labelledby={legendId}
          className="flex flex-col gap-3"
        >
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 transition-colors",
                selected === option.value
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:bg-muted/50"
              )}
            >
              <RadioGroupPrimitive.Item
                id={option.value}
                value={option.value}
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0 rounded-full border border-primary ring-offset-background",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                )}
              >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                </RadioGroupPrimitive.Indicator>
              </RadioGroupPrimitive.Item>

              <div className="flex flex-col gap-1 flex-1">
                <Label
                  htmlFor={option.value}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {option.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>

                {option.value === "custom" && selected === "custom" && (
                  <div className="mt-3 flex flex-col gap-1.5">
                    <Label
                      htmlFor={customInputId}
                      className="text-sm font-medium"
                    >
                      Interval in days
                    </Label>
                    <Input
                      id={customInputId}
                      type="number"
                      min={1}
                      max={365}
                      placeholder="e.g. 14"
                      value={customDays}
                      onChange={handleCustomDaysChange}
                      aria-invalid={!!customError}
                      aria-describedby={
                        customError ? customErrorId : undefined
                      }
                      className={cn(
                        "max-w-[160px]",
                        customError &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {customError && (
                      <p
                        id={customErrorId}
                        className="text-sm text-destructive"
                        role="alert"
                      >
                        {customError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </RadioGroupPrimitive.Root>
      </fieldset>

      <div className="mt-6 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
        {selected === "monthly" && (
          <span>
            You are on a <strong className="text-foreground">monthly</strong>{" "}
            billing cycle.
          </span>
        )}
        {selected === "yearly" && (
          <span>
            You are on a <strong className="text-foreground">yearly</strong>{" "}
            billing cycle.
          </span>
        )}
        {selected === "custom" && (
          <span>
            {customDays && !customError ? (
              <>
                You are on a{" "}
                <strong className="text-foreground">
                  {customDays}-day
                </strong>{" "}
                custom billing cycle.
              </>
            ) : (
              "Enter the number of days for your custom billing cycle."
            )}
          </span>
        )}
      </div>
    </div>
  );
}