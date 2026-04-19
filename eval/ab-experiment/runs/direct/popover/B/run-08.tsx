"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────── helpers ─────────────────────────── */

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
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
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function isValidHex(hex: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(hex);
}

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16",
  "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6",
  "#8b5cf6", "#ec4899", "#f43f5e", "#64748b",
  "#ffffff", "#e2e8f0", "#94a3b8", "#0f172a",
];

/* ─────────────────────────── sub-components ─────────────────────────── */

interface SliderProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  gradient: string;
  onChange: (v: number) => void;
}

function ColorSlider({ id, label, value, min, max, step = 1, gradient, onChange }: SliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
        <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">{value}</span>
      </div>
      <div
        className="relative h-3 rounded-full"
        style={{ background: gradient }}
      >
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "absolute inset-0 w-full h-full opacity-0 cursor-pointer",
          )}
          aria-label={label}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md bg-white pointer-events-none"
          style={{ left: `calc(${((value - min) / (max - min)) * 100}% - 8px)` }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────── main component ─────────────────────────── */

export interface ColorPickerPopoverProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
  align?: "start" | "center" | "end";
  className?: string;
}

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  label = "Color",
  align = "start",
  className,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);

  const safeValue = isValidHex(value) ? value : "#3b82f6";
  const { h, s, l } = hexToHsl(safeValue);

  const [hue, setHue] = React.useState(h);
  const [sat, setSat] = React.useState(s);
  const [lit, setLit] = React.useState(l);
  const [hexInput, setHexInput] = React.useState(safeValue);
  const [hexError, setHexError] = React.useState(false);

  /* sync internal state when value prop changes externally */
  React.useEffect(() => {
    if (isValidHex(value)) {
      const parsed = hexToHsl(value);
      setHue(parsed.h);
      setSat(parsed.s);
      setLit(parsed.l);
      setHexInput(value.toLowerCase());
      setHexError(false);
    }
  }, [value]);

  const currentHex = hslToHex(hue, sat, lit);

  function emitChange(hex: string) {
    onChange?.(hex);
  }

  function handleHueChange(v: number) {
    setHue(v);
    const hex = hslToHex(v, sat, lit);
    setHexInput(hex);
    emitChange(hex);
  }

  function handleSatChange(v: number) {
    setSat(v);
    const hex = hslToHex(hue, v, lit);
    setHexInput(hex);
    emitChange(hex);
  }

  function handleLitChange(v: number) {
    setLit(v);
    const hex = hslToHex(hue, sat, v);
    setHexInput(hex);
    emitChange(hex);
  }

  function handleHexInput(raw: string) {
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      setHexError(false);
      const parsed = hexToHsl(normalized);
      setHue(parsed.h);
      setSat(parsed.s);
      setLit(parsed.l);
      emitChange(normalized.toLowerCase());
    } else {
      setHexError(true);
    }
  }

  function handlePreset(hex: string) {
    const parsed = hexToHsl(hex);
    setHue(parsed.h);
    setSat(parsed.s);
    setLit(parsed.l);
    setHexInput(hex);
    setHexError(false);
    emitChange(hex);
  }

  const hueGradient =
    "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)";
  const satGradient = `linear-gradient(to right, ${hslToHex(hue, 0, lit)}, ${hslToHex(hue, 100, lit)})`;
  const litGradient = `linear-gradient(to right, #000000, ${hslToHex(hue, sat, 50)}, #ffffff)`;

  const titleId = React.useId();
  const descId = React.useId();
  const hexInputId = React.useId();

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex items-center gap-2 h-9 px-3 min-w-[140px] justify-start",
            className,
          )}
          aria-label={`${label}: ${safeValue}`}
        >
          <span
            className="inline-block w-5 h-5 rounded-sm border border-black/10 shadow-sm flex-shrink-0"
            style={{ backgroundColor: currentHex }}
            aria-hidden="true"
          />
          <span className="font-mono text-sm tracking-tight">{currentHex}</span>
          <Pipette className="ml-auto w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
        </Button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align={align}
          sideOffset={8}
          role="dialog"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className={cn(
            "z-50 w-72 rounded-xl border bg-popover p-4 text-popover-foreground shadow-xl",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            "@media (prefers-reduced-motion: reduce) { animation: none !important; }",
          )}
        >
          {/* header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <p id={titleId} className="font-semibold text-sm leading-none">
                {label}
              </p>
              <p id={descId} className="text-xs text-muted-foreground mt-1">
                Pick a color using sliders or enter a hex value.
              </p>
            </div>
            <PopoverPrimitive.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-0.5 -mr-1 text-muted-foreground hover:text-foreground"
                aria-label="Close color picker"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </PopoverPrimitive.Close>
          </div>

          {/* preview swatch */}
          <div
            className="w-full h-12 rounded-lg border border-black/10 mb-4 shadow-inner transition-colors duration-100"
            style={{ backgroundColor: currentHex }}
            aria-label={`Current color preview: ${currentHex}`}
            role="img"
          />

          {/* sliders */}
          <div className="space-y-3 mb-4">
            <ColorSlider
              id={`${titleId}-hue`}
              label="Hue"
              value={hue}
              min={0}
              max={360}
              gradient={hueGradient}
              onChange={handleHueChange}
            />
            <ColorSlider
              id={`${titleId}-sat`}
              label="Saturation"
              value={sat}
              min={0}
              max={100}
              gradient={satGradient}
              onChange={handleSatChange}
            />
            <ColorSlider
              id={`${titleId}-lit`}
              label="Lightness"
              value={lit}
              min={0}
              max={100}
              gradient={litGradient}
              onChange={handleLitChange}
            />
          </div>

          {/* hex input */}
          <div className="mb-4">
            <Label htmlFor={hexInputId} className="text-xs text-muted-foreground mb-1 block">
              Hex value
            </Label>
            <Input
              id={hexInputId}
              value={hexInput}
              onChange={(e) => handleHexInput(e.target.value)}
              placeholder="#000000"
              spellCheck={false}
              className={cn(
                "font-mono text-sm h-8",
                hexError && "border-red-500 focus-visible:ring-red-500",
              )}
              aria-invalid={hexError}
              aria-describedby={hexError ? `${hexInputId}-error` : undefined}
            />
            {hexError && (
              <p id={`${hexInputId}-error`} className="text-xs text-red-500 mt-1" role="alert">
                Enter a valid hex color, e.g. #a1b2c3.
              </p>
            )}
          </div>

          {/* presets */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Presets</p>
            <div className="grid grid-cols-8 gap-1.5">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePreset(preset)}
                  className={cn(
                    "w-7 h-7 rounded-md border border-black/10 shadow-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    currentHex.toLowerCase() === preset.toLowerCase() &&
                      "ring-2 ring-ring ring-offset-2 scale-110",
                  )}
                  style={{ backgroundColor: preset }}
                  aria-label={`Select color ${preset}`}
                  aria-pressed={currentHex.toLowerCase() === preset.toLowerCase()}
                />
              ))}
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}