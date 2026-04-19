"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Utility helpers ──────────────────────────────────────────────────────────

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let r = 0,
    g = 0,
    b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16);
    g = parseInt(hex.slice(3, 5), 16);
    b = parseInt(hex.slice(5, 7), 16);
  }
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function isValidHex(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

// ─── Preset palette ───────────────────────────────────────────────────────────

const PRESETS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#ffffff",
  "#d4d4d4",
  "#737373",
  "#404040",
  "#171717",
  "#000000",
  "#fef9c3",
  "#fde68a",
  "#bbf7d0",
  "#bfdbfe",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  gradient: string;
}

function GradientSlider({
  label,
  value,
  min,
  max,
  onChange,
  gradient,
}: SliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">
          {value}
        </span>
      </div>
      <div className="relative h-3 rounded-full" style={{ background: gradient }}>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full border-2 border-white shadow-md pointer-events-none"
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 8px)` }}
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export interface ColorPickerPopoverProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  label = "Color",
  disabled = false,
  className,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [internalColor, setInternalColor] = React.useState(
    isValidHex(value) ? value : "#3b82f6"
  );
  const [hexInput, setHexInput] = React.useState(internalColor);
  const [hsl, setHsl] = React.useState(() => hexToHsl(internalColor));

  // Sync external value
  React.useEffect(() => {
    if (isValidHex(value) && value !== internalColor) {
      setInternalColor(value);
      setHexInput(value);
      setHsl(hexToHsl(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commit = React.useCallback(
    (hex: string) => {
      setInternalColor(hex);
      setHexInput(hex);
      setHsl(hexToHsl(hex));
      onChange?.(hex);
    },
    [onChange]
  );

  const handleHslChange = (key: "h" | "s" | "l", v: number) => {
    const next = { ...hsl, [key]: v };
    setHsl(next);
    const hex = hslToHex(next.h, next.s, next.l);
    setInternalColor(hex);
    setHexInput(hex);
    onChange?.(hex);
  };

  const handleHexInput = (raw: string) => {
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      commit(normalized);
    }
  };

  // Computed gradients for sliders
  const hGradient = `linear-gradient(to right,
    hsl(0,${hsl.s}%,${hsl.l}%),
    hsl(60,${hsl.s}%,${hsl.l}%),
    hsl(120,${hsl.s}%,${hsl.l}%),
    hsl(180,${hsl.s}%,${hsl.l}%),
    hsl(240,${hsl.s}%,${hsl.l}%),
    hsl(300,${hsl.s}%,${hsl.l}%),
    hsl(360,${hsl.s}%,${hsl.l}%))`;
  const sGradient = `linear-gradient(to right,
    hsl(${hsl.h},0%,${hsl.l}%),
    hsl(${hsl.h},100%,${hsl.l}%))`;
  const lGradient = `linear-gradient(to right,
    hsl(${hsl.h},${hsl.s}%,0%),
    hsl(${hsl.h},${hsl.s}%,50%),
    hsl(${hsl.h},${hsl.s}%,100%))`;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <Label className="text-sm">{label}</Label>}
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            disabled={disabled}
            aria-label="Open color picker"
            className={cn(
              "flex items-center gap-2 h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm",
              "hover:bg-accent hover:text-accent-foreground transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <span
              className="h-5 w-5 rounded-sm border border-black/10 flex-shrink-0"
              style={{ backgroundColor: internalColor }}
            />
            <span className="font-mono uppercase tracking-wide">
              {internalColor}
            </span>
            <Pipette className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            sideOffset={8}
            align="start"
            className={cn(
              "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">Color Picker</p>
              <PopoverPrimitive.Close asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Close</span>
                </Button>
              </PopoverPrimitive.Close>
            </div>

            {/* Preview bar */}
            <div
              className="w-full h-12 rounded-lg mb-4 border border-black/10"
              style={{ backgroundColor: internalColor }}
            />

            {/* HSL Sliders */}
            <div className="space-y-4 mb-4">
              <GradientSlider
                label="Hue"
                value={hsl.h}
                min={0}
                max={360}
                gradient={hGradient}
                onChange={(v) => handleHslChange("h", v)}
              />
              <GradientSlider
                label="Saturation"
                value={hsl.s}
                min={0}
                max={100}
                gradient={sGradient}
                onChange={(v) => handleHslChange("s", v)}
              />
              <GradientSlider
                label="Lightness"
                value={hsl.l}
                min={0}
                max={100}
                gradient={lGradient}
                onChange={(v) => handleHslChange("l", v)}
              />
            </div>

            {/* Hex input */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className="h-8 w-8 flex-shrink-0 rounded border border-input"
                style={{ backgroundColor: internalColor }}
              />
              <div className="flex-1">
                <Input
                  value={hexInput}
                  onChange={(e) => handleHexInput(e.target.value)}
                  placeholder="#000000"
                  className="h-8 font-mono text-sm uppercase"
                  maxLength={7}
                />
              </div>
              <span className="text-xs text-muted-foreground">HEX</span>
            </div>

            {/* HSL display */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(["h", "s", "l"] as const).map((key) => (
                <div key={key} className="flex flex-col items-center gap-1">
                  <Input
                    type="number"
                    min={0}
                    max={key === "h" ? 360 : 100}
                    value={hsl[key]}
                    onChange={(e) =>
                      handleHslChange(key, Number(e.target.value))
                    }
                    className="h-8 text-center text-xs font-mono"
                  />
                  <span className="text-xs text-muted-foreground uppercase">
                    {key}
                  </span>
                </div>
              ))}
            </div>

            {/* Preset swatches */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Presets
              </p>
              <div className="grid grid-cols-9 gap-1.5">
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    title={preset}
                    onClick={() => commit(preset)}
                    className={cn(
                      "h-6 w-6 rounded border border-black/10 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      internalColor.toLowerCase() === preset.toLowerCase() &&
                        "ring-2 ring-ring ring-offset-1"
                    )}
                    style={{ backgroundColor: preset }}
                  />
                ))}
              </div>
            </div>

            <PopoverPrimitive.Arrow className="fill-popover" />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}