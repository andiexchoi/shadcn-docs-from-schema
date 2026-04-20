"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Tiny utility helpers
───────────────────────────────────────────── */

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!result) return null;
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
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
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function isValidHex(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value.trim());
}

/* ─────────────────────────────────────────────
   Preset swatches
───────────────────────────────────────────── */

const PRESETS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f43f5e",
  "#84cc16",
  "#a855f7",
  "#ffffff",
  "#94a3b8",
  "#1e293b",
  "#000000",
];

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */

interface ColorPickerPopoverProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
  disabled?: boolean;
}

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  label = "Color",
  disabled = false,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [internalColor, setInternalColor] = React.useState(value);
  const [hexInput, setHexInput] = React.useState(value);
  const [hsl, setHsl] = React.useState(
    () => hexToHsl(value) ?? { h: 217, s: 91, l: 60 }
  );

  /* Sync when prop changes externally */
  React.useEffect(() => {
    if (isValidHex(value) && value !== internalColor) {
      setInternalColor(value);
      setHexInput(value);
      setHsl(hexToHsl(value) ?? hsl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commit = React.useCallback(
    (hex: string) => {
      setInternalColor(hex);
      setHexInput(hex);
      setHsl(hexToHsl(hex) ?? { h: 0, s: 0, l: 0 });
      onChange?.(hex);
    },
    [onChange]
  );

  /* Hue/Sat/Light slider changes */
  const handleHslChange = (key: "h" | "s" | "l", raw: number) => {
    const next = { ...hsl, [key]: raw };
    setHsl(next);
    const hex = hslToHex(next.h, next.s, next.l);
    setInternalColor(hex);
    setHexInput(hex);
    onChange?.(hex);
  };

  /* Hex text input */
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const normalised = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalised)) {
      setInternalColor(normalised);
      setHsl(hexToHsl(normalised) ?? hsl);
      onChange?.(normalised);
    }
  };

  const handleHexInputBlur = () => {
    const normalised = hexInput.startsWith("#") ? hexInput : `#${hexInput}`;
    if (isValidHex(normalised)) {
      setHexInput(normalised);
    } else {
      setHexInput(internalColor);
    }
  };

  /* Native color input (eyedropper fallback) */
  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    commit(e.target.value);
  };

  const titleId = React.useId();
  const descId = React.useId();

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        {label && (
          <Label className="text-sm font-medium leading-none">{label}</Label>
        )}
        <PopoverPrimitive.Trigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            aria-label={`${label}: ${internalColor}. Click to open color picker`}
            className={cn(
              "h-9 w-9 rounded-md border-2 p-0.5 shadow-sm transition-all",
              "focus-visible:ring-2 focus-visible:ring-offset-2",
              open && "ring-2 ring-offset-2"
            )}
            style={{ borderColor: internalColor }}
          >
            <span
              className="block h-full w-full rounded-sm"
              style={{ backgroundColor: internalColor }}
            />
          </Button>
        </PopoverPrimitive.Trigger>

        {/* Inline hex readout */}
        <span className="font-mono text-xs text-muted-foreground select-all">
          {internalColor.toUpperCase()}
        </span>
      </div>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          role="dialog"
          aria-labelledby={titleId}
          aria-describedby={descId}
          sideOffset={8}
          align="start"
          className={cn(
            "z-50 w-72 rounded-xl border bg-popover p-4 text-popover-foreground shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            "@media (prefers-reduced-motion: reduce) { animation: none !important }"
          )}
        >
          {/* Header */}
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p id={titleId} className="text-sm font-semibold leading-none">
                Color picker
              </p>
              <p id={descId} className="mt-1 text-xs text-muted-foreground">
                Choose a theme color using sliders or hex value.
              </p>
            </div>
            <PopoverPrimitive.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 rounded-md"
                aria-label="Close color picker"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </PopoverPrimitive.Close>
          </div>

          {/* Large preview swatch */}
          <div
            className="mb-4 h-16 w-full rounded-lg border shadow-inner transition-colors duration-100"
            style={{ backgroundColor: internalColor }}
            aria-hidden="true"
          />

          {/* HSL Sliders */}
          <div className="mb-4 space-y-3">
            {/* Hue */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Hue</Label>
                <span className="font-mono text-xs text-muted-foreground">
                  {hsl.h}°
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={hsl.h}
                onChange={(e) => handleHslChange("h", Number(e.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                style={{
                  background:
                    "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                }}
                aria-label="Hue"
              />
            </div>

            {/* Saturation */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">
                  Saturation
                </Label>
                <span className="font-mono text-xs text-muted-foreground">
                  {hsl.s}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={hsl.s}
                onChange={(e) => handleHslChange("s", Number(e.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                style={{
                  background: `linear-gradient(to right, ${hslToHex(hsl.h, 0, hsl.l)}, ${hslToHex(hsl.h, 100, hsl.l)})`,
                }}
                aria-label="Saturation"
              />
            </div>

            {/* Lightness */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">
                  Lightness
                </Label>
                <span className="font-mono text-xs text-muted-foreground">
                  {hsl.l}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={hsl.l}
                onChange={(e) => handleHslChange("l", Number(e.target.value))}
                className="h-3 w-full cursor-pointer appearance-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                style={{
                  background: `linear-gradient(to right, #000000, ${hslToHex(hsl.h, hsl.s, 50)}, #ffffff)`,
                }}
                aria-label="Lightness"
              />
            </div>
          </div>

          {/* Hex input + native picker */}
          <div className="mb-4 flex items-center gap-2">
            <Label
              htmlFor="hex-input"
              className="shrink-0 font-mono text-xs text-muted-foreground"
            >
              HEX
            </Label>
            <Input
              id="hex-input"
              value={hexInput}
              onChange={handleHexInputChange}
              onBlur={handleHexInputBlur}
              spellCheck={false}
              maxLength={7}
              className="h-8 font-mono text-sm uppercase"
              aria-label="Hex color value"
            />
            <div className="relative shrink-0">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                aria-label="Open native color picker"
                asChild={false}
                tabIndex={-1}
              >
                <Pipette className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
              <input
                type="color"
                value={internalColor}
                onChange={handleNativeChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Native color picker"
                tabIndex={-1}
              />
            </div>
          </div>

          {/* Preset swatches */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Presets
            </p>
            <div className="grid grid-cols-8 gap-1.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => commit(preset)}
                  aria-label={`Select color ${preset}`}
                  aria-pressed={internalColor.toLowerCase() === preset.toLowerCase()}
                  className={cn(
                    "h-7 w-7 rounded-md border border-black/10 shadow-sm transition-transform",
                    "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    internalColor.toLowerCase() === preset.toLowerCase() &&
                      "ring-2 ring-ring ring-offset-1 scale-110"
                  )}
                  style={{ backgroundColor: preset }}
                />
              ))}
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}