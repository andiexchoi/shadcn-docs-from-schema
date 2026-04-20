"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ── Popover primitives ────────────────────────────────────────────────────────

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "start", sideOffset = 8, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        "@media (prefers-reduced-motion: reduce) { animation: none !important; }",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

// ── Visually-hidden helper (for accessible PopoverTitle) ──────────────────────

function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 clip-[rect(0,0,0,0)]">
      {children}
    </span>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
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
  const sn = s / 100;
  const ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function isValidHex(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

// ── Preset swatches ───────────────────────────────────────────────────────────

const PRESETS: { label: string; value: string }[] = [
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
  { label: "Violet", value: "#8b5cf6" },
  { label: "Pink", value: "#ec4899" },
];

// ── Slider ────────────────────────────────────────────────────────────────────

interface SliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  gradient: string;
}

function ColorSlider({
  id,
  label,
  min,
  max,
  value,
  onChange,
  gradient,
}: SliderProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
          {label}
        </Label>
        <span className="text-xs tabular-nums text-muted-foreground">{value}</span>
      </div>
      <div className="relative flex items-center h-5">
        <div
          className="absolute inset-x-0 h-2 rounded-full pointer-events-none"
          style={{ background: gradient }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "w-full h-2 appearance-none bg-transparent cursor-pointer rounded-full",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4",
            "[&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-white",
            "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-border",
            "[&::-webkit-slider-thumb]:shadow-md",
            "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4",
            "[&::-moz-range-thumb]:rounded-full",
            "[&::-moz-range-thumb]:bg-white",
            "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-border",
            "[&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-solid"
          )}
        />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export interface ColorPickerPopoverProps {
  value?: string;
  onChange?: (hex: string) => void;
  label?: string;
}

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  label = "Color",
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);

  // Internal colour state
  const [hex, setHex] = React.useState(() =>
    isValidHex(value) ? value.toLowerCase() : "#3b82f6"
  );
  const [hexInput, setHexInput] = React.useState(hex);
  const [hsl, setHsl] = React.useState(() => hexToHsl(hex));
  const [copied, setCopied] = React.useState(false);

  // Sync external value → internal when prop changes
  React.useEffect(() => {
    if (isValidHex(value) && value.toLowerCase() !== hex) {
      const v = value.toLowerCase();
      setHex(v);
      setHexInput(v);
      setHsl(hexToHsl(v));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function applyHex(newHex: string) {
    const normalised = newHex.toLowerCase();
    setHex(normalised);
    setHexInput(normalised);
    setHsl(hexToHsl(normalised));
    onChange?.(normalised);
  }

  function handleHslChange(channel: "h" | "s" | "l", v: number) {
    const next = { ...hsl, [channel]: v };
    setHsl(next);
    const newHex = hslToHex(next.h, next.s, next.l);
    setHex(newHex);
    setHexInput(newHex);
    onChange?.(newHex);
  }

  function handleHexInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setHexInput(raw);
    const prefixed = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(prefixed)) {
      applyHex(prefixed);
    }
  }

  function handleHexInputBlur() {
    const prefixed = hexInput.startsWith("#") ? hexInput : `#${hexInput}`;
    if (isValidHex(prefixed)) {
      applyHex(prefixed);
    } else {
      setHexInput(hex);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  }

  // Gradients for sliders
  const hGradient = `linear-gradient(to right,
    hsl(0,${hsl.s}%,${hsl.l}%),
    hsl(30,${hsl.s}%,${hsl.l}%),
    hsl(60,${hsl.s}%,${hsl.l}%),
    hsl(90,${hsl.s}%,${hsl.l}%),
    hsl(120,${hsl.s}%,${hsl.l}%),
    hsl(150,${hsl.s}%,${hsl.l}%),
    hsl(180,${hsl.s}%,${hsl.l}%),
    hsl(210,${hsl.s}%,${hsl.l}%),
    hsl(240,${hsl.s}%,${hsl.l}%),
    hsl(270,${hsl.s}%,${hsl.l}%),
    hsl(300,${hsl.s}%,${hsl.l}%),
    hsl(330,${hsl.s}%,${hsl.l}%),
    hsl(360,${hsl.s}%,${hsl.l}%))`;

  const sGradient = `linear-gradient(to right,
    hsl(${hsl.h},0%,${hsl.l}%),
    hsl(${hsl.h},100%,${hsl.l}%))`;

  const lGradient = `linear-gradient(to right,
    hsl(${hsl.h},${hsl.s}%,0%),
    hsl(${hsl.h},${hsl.s}%,50%),
    hsl(${hsl.h},${hsl.s}%,100%))`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`Open ${label} color picker, current color ${hex}`}
          className={cn(
            "flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2",
            "text-sm font-medium shadow-sm transition-colors",
            "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <span
            className="w-5 h-5 rounded-md border border-border/60 shadow-inner flex-shrink-0"
            style={{ backgroundColor: hex }}
            aria-hidden="true"
          />
          <span className="font-mono">{hex}</span>
          <Pipette className="w-3.5 h-3.5 text-muted-foreground ml-0.5" aria-hidden="true" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-0">
        {/* Accessible title/description (visually hidden title, visible description) */}
        <VisuallyHidden>
          <h2 id="color-picker-title">{label} picker</h2>
        </VisuallyHidden>
        <VisuallyHidden>
          <p id="color-picker-desc">
            Adjust hue, saturation, and lightness sliders or type a hex code to choose a colour.
          </p>
        </VisuallyHidden>

        {/* Preview bar */}
        <div
          className="w-full h-14 rounded-t-xl transition-colors duration-150"
          style={{ backgroundColor: hex }}
          aria-hidden="true"
        />

        <div className="p-4 space-y-4">
          {/* Hex input + copy */}
          <div className="space-y-1.5">
            <Label htmlFor="hex-input" className="text-xs font-medium text-muted-foreground">
              Hex
            </Label>
            <div className="flex gap-2">
              <Input
                id="hex-input"
                value={hexInput}
                onChange={handleHexInputChange}
                onBlur={handleHexInputBlur}
                spellCheck={false}
                className="font-mono text-sm h-8"
                aria-label="Hex colour value"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={handleCopy}
                aria-label="Copy hex value"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </Button>
            </div>
          </div>

          {/* HSL sliders */}
          <div className="space-y-3">
            <ColorSlider
              id="hue-slider"
              label="Hue"
              min={0}
              max={360}
              value={hsl.h}
              onChange={(v) => handleHslChange("h", v)}
              gradient={hGradient}
            />
            <ColorSlider
              id="saturation-slider"
              label="Saturation"
              min={0}
              max={100}
              value={hsl.s}
              onChange={(v) => handleHslChange("s", v)}
              gradient={sGradient}
            />
            <ColorSlider
              id="lightness-slider"
              label="Lightness"
              min={0}
              max={100}
              value={hsl.l}
              onChange={(v) => handleHslChange("l", v)}
              gradient={lGradient}
            />
          </div>

          {/* Presets */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">Presets</p>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  title={preset.label}
                  aria-label={`${preset.label}: ${preset.value}`}
                  aria-pressed={hex === preset.value}
                  onClick={() => applyHex(preset.value)}
                  className={cn(
                    "w-8 h-8 rounded-md border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    hex === preset.value
                      ? "border-foreground ring-2 ring-foreground ring-offset-1"
                      : "border-border/60"
                  )}
                  style={{ backgroundColor: preset.value }}
                />
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}