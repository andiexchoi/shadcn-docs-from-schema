"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

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
  const sn = s / 100;
  const ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function isValidHex(value: string): boolean {
  return /^#([0-9a-f]{3}){1,2}$/i.test(value);
}

function normalizeHex(value: string): string {
  const v = value.startsWith("#") ? value : `#${value}`;
  if (/^#([0-9a-f]{3})$/i.test(v)) {
    return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  }
  return v;
}

/* ─────────────────────────────────────────────
   Popover sub-components (local wrappers)
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
      role="dialog"
      className={cn(
        "z-50 w-80 rounded-xl border border-border bg-white p-0 shadow-xl outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

function PopoverHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      {children}
    </div>
  );
}

function PopoverTitle({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 id={id} className="text-sm font-semibold text-foreground">
      {children}
    </h2>
  );
}

function PopoverDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>;
}

/* ─────────────────────────────────────────────
   Gradient canvas picker
───────────────────────────────────────────── */

interface GradientPickerProps {
  hue: number;
  saturation: number;
  lightness: number;
  onChange: (s: number, l: number) => void;
}

function GradientPicker({ hue, saturation, lightness, onChange }: GradientPickerProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null);

  // Convert HSL picker coordinates: x = saturation, y = inverted lightness
  // We approximate a common "saturation/brightness" feel using an HSL gradient overlay.
  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.buttons !== 1) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      const newS = Math.round(x * 100);
      // Map y=0 -> l=100, y=1 -> l=0 but also factor in saturation
      const newL = Math.round(100 - y * 50 - x * 50);
      onChange(newS, Math.max(0, Math.min(100, newL)));
    },
    [onChange],
  );

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      handlePointerMove(e);
    },
    [handlePointerMove],
  );

  // Cursor position
  const cursorX = `${saturation}%`;
  // Reverse mapping: y = (100 - l - s*0.5) / 0.5 but clamped
  const rawY = (100 - lightness - saturation * 0.5) / 50;
  const cursorY = `${Math.max(0, Math.min(100, rawY * 100))}%`;

  return (
    <div
      ref={canvasRef}
      className="relative h-36 w-full cursor-crosshair overflow-hidden rounded-none select-none"
      style={{
        background: `hsl(${hue}, 100%, 50%)`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      {/* White left-to-right gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(to right, #fff 0%, transparent 100%)",
        }}
      />
      {/* Black top-to-bottom gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #000 100%)",
        }}
      />
      {/* Cursor */}
      <div
        className="pointer-events-none absolute z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md ring-1 ring-black/20"
        style={{
          left: cursorX,
          top: cursorY,
          backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Hue & Opacity sliders
───────────────────────────────────────────── */

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
  background: string;
  label: string;
}

function ColorSlider({ value, min = 0, max = 100, onChange, background, label }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  const handlePointer = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.buttons !== 1) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onChange(Math.round(min + x * (max - min)));
    },
    [min, max, onChange],
  );

  return (
    <div className="flex flex-col gap-1">
      <span className="sr-only">{label}</span>
      <div
        className="relative h-3 w-full cursor-pointer rounded-full"
        style={{ background }}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          handlePointer(e);
        }}
        onPointerMove={handlePointer}
        role="slider"
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") onChange(Math.min(max, value + 1));
          if (e.key === "ArrowLeft") onChange(Math.max(min, value - 1));
        }}
      >
        <div
          className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md ring-1 ring-black/20"
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Preset swatches
───────────────────────────────────────────── */

const PRESETS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#f43f5e", "#14b8a6", "#6366f1", "#84cc16",
  "#0ea5e9", "#a855f7", "#d946ef", "#f59e0b",
  "#ffffff", "#d1d5db", "#6b7280", "#111827",
];

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
  const titleId = React.useId();
  const descId = React.useId();
  const [open, setOpen] = React.useState(false);

  const safeHex = isValidHex(value) ? normalizeHex(value) : "#3b82f6";
  const { h, s, l } = hexToHsl(safeHex);

  const [hue, setHue] = React.useState(h);
  const [saturation, setSaturation] = React.useState(s);
  const [lightness, setLightness] = React.useState(l);
  const [opacity, setOpacity] = React.useState(100);
  const [hexInput, setHexInput] = React.useState(safeHex);
  const [hexError, setHexError] = React.useState(false);

  // Sync external value → internal state when popover opens
  React.useEffect(() => {
    if (open) {
      const hex = isValidHex(value) ? normalizeHex(value) : "#3b82f6";
      const hsl = hexToHsl(hex);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      setHexInput(hex);
      setHexError(false);
    }
  }, [open, value]);

  const currentHex = hslToHex(hue, saturation, lightness);

  // Sync hsl → hex input whenever hsl changes (from sliders/canvas)
  const prevHsl = React.useRef({ h: hue, s: saturation, l: lightness });
  React.useEffect(() => {
    if (
      prevHsl.current.h !== hue ||
      prevHsl.current.s !== saturation ||
      prevHsl.current.l !== lightness
    ) {
      prevHsl.current = { h: hue, s: saturation, l: lightness };
      setHexInput(currentHex);
      setHexError(false);
    }
  }, [hue, saturation, lightness, currentHex]);

  const handleGradientChange = (newS: number, newL: number) => {
    setSaturation(newS);
    setLightness(newL);
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const norm = normalizeHex(raw);
    if (isValidHex(norm)) {
      const hsl = hexToHsl(norm);
      setHue(hsl.h);
      setSaturation(hsl.s);
      setLightness(hsl.l);
      setHexError(false);
    } else {
      setHexError(true);
    }
  };

  const handleApply = () => {
    if (!hexError) {
      onChange?.(currentHex);
      setOpen(false);
    }
  };

  const handlePreset = (hex: string) => {
    const hsl = hexToHsl(hex);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
    setHexInput(hex);
    setHexError(false);
  };

  const alphaHex = Math.round((opacity / 100) * 255)
    .toString(16)
    .padStart(2, "0");
  const hexWithAlpha = opacity < 100 ? `${currentHex}${alphaHex}` : currentHex;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={`Pick ${label.toLowerCase()}, current value ${hexWithAlpha}`}
            className={cn(
              "flex h-10 w-full items-center gap-3 rounded-lg border border-input bg-background px-3 py-2",
              "text-sm shadow-sm transition-colors",
              "hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <span
              className="h-5 w-5 flex-shrink-0 rounded-md border border-black/10 shadow-sm"
              style={{ backgroundColor: hexWithAlpha }}
            />
            <span className="font-mono text-muted-foreground">{hexWithAlpha.toUpperCase()}</span>
            <Pipette className="ml-auto h-4 w-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          aria-labelledby={titleId}
          aria-describedby={descId}
          align="start"
          className="w-80 overflow-hidden"
        >
          {/* Header */}
          <PopoverHeader>
            <div>
              <PopoverTitle id={titleId}>Color picker</PopoverTitle>
              <PopoverDescription>
                Choose a color for your theme.
              </PopoverDescription>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close color picker"
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="h-4 w-4" />
            </button>
          </PopoverHeader>

          {/* Gradient canvas */}
          <GradientPicker
            hue={hue}
            saturation={saturation}
            lightness={lightness}
            onChange={handleGradientChange}
          />

          {/* Sliders + preview */}
          <div className="flex items-center gap-3 px-4 pt-3">
            {/* Preview swatch */}
            <div
              className="h-9 w-9 flex-shrink-0 rounded-full border border-black/10 shadow-sm"
              style={{ backgroundColor: hexWithAlpha }}
            />
            {/* Sliders */}
            <div className="flex flex-1 flex-col gap-2.5">
              <ColorSlider
                label="Hue"
                value={hue}
                min={0}
                max={360}
                onChange={setHue}
                background="linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)"
              />
              <ColorSlider
                label="Opacity"
                value={opacity}
                min={0}
                max={100}
                onChange={setOpacity}
                background={`linear-gradient(to right, transparent, hsl(${hue}, ${saturation}%, ${lightness}%))`}
              />
            </div>
          </div>

          {/* Hex input + copy */}
          <div className="px-4 pt-3">
            <Label
              htmlFor={`${titleId}-hex`}
              className="mb-1.5 block text-xs font-medium text-muted-foreground"
            >
              Hex value
            </Label>
            <div className="flex gap-2">
              <Input
                id={`${titleId}-hex`}
                value={hexInput}
                onChange={handleHexInput}
                placeholder="#000000"
                spellCheck={false}
                className={cn(
                  "font-mono text-sm",
                  hexError && "border-destructive focus-visible:ring-destructive",
                )}
              />
            </div>
            {hexError && (
              <p className="mt-1 text-xs text-destructive">
                Enter a valid hex color (e.g. #3b82f6).
              </p>
            )}
          </div>

          {/* Presets */}
          <div className="px-4 pt-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Presets</p>
            <div className="grid grid-cols-10 gap-1">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  title={preset.toUpperCase()}
                  aria-label={`Select preset color ${preset.toUpperCase()}`}
                  onClick={() => handlePreset(preset)}
                  className={cn(
                    "h-5 w-5 rounded-md border border-black/10 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    currentHex.toLowerCase() === preset.toLowerCase() &&
                      "ring-2 ring-ring ring-offset-1",
                  )}
                  style={{ backgroundColor: preset }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 px-4 pb-4 pt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={handleApply}
              disabled={hexError}
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}