"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Utility helpers ────────────────────────────────────────────────────────

function hexToHsv(hex: string): { h: number; s: number; v: number } {
  let r = 0,
    g = 0,
    b = 0;
  const clean = hex.replace("#", "");
  if (clean.length === 6) {
    r = parseInt(clean.slice(0, 2), 16) / 255;
    g = parseInt(clean.slice(2, 4), 16) / 255;
    b = parseInt(clean.slice(4, 6), 16) / 255;
  }
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, v: v * 100 };
}

function hsvToHex(h: number, s: number, v: number): string {
  const hh = h / 360;
  const ss = s / 100;
  const vv = v / 100;
  let r = 0,
    g = 0,
    b = 0;
  const i = Math.floor(hh * 6);
  const f = hh * 6 - i;
  const p = vv * (1 - ss);
  const q = vv * (1 - f * ss);
  const t = vv * (1 - (1 - f) * ss);
  switch (i % 6) {
    case 0: r = vv; g = t; b = p; break;
    case 1: r = q; g = vv; b = p; break;
    case 2: r = p; g = vv; b = t; break;
    case 3: r = p; g = q; b = vv; break;
    case 4: r = t; g = p; b = vv; break;
    case 5: r = vv; g = p; b = q; break;
  }
  return (
    "#" +
    [r, g, b]
      .map((x) =>
        Math.round(x * 255)
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function isValidHex(hex: string) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
}

// ─── Sub-components ──────────────────────────────────────────────────────────

interface SatValPickerProps {
  hue: number;
  saturation: number;
  value: number;
  onChange: (s: number, v: number) => void;
}

function SatValPicker({ hue, saturation, value, onChange }: SatValPickerProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const getCoords = React.useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const rect = ref.current!.getBoundingClientRect();
      const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
      onChange(x * 100, (1 - y) * 100);
    },
    [onChange]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    getCoords(e);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    getCoords(e);
  };

  const thumbLeft = `${saturation}%`;
  const thumbTop = `${100 - value}%`;

  return (
    <div
      ref={ref}
      className="relative w-full h-40 rounded-md cursor-crosshair select-none"
      style={{
        background: `
          linear-gradient(to top, #000, transparent),
          linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))
        `,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      <div
        className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
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
  const ref = React.useRef<HTMLDivElement>(null);

  const getHue = React.useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const rect = ref.current!.getBoundingClientRect();
      const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      onChange(x * 360);
    },
    [onChange]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    getHue(e);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    getHue(e);
  };

  return (
    <div
      ref={ref}
      className="relative w-full h-4 rounded-full cursor-pointer select-none"
      style={{
        background:
          "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
    >
      <div
        className="absolute top-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: `${(hue / 360) * 100}%`,
          backgroundColor: `hsl(${hue}, 100%, 50%)`,
        }}
      />
    </div>
  );
}

// ─── Preset swatches ─────────────────────────────────────────────────────────

const PRESETS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#ffffff", "#d1d5db", "#6b7280", "#111827",
];

// ─── Main component ───────────────────────────────────────────────────────────

export interface ColorPickerPopoverProps {
  value?: string;
  onChange?: (color: string) => void;
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
  const [internalColor, setInternalColor] = React.useState(value);
  const [hexInput, setHexInput] = React.useState(value);

  const { h, s, v } = React.useMemo(
    () => hexToHsv(isValidHex(internalColor) ? internalColor : "#3b82f6"),
    [internalColor]
  );

  const [hue, setHue] = React.useState(h);
  const [saturation, setSaturation] = React.useState(s);
  const [brightness, setBrightness] = React.useState(v);

  // Sync when value prop changes externally
  React.useEffect(() => {
    if (isValidHex(value) && value !== internalColor) {
      const { h: nh, s: ns, v: nv } = hexToHsv(value);
      setInternalColor(value);
      setHexInput(value);
      setHue(nh);
      setSaturation(ns);
      setBrightness(nv);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const commit = React.useCallback(
    (hex: string) => {
      setInternalColor(hex);
      setHexInput(hex);
      onChange?.(hex);
    },
    [onChange]
  );

  const handleSatVal = React.useCallback(
    (s: number, v: number) => {
      setSaturation(s);
      setBrightness(v);
      commit(hsvToHex(hue, s, v));
    },
    [hue, commit]
  );

  const handleHue = React.useCallback(
    (newHue: number) => {
      setHue(newHue);
      commit(hsvToHex(newHue, saturation, brightness));
    },
    [saturation, brightness, commit]
  );

  const handleHexInput = (raw: string) => {
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      const { h: nh, s: ns, v: nv } = hexToHsv(normalized);
      setHue(nh);
      setSaturation(ns);
      setBrightness(nv);
      commit(normalized);
    }
  };

  const handlePreset = (hex: string) => {
    const { h: nh, s: ns, v: nv } = hexToHsv(hex);
    setHue(nh);
    setSaturation(ns);
    setBrightness(nv);
    commit(hex);
  };

  const displayColor = isValidHex(internalColor) ? internalColor : "#3b82f6";

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start gap-2 px-3 font-mono text-sm"
          >
            <span
              className="h-5 w-5 rounded-md border border-black/10 flex-shrink-0"
              style={{ backgroundColor: displayColor }}
            />
            <span className="flex-1 text-left">{displayColor}</span>
            <Pipette className="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            sideOffset={8}
            align="start"
            className={cn(
              "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
              "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
            )}
          >
            {/* Close button */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-popover-foreground">
                Pick a color
              </p>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Saturation / Value canvas */}
            <SatValPicker
              hue={hue}
              saturation={saturation}
              value={brightness}
              onChange={handleSatVal}
            />

            {/* Hue slider */}
            <div className="mt-3">
              <HueSlider hue={hue} onChange={handleHue} />
            </div>

            {/* Preview + Hex input */}
            <div className="mt-4 flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-lg border border-black/10 flex-shrink-0 shadow-inner"
                style={{ backgroundColor: displayColor }}
              />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Hex
                </Label>
                <Input
                  value={hexInput}
                  onChange={(e) => handleHexInput(e.target.value)}
                  className="font-mono h-8 text-sm"
                  maxLength={7}
                  spellCheck={false}
                />
              </div>
            </div>

            {/* Presets */}
            <div className="mt-4">
              <Label className="text-xs text-muted-foreground mb-2 block">
                Presets
              </Label>
              <div className="grid grid-cols-6 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handlePreset(preset)}
                    className={cn(
                      "h-7 w-full rounded-md border transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                      displayColor.toLowerCase() === preset.toLowerCase()
                        ? "border-primary ring-2 ring-primary ring-offset-1"
                        : "border-black/10"
                    )}
                    style={{ backgroundColor: preset }}
                    title={preset}
                  />
                ))}
              </div>
            </div>

            <PopoverPrimitive.Arrow className="fill-popover" />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}

export default ColorPickerPopover;