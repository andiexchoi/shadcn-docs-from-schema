"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Utilities ───────────────────────────────────────────────────────────────

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
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
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
  const hh = h / 360,
    ss = s / 100,
    vv = v / 100;
  let r = 0,
    g = 0,
    b = 0;
  const i = Math.floor(hh * 6);
  const f = hh * 6 - i;
  const p = vv * (1 - ss);
  const q = vv * (1 - f * ss);
  const t = vv * (1 - (1 - f) * ss);
  switch (i % 6) {
    case 0:
      r = vv;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = vv;
      b = p;
      break;
    case 2:
      r = p;
      g = vv;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = vv;
      break;
    case 4:
      r = t;
      g = p;
      b = vv;
      break;
    case 5:
      r = vv;
      g = p;
      b = q;
      break;
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

function isValidHex(hex: string) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
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

// ─── Preset Palette ──────────────────────────────────────────────────────────

const PRESETS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#84cc16",
  "#06b6d4",
  "#6366f1",
  "#ffffff",
  "#d1d5db",
  "#6b7280",
  "#1f2937",
  "#000000",
  "#fef08a",
];

// ─── Sub-components ──────────────────────────────────────────────────────────

interface GradientPickerProps {
  hue: number;
  saturation: number;
  value: number;
  onChange: (s: number, v: number) => void;
}

function GradientPicker({ hue, saturation, value, onChange }: GradientPickerProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const getCoords = React.useCallback(
    (e: MouseEvent | React.MouseEvent | TouchEvent | React.TouchEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY =
        "touches" in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      onChange(x * 100, (1 - y) * 100);
    },
    [onChange]
  );

  const dragging = React.useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    getCoords(e);
  };

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) getCoords(e);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [getCoords]);

  const thumbLeft = `${saturation}%`;
  const thumbTop = `${100 - value}%`;

  return (
    <div
      ref={ref}
      className="relative w-full h-40 rounded-md cursor-crosshair select-none overflow-hidden"
      style={{
        background: `hsl(${hue}, 100%, 50%)`,
      }}
      onMouseDown={onMouseDown}
    >
      {/* White gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, #fff 0%, transparent 100%)",
        }}
      />
      {/* Black gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #000 100%)",
        }}
      />
      {/* Thumb */}
      <div
        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md pointer-events-none"
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
    (e: MouseEvent | React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onChange(x * 360);
    },
    [onChange]
  );

  const dragging = React.useRef(false);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    getHue(e);
  };

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) getHue(e);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [getHue]);

  return (
    <div
      ref={ref}
      className="relative w-full h-3 rounded-full cursor-pointer select-none"
      style={{
        background:
          "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
      }}
      onMouseDown={onMouseDown}
    >
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
        style={{
          left: `${(hue / 360) * 100}%`,
          backgroundColor: `hsl(${hue}, 100%, 50%)`,
        }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

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
  const [hexInput, setHexInput] = React.useState(value);

  const { h, s, v } = React.useMemo(() => hexToHsv(value), [value]);
  const [hue, setHue] = React.useState(h);
  const [sat, setSat] = React.useState(s);
  const [val, setVal] = React.useState(v);

  // Sync internal state when value prop changes externally
  React.useEffect(() => {
    const { h: nh, s: ns, v: nv } = hexToHsv(value);
    setHue(nh);
    setSat(ns);
    setVal(nv);
    setHexInput(value);
  }, [value]);

  const emitColor = React.useCallback(
    (hex: string) => {
      onChange?.(hex);
    },
    [onChange]
  );

  const handleGradientChange = (newS: number, newV: number) => {
    setSat(newS);
    setVal(newV);
    const hex = hsvToHex(hue, newS, newV);
    setHexInput(hex);
    emitColor(hex);
  };

  const handleHueChange = (newH: number) => {
    setHue(newH);
    const hex = hsvToHex(newH, sat, val);
    setHexInput(hex);
    emitColor(hex);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    if (isValidHex(raw)) {
      const normalized = normalizeHex(raw);
      const { h: nh, s: ns, v: nv } = hexToHsv(normalized);
      setHue(nh);
      setSat(ns);
      setVal(nv);
      emitColor(normalized);
    }
  };

  const handlePreset = (preset: string) => {
    const { h: nh, s: ns, v: nv } = hexToHsv(preset);
    setHue(nh);
    setSat(ns);
    setVal(nv);
    setHexInput(preset);
    emitColor(preset);
  };

  const currentHex = hsvToHex(hue, sat, val);

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
              "flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-background shadow-sm",
              "hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "text-sm font-medium"
            )}
            aria-label={`Pick color: ${currentHex}`}
          >
            <span
              className="inline-block w-5 h-5 rounded border border-black/20 shadow-inner flex-shrink-0"
              style={{ backgroundColor: currentHex }}
            />
            <span className="font-mono text-xs text-muted-foreground">
              {currentHex.toUpperCase()}
            </span>
            <Pipette className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            sideOffset={8}
            align="start"
            className={cn(
              "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
            )}
          >
            {/* Close button */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-popover-foreground">
                Pick a Color
              </span>
              <PopoverPrimitive.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-md"
                  aria-label="Close color picker"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </PopoverPrimitive.Close>
            </div>

            {/* Gradient picker */}
            <GradientPicker
              hue={hue}
              saturation={sat}
              value={val}
              onChange={handleGradientChange}
            />

            {/* Hue slider + preview */}
            <div className="flex items-center gap-3 mt-3">
              <div className="flex-1">
                <HueSlider hue={hue} onChange={handleHueChange} />
              </div>
              <div
                className="w-8 h-8 rounded-md border border-black/20 shadow-inner flex-shrink-0"
                style={{ backgroundColor: currentHex }}
              />
            </div>

            {/* Hex input */}
            <div className="mt-3 flex items-center gap-2">
              <Label className="text-xs text-muted-foreground w-8 shrink-0">
                HEX
              </Label>
              <Input
                className="h-8 font-mono text-xs"
                value={hexInput}
                onChange={handleHexInputChange}
                maxLength={7}
                spellCheck={false}
                placeholder="#000000"
              />
            </div>

            {/* Presets */}
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Presets</p>
              <div className="grid grid-cols-9 gap-1">
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    title={preset.toUpperCase()}
                    onClick={() => handlePreset(preset)}
                    className={cn(
                      "w-6 h-6 rounded border border-black/10 shadow-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      currentHex.toLowerCase() === preset.toLowerCase() &&
                        "ring-2 ring-ring ring-offset-1"
                    )}
                    style={{ backgroundColor: preset }}
                  />
                ))}
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