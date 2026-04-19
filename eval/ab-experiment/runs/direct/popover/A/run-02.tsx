"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Utility helpers ──────────────────────────────────────────────────────────

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (d !== 0) {
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

  return { h: h * 360, s: s * 100, v: v * 100 };
}

function hsvToHex(h: number, s: number, v: number): string {
  const hn = h / 360;
  const sn = s / 100;
  const vn = v / 100;

  const i = Math.floor(hn * 6);
  const f = hn * 6 - i;
  const p = vn * (1 - sn);
  const q = vn * (1 - f * sn);
  const t = vn * (1 - (1 - f) * sn);

  let r = 0,
    g = 0,
    b = 0;
  switch (i % 6) {
    case 0: r = vn; g = t; b = p; break;
    case 1: r = q; g = vn; b = p; break;
    case 2: r = p; g = vn; b = t; break;
    case 3: r = p; g = q; b = vn; break;
    case 4: r = t; g = p; b = vn; break;
    case 5: r = vn; g = p; b = q; break;
  }

  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, "0");

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function isValidHex(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

function normaliseHex(value: string): string {
  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    return (
      "#" +
      value[1] +
      value[1] +
      value[2] +
      value[2] +
      value[3] +
      value[3]
    );
  }
  return value.toLowerCase();
}

// ─── Preset swatches ─────────────────────────────────────────────────────────

const PRESETS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
  "#ffffff", "#d1d5db", "#6b7280", "#1f2937",
  "#000000", "#fef3c7", "#dbeafe", "#fce7f3",
];

// ─── Sub‑components ───────────────────────────────────────────────────────────

interface GradientPickerProps {
  hue: number;
  saturation: number;
  value: number;
  onChange: (s: number, v: number) => void;
}

function GradientPicker({ hue, saturation, value, onChange }: GradientPickerProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null);

  const handlePointerEvent = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = canvasRef.current;
      if (!el) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      onChange(x * 100, (1 - y) * 100);
    },
    [onChange]
  );

  const thumbLeft = `${saturation}%`;
  const thumbTop = `${100 - value}%`;

  return (
    <div
      ref={canvasRef}
      className="relative h-36 w-full cursor-crosshair rounded-md overflow-hidden select-none"
      style={{
        background: `linear-gradient(to top, #000, transparent),
                     linear-gradient(to right, #fff, hsl(${hue},100%,50%))`,
      }}
      onPointerDown={handlePointerEvent}
      onPointerMove={(e) => {
        if (e.buttons !== 1) return;
        handlePointerEvent(e);
      }}
    >
      {/* thumb */}
      <div
        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow pointer-events-none"
        style={{
          left: thumbLeft,
          top: thumbTop,
          backgroundColor: hsvToHex(hue, saturation, value),
        }}
      />
    </div>
  );
}

interface HueSliderProps {
  hue: number;
  onChange: (h: number) => void;
}

function HueSlider({ hue, onChange }: HueSliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);

  const handlePointerEvent = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = trackRef.current;
      if (!el) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onChange(x * 360);
    },
    [onChange]
  );

  return (
    <div
      ref={trackRef}
      className="relative h-3 w-full rounded-full cursor-pointer select-none"
      style={{
        background:
          "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
      }}
      onPointerDown={handlePointerEvent}
      onPointerMove={(e) => {
        if (e.buttons !== 1) return;
        handlePointerEvent(e);
      }}
    >
      <div
        className="absolute top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow pointer-events-none"
        style={{
          left: `${(hue / 360) * 100}%`,
          backgroundColor: `hsl(${hue},100%,50%)`,
        }}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export interface ColorPickerPopoverProps {
  value?: string;
  defaultValue?: string;
  onChange?: (color: string) => void;
  label?: string;
  className?: string;
}

export function ColorPickerPopover({
  value: controlledValue,
  defaultValue = "#3b82f6",
  onChange,
  label = "Color",
  className,
}: ColorPickerPopoverProps) {
  const isControlled = controlledValue !== undefined;

  const [internalColor, setInternalColor] = React.useState<string>(
    isControlled ? (controlledValue ?? defaultValue) : defaultValue
  );

  const color = isControlled ? (controlledValue ?? defaultValue) : internalColor;

  const [hexInput, setHexInput] = React.useState<string>(color);
  const [open, setOpen] = React.useState(false);

  // Sync hexInput with color when popover opens or controlled value changes
  React.useEffect(() => {
    setHexInput(color);
  }, [color, open]);

  const hsv = React.useMemo(() => {
    const safeColor =
      isValidHex(color) ? normaliseHex(color) : "#3b82f6";
    return hexToHsv(safeColor);
  }, [color]);

  const updateColor = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternalColor(next);
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const handleGradientChange = React.useCallback(
    (s: number, v: number) => {
      const next = hsvToHex(hsv.h, s, v);
      updateColor(next);
    },
    [hsv.h, updateColor]
  );

  const handleHueChange = React.useCallback(
    (h: number) => {
      const next = hsvToHex(h, hsv.s, hsv.v);
      updateColor(next);
    },
    [hsv.s, hsv.v, updateColor]
  );

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    if (isValidHex(raw)) {
      updateColor(normaliseHex(raw));
    }
  };

  const handleHexInputBlur = () => {
    if (!isValidHex(hexInput)) {
      setHexInput(color);
    }
  };

  const handlePresetClick = (preset: string) => {
    updateColor(preset);
    setHexInput(preset);
  };

  const displayColor = isValidHex(color) ? color : "#3b82f6";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label className="text-sm font-medium text-foreground">{label}</Label>
      )}

      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            className={cn(
              "flex items-center gap-2 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "transition-colors"
            )}
          >
            <span
              className="w-5 h-5 rounded-sm border border-black/10 shrink-0"
              style={{ backgroundColor: displayColor }}
            />
            <span className="font-mono text-xs tracking-wide">{displayColor.toUpperCase()}</span>
            <Pipette className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            side="bottom"
            align="start"
            sideOffset={6}
            className={cn(
              "z-50 w-64 rounded-xl border border-border bg-popover p-4 shadow-xl",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
            )}
          >
            {/* Close button */}
            <PopoverPrimitive.Close asChild>
              <button
                type="button"
                className="absolute right-3 top-3 rounded-sm opacity-60 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring transition-opacity"
                aria-label="Close color picker"
              >
                <X className="h-4 w-4" />
              </button>
            </PopoverPrimitive.Close>

            <div className="flex flex-col gap-4">
              {/* Gradient picker */}
              <GradientPicker
                hue={hsv.h}
                saturation={hsv.s}
                value={hsv.v}
                onChange={handleGradientChange}
              />

              {/* Hue slider */}
              <HueSlider hue={hsv.h} onChange={handleHueChange} />

              {/* Preview + hex input */}
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-md border border-black/10 shrink-0"
                  style={{ backgroundColor: displayColor }}
                />
                <div className="flex-1">
                  <Input
                    value={hexInput}
                    onChange={handleHexInputChange}
                    onBlur={handleHexInputBlur}
                    maxLength={7}
                    className="font-mono text-xs h-8"
                    aria-label="Hex color value"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => {
                    navigator.clipboard?.writeText(displayColor);
                  }}
                >
                  Copy
                </Button>
              </div>

              {/* Preset swatches */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Presets</p>
                <div className="grid grid-cols-8 gap-1.5">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      title={preset.toUpperCase()}
                      onClick={() => handlePresetClick(preset)}
                      className={cn(
                        "w-6 h-6 rounded-md border border-black/10 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring",
                        displayColor.toLowerCase() === preset.toLowerCase() &&
                          "ring-2 ring-ring ring-offset-1"
                      )}
                      style={{ backgroundColor: preset }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <PopoverPrimitive.Arrow className="fill-border" />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}

export default ColorPickerPopover;