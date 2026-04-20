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

function hexToHsb(hex: string): { h: number; s: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : Math.round((delta / max) * 100);
  const bv = Math.round(max * 100);
  return { h, s, b: bv };
}

function hsbToHex(h: number, s: number, b: number): string {
  const sv = s / 100;
  const bv = b / 100;
  const c = bv * sv;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = bv - c;
  let r = 0, g = 0, bl = 0;
  if (h < 60) { r = c; g = x; bl = 0; }
  else if (h < 120) { r = x; g = c; bl = 0; }
  else if (h < 180) { r = 0; g = c; bl = x; }
  else if (h < 240) { r = 0; g = x; bl = c; }
  else if (h < 300) { r = x; g = 0; bl = c; }
  else { r = c; g = 0; bl = x; }
  const toHex = (n: number) =>
    Math.round((n + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

function isValidHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
}

const titleId = "color-picker-title";
const descId = "color-picker-desc";

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  label = "Color",
}: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [internalColor, setInternalColor] = React.useState(
    isValidHex(value) ? value : "#3b82f6"
  );
  const [hexInput, setHexInput] = React.useState(internalColor);

  const hsb = React.useMemo(() => hexToHsb(internalColor), [internalColor]);

  const isDraggingSb = React.useRef(false);
  const isDraggingHue = React.useRef(false);
  const sbRef = React.useRef<HTMLDivElement>(null);
  const hueRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isValidHex(value)) {
      setInternalColor(value);
      setHexInput(value);
    }
  }, [value]);

  const commit = React.useCallback(
    (color: string) => {
      setInternalColor(color);
      setHexInput(color);
      onChange?.(color);
    },
    [onChange]
  );

  const handleSbPointerMove = React.useCallback(
    (e: PointerEvent) => {
      if (!isDraggingSb.current || !sbRef.current) return;
      const rect = sbRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      const newS = Math.round(x * 100);
      const newB = Math.round((1 - y) * 100);
      const hex = hsbToHex(hsb.h, newS, newB);
      setInternalColor(hex);
      setHexInput(hex);
      onChange?.(hex);
    },
    [hsb.h, onChange]
  );

  const handleHuePointerMove = React.useCallback(
    (e: PointerEvent) => {
      if (!isDraggingHue.current || !hueRef.current) return;
      const rect = hueRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newH = Math.round(x * 360);
      const hex = hsbToHex(newH, hsb.s, hsb.b);
      setInternalColor(hex);
      setHexInput(hex);
      onChange?.(hex);
    },
    [hsb.s, hsb.b, onChange]
  );

  React.useEffect(() => {
    const upHandler = () => {
      isDraggingSb.current = false;
      isDraggingHue.current = false;
    };
    window.addEventListener("pointerup", upHandler);
    window.addEventListener("pointermove", handleSbPointerMove);
    window.addEventListener("pointermove", handleHuePointerMove);
    return () => {
      window.removeEventListener("pointerup", upHandler);
      window.removeEventListener("pointermove", handleSbPointerMove);
      window.removeEventListener("pointermove", handleHuePointerMove);
    };
  }, [handleSbPointerMove, handleHuePointerMove]);

  const handleSbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingSb.current = true;
    handleSbPointerMove(e.nativeEvent);
  };

  const handleHuePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingHue.current = true;
    handleHuePointerMove(e.nativeEvent);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (isValidHex(val)) {
      commit(val);
    }
  };

  const saturationBg = `hsl(${hsb.h}, 100%, 50%)`;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="color-trigger">{label}</Label>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <Button
            id="color-trigger"
            variant="outline"
            className="flex items-center gap-2 w-44 justify-between font-mono text-sm"
            aria-label={`Pick a color. Current color: ${internalColor}`}
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block w-5 h-5 rounded-sm border border-black/10 flex-shrink-0"
                style={{ backgroundColor: internalColor }}
                aria-hidden="true"
              />
              {internalColor.toUpperCase()}
            </span>
            <ChevronDown className="w-4 h-4 opacity-50" />
          </Button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={8}
            aria-labelledby={titleId}
            aria-describedby={descId}
            className={cn(
              "z-50 w-72 rounded-xl border bg-white shadow-xl outline-none",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
              "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
              "@media (prefers-reduced-motion: reduce) { animation: none }"
            )}
          >
            {/* Header */}
            <div className="px-4 pt-4 pb-2">
              <p id={titleId} className="font-semibold text-sm text-gray-900">
                Pick a color
              </p>
              <p id={descId} className="text-xs text-gray-500 mt-0.5">
                Choose from the palette or enter a hex value.
              </p>
            </div>

            {/* Saturation / Brightness gradient */}
            <div className="px-4">
              <div
                ref={sbRef}
                onPointerDown={handleSbPointerDown}
                className="relative w-full h-40 rounded-lg cursor-crosshair select-none touch-none"
                style={{
                  background: `linear-gradient(to bottom, transparent, #000),
                                linear-gradient(to right, #fff, ${saturationBg})`,
                }}
              >
                {/* Thumb */}
                <div
                  className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${hsb.s}%`,
                    top: `${100 - hsb.b}%`,
                    backgroundColor: internalColor,
                  }}
                />
              </div>
            </div>

            {/* Hue slider */}
            <div className="px-4 mt-3">
              <div
                ref={hueRef}
                onPointerDown={handleHuePointerDown}
                className="relative w-full h-4 rounded-full cursor-pointer select-none touch-none"
                style={{
                  background:
                    "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                }}
              >
                {/* Hue thumb */}
                <div
                  className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 top-0 pointer-events-none"
                  style={{
                    left: `${(hsb.h / 360) * 100}%`,
                    backgroundColor: `hsl(${hsb.h}, 100%, 50%)`,
                  }}
                />
              </div>
            </div>

            {/* Hex input & preview */}
            <div className="px-4 mt-3 flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-md border border-black/10 flex-shrink-0"
                style={{ backgroundColor: internalColor }}
                aria-hidden="true"
              />
              <div className="flex-1">
                <Label htmlFor="hex-input" className="sr-only">
                  Hex color value
                </Label>
                <Input
                  id="hex-input"
                  value={hexInput}
                  onChange={handleHexChange}
                  placeholder="#000000"
                  className="font-mono text-sm h-9"
                  maxLength={7}
                  spellCheck={false}
                />
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-9 w-9 flex-shrink-0"
                aria-label="Sample color from screen"
                onClick={async () => {
                  if ("EyeDropper" in window) {
                    try {
                      // @ts-expect-error EyeDropper API
                      const eyeDropper = new window.EyeDropper();
                      const result = await eyeDropper.open();
                      if (isValidHex(result.sRGBHex)) {
                        commit(result.sRGBHex);
                      }
                    } catch {
                      // user cancelled
                    }
                  }
                }}
              >
                <Pipette className="w-4 h-4" />
              </Button>
            </div>

            {/* Preset swatches */}
            <div className="px-4 mt-3 pb-4">
              <p className="text-xs text-gray-500 mb-2">Presets</p>
              <div className="grid grid-cols-9 gap-1.5">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.value}
                    aria-label={preset.label}
                    title={preset.label}
                    onClick={() => commit(preset.value)}
                    className={cn(
                      "w-6 h-6 rounded-md border border-black/10 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                      internalColor.toLowerCase() ===
                        preset.value.toLowerCase() &&
                        "ring-2 ring-blue-500 ring-offset-1"
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