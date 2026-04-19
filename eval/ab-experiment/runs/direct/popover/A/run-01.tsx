"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PRESET_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#ffffff",
  "#e5e7eb",
  "#9ca3af",
  "#6b7280",
  "#374151",
  "#1f2937",
  "#111827",
  "#000000",
];

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
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;
  let r: number, g: number, b: number;
  if (sNorm === 0) {
    r = g = b = lNorm;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;
    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function isValidHex(hex: string): boolean {
  return /^#([a-f\d]{3}|[a-f\d]{6})$/i.test(hex);
}

function expandHex(hex: string): string {
  if (/^#[a-f\d]{3}$/i.test(hex)) {
    return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
}

interface ColorPickerPopoverProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
  className?: string;
}

export function ColorPickerPopover({
  value = "#6366f1",
  onChange,
  label = "Color",
  className,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [internalColor, setInternalColor] = React.useState(value);
  const [hexInput, setHexInput] = React.useState(value);
  const [hsl, setHsl] = React.useState(() => hexToHsl(expandHex(value)));

  React.useEffect(() => {
    setInternalColor(value);
    setHexInput(value);
    setHsl(hexToHsl(expandHex(value)));
  }, [value]);

  const applyColor = React.useCallback(
    (hex: string) => {
      setInternalColor(hex);
      setHexInput(hex);
      setHsl(hexToHsl(expandHex(hex)));
      onChange?.(hex);
    },
    [onChange]
  );

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    const full = val.startsWith("#") ? val : `#${val}`;
    if (isValidHex(full)) {
      const expanded = expandHex(full);
      setInternalColor(expanded);
      setHsl(hexToHsl(expanded));
      onChange?.(expanded);
    }
  };

  const handleHexInputBlur = () => {
    const full = hexInput.startsWith("#") ? hexInput : `#${hexInput}`;
    if (isValidHex(full)) {
      const expanded = expandHex(full);
      setHexInput(expanded);
      setInternalColor(expanded);
      setHsl(hexToHsl(expanded));
      onChange?.(expanded);
    } else {
      setHexInput(internalColor);
    }
  };

  const handleHslChange = (key: "h" | "s" | "l", rawVal: number) => {
    const newHsl = { ...hsl, [key]: rawVal };
    setHsl(newHsl);
    const hex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    setInternalColor(hex);
    setHexInput(hex);
    onChange?.(hex);
  };

  const satLightBackground = `hsl(${hsl.h}, 100%, 50%)`;

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <Label className="text-sm font-medium text-foreground">{label}</Label>
        )}
        <PopoverPrimitive.Trigger asChild>
          <button
            className={cn(
              "flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-background shadow-sm",
              "hover:bg-accent hover:text-accent-foreground transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "text-sm font-mono"
            )}
          >
            <span
              className="w-5 h-5 rounded-sm border border-black/10 flex-shrink-0"
              style={{ backgroundColor: internalColor }}
            />
            <span className="text-muted-foreground">{internalColor}</span>
            <Pipette className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </PopoverPrimitive.Trigger>
      </div>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={8}
          align="start"
          className={cn(
            "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-popover-foreground">
              Color Picker
            </span>
            <PopoverPrimitive.Close asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <X className="h-3.5 w-3.5" />
              </Button>
            </PopoverPrimitive.Close>
          </div>

          {/* Gradient Picker */}
          <div className="mb-3 space-y-2">
            {/* Saturation / Lightness picker */}
            <div
              className="relative w-full h-36 rounded-lg cursor-crosshair overflow-hidden"
              style={{
                background: `linear-gradient(to bottom, transparent, #000),
                             linear-gradient(to right, #fff, ${satLightBackground})`,
              }}
              onMouseDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const move = (ev: MouseEvent) => {
                  const x = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
                  const y = Math.max(0, Math.min(1, (ev.clientY - rect.top) / rect.height));
                  const s = Math.round(x * 100);
                  const l = Math.round((1 - y) * 50 * (1 - x / 2));
                  handleHslChange("s", s);
                  handleHslChange("l", Math.max(0, Math.min(100, l + Math.round((1 - y) * x * 50))));
                };
                const up = () => {
                  window.removeEventListener("mousemove", move);
                  window.removeEventListener("mouseup", up);
                };
                window.addEventListener("mousemove", move);
                window.addEventListener("mouseup", up);
                move(e.nativeEvent as MouseEvent);
              }}
            >
              {/* Marker */}
              <div
                className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${hsl.s}%`,
                  top: `${100 - (hsl.l / 50) * 100}%`,
                  backgroundColor: internalColor,
                }}
              />
            </div>

            {/* Hue slider */}
            <div className="relative">
              <div
                className="h-3 rounded-full w-full"
                style={{
                  background:
                    "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                }}
              />
              <input
                type="range"
                min={0}
                max={360}
                value={hsl.h}
                onChange={(e) => handleHslChange("h", Number(e.target.value))}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-3"
              />
              {/* Hue thumb indicator */}
              <div
                className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  left: `${(hsl.h / 360) * 100}%`,
                  backgroundColor: `hsl(${hsl.h}, 100%, 50%)`,
                }}
              />
            </div>
          </div>

          {/* HSL Sliders */}
          <div className="space-y-2 mb-3">
            {(["h", "s", "l"] as const).map((key) => {
              const max = key === "h" ? 360 : 100;
              const labelMap = { h: "Hue", s: "Saturation", l: "Lightness" };
              return (
                <div key={key} className="flex items-center gap-2">
                  <Label className="w-20 text-xs text-muted-foreground shrink-0">
                    {labelMap[key]}
                  </Label>
                  <input
                    type="range"
                    min={0}
                    max={max}
                    value={hsl[key]}
                    onChange={(e) => handleHslChange(key, Number(e.target.value))}
                    className="flex-1 accent-primary h-1.5 cursor-pointer"
                  />
                  <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
                    {hsl[key]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Hex Input */}
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-md border border-black/10 flex-shrink-0"
              style={{ backgroundColor: internalColor }}
            />
            <div className="flex-1">
              <Input
                value={hexInput}
                onChange={handleHexInputChange}
                onBlur={handleHexInputBlur}
                className="h-8 font-mono text-sm"
                placeholder="#000000"
                maxLength={7}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs px-2"
              onClick={() => {
                if (navigator.clipboard) {
                  navigator.clipboard.writeText(internalColor);
                }
              }}
            >
              Copy
            </Button>
          </div>

          {/* Preset Colors */}
          <div>
            <Label className="text-xs text-muted-foreground mb-2 block">Presets</Label>
            <div className="grid grid-cols-8 gap-1.5">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  title={color}
                  onClick={() => applyColor(color)}
                  className={cn(
                    "w-full aspect-square rounded-md border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    internalColor.toLowerCase() === color.toLowerCase()
                      ? "border-primary ring-2 ring-primary ring-offset-1"
                      : "border-black/10"
                  )}
                  style={{ backgroundColor: color }}
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

export default ColorPickerPopover;