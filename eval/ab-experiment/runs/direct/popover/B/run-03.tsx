"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Utility helpers
───────────────────────────────────────────── */

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const clean = hex.replace("#", "");
  if (!/^([0-9a-fA-F]{6})$/.test(clean)) return null;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
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
  const sn = s / 100;
  const ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function isValidHex(hex: string) {
  return /^#([0-9a-fA-F]{6})$/.test(hex);
}

/* ─────────────────────────────────────────────
   Preset palette
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
  "#f43f5e",
  "#14b8a6",
  "#64748b",
  "#000000",
  "#ffffff",
  "#6366f1",
  "#a855f7",
  "#d97706",
];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "start", sideOffset = 8, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-lg outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        "@media (prefers-reduced-motion: reduce) { animation: none !important; }",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

/* ─────────────────────────────────────────────
   Gradient canvas picker
───────────────────────────────────────────── */

interface GradientPickerProps {
  hue: number;
  saturation: number;
  lightness: number;
  onChange: (s: number, l: number) => void;
}

function GradientPicker({
  hue,
  saturation,
  lightness,
  onChange,
}: GradientPickerProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const handlePointer = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
      const s = Math.round((x / rect.width) * 100);
      const rawL = Math.round((1 - y / rect.height) * 100);
      // Convert from HSV-like UX (saturation + brightness) to HSL
      const l = Math.round(rawL / 2 + ((100 - s) * rawL) / 200);
      const sHsl =
        l === 0 || l === 100
          ? 0
          : Math.round(((rawL - l) / Math.min(l, 100 - l)) * 100);
      onChange(Math.max(0, Math.min(sHsl, 100)), Math.max(0, Math.min(l, 100)));
    },
    [onChange]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    handlePointer(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    handlePointer(e);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  // Map HSL back to approximate cursor position
  // Reverse: rawL = 2*l - (100-s)*rawL/100  → approximate
  const approxBrightness = lightness + (saturation * (100 - lightness)) / 100;
  const cursorX =
    approxBrightness === 0
      ? 0
      : Math.round((saturation / 100) * approxBrightness);
  const cursorY = 100 - approxBrightness;

  return (
    <div
      ref={canvasRef}
      role="presentation"
      className="relative h-36 w-full cursor-crosshair touch-none select-none rounded-lg overflow-hidden"
      style={{
        background: `
          linear-gradient(to top, #000, transparent),
          linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))
        `,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Cursor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
        style={{
          left: `${cursorX}%`,
          top: `${cursorY}%`,
          backgroundColor: hslToHex(hue, saturation, lightness),
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
  return (
    <div className="relative h-3 w-full touch-none select-none">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
        }}
        aria-hidden="true"
      />
      <input
        type="range"
        min={0}
        max={360}
        value={hue}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Hue"
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
      />
      {/* Thumb indicator */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
        style={{
          left: `${(hue / 360) * 100}%`,
          backgroundColor: `hsl(${hue}, 100%, 50%)`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main ColorPickerPopover
───────────────────────────────────────────── */

export interface ColorPickerPopoverProps {
  /** Controlled hex color value, e.g. "#3b82f6" */
  value?: string;
  /** Called with new hex string whenever the color changes */
  onChange?: (hex: string) => void;
  /** Label shown next to the trigger button */
  label?: string;
  /** Additional className on the root wrapper */
  className?: string;
}

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  label = "Color",
  className,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [internalHex, setInternalHex] = React.useState(
    isValidHex(value) ? value : "#3b82f6"
  );
  const [hexInput, setHexInput] = React.useState(internalHex);

  // Derive HSL from hex
  const hsl = hexToHsl(internalHex) ?? { h: 220, s: 89, l: 60 };
  const [hue, setHue] = React.useState(hsl.h);

  // Sync when value prop changes externally
  React.useEffect(() => {
    if (isValidHex(value) && value !== internalHex) {
      setInternalHex(value);
      setHexInput(value);
      const derived = hexToHsl(value);
      if (derived) setHue(derived.h);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function commit(hex: string) {
    setInternalHex(hex);
    setHexInput(hex);
    onChange?.(hex);
  }

  function handleGradientChange(s: number, l: number) {
    const hex = hslToHex(hue, s, l);
    commit(hex);
  }

  function handleHueChange(h: number) {
    setHue(h);
    const current = hexToHsl(internalHex) ?? { h, s: 80, l: 50 };
    const hex = hslToHex(h, current.s, current.l);
    commit(hex);
  }

  function handleHexInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      const derived = hexToHsl(normalized);
      if (derived) setHue(derived.h);
      commit(normalized);
    }
  }

  function handlePreset(preset: string) {
    const derived = hexToHsl(preset);
    if (derived) setHue(derived.h);
    commit(preset);
  }

  const titleId = React.useId();
  const descId = React.useId();

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Label htmlFor="color-trigger" className="text-sm font-medium">
        {label}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="color-trigger"
            variant="outline"
            size="sm"
            className="flex h-9 items-center gap-2 pr-3"
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            {/* Color swatch */}
            <span
              aria-hidden="true"
              className="h-5 w-5 flex-shrink-0 rounded border border-border shadow-sm"
              style={{ backgroundColor: internalHex }}
            />
            <Pipette aria-hidden="true" className="h-3.5 w-3.5 opacity-60" />
            <span className="font-mono text-xs uppercase tracking-wide">
              {internalHex}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          aria-labelledby={titleId}
          aria-describedby={descId}
          align="start"
        >
          {/* Header */}
          <div className="mb-3 flex items-start justify-between">
            <div>
              <h2 id={titleId} className="text-sm font-semibold leading-none">
                Color picker
              </h2>
              <p
                id={descId}
                className="mt-1 text-xs text-muted-foreground"
              >
                Choose a theme color using the palette or hex input.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 shrink-0"
              onClick={() => setOpen(false)}
              aria-label="Close color picker"
            >
              <X aria-hidden="true" className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Gradient picker */}
          <GradientPicker
            hue={hue}
            saturation={hexToHsl(internalHex)?.s ?? 80}
            lightness={hexToHsl(internalHex)?.l ?? 50}
            onChange={handleGradientChange}
          />

          {/* Hue slider */}
          <div className="mt-3">
            <HueSlider hue={hue} onChange={handleHueChange} />
          </div>

          {/* Hex input + preview */}
          <div className="mt-4 flex items-center gap-2">
            <span
              className="h-8 w-8 flex-shrink-0 rounded-md border border-border shadow-sm"
              aria-hidden="true"
              style={{ backgroundColor: internalHex }}
            />
            <div className="flex-1">
              <Label htmlFor="hex-input" className="sr-only">
                Hex color value
              </Label>
              <Input
                id="hex-input"
                value={hexInput}
                onChange={handleHexInputChange}
                placeholder="#000000"
                maxLength={7}
                spellCheck={false}
                className="h-8 font-mono text-xs uppercase"
              />
            </div>
          </div>

          {/* Preset swatches */}
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Presets
            </p>
            <div className="grid grid-cols-8 gap-1.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  aria-label={`Select color ${preset}`}
                  aria-pressed={internalHex.toLowerCase() === preset.toLowerCase()}
                  onClick={() => handlePreset(preset)}
                  className={cn(
                    "h-6 w-6 rounded-md border transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                    internalHex.toLowerCase() === preset.toLowerCase()
                      ? "border-foreground ring-2 ring-foreground ring-offset-1"
                      : "border-border"
                  )}
                  style={{ backgroundColor: preset }}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}