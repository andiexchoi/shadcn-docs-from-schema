"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Tiny Radix-based popover wrappers (local)
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
        "z-50 w-72 rounded-xl border border-neutral-200 bg-white p-4 shadow-xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
        "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

/** Clamp a number to [min, max]. */
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/** Convert HSV (0-360, 0-100, 0-100) → hex string. */
function hsvToHex(h: number, s: number, v: number): string {
  const sn = s / 100;
  const vn = v / 100;
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return vn - vn * sn * Math.max(0, Math.min(k, 4 - k, 1));
  };
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`;
}

/** Convert hex → HSV. Returns null on invalid hex. */
function hexToHsv(hex: string): { h: number; s: number; v: number } | null {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) return null;
  const r = parseInt(cleaned.slice(0, 2), 16) / 255;
  const g = parseInt(cleaned.slice(2, 4), 16) / 255;
  const b = parseInt(cleaned.slice(4, 6), 16) / 255;
  if ([r, g, b].some(isNaN)) return null;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    switch (max) {
      case r:
        h = 60 * (((g - b) / d) % 6);
        break;
      case g:
        h = 60 * ((b - r) / d + 2);
        break;
      case b:
        h = 60 * ((r - g) / d + 4);
        break;
    }
  }
  if (h < 0) h += 360;
  const s = max === 0 ? 0 : (d / max) * 100;
  const v = max * 100;
  return { h, s, v };
}

/** Ensure a hex string has a leading #. */
function normalizeHex(raw: string): string {
  const s = raw.trim().replace(/^#+/, "");
  return `#${s}`;
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

interface SaturationValuePickerProps {
  hue: number;
  saturation: number;
  value: number;
  onChange: (s: number, v: number) => void;
}

function SaturationValuePicker({
  hue,
  saturation,
  value,
  onChange,
}: SaturationValuePickerProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  const getCoords = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const s = clamp((clientX - rect.left) / rect.width, 0, 1) * 100;
      const v = clamp(1 - (clientY - rect.top) / rect.height, 0, 1) * 100;
      onChange(s, v);
    },
    [onChange]
  );

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    getCoords(e.clientX, e.clientY);
    e.preventDefault();
  };

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) getCoords(e.clientX, e.clientY);
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
      className="relative h-40 w-full cursor-crosshair rounded-lg select-none overflow-hidden"
      style={{
        background: `linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`,
      }}
      onMouseDown={onMouseDown}
      aria-label="Saturation and brightness picker"
    >
      {/* darkness overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent, #000)",
        }}
      />
      {/* thumb */}
      <div
        className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
        style={{
          left: thumbLeft,
          top: thumbTop,
          background: hsvToHex(hue, saturation, value),
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
  const dragging = React.useRef(false);

  const getHue = React.useCallback(
    (clientX: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const h = clamp((clientX - rect.left) / rect.width, 0, 1) * 360;
      onChange(h);
    },
    [onChange]
  );

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    getHue(e.clientX);
    e.preventDefault();
  };

  React.useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) getHue(e.clientX);
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
      className="relative h-4 w-full cursor-pointer rounded-full select-none"
      style={{
        background:
          "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
      }}
      onMouseDown={onMouseDown}
      aria-label="Hue slider"
    >
      <div
        className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
        style={{
          left: `${(hue / 360) * 100}%`,
          background: `hsl(${hue}, 100%, 50%)`,
        }}
      />
    </div>
  );
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
  "#ffffff",
  "#94a3b8",
  "#334155",
  "#000000",
];

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */

export interface ColorPickerPopoverProps {
  /** Controlled hex color value (e.g. "#3b82f6"). */
  value?: string;
  /** Called with a valid hex string whenever the color changes. */
  onChange?: (hex: string) => void;
  /** Label shown on the trigger button and used as accessible name. */
  label?: string;
  /** Additional class names for the trigger button. */
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

  /* Internal HSV state derived from the controlled hex value. */
  const initialHsv = hexToHsv(value) ?? { h: 217, s: 91, v: 96 };
  const [hue, setHue] = React.useState(initialHsv.h);
  const [saturation, setSaturation] = React.useState(initialHsv.s);
  const [brightness, setBrightness] = React.useState(initialHsv.v);
  const [hexInput, setHexInput] = React.useState(value);
  const [open, setOpen] = React.useState(false);

  /* Keep hex input in sync when HSV changes. */
  const currentHex = hsvToHex(hue, saturation, brightness);

  React.useEffect(() => {
    setHexInput(currentHex);
    onChange?.(currentHex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHex]);

  /* Sync internal state if controlled value changes externally. */
  React.useEffect(() => {
    const hsv = hexToHsv(value);
    if (hsv) {
      setHue(hsv.h);
      setSaturation(hsv.s);
      setBrightness(hsv.v);
      setHexInput(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleSVChange = (s: number, v: number) => {
    setSaturation(s);
    setBrightness(v);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = normalizeHex(raw);
    const hsv = hexToHsv(normalized);
    if (hsv) {
      setHue(hsv.h);
      setSaturation(hsv.s);
      setBrightness(hsv.v);
    }
  };

  const handlePreset = (hex: string) => {
    const hsv = hexToHsv(hex);
    if (hsv) {
      setHue(hsv.h);
      setSaturation(hsv.s);
      setBrightness(hsv.v);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-label={`${label}: ${currentHex}`}
          className={cn(
            "flex h-10 items-center gap-2 rounded-lg border border-neutral-200 px-3",
            className
          )}
        >
          {/* Color swatch */}
          <span
            className="h-5 w-5 flex-shrink-0 rounded-md border border-neutral-200 shadow-inner"
            style={{ background: currentHex }}
            aria-hidden="true"
          />
          <span className="font-mono text-sm text-neutral-700">
            {currentHex}
          </span>
          <Pipette className="ml-1 h-4 w-4 text-neutral-400" aria-hidden />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p id={titleId} className="text-sm font-semibold text-neutral-900">
              {label}
            </p>
            <p id={descId} className="text-xs text-neutral-500">
              Pick a color for your theme.
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="rounded p-0.5 text-neutral-400 hover:text-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
            aria-label="Close color picker"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>

        {/* Saturation / Value canvas */}
        <SaturationValuePicker
          hue={hue}
          saturation={saturation}
          value={brightness}
          onChange={handleSVChange}
        />

        {/* Hue slider */}
        <HueSlider hue={hue} onChange={setHue} />

        {/* Preview + hex input row */}
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 flex-shrink-0 rounded-md border border-neutral-200 shadow-inner"
            style={{ background: currentHex }}
            aria-hidden="true"
          />
          <div className="flex flex-1 flex-col gap-1">
            <Label
              htmlFor="hex-input"
              className="text-xs font-medium text-neutral-600"
            >
              Hex
            </Label>
            <Input
              id="hex-input"
              value={hexInput}
              onChange={handleHexInputChange}
              spellCheck={false}
              className="h-8 font-mono text-sm"
              maxLength={7}
              aria-label="Hex color value"
            />
          </div>
        </div>

        {/* Preset swatches */}
        <div>
          <p className="mb-2 text-xs font-medium text-neutral-600">Presets</p>
          <div className="grid grid-cols-6 gap-2">
            {PRESETS.map((hex) => (
              <button
                key={hex}
                onClick={() => handlePreset(hex)}
                className={cn(
                  "h-7 w-7 rounded-md border border-neutral-200 shadow-sm transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400",
                  currentHex.toLowerCase() === hex.toLowerCase() &&
                    "ring-2 ring-neutral-700"
                )}
                style={{ background: hex }}
                aria-label={`Select color ${hex}`}
                aria-pressed={currentHex.toLowerCase() === hex.toLowerCase()}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}