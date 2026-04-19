"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Tiny utility: convert hex → {r,g,b} and back
───────────────────────────────────────────── */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const n = parseInt(clean, 16);
  if (isNaN(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
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
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/* ─────────────────────────────────────────────
   Preset swatches
───────────────────────────────────────────── */
const PRESETS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#64748b",
  "#000000",
  "#ffffff",
];

/* ─────────────────────────────────────────────
   Gradient canvas picker
───────────────────────────────────────────── */
interface GradientPickerProps {
  hue: number;
  saturation: number; // 0–100
  lightness: number;  // 0–100
  onChange: (s: number, l: number) => void;
}

function GradientPicker({ hue, saturation, lightness, onChange }: GradientPickerProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const handlePointer = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
      const s = Math.round((x / rect.width) * 100);
      const l = Math.round(100 - (y / rect.height) * 100);
      onChange(s, l);
    },
    [onChange]
  );

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    isDragging.current = true;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    handlePointer(e);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    handlePointer(e);
  }

  function onPointerUp() {
    isDragging.current = false;
  }

  // Cursor position
  const cursorX = `${saturation}%`;
  const cursorY = `${100 - lightness}%`;

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-36 rounded-md cursor-crosshair select-none touch-none"
      style={{
        background: `
          linear-gradient(to top, #000, transparent),
          linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))
        `,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Cursor */}
      <div
        className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: cursorX,
          top: cursorY,
          background: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Hue slider
───────────────────────────────────────────── */
interface HueSliderProps {
  hue: number;
  onChange: (h: number) => void;
}

function HueSlider({ hue, onChange }: HueSliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const handlePointer = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      onChange(Math.round((x / rect.width) * 360));
    },
    [onChange]
  );

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    isDragging.current = true;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    handlePointer(e);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current) return;
    handlePointer(e);
  }

  function onPointerUp() {
    isDragging.current = false;
  }

  return (
    <div
      ref={trackRef}
      className="relative w-full h-3 rounded-full cursor-pointer touch-none select-none"
      style={{
        background:
          "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div
        className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: `${(hue / 360) * 100}%`,
          background: `hsl(${hue}, 100%, 50%)`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
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
  const [hex, setHex] = React.useState(value);
  const [hexInput, setHexInput] = React.useState(value);

  // Derived HSL from hex
  const hsl = React.useMemo(() => hexToHsl(hex) ?? { h: 0, s: 100, l: 50 }, [hex]);
  const [hue, setHue] = React.useState(hsl.h);
  const [saturation, setSaturation] = React.useState(hsl.s);
  const [lightness, setLightness] = React.useState(hsl.l);

  // Sync external value
  React.useEffect(() => {
    setHex(value);
    setHexInput(value);
    const parsed = hexToHsl(value);
    if (parsed) {
      setHue(parsed.h);
      setSaturation(parsed.s);
      setLightness(parsed.l);
    }
  }, [value]);

  function applyHex(newHex: string) {
    setHex(newHex);
    setHexInput(newHex);
    onChange?.(newHex);
    const parsed = hexToHsl(newHex);
    if (parsed) {
      setHue(parsed.h);
      setSaturation(parsed.s);
      setLightness(parsed.l);
    }
  }

  function applyHsl(h: number, s: number, l: number) {
    // hsl → approximate hex via canvas math
    const hNorm = h / 360;
    const sNorm = s / 100;
    const lNorm = l / 100;
    const a = sNorm * Math.min(lNorm, 1 - lNorm);
    function f(n: number) {
      const k = (n + hNorm * 12) % 12;
      return lNorm - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    }
    const newHex = rgbToHex(
      Math.round(f(0) * 255),
      Math.round(f(8) * 255),
      Math.round(f(4) * 255)
    );
    setHex(newHex);
    setHexInput(newHex);
    onChange?.(newHex);
  }

  function handleHueChange(h: number) {
    setHue(h);
    applyHsl(h, saturation, lightness);
  }

  function handleGradientChange(s: number, l: number) {
    setSaturation(s);
    setLightness(l);
    applyHsl(hue, s, l);
  }

  function handleHexInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : "#" + raw;
    if (/^#[0-9a-fA-F]{6}$/.test(normalized)) {
      applyHex(normalized);
    }
  }

  function handleHexBlur() {
    const normalized = hexInput.startsWith("#") ? hexInput : "#" + hexInput;
    if (/^#[0-9a-fA-F]{6}$/.test(normalized)) {
      applyHex(normalized);
    } else {
      setHexInput(hex);
    }
  }

  const rgb = hexToRgb(hex);

  function handleRgbChange(channel: "r" | "g" | "b", val: string) {
    const n = parseInt(val, 10);
    if (isNaN(n) || !rgb) return;
    const clamped = Math.max(0, Math.min(255, n));
    const newHex = rgbToHex(
      channel === "r" ? clamped : rgb.r,
      channel === "g" ? clamped : rgb.g,
      channel === "b" ? clamped : rgb.b
    );
    applyHex(newHex);
  }

  const titleId = React.useId();
  const descId = React.useId();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Label htmlFor="color-trigger" className="text-sm font-medium shrink-0">
        {label}
      </Label>

      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <Button
            id="color-trigger"
            variant="outline"
            className="flex items-center gap-2 h-9 px-3 min-w-[120px]"
            aria-label={`Pick ${label.toLowerCase()} color, current value ${hex}`}
          >
            <span
              className="inline-block w-5 h-5 rounded border border-black/20 shrink-0"
              style={{ background: hex }}
              aria-hidden="true"
            />
            <span className="text-xs font-mono tracking-wider">{hex}</span>
            <Pipette className="ml-auto w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
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
              "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl outline-none",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
              "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
              "@media (prefers-reduced-motion: reduce) { animation: none !important; }"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <p id={titleId} className="text-sm font-semibold leading-none">
                  {label}
                </p>
                <p id={descId} className="mt-1 text-xs text-muted-foreground">
                  Choose a color for your theme.
                </p>
              </div>
              <PopoverPrimitive.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-md -mr-1 -mt-1"
                  aria-label="Close color picker"
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

            {/* Hue slider */}
            <div className="mt-3">
              <HueSlider hue={hue} onChange={handleHueChange} />
            </div>

            {/* Preview + Hex input */}
            <div className="mt-4 flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-md border border-black/20 shrink-0 shadow-sm"
                style={{ background: hex }}
                aria-hidden="true"
              />
              <div className="flex-1">
                <Label htmlFor="hex-input" className="sr-only">
                  Hex color value
                </Label>
                <Input
                  id="hex-input"
                  value={hexInput}
                  onChange={handleHexInput}
                  onBlur={handleHexBlur}
                  className="h-9 font-mono text-sm uppercase"
                  placeholder="#000000"
                  spellCheck={false}
                  maxLength={7}
                />
              </div>
            </div>

            {/* RGB inputs */}
            {rgb && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {(["r", "g", "b"] as const).map((ch) => (
                  <div key={ch} className="flex flex-col gap-1">
                    <Label
                      htmlFor={`rgb-${ch}`}
                      className="text-center text-[10px] uppercase font-semibold text-muted-foreground tracking-widest"
                    >
                      {ch}
                    </Label>
                    <Input
                      id={`rgb-${ch}`}
                      type="number"
                      min={0}
                      max={255}
                      value={rgb[ch]}
                      onChange={(e) => handleRgbChange(ch, e.target.value)}
                      className="h-8 text-center text-sm font-mono px-1"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Preset swatches */}
            <div className="mt-4">
              <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest mb-2">
                Presets
              </p>
              <div className="flex flex-wrap gap-1.5">
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    aria-label={`Select color ${preset}`}
                    onClick={() => applyHex(preset)}
                    className={cn(
                      "w-6 h-6 rounded-md border border-black/20 shadow-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      hex === preset && "ring-2 ring-offset-1 ring-ring scale-110"
                    )}
                    style={{ background: preset }}
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