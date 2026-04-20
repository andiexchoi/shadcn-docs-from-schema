"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
   Tiny helpers
───────────────────────────────────────────────────────────────────────────── */

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!result) return null;
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
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
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
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
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.trim());
}

function normaliseHex(value: string): string {
  const v = value.trim().replace(/^#+/, "");
  if (v.length === 3) {
    return `#${v[0]}${v[0]}${v[1]}${v[1]}${v[2]}${v[2]}`;
  }
  return `#${v}`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Preset swatches
───────────────────────────────────────────────────────────────────────────── */

const PRESETS: { label: string; color: string }[] = [
  { label: "Slate", color: "#64748b" },
  { label: "Red", color: "#ef4444" },
  { label: "Orange", color: "#f97316" },
  { label: "Amber", color: "#f59e0b" },
  { label: "Green", color: "#22c55e" },
  { label: "Teal", color: "#14b8a6" },
  { label: "Blue", color: "#3b82f6" },
  { label: "Violet", color: "#8b5cf6" },
  { label: "Pink", color: "#ec4899" },
  { label: "Rose", color: "#f43f5e" },
  { label: "White", color: "#ffffff" },
  { label: "Black", color: "#0f172a" },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Gradient canvas picker
───────────────────────────────────────────────────────────────────────────── */

interface GradientCanvasProps {
  hue: number;
  saturation: number;
  lightness: number;
  onChange: (s: number, l: number) => void;
}

function GradientCanvas({
  hue,
  saturation,
  lightness,
  onChange,
}: GradientCanvasProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  // Convert HSL saturation/lightness to canvas x/y coordinates
  // Canvas: x = saturation (0-100%), y = inverted lightness relative to sat
  // We map s=0,l=100 (white) → top-left, s=100,l=50 (pure) → top-right,
  // s=0,l=0 (black) → bottom-left, s=100,l=0 (black) → bottom-right.
  // Use: S_canvas = saturation, L_canvas = 100 - lightness * 2 / (2 - saturation/100)
  // Simplified: treat x = saturation (0→100), y = 1 - (l / ((1 - s/200))) clamped

  const toXY = (s: number, l: number) => {
    // brightness = l + s*(min(l,1-l))/1 ... simpler approach using HSV
    // Convert HSL → HSV
    const sv = s / 100;
    const lv = l / 100;
    const v = lv + sv * Math.min(lv, 1 - lv);
    const sv2 = v === 0 ? 0 : 2 * (1 - lv / v);
    return { x: sv2 * 100, y: (1 - v) * 100 };
  };

  const fromXY = (x: number, y: number) => {
    // HSV → HSL
    const sv = x / 100;
    const v = 1 - y / 100;
    const l = v * (1 - sv / 2);
    const s = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l);
    return { s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const handleInteraction = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = canvasRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      const { s, l } = fromXY(x * 100, y * 100);
      onChange(s, l);
    },
    [onChange]
  );

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      handleInteraction(e.clientX, e.clientY);
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
  }, [handleInteraction]);

  const { x: thumbX, y: thumbY } = toXY(saturation, lightness);

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-36 rounded-md cursor-crosshair select-none"
      style={{
        background: `
          linear-gradient(to bottom, transparent, #000),
          linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))
        `,
      }}
      onMouseDown={(e) => {
        dragging.current = true;
        handleInteraction(e.clientX, e.clientY);
      }}
      onTouchStart={(e) => {
        const t = e.touches[0];
        handleInteraction(t.clientX, t.clientY);
      }}
      onTouchMove={(e) => {
        const t = e.touches[0];
        handleInteraction(t.clientX, t.clientY);
      }}
      role="presentation"
    >
      {/* thumb */}
      <div
        className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: `${thumbX}%`,
          top: `${thumbY}%`,
          backgroundColor: hslToHex(hue, saturation, lightness),
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Slider
───────────────────────────────────────────────────────────────────────────── */

interface SliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  gradient: string;
  label: string;
  thumbColor?: string;
}

function ColorSlider({
  value,
  min,
  max,
  onChange,
  gradient,
  label,
  thumbColor,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative h-4 w-full rounded-full" style={{ background: gradient }}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      {/* track thumb */}
      <div
        className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow -translate-y-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          left: `${pct}%`,
          backgroundColor: thumbColor ?? `hsl(${value}, 100%, 50%)`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────────────────────────── */

export interface ColorPickerPopoverProps {
  value?: string;
  defaultValue?: string;
  onChange?: (hex: string) => void;
  label?: string;
}

export function ColorPickerPopover({
  value: controlledValue,
  defaultValue = "#3b82f6",
  onChange,
  label = "Color",
}: ColorPickerPopoverProps) {
  const isControlled = controlledValue !== undefined;

  const [internalColor, setInternalColor] = React.useState<string>(
    defaultValue
  );
  const color = isControlled ? (controlledValue as string) : internalColor;

  const hsl = hexToHsl(color) ?? { h: 220, s: 91, l: 60 };
  const [hue, setHue] = React.useState(hsl.h);
  const [saturation, setSaturation] = React.useState(hsl.s);
  const [lightness, setLightness] = React.useState(hsl.l);
  const [hexInput, setHexInput] = React.useState(color);
  const [open, setOpen] = React.useState(false);
  const titleId = React.useId();
  const descId = React.useId();

  // sync sliders when external color changes
  React.useEffect(() => {
    const parsed = hexToHsl(color);
    if (parsed) {
      setHue(parsed.h);
      setSaturation(parsed.s);
      setLightness(parsed.l);
      setHexInput(color);
    }
  }, [color]);

  const commit = React.useCallback(
    (h: number, s: number, l: number) => {
      const hex = hslToHex(h, s, l);
      setHexInput(hex);
      if (!isControlled) setInternalColor(hex);
      onChange?.(hex);
    },
    [isControlled, onChange]
  );

  const handleHueChange = (h: number) => {
    setHue(h);
    commit(h, saturation, lightness);
  };

  const handleSLChange = (s: number, l: number) => {
    setSaturation(s);
    setLightness(l);
    commit(hue, s, l);
  };

  const handleAlphaHexInput = (raw: string) => {
    setHexInput(raw);
    const withHash = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(withHash)) {
      const normalised = normaliseHex(withHash);
      const parsed = hexToHsl(normalised);
      if (parsed) {
        setHue(parsed.h);
        setSaturation(parsed.s);
        setLightness(parsed.l);
        if (!isControlled) setInternalColor(normalised);
        onChange?.(normalised);
      }
    }
  };

  const handlePreset = (hex: string) => {
    const parsed = hexToHsl(hex);
    if (parsed) {
      setHue(parsed.h);
      setSaturation(parsed.s);
      setLightness(parsed.l);
    }
    setHexInput(hex);
    if (!isControlled) setInternalColor(hex);
    onChange?.(hex);
  };

  const hueGradient =
    "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)";

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 px-3 h-9"
          aria-label={`Pick ${label}: current color ${color}`}
        >
          <span
            className="inline-block w-5 h-5 rounded border border-border shadow-sm flex-shrink-0"
            style={{ backgroundColor: color }}
            aria-hidden="true"
          />
          <span className="font-mono text-sm">{color.toUpperCase()}</span>
          <Pipette className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
        </Button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          role="dialog"
          aria-labelledby={titleId}
          aria-describedby={descId}
          sideOffset={8}
          align="start"
          className={cn(
            "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "@media (prefers-reduced-motion: reduce) { animation: none !important; }"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <p id={titleId} className="text-sm font-semibold leading-none">
                {label}
              </p>
              <p id={descId} className="text-xs text-muted-foreground mt-1">
                Pick a color for your theme.
              </p>
            </div>
            <PopoverPrimitive.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mr-1 -mt-1"
                aria-label="Close color picker"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </Button>
            </PopoverPrimitive.Close>
          </div>

          {/* Gradient canvas */}
          <GradientCanvas
            hue={hue}
            saturation={saturation}
            lightness={lightness}
            onChange={(s, l) => handleSLChange(s, l)}
          />

          {/* Sliders */}
          <div className="mt-3 space-y-3">
            {/* Hue */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Hue</Label>
              <ColorSlider
                value={hue}
                min={0}
                max={360}
                onChange={handleHueChange}
                gradient={hueGradient}
                label="Hue"
              />
            </div>
          </div>

          {/* Hex input + preview */}
          <div className="mt-4 flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-md border border-border flex-shrink-0 shadow-inner"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <div className="flex-1 space-y-1">
              <Label htmlFor="hex-input" className="text-xs text-muted-foreground sr-only">
                Hex value
              </Label>
              <Input
                id="hex-input"
                value={hexInput}
                onChange={(e) => handleAlphaHexInput(e.target.value)}
                className="h-9 font-mono text-sm uppercase"
                maxLength={7}
                placeholder="#000000"
                spellCheck={false}
              />
            </div>
          </div>

          {/* HSL readout */}
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            {(
              [
                ["H", hue, "°"],
                ["S", saturation, "%"],
                ["L", lightness, "%"],
              ] as const
            ).map(([ch, val, unit]) => (
              <div key={ch} className="rounded-md bg-muted px-2 py-1">
                <p className="text-[10px] text-muted-foreground font-medium">{ch}</p>
                <p className="text-sm font-semibold tabular-nums">
                  {val}
                  <span className="text-xs font-normal text-muted-foreground">
                    {unit}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {/* Presets */}
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Presets</p>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESETS.map(({ label: presetLabel, color: presetColor }) => (
                <button
                  key={presetColor}
                  onClick={() => handlePreset(presetColor)}
                  aria-label={presetLabel}
                  title={presetLabel}
                  className={cn(
                    "w-8 h-8 rounded-md border-2 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    color.toLowerCase() === presetColor.toLowerCase()
                      ? "border-primary ring-2 ring-primary ring-offset-1"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: presetColor }}
                />
              ))}
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}