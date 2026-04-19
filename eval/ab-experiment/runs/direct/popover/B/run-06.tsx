"use client";

import { useState, useId } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  { label: "Slate", value: "#64748b" },
  { label: "Red", value: "#ef4444" },
  { label: "Orange", value: "#f97316" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Yellow", value: "#eab308" },
  { label: "Lime", value: "#84cc16" },
  { label: "Green", value: "#22c55e" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Indigo", value: "#6366f1" },
  { label: "Violet", value: "#8b5cf6" },
  { label: "Purple", value: "#a855f7" },
  { label: "Pink", value: "#ec4899" },
  { label: "Rose", value: "#f43f5e" },
  { label: "White", value: "#ffffff" },
  { label: "Gray", value: "#9ca3af" },
  { label: "Black", value: "#000000" },
];

function isValidHex(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
      .join("")
  );
}

interface ColorPickerPopoverProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
  className?: string;
}

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  label = "Color",
  className,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = useState(false);
  const [internalColor, setInternalColor] = useState(value);
  const [hexInput, setHexInput] = useState(value);
  const [hexError, setHexError] = useState(false);

  const titleId = useId();
  const descId = useId();

  const rgb = hexToRgb(internalColor) ?? { r: 59, g: 130, b: 246 };

  function applyColor(hex: string) {
    const normalized = hex.startsWith("#") ? hex : `#${hex}`;
    setInternalColor(normalized);
    setHexInput(normalized);
    setHexError(false);
    onChange?.(normalized);
  }

  function handleHexInputChange(raw: string) {
    setHexInput(raw);
    const withHash = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(withHash)) {
      setHexError(false);
      setInternalColor(withHash);
      onChange?.(withHash);
    } else {
      setHexError(true);
    }
  }

  function handleChannelChange(
    channel: "r" | "g" | "b",
    rawValue: string
  ) {
    const num = Math.max(0, Math.min(255, Number(rawValue)));
    if (isNaN(num)) return;
    const next = {
      ...rgb,
      [channel]: num,
    };
    const hex = rgbToHex(next.r, next.g, next.b);
    applyColor(hex);
  }

  function handleNativePickerChange(e: React.ChangeEvent<HTMLInputElement>) {
    applyColor(e.target.value);
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {label && (
        <span className="text-sm font-medium text-foreground">{label}</span>
      )}
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <Button
            variant="outline"
            className="flex h-9 items-center gap-2 px-3"
            aria-label={`${label}: ${internalColor}. Click to open color picker.`}
          >
            <span
              className="h-5 w-5 rounded-sm border border-black/10 shadow-inner flex-shrink-0"
              style={{ backgroundColor: internalColor }}
              aria-hidden="true"
            />
            <span className="font-mono text-xs tracking-wide">
              {internalColor.toUpperCase()}
            </span>
            <Pipette className="ml-1 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          </Button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            side="bottom"
            align="start"
            sideOffset={8}
            aria-labelledby={titleId}
            aria-describedby={descId}
            className={cn(
              "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "@media (prefers-reduced-motion: reduce) { animation: none !important; }"
            )}
            style={
              {
                "--tw-ring-shadow": "none",
              } as React.CSSProperties
            }
          >
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p
                  id={titleId}
                  className="text-sm font-semibold leading-none text-popover-foreground"
                >
                  Color picker
                </p>
                <p
                  id={descId}
                  className="mt-1 text-xs text-muted-foreground"
                >
                  Choose a theme color using swatches, sliders, or a hex value.
                </p>
              </div>
              <PopoverPrimitive.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  aria-label="Close color picker"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </PopoverPrimitive.Close>
            </div>

            {/* Native color preview + picker */}
            <div className="mb-4 flex items-center gap-3">
              <label className="relative h-14 w-14 cursor-pointer flex-shrink-0 overflow-hidden rounded-lg border border-border shadow-sm">
                <span
                  className="absolute inset-0 rounded-lg"
                  style={{ backgroundColor: internalColor }}
                  aria-hidden="true"
                />
                <input
                  type="color"
                  value={internalColor}
                  onChange={handleNativePickerChange}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Native color picker"
                />
              </label>
              <div className="flex-1 space-y-1">
                <Label htmlFor="hex-input" className="text-xs">
                  Hex
                </Label>
                <Input
                  id="hex-input"
                  value={hexInput}
                  onChange={(e) => handleHexInputChange(e.target.value)}
                  className={cn(
                    "h-8 font-mono text-xs",
                    hexError && "border-destructive focus-visible:ring-destructive"
                  )}
                  placeholder="#000000"
                  spellCheck={false}
                  aria-invalid={hexError}
                  aria-describedby={hexError ? "hex-error" : undefined}
                />
                {hexError && (
                  <p id="hex-error" className="text-xs text-destructive">
                    Invalid hex color.
                  </p>
                )}
              </div>
            </div>

            {/* RGB sliders */}
            <div className="mb-4 space-y-2">
              {(["r", "g", "b"] as const).map((ch) => {
                const labelMap = { r: "Red", g: "Green", b: "Blue" };
                const trackColors = {
                  r: "linear-gradient(to right, #000, #ff0000)",
                  g: "linear-gradient(to right, #000, #00ff00)",
                  b: "linear-gradient(to right, #000, #0000ff)",
                };
                return (
                  <div key={ch} className="flex items-center gap-2">
                    <span className="w-8 text-xs font-medium text-muted-foreground">
                      {labelMap[ch]}
                    </span>
                    <div className="relative flex-1">
                      <div
                        className="absolute inset-y-0 my-auto h-2 w-full rounded-full"
                        style={{ background: trackColors[ch] }}
                        aria-hidden="true"
                      />
                      <input
                        type="range"
                        min={0}
                        max={255}
                        value={rgb[ch]}
                        onChange={(e) =>
                          handleChannelChange(ch, e.target.value)
                        }
                        className="relative w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:shadow-md"
                        aria-label={`${labelMap[ch]} channel: ${rgb[ch]}`}
                      />
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={255}
                      value={rgb[ch]}
                      onChange={(e) => handleChannelChange(ch, e.target.value)}
                      className="h-7 w-12 rounded-md border border-input bg-background px-1.5 text-center font-mono text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                      aria-label={`${labelMap[ch]} value`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Preset swatches */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Presets
              </p>
              <div
                className="grid grid-cols-9 gap-1.5"
                role="group"
                aria-label="Preset colors"
              >
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => applyColor(preset.value)}
                    title={preset.label}
                    aria-label={`${preset.label} (${preset.value})`}
                    aria-pressed={
                      internalColor.toLowerCase() ===
                      preset.value.toLowerCase()
                    }
                    className={cn(
                      "h-6 w-6 rounded-md border border-black/10 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                      internalColor.toLowerCase() ===
                        preset.value.toLowerCase() &&
                        "ring-2 ring-ring ring-offset-1 scale-110"
                    )}
                    style={{ backgroundColor: preset.value }}
                  />
                ))}
              </div>
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}