"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, Copy, Check } from "lucide-react";
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
  { label: "Sky", value: "#0ea5e9" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Indigo", value: "#6366f1" },
  { label: "Violet", value: "#8b5cf6" },
  { label: "Purple", value: "#a855f7" },
  { label: "Pink", value: "#ec4899" },
  { label: "Rose", value: "#f43f5e" },
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
];

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace(/^#/, "");
  if (cleaned.length !== 6) return null;
  const num = parseInt(cleaned, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
      .join("")
  );
}

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / d + 2) / 6;
      break;
    default:
      h = ((r - g) / d + 4) / 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function isValidHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

interface ColorPickerPopoverProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
}

export function ColorPickerPopover({
  value = "#6366f1",
  onChange,
  label = "Color",
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [internalColor, setInternalColor] = React.useState(
    isValidHex(value) ? value : "#6366f1"
  );
  const [hexInput, setHexInput] = React.useState(internalColor);
  const [rgbInput, setRgbInput] = React.useState<{
    r: string;
    g: string;
    b: string;
  }>(() => {
    const rgb = hexToRgb(internalColor);
    return rgb
      ? { r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) }
      : { r: "99", g: "102", b: "241" };
  });
  const [copied, setCopied] = React.useState(false);

  const titleId = React.useId();
  const descId = React.useId();

  React.useEffect(() => {
    if (isValidHex(value) && value !== internalColor) {
      setInternalColor(value);
      setHexInput(value);
      const rgb = hexToRgb(value);
      if (rgb)
        setRgbInput({ r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const applyColor = React.useCallback(
    (hex: string) => {
      if (!isValidHex(hex)) return;
      setInternalColor(hex);
      setHexInput(hex);
      const rgb = hexToRgb(hex);
      if (rgb)
        setRgbInput({ r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) });
      onChange?.(hex);
    },
    [onChange]
  );

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      applyColor(normalized);
    }
  };

  const handleRgbChange =
    (channel: "r" | "g" | "b") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const updated = { ...rgbInput, [channel]: val };
      setRgbInput(updated);
      const r = parseInt(updated.r, 10);
      const g = parseInt(updated.g, 10);
      const b = parseInt(updated.b, 10);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        const hex = rgbToHex(r, g, b);
        setInternalColor(hex);
        setHexInput(hex);
        onChange?.(hex);
      }
    };

  const handleNativeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyColor(e.target.value);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(internalColor);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const hsl = hexToHsl(internalColor);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <PopoverPrimitive.Trigger asChild>
          <button
            aria-label={`Pick ${label} color, current color ${internalColor}`}
            className={cn(
              "h-9 w-9 rounded-md border-2 border-border shadow-sm transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "hover:scale-105 active:scale-95"
            )}
            style={{ backgroundColor: internalColor }}
          />
        </PopoverPrimitive.Trigger>
        <span className="font-mono text-sm text-muted-foreground">
          {internalColor.toUpperCase()}
        </span>
      </div>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          aria-labelledby={titleId}
          aria-describedby={descId}
          align="start"
          sideOffset={8}
          className={cn(
            "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            "@media (prefers-reduced-motion: reduce) { animation: none !important; }"
          )}
        >
          {/* Header */}
          <div className="mb-4">
            <h2
              id={titleId}
              className="text-sm font-semibold leading-none text-popover-foreground"
            >
              {label} picker
            </h2>
            <p id={descId} className="mt-1 text-xs text-muted-foreground">
              Choose a color using the palette, presets, or manual input.
            </p>
          </div>

          {/* Native color wheel + preview */}
          <div className="mb-4 flex items-center gap-3">
            <label className="relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-border shadow-inner transition-transform hover:scale-105 active:scale-95">
              <div
                className="absolute inset-0 rounded-lg"
                style={{ backgroundColor: internalColor }}
              />
              <Pipette className="relative z-10 h-4 w-4 text-white drop-shadow-md mix-blend-difference" />
              <input
                type="color"
                value={internalColor}
                onChange={handleNativeColorChange}
                className="sr-only"
                aria-label="Open color palette"
              />
            </label>
            <div className="flex flex-1 flex-col gap-1">
              <div
                className="h-8 w-full rounded-md border border-border shadow-sm"
                style={{ backgroundColor: internalColor }}
                aria-hidden="true"
              />
              {hsl && (
                <p className="text-xs text-muted-foreground">
                  HSL {hsl.h}° {hsl.s}% {hsl.l}%
                </p>
              )}
            </div>
          </div>

          {/* Hue slider */}
          <div className="mb-4">
            <Label className="mb-1 block text-xs text-muted-foreground">
              Hue
            </Label>
            <input
              type="range"
              min={0}
              max={360}
              value={hsl?.h ?? 0}
              onChange={(e) => {
                const h = Number(e.target.value);
                const currentHsl = hexToHsl(internalColor) ?? {
                  s: 70,
                  l: 50,
                };
                // hsl -> hex conversion
                const s = currentHsl.s / 100;
                const l = currentHsl.l / 100;
                const k = (n: number) => (n + h / 30) % 12;
                const a = s * Math.min(l, 1 - l);
                const f = (n: number) =>
                  l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
                const hex = rgbToHex(
                  Math.round(f(0) * 255),
                  Math.round(f(8) * 255),
                  Math.round(f(4) * 255)
                );
                applyColor(hex);
              }}
              className="h-2 w-full cursor-pointer appearance-none rounded-full"
              style={{
                background:
                  "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
              }}
              aria-label="Hue"
            />
          </div>

          {/* Saturation & Lightness sliders */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1 block text-xs text-muted-foreground">
                Saturation
              </Label>
              <input
                type="range"
                min={0}
                max={100}
                value={hsl?.s ?? 0}
                onChange={(e) => {
                  const s = Number(e.target.value);
                  const currentHsl = hexToHsl(internalColor) ?? { h: 0, l: 50 };
                  const h = currentHsl.h;
                  const l = currentHsl.l / 100;
                  const sn = s / 100;
                  const k = (n: number) => (n + h / 30) % 12;
                  const a = sn * Math.min(l, 1 - l);
                  const f = (n: number) =>
                    l -
                    a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
                  const hex = rgbToHex(
                    Math.round(f(0) * 255),
                    Math.round(f(8) * 255),
                    Math.round(f(4) * 255)
                  );
                  applyColor(hex);
                }}
                className="h-2 w-full cursor-pointer appearance-none rounded-full"
                style={{
                  background: hsl
                    ? `linear-gradient(to right, hsl(${hsl.h},0%,${hsl.l}%), hsl(${hsl.h},100%,${hsl.l}%))`
                    : undefined,
                }}
                aria-label="Saturation"
              />
            </div>
            <div>
              <Label className="mb-1 block text-xs text-muted-foreground">
                Lightness
              </Label>
              <input
                type="range"
                min={0}
                max={100}
                value={hsl?.l ?? 50}
                onChange={(e) => {
                  const l = Number(e.target.value);
                  const currentHsl = hexToHsl(internalColor) ?? { h: 0, s: 70 };
                  const h = currentHsl.h;
                  const ln = l / 100;
                  const sn = currentHsl.s / 100;
                  const k = (n: number) => (n + h / 30) % 12;
                  const a = sn * Math.min(ln, 1 - ln);
                  const f = (n: number) =>
                    ln -
                    a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
                  const hex = rgbToHex(
                    Math.round(f(0) * 255),
                    Math.round(f(8) * 255),
                    Math.round(f(4) * 255)
                  );
                  applyColor(hex);
                }}
                className="h-2 w-full cursor-pointer appearance-none rounded-full"
                style={{
                  background: hsl
                    ? `linear-gradient(to right, hsl(${hsl.h},${hsl.s}%,0%), hsl(${hsl.h},${hsl.s}%,50%), hsl(${hsl.h},${hsl.s}%,100%))`
                    : undefined,
                }}
                aria-label="Lightness"
              />
            </div>
          </div>

          {/* Hex input */}
          <div className="mb-3">
            <Label htmlFor="hex-input" className="mb-1 block text-xs text-muted-foreground">
              Hex
            </Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  id="hex-input"
                  value={hexInput}
                  onChange={handleHexInputChange}
                  onBlur={() => {
                    const normalized = hexInput.startsWith("#")
                      ? hexInput
                      : `#${hexInput}`;
                    if (isValidHex(normalized)) {
                      applyColor(normalized);
                    } else {
                      setHexInput(internalColor);
                    }
                  }}
                  className="font-mono text-sm"
                  placeholder="#000000"
                  maxLength={7}
                  spellCheck={false}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                aria-label="Copy hex color value"
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* RGB inputs */}
          <div className="mb-4 grid grid-cols-3 gap-2">
            {(["r", "g", "b"] as const).map((ch) => (
              <div key={ch}>
                <Label
                  htmlFor={`rgb-${ch}`}
                  className="mb-1 block text-center text-xs text-muted-foreground uppercase"
                >
                  {ch}
                </Label>
                <Input
                  id={`rgb-${ch}`}
                  value={rgbInput[ch]}
                  onChange={handleRgbChange(ch)}
                  onBlur={() => {
                    const val = parseInt(rgbInput[ch], 10);
                    if (isNaN(val)) {
                      const rgb = hexToRgb(internalColor);
                      if (rgb)
                        setRgbInput((prev) => ({
                          ...prev,
                          [ch]: String(rgb[ch]),
                        }));
                    }
                  }}
                  className="text-center font-mono text-sm"
                  placeholder="0"
                  maxLength={3}
                  inputMode="numeric"
                />
              </div>
            ))}
          </div>

          {/* Preset swatches */}
          <div>
            <Label className="mb-2 block text-xs text-muted-foreground">
              Presets
            </Label>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Color presets">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => applyColor(preset.value)}
                  aria-label={`Select ${preset.label} (${preset.value})`}
                  aria-pressed={internalColor.toLowerCase() === preset.value.toLowerCase()}
                  title={preset.label}
                  className={cn(
                    "h-6 w-6 rounded-md border transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    "hover:scale-110 active:scale-95",
                    internalColor.toLowerCase() === preset.value.toLowerCase()
                      ? "border-ring ring-2 ring-ring ring-offset-1 scale-110"
                      : "border-border"
                  )}
                  style={{ backgroundColor: preset.value }}
                />
              ))}
            </div>
          </div>

          <PopoverPrimitive.Arrow className="fill-border" />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}