"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function hexToHsl(hex: string): [number, number, number] {
  let r = 0,
    g = 0,
    b = 0;
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length === 6) {
    r = parseInt(clean.slice(0, 2), 16);
    g = parseInt(clean.slice(2, 4), 16);
    b = parseInt(clean.slice(4, 6), 16);
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
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
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
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
}

function normalizeHex(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    return (
      "#" +
      clean
        .split("")
        .map((c) => c + c)
        .join("")
    );
  }
  return "#" + clean;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface GradientPickerProps {
  hue: number;
  saturation: number;
  lightness: number;
  onChange: (s: number, l: number) => void;
}

function SaturationLightnessPicker({
  hue,
  saturation,
  lightness,
  onChange,
}: GradientPickerProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  // Convert HSL to picker position
  // The picker maps: x -> saturation (0-100), y -> lightness inverted
  // We approximate: at the top-left corner (x=0,y=0) -> white (s=0,l=100)
  // at the top-right (x=1,y=0) -> pure hue (s=100,l=50)
  // at bottom-left (x=0,y=1) -> black (s=0,l=0)
  // We use the HSV to HSL mapping for a natural feel
  // Simplified: x = saturation/100, y = 1 - lightness/100 (approximate)

  const xPercent = saturation;
  const yPercent = 100 - lightness * 2;

  const handlePointer = React.useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      const newS = Math.round(x * 100);
      const newL = Math.round((1 - y) * 50 + (1 - x) * y * 50);
      onChange(newS, newL);
    },
    [onChange]
  );

  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (isDragging.current) handlePointer(e);
    };
    const onUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [handlePointer]);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-40 rounded-md cursor-crosshair select-none touch-none overflow-hidden"
      style={{
        background: `hsl(${hue}, 100%, 50%)`,
      }}
      onPointerDown={(e) => {
        isDragging.current = true;
        handlePointer(e);
      }}
    >
      {/* White gradient left to right */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, #fff 0%, transparent 100%)",
        }}
      />
      {/* Black gradient top to bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #000 100%)",
        }}
      />
      {/* Thumb */}
      <div
        className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: `${xPercent}%`,
          top: `${Math.max(0, Math.min(100, yPercent))}%`,
          backgroundColor: hslToHex(hue, saturation, lightness),
        }}
      />
    </div>
  );
}

interface SliderProps {
  value: number;
  min: number;
  max: number;
  background: string;
  onChange: (value: number) => void;
  thumbColor?: string;
}

function ColorSlider({
  value,
  min,
  max,
  background,
  onChange,
  thumbColor,
}: SliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const percent = ((value - min) / (max - min)) * 100;

  const handlePointer = React.useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onChange(Math.round(x * (max - min) + min));
    },
    [max, min, onChange]
  );

  React.useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (isDragging.current) handlePointer(e);
    };
    const onUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [handlePointer]);

  return (
    <div
      ref={trackRef}
      className="relative w-full h-4 rounded-full cursor-pointer select-none touch-none"
      style={{ background }}
      onPointerDown={(e) => {
        isDragging.current = true;
        handlePointer(e);
      }}
    >
      <div
        className="absolute top-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: `${percent}%`,
          backgroundColor: thumbColor ?? `hsl(${value}, 100%, 50%)`,
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Preset swatches
// ---------------------------------------------------------------------------

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
  "#d1d5db",
  "#6b7280",
  "#111827",
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export interface ColorPickerPopoverProps {
  value?: string;
  onChange?: (hex: string) => void;
  label?: string;
  className?: string;
}

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  label = "Color",
  className,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [internalColor, setInternalColor] = React.useState<string>(
    isValidHex(value) ? normalizeHex(value) : "#3b82f6"
  );
  const [hexInput, setHexInput] = React.useState(internalColor);

  // Sync external value
  React.useEffect(() => {
    if (isValidHex(value)) {
      const normalized = normalizeHex(value);
      setInternalColor(normalized);
      setHexInput(normalized);
    }
  }, [value]);

  const [h, s, l] = React.useMemo(
    () => hexToHsl(internalColor),
    [internalColor]
  );

  const applyColor = React.useCallback(
    (hex: string) => {
      setInternalColor(hex);
      setHexInput(hex);
      onChange?.(hex);
    },
    [onChange]
  );

  const handleSaturationLightnessChange = (newS: number, newL: number) => {
    const hex = hslToHex(h, newS, newL);
    applyColor(hex);
  };

  const handleHueChange = (newH: number) => {
    const hex = hslToHex(newH, s, l);
    applyColor(hex);
  };

  const handleAlphaChange = (_: number) => {
    // Alpha is displayed but hex doesn't store it; kept for UX completeness
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const withHash = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(withHash)) {
      applyColor(normalizeHex(withHash));
    }
  };

  const [alpha, setAlpha] = React.useState(100);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}

      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-3 px-3 font-mono text-sm"
          >
            <span
              className="inline-block h-5 w-5 flex-shrink-0 rounded border border-black/10 shadow-inner"
              style={{ backgroundColor: internalColor }}
            />
            <span className="flex-1 text-left">{internalColor}</span>
            <Pipette className="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={8}
            className={cn(
              "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl outline-none",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
            )}
          >
            {/* Close button */}
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-popover-foreground">
                Color Picker
              </span>
              <PopoverPrimitive.Close asChild>
                <button
                  className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </PopoverPrimitive.Close>
            </div>

            {/* Saturation / Lightness canvas */}
            <SaturationLightnessPicker
              hue={h}
              saturation={s}
              lightness={l}
              onChange={handleSaturationLightnessChange}
            />

            <div className="mt-4 flex gap-3">
              {/* Preview swatch */}
              <div
                className="h-10 w-10 flex-shrink-0 rounded-lg border border-black/10 shadow-inner"
                style={{ backgroundColor: internalColor }}
              />

              {/* Hue + Alpha sliders */}
              <div className="flex flex-1 flex-col gap-2.5 justify-center">
                {/* Hue slider */}
                <ColorSlider
                  value={h}
                  min={0}
                  max={360}
                  background="linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)"
                  onChange={handleHueChange}
                />

                {/* Alpha slider */}
                <ColorSlider
                  value={alpha}
                  min={0}
                  max={100}
                  background={`linear-gradient(to right, transparent, ${internalColor}), repeating-conic-gradient(#ccc 0% 25%, #fff 0% 50%) 0 0 / 8px 8px`}
                  thumbColor={internalColor}
                  onChange={(v) => {
                    setAlpha(v);
                    handleAlphaChange(v);
                  }}
                />
              </div>
            </div>

            {/* Hex input */}
            <div className="mt-4 flex items-center gap-2">
              <Label className="w-8 flex-shrink-0 text-xs text-muted-foreground">
                HEX
              </Label>
              <Input
                className="h-8 font-mono text-xs"
                value={hexInput}
                onChange={handleHexInput}
                maxLength={7}
                spellCheck={false}
              />
              <Label className="w-10 flex-shrink-0 text-xs text-muted-foreground">
                A: {alpha}%
              </Label>
            </div>

            {/* HSL readout */}
            <div className="mt-2 flex gap-2">
              {[
                { label: "H", value: h },
                { label: "S", value: s },
                { label: "L", value: l },
              ].map(({ label: lbl, value: val }) => (
                <div key={lbl} className="flex flex-1 flex-col items-center">
                  <div className="w-full rounded border border-input bg-background px-2 py-1 text-center font-mono text-xs">
                    {val}
                  </div>
                  <span className="mt-0.5 text-[10px] text-muted-foreground">
                    {lbl}
                  </span>
                </div>
              ))}
            </div>

            {/* Preset swatches */}
            <div className="mt-4">
              <p className="mb-2 text-xs text-muted-foreground">Presets</p>
              <div className="grid grid-cols-6 gap-1.5">
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    className={cn(
                      "h-7 w-full rounded border border-black/10 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                      internalColor.toLowerCase() === preset.toLowerCase() &&
                        "ring-2 ring-ring ring-offset-1"
                    )}
                    style={{ backgroundColor: preset }}
                    onClick={() => applyColor(preset)}
                    title={preset}
                    aria-label={`Select ${preset}`}
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