"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, ChevronDown } from "lucide-react";
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
  const sanitized = hex.replace("#", "");
  if (sanitized.length !== 6) return null;
  const num = parseInt(sanitized, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
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
  let h = 0;
  let s = 0;
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

interface ColorPickerPopoverProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
  disabled?: boolean;
}

const titleId = "color-picker-title";
const descId = "color-picker-desc";

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  label = "Color",
  disabled = false,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [internalColor, setInternalColor] = React.useState(value);
  const [hexInput, setHexInput] = React.useState(value);
  const [rgbInputs, setRgbInputs] = React.useState(() => hexToRgb(value) ?? { r: 0, g: 0, b: 0 });
  const [mode, setMode] = React.useState<"hex" | "rgb" | "hsl">("hex");

  React.useEffect(() => {
    setInternalColor(value);
    setHexInput(value);
    setRgbInputs(hexToRgb(value) ?? { r: 0, g: 0, b: 0 });
  }, [value]);

  const applyColor = React.useCallback(
    (hex: string) => {
      setInternalColor(hex);
      setHexInput(hex);
      setRgbInputs(hexToRgb(hex) ?? { r: 0, g: 0, b: 0 });
      onChange?.(hex);
    },
    [onChange]
  );

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (/^#[0-9a-fA-F]{6}$/.test(normalized)) {
      applyColor(normalized.toLowerCase());
    }
  };

  const handleRgbChange = (channel: "r" | "g" | "b", raw: string) => {
    const num = parseInt(raw, 10);
    const clamped = isNaN(num) ? 0 : Math.max(0, Math.min(255, num));
    const updated = { ...rgbInputs, [channel]: clamped };
    setRgbInputs(updated);
    const hex = rgbToHex(updated.r, updated.g, updated.b);
    setInternalColor(hex);
    setHexInput(hex);
    onChange?.(hex);
  };

  const hsl = hexToHsl(internalColor);

  const isLight = (() => {
    const rgb = hexToRgb(internalColor);
    if (!rgb) return true;
    const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
    return luminance > 0.5;
  })();

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="color-picker-trigger" className="text-sm font-medium">
        {label}
      </Label>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            id="color-picker-trigger"
            disabled={disabled}
            aria-label={`Pick ${label}: current color ${internalColor}`}
            className={cn(
              "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
          >
            <span
              className="h-5 w-5 flex-shrink-0 rounded-sm border border-black/10 shadow-inner"
              style={{ backgroundColor: internalColor }}
              aria-hidden="true"
            />
            <span className="flex-1 text-left font-mono tracking-wide">
              {internalColor}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform duration-200",
                open && "rotate-180"
              )}
              aria-hidden="true"
            />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={8}
            aria-labelledby={titleId}
            aria-describedby={descId}
            className={cn(
              "z-50 w-72 rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
              "@media (prefers-reduced-motion: reduce) { animation: none !important; }"
            )}
          >
            {/* Header */}
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <Pipette className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <div>
                <p id={titleId} className="text-sm font-semibold leading-none">
                  Color picker
                </p>
                <p id={descId} className="mt-0.5 text-xs text-muted-foreground">
                  Choose a color for your theme.
                </p>
              </div>
            </div>

            {/* Color gradient canvas */}
            <div className="px-4 pt-4">
              <div
                className="relative h-32 w-full cursor-crosshair overflow-hidden rounded-lg border border-border"
                style={{
                  background: `
                    linear-gradient(to bottom, transparent, #000),
                    linear-gradient(to right, #fff, hsl(${hsl?.h ?? 0}, 100%, 50%))
                  `,
                }}
                role="presentation"
              >
                {/* Current color dot indicator */}
                <div
                  className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
                  style={{
                    backgroundColor: internalColor,
                    left: "50%",
                    top: "50%",
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Hue slider */}
              <div className="mt-3">
                <Label className="mb-1.5 block text-xs text-muted-foreground">
                  Hue
                </Label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={hsl?.h ?? 0}
                  aria-label="Hue"
                  onChange={(e) => {
                    const h = Number(e.target.value);
                    const s = hsl?.s ?? 100;
                    const l = hsl?.l ?? 50;
                    // Convert HSL back to hex
                    const hNorm = h / 360;
                    const sNorm = s / 100;
                    const lNorm = l / 100;
                    const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm;
                    const x = c * (1 - Math.abs(((hNorm * 6) % 2) - 1));
                    const m = lNorm - c / 2;
                    let r = 0, g = 0, b = 0;
                    const seg = hNorm * 6;
                    if (seg < 1) { r = c; g = x; }
                    else if (seg < 2) { r = x; g = c; }
                    else if (seg < 3) { g = c; b = x; }
                    else if (seg < 4) { g = x; b = c; }
                    else if (seg < 5) { r = x; b = c; }
                    else { r = c; b = x; }
                    const newHex = rgbToHex(
                      Math.round((r + m) * 255),
                      Math.round((g + m) * 255),
                      Math.round((b + m) * 255)
                    );
                    applyColor(newHex);
                  }}
                  className="h-3 w-full cursor-pointer appearance-none rounded-full border border-border"
                  style={{
                    background:
                      "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                  }}
                />
              </div>
            </div>

            {/* Preset swatches */}
            <div className="px-4 pt-3">
              <Label className="mb-2 block text-xs text-muted-foreground">
                Presets
              </Label>
              <div
                className="grid grid-cols-9 gap-1.5"
                role="listbox"
                aria-label="Preset colors"
              >
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.value}
                    role="option"
                    aria-selected={internalColor === preset.value}
                    aria-label={preset.label}
                    title={preset.label}
                    onClick={() => applyColor(preset.value)}
                    className={cn(
                      "h-6 w-6 rounded-md border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                      internalColor === preset.value
                        ? "border-foreground ring-2 ring-ring ring-offset-1"
                        : "border-black/10"
                    )}
                    style={{ backgroundColor: preset.value }}
                  />
                ))}
              </div>
            </div>

            {/* Mode toggle + inputs */}
            <div className="px-4 pb-4 pt-3">
              <div className="mb-2 flex gap-1">
                {(["hex", "rgb", "hsl"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={cn(
                      "rounded px-2 py-0.5 text-xs font-medium uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      mode === m
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {mode === "hex" && (
                <div className="flex items-center gap-2">
                  <span
                    className="h-8 w-8 flex-shrink-0 rounded-md border border-border shadow-inner"
                    style={{ backgroundColor: internalColor }}
                    aria-hidden="true"
                  />
                  <Input
                    value={hexInput}
                    onChange={handleHexInputChange}
                    placeholder="#000000"
                    spellCheck={false}
                    aria-label="Hex color value"
                    className="h-8 font-mono text-sm uppercase"
                  />
                </div>
              )}

              {mode === "rgb" && (
                <div className="grid grid-cols-3 gap-2">
                  {(["r", "g", "b"] as const).map((ch) => (
                    <div key={ch} className="flex flex-col gap-1">
                      <Label className="text-xs uppercase text-muted-foreground">
                        {ch}
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        max={255}
                        value={rgbInputs[ch]}
                        onChange={(e) => handleRgbChange(ch, e.target.value)}
                        aria-label={`${ch.toUpperCase()} channel`}
                        className="h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}

              {mode === "hsl" && hsl && (
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { key: "h", label: "H", max: 360 },
                      { key: "s", label: "S", max: 100 },
                      { key: "l", label: "L", max: 100 },
                    ] as const
                  ).map(({ key, label, max }) => (
                    <div key={key} className="flex flex-col gap-1">
                      <Label className="text-xs uppercase text-muted-foreground">
                        {label}
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        max={max}
                        value={hsl[key]}
                        readOnly
                        aria-label={`${label} channel`}
                        className="h-8 text-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between rounded-b-xl px-4 py-3"
              style={{ backgroundColor: internalColor }}
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  isLight ? "text-black/70" : "text-white/80"
                )}
              >
                Preview
              </span>
              <span
                className={cn(
                  "font-mono text-xs font-semibold",
                  isLight ? "text-black" : "text-white"
                )}
              >
                {internalColor.toUpperCase()}
              </span>
            </div>

            <PopoverPrimitive.Arrow className="fill-border" />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}