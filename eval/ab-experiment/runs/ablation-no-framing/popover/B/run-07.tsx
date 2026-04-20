"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Tiny visually-hidden utility (no extra dep)
───────────────────────────────────────────── */
function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        position: "absolute",
        width: 1,
        height: 1,
        padding: 0,
        margin: -1,
        overflow: "hidden",
        clip: "rect(0,0,0,0)",
        whiteSpace: "nowrap",
        border: 0,
      }}
    >
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const v = max;
  const s = max === 0 ? 0 : d / max;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, v: v * 100 };
}

function hsvToHex(h: number, s: number, v: number): string {
  const hn = h / 360;
  const sn = s / 100;
  const vn = v / 100;
  let r = 0, g = 0, b = 0;
  const i = Math.floor(hn * 6);
  const f = hn * 6 - i;
  const p = vn * (1 - sn);
  const q = vn * (1 - f * sn);
  const t = vn * (1 - (1 - f) * sn);
  switch (i % 6) {
    case 0: r = vn; g = t;  b = p;  break;
    case 1: r = q;  g = vn; b = p;  break;
    case 2: r = p;  g = vn; b = t;  break;
    case 3: r = p;  g = q;  b = vn; break;
    case 4: r = t;  g = p;  b = vn; break;
    case 5: r = vn; g = p;  b = q;  break;
  }
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function isValidHex(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

const PRESETS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#ffffff", "#d1d5db", "#6b7280", "#111827",
];

/* ─────────────────────────────────────────────
   Saturation / Value canvas
───────────────────────────────────────────── */
interface SvCanvasProps {
  hue: number;
  saturation: number;
  value: number;
  onChange: (s: number, v: number) => void;
}

function SvCanvas({ hue, saturation, value, onChange }: SvCanvasProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const getCoords = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      onChange(x * 100, (1 - y) * 100);
    },
    [onChange]
  );

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      getCoords(e.clientX, e.clientY);
    },
    [getCoords]
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (e.buttons !== 1) return;
      getCoords(e.clientX, e.clientY);
    },
    [getCoords]
  );

  const thumbX = saturation;
  const thumbY = 100 - value;

  return (
    <div
      ref={ref}
      className="relative w-full rounded-md cursor-crosshair select-none touch-none"
      style={{
        height: 180,
        background: `
          linear-gradient(to top, #000, transparent),
          linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))
        `,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      role="slider"
      aria-label="Saturation and brightness"
      tabIndex={0}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 10 : 1;
        let ns = saturation;
        let nv = value;
        if (e.key === "ArrowRight") ns = Math.min(100, ns + step);
        if (e.key === "ArrowLeft")  ns = Math.max(0, ns - step);
        if (e.key === "ArrowUp")    nv = Math.min(100, nv + step);
        if (e.key === "ArrowDown")  nv = Math.max(0, nv - step);
        if (ns !== saturation || nv !== value) {
          e.preventDefault();
          onChange(ns, nv);
        }
      }}
    >
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md"
        style={{
          left: `${thumbX}%`,
          top: `${thumbY}%`,
          background: hsvToHex(hue, saturation, value),
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
  const ref = React.useRef<HTMLDivElement>(null);

  const getHue = React.useCallback(
    (clientX: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onChange(x * 360);
    },
    [onChange]
  );

  return (
    <div
      ref={ref}
      className="relative h-4 w-full rounded-full cursor-pointer select-none touch-none"
      style={{
        background:
          "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        getHue(e.clientX);
      }}
      onPointerMove={(e) => {
        if (e.buttons !== 1) return;
        getHue(e.clientX);
      }}
      role="slider"
      aria-label="Hue"
      aria-valuemin={0}
      aria-valuemax={360}
      aria-valuenow={Math.round(hue)}
      tabIndex={0}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 10 : 1;
        if (e.key === "ArrowRight") { e.preventDefault(); onChange(Math.min(360, hue + step)); }
        if (e.key === "ArrowLeft")  { e.preventDefault(); onChange(Math.max(0, hue - step)); }
      }}
    >
      <div
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md"
        style={{ left: `${(hue / 360) * 100}%`, background: `hsl(${hue}, 100%, 50%)` }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
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

  // Internal HSV state derived from prop
  const [hsv, setHsv] = React.useState(() => hexToHsv(isValidHex(value) ? value : "#3b82f6"));
  const [hexInput, setHexInput] = React.useState(value.toUpperCase());

  // Sync when external value changes
  React.useEffect(() => {
    if (isValidHex(value)) {
      const newHsv = hexToHsv(value);
      setHsv(newHsv);
      setHexInput(value.toUpperCase());
    }
  }, [value]);

  const currentHex = isValidHex(value) ? value : "#3b82f6";

  const handleSvChange = (s: number, v: number) => {
    const newHsv = { ...hsv, s, v };
    setHsv(newHsv);
    const hex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
    setHexInput(hex.toUpperCase());
    onChange?.(hex);
  };

  const handleHueChange = (h: number) => {
    const newHsv = { ...hsv, h };
    setHsv(newHsv);
    const hex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
    setHexInput(hex.toUpperCase());
    onChange?.(hex);
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      const newHsv = hexToHsv(normalized);
      setHsv(newHsv);
      onChange?.(normalized);
    }
  };

  const handlePreset = (hex: string) => {
    const newHsv = hexToHsv(hex);
    setHsv(newHsv);
    setHexInput(hex.toUpperCase());
    onChange?.(hex);
  };

  const titleId = React.useId();
  const descId = React.useId();

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          aria-label={`Pick ${label} color, current value ${currentHex}`}
          className={cn(
            "flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "transition-colors",
            className
          )}
        >
          <span
            className="inline-block h-5 w-5 rounded border border-black/10 shadow-inner flex-shrink-0"
            style={{ background: currentHex }}
          />
          <span className="font-mono">{currentHex.toUpperCase()}</span>
          <Pipette className="ml-1 h-4 w-4 text-muted-foreground" />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          aria-labelledby={titleId}
          aria-describedby={descId}
          sideOffset={8}
          align="start"
          className={cn(
            "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "@media (prefers-reduced-motion: reduce) { animation: none }"
          )}
        >
          {/* Header */}
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 id={titleId} className="text-sm font-semibold leading-none">
                {label}
              </h2>
              <p id={descId} className="mt-1 text-xs text-muted-foreground">
                Pick a color for your theme.
              </p>
            </div>
            <PopoverPrimitive.Close asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7" aria-label="Close color picker">
                <X className="h-4 w-4" />
              </Button>
            </PopoverPrimitive.Close>
          </div>

          {/* SV Canvas */}
          <SvCanvas
            hue={hsv.h}
            saturation={hsv.s}
            value={hsv.v}
            onChange={handleSvChange}
          />

          {/* Hue Slider */}
          <div className="mt-3">
            <HueSlider hue={hsv.h} onChange={handleHueChange} />
          </div>

          {/* Hex input + swatch */}
          <div className="mt-4 flex items-center gap-2">
            <div
              className="h-8 w-8 flex-shrink-0 rounded-md border border-black/10 shadow-inner"
              style={{ background: currentHex }}
              aria-hidden="true"
            />
            <div className="flex flex-1 flex-col gap-1">
              <VisuallyHidden>
                <Label htmlFor="hex-input">Hex color</Label>
              </VisuallyHidden>
              <Input
                id="hex-input"
                value={hexInput}
                onChange={handleHexInput}
                placeholder="#000000"
                className="h-8 font-mono text-xs uppercase"
                maxLength={7}
                spellCheck={false}
                aria-label="Hex color value"
              />
            </div>
          </div>

          {/* Presets */}
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Presets</p>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESETS.map((hex) => (
                <button
                  key={hex}
                  onClick={() => handlePreset(hex)}
                  aria-label={`Select color ${hex}`}
                  aria-pressed={currentHex.toLowerCase() === hex.toLowerCase()}
                  className={cn(
                    "h-8 w-full rounded-md border border-black/10 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    currentHex.toLowerCase() === hex.toLowerCase() &&
                      "ring-2 ring-ring ring-offset-1"
                  )}
                  style={{ background: hex }}
                />
              ))}
            </div>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}