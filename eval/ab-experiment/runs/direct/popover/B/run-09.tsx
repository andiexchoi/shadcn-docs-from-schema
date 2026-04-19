"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────
   Tiny helpers
───────────────────────────────────────────────────────── */

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
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) =>
    Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function isValidHex(value: string) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

function normaliseHex(value: string): string {
  const raw = value.startsWith("#") ? value : `#${value}`;
  if (/^#[0-9a-fA-F]{3}$/.test(raw)) {
    return `#${raw[1]}${raw[1]}${raw[2]}${raw[2]}${raw[3]}${raw[3]}`;
  }
  return raw;
}

/* ─────────────────────────────────────────────────────────
   Preset palette
───────────────────────────────────────────────────────── */

const PRESETS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#ffffff", "#d1d5db", "#6b7280", "#111827",
];

/* ─────────────────────────────────────────────────────────
   Gradient canvas (hue + saturation / lightness picker)
───────────────────────────────────────────────────────── */

interface GradientPickerProps {
  hue: number;
  saturation: number;
  lightness: number;
  onChange: (s: number, l: number) => void;
}

function GradientPicker({ hue, saturation, lightness, onChange }: GradientPickerProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const computeFromEvent = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      const el = canvasRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
      const s = Math.round((x / rect.width) * 100);
      const l = Math.round(100 - (y / rect.height) * 100);
      onChange(s, l);
    },
    [onChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    computeFromEvent(e.nativeEvent);
  };

  React.useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging.current) computeFromEvent(e);
    };
    const onUp = () => { isDragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [computeFromEvent]);

  const thumbLeft = `${saturation}%`;
  const thumbTop = `${100 - lightness}%`;

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-40 rounded-md cursor-crosshair select-none touch-none"
      style={{
        background: `
          linear-gradient(to bottom, transparent, #000),
          linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))
        `,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={(e) => {
        isDragging.current = true;
        computeFromEvent(e.nativeEvent);
      }}
    >
      <span
        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md pointer-events-none"
        style={{
          left: thumbLeft,
          top: thumbTop,
          background: hslToHex(hue, saturation, lightness),
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Hue slider
───────────────────────────────────────────────────────── */

interface HueSliderProps {
  hue: number;
  onChange: (h: number) => void;
}

function HueSlider({ hue, onChange }: HueSliderProps) {
  return (
    <div className="relative w-full h-4">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
        }}
      />
      <input
        type="range"
        min={0}
        max={360}
        value={hue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer h-4"
        aria-label="Hue"
      />
      <span
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow pointer-events-none"
        style={{
          left: `${(hue / 360) * 100}%`,
          background: `hsl(${hue}, 100%, 50%)`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Alpha slider
───────────────────────────────────────────────────────── */

interface AlphaSliderProps {
  hex: string;
  alpha: number;
  onChange: (a: number) => void;
}

function AlphaSlider({ hex, alpha, onChange }: AlphaSliderProps) {
  return (
    <div className="relative w-full h-4">
      {/* checkerboard */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundImage:
            "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
          backgroundSize: "8px 8px",
          backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(to right, transparent, ${hex})`,
        }}
      />
      <input
        type="range"
        min={0}
        max={100}
        value={alpha}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer h-4"
        aria-label="Opacity"
      />
      <span
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow pointer-events-none"
        style={{
          left: `${alpha}%`,
          background: hex,
          opacity: alpha / 100,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────────────── */

export interface ColorPickerPopoverProps {
  /** Controlled hex colour, e.g. "#3b82f6" */
  value?: string;
  /** Called with the new hex string whenever the colour changes */
  onChange?: (hex: string) => void;
  /** Label shown next to the swatch trigger */
  label?: string;
  className?: string;
}

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  label = "Colour",
  className,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);

  // Derive HSL from the controlled value
  const safeHex = isValidHex(normaliseHex(value)) ? normaliseHex(value) : "#3b82f6";
  const { h, s, l } = hexToHsl(safeHex);

  const [hue, setHue] = React.useState(h);
  const [saturation, setSaturation] = React.useState(s);
  const [lightness, setLightness] = React.useState(l);
  const [alpha, setAlpha] = React.useState(100);
  const [hexInput, setHexInput] = React.useState(safeHex);

  // Sync internal state when controlled value changes externally
  React.useEffect(() => {
    const norm = normaliseHex(value);
    if (isValidHex(norm)) {
      const { h: nh, s: ns, l: nl } = hexToHsl(norm);
      setHue(nh);
      setSaturation(ns);
      setLightness(nl);
      setHexInput(norm);
    }
  }, [value]);

  const emitChange = React.useCallback(
    (h: number, s: number, l: number) => {
      const newHex = hslToHex(h, s, l);
      setHexInput(newHex);
      onChange?.(newHex);
    },
    [onChange]
  );

  const handleGradientChange = (s: number, l: number) => {
    setSaturation(s);
    setLightness(l);
    emitChange(hue, s, l);
  };

  const handleHueChange = (h: number) => {
    setHue(h);
    emitChange(h, saturation, lightness);
  };

  const handleHexInput = (raw: string) => {
    setHexInput(raw);
    const norm = normaliseHex(raw);
    if (isValidHex(norm)) {
      const { h: nh, s: ns, l: nl } = hexToHsl(norm);
      setHue(nh);
      setSaturation(ns);
      setLightness(nl);
      onChange?.(norm);
    }
  };

  const handlePreset = (preset: string) => {
    const { h: nh, s: ns, l: nl } = hexToHsl(preset);
    setHue(nh);
    setSaturation(ns);
    setLightness(nl);
    setHexInput(preset);
    onChange?.(preset);
  };

  const currentHex = hslToHex(hue, saturation, lightness);
  const displayHex = isValidHex(hexInput) ? hexInput : currentHex;

  const titleId = React.useId();
  const descId = React.useId();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <Button
            variant="outline"
            className="h-9 gap-2 px-3 font-medium"
            aria-label={`${label}: ${displayHex}. Click to open colour picker`}
          >
            <span
              className="inline-block w-5 h-5 rounded-sm border border-black/10 shadow-inner flex-shrink-0"
              style={{
                background: currentHex,
                opacity: alpha / 100,
              }}
              aria-hidden="true"
            />
            <span className="text-sm tracking-wide font-mono">
              {displayHex.toUpperCase()}
            </span>
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
              "z-50 w-72 rounded-xl border bg-popover p-4 shadow-xl outline-none",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "@media (prefers-reduced-motion: reduce) { animation: none !important }",
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p id={titleId} className="text-sm font-semibold leading-none">
                  {label}
                </p>
                <p id={descId} className="text-xs text-muted-foreground mt-1">
                  Pick a colour for your theme.
                </p>
              </div>
              <PopoverPrimitive.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  aria-label="Close colour picker"
                >
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                </Button>
              </PopoverPrimitive.Close>
            </div>

            {/* Gradient canvas */}
            <GradientPicker
              hue={hue}
              saturation={saturation}
              lightness={lightness}
              onChange={handleGradientChange}
            />

            {/* Sliders */}
            <div className="mt-3 space-y-2">
              <HueSlider hue={hue} onChange={handleHueChange} />
              <AlphaSlider
                hex={currentHex}
                alpha={alpha}
                onChange={setAlpha}
              />
            </div>

            {/* Hex input + preview */}
            <div className="mt-4 flex items-center gap-2">
              <span
                className="w-9 h-9 rounded-md border border-border flex-shrink-0 shadow-inner"
                style={{
                  background: currentHex,
                  opacity: alpha / 100,
                }}
                aria-hidden="true"
              />
              <div className="flex-1 space-y-1">
                <Label htmlFor="hex-input" className="text-xs text-muted-foreground sr-only">
                  Hex colour
                </Label>
                <Input
                  id="hex-input"
                  value={hexInput}
                  onChange={(e) => handleHexInput(e.target.value)}
                  maxLength={7}
                  className={cn(
                    "h-9 font-mono text-sm uppercase tracking-widest",
                    !isValidHex(normaliseHex(hexInput)) && "border-destructive focus-visible:ring-destructive"
                  )}
                  spellCheck={false}
                  aria-label="Hex colour value"
                />
              </div>
              <div className="w-16 space-y-1">
                <Label htmlFor="alpha-input" className="text-xs text-muted-foreground sr-only">
                  Opacity
                </Label>
                <div className="relative">
                  <Input
                    id="alpha-input"
                    type="number"
                    min={0}
                    max={100}
                    value={alpha}
                    onChange={(e) =>
                      setAlpha(Math.max(0, Math.min(100, Number(e.target.value))))
                    }
                    className="h-9 pr-5 text-sm font-mono"
                    aria-label="Opacity percentage"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Preset palette */}
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Presets</p>
              <div className="grid grid-cols-6 gap-1.5">
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handlePreset(preset)}
                    className={cn(
                      "w-full aspect-square rounded-md border border-black/10 shadow-sm",
                      "hover:scale-110 focus-visible:scale-110 transition-transform",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                      currentHex.toLowerCase() === preset.toLowerCase() &&
                        "ring-2 ring-ring ring-offset-1"
                    )}
                    style={{ background: preset }}
                    aria-label={`Select colour ${preset}`}
                    aria-pressed={currentHex.toLowerCase() === preset.toLowerCase()}
                  />
                ))}
              </div>
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>

      {/* Inline label */}
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
  );
}