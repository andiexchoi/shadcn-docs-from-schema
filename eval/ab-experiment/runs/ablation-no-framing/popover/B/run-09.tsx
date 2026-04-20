"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Radix wrappers ──────────────────────────────────────────────────────────

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
        "z-50 w-72 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-xl outline-none",
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!result) return null;
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
  const sl = s / 100;
  const ll = l / 100;
  const a = sl * Math.min(ll, 1 - ll);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function isValidHex(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value.trim());
}

// ─── Preset swatches ─────────────────────────────────────────────────────────

const PRESETS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
  "#ffffff", "#d1d5db", "#6b7280", "#111827",
];

// ─── Slider ──────────────────────────────────────────────────────────────────

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
        <Label htmlFor={id} className="text-xs text-muted-foreground">
          {label}
        </Label>
        <span className="text-xs tabular-nums text-muted-foreground w-8 text-right">
          {value}
        </span>
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
            "absolute inset-0 h-full w-full cursor-pointer appearance-none rounded-full bg-transparent",
            "[&::-webkit-slider-thumb]:appearance-none",
            "[&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4",
            "[&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-white",
            "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-border",
            "[&::-webkit-slider-thumb]:shadow-sm",
            "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4",
            "[&::-moz-range-thumb]:rounded-full",
            "[&::-moz-range-thumb]:bg-white",
            "[&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-border",
            "[&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:border-none",
          )}
          aria-label={label}
        />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

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
  const [hex, setHex] = React.useState(isValidHex(value) ? value : "#3b82f6");
  const [hexInput, setHexInput] = React.useState(hex);
  const [copied, setCopied] = React.useState(false);

  // Derive HSL from hex
  const hsl = React.useMemo(() => hexToHsl(hex) ?? { h: 0, s: 0, l: 50 }, [hex]);

  // Sync external value
  React.useEffect(() => {
    if (isValidHex(value) && value !== hex) {
      setHex(value);
      setHexInput(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function applyHex(newHex: string) {
    setHex(newHex);
    setHexInput(newHex);
    onChange?.(newHex);
  }

  function handleHue(h: number) {
    const newHex = hslToHex(h, hsl.s, hsl.l);
    applyHex(newHex);
  }

  function handleSaturation(s: number) {
    const newHex = hslToHex(hsl.h, s, hsl.l);
    applyHex(newHex);
  }

  function handleLightness(l: number) {
    const newHex = hslToHex(hsl.h, hsl.s, l);
    applyHex(newHex);
  }

  function handleHexInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      applyHex(normalized);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  const hueGradient =
    "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)";

  const satGradient = `linear-gradient(to right, ${hslToHex(hsl.h, 0, hsl.l)}, ${hslToHex(hsl.h, 100, hsl.l)})`;

  const ligGradient = `linear-gradient(to right, #000000, ${hslToHex(hsl.h, hsl.s, 50)}, #ffffff)`;

  const titleId = React.useId();
  const descId = React.useId();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label={`Pick ${label}`}
          className="flex items-center gap-2 px-3"
        >
          <span
            className="h-5 w-5 rounded-full border border-border shadow-inner flex-shrink-0"
            style={{ background: hex }}
            aria-hidden="true"
          />
          <span className="text-sm font-mono">{hex.toUpperCase()}</span>
          <Pipette className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        aria-labelledby={titleId}
        aria-describedby={descId}
        align="start"
      >
        {/* Header */}
        <div className="mb-4 space-y-0.5">
          <h2 id={titleId} className="text-sm font-semibold leading-none">
            {label}
          </h2>
          <p id={descId} className="text-xs text-muted-foreground">
            Choose a color for your theme.
          </p>
        </div>

        {/* Preview + hex input */}
        <div className="mb-4 flex items-center gap-3">
          <div
            className="h-10 w-10 flex-shrink-0 rounded-lg border border-border shadow-inner"
            style={{ background: hex }}
            aria-hidden="true"
          />
          <div className="flex flex-1 items-center gap-1">
            <div className="relative flex-1">
              <Input
                value={hexInput}
                onChange={handleHexInput}
                placeholder="#000000"
                className="font-mono text-sm pr-8 h-9"
                aria-label="Hex color value"
                maxLength={7}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 flex-shrink-0"
              onClick={handleCopy}
              aria-label={copied ? "Copied" : "Copy hex value"}
              title={copied ? "Copied!" : "Copy hex"}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Sliders */}
        <div className="mb-4 space-y-3">
          <ColorSlider
            id="hue-slider"
            label="Hue"
            value={hsl.h}
            min={0}
            max={360}
            gradient={hueGradient}
            onChange={handleHue}
          />
          <ColorSlider
            id="saturation-slider"
            label="Saturation"
            value={hsl.s}
            min={0}
            max={100}
            gradient={satGradient}
            onChange={handleSaturation}
          />
          <ColorSlider
            id="lightness-slider"
            label="Lightness"
            value={hsl.l}
            min={0}
            max={100}
            gradient={ligGradient}
            onChange={handleLightness}
          />
        </div>

        {/* Preset swatches */}
        <div>
          <p className="mb-2 text-xs text-muted-foreground">Presets</p>
          <div className="grid grid-cols-6 gap-1.5" role="listbox" aria-label="Color presets">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                role="option"
                aria-selected={hex.toLowerCase() === preset.toLowerCase()}
                aria-label={preset}
                onClick={() => applyHex(preset)}
                className={cn(
                  "h-8 w-full rounded-md border transition-all",
                  "hover:scale-110 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  hex.toLowerCase() === preset.toLowerCase()
                    ? "border-ring ring-2 ring-ring ring-offset-1 scale-110"
                    : "border-border"
                )}
                style={{ background: preset }}
              />
            ))}
          </div>
        </div>

        {/* Close button */}
        <div className="mt-4 flex justify-end">
          <PopoverPrimitive.Close asChild>
            <Button variant="outline" size="sm">
              Done
            </Button>
          </PopoverPrimitive.Close>
        </div>
      </PopoverContent>
    </Popover>
  );
}