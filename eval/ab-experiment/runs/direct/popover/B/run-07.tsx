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

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!result) return null;
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

function isValidHex(value: string): boolean {
  return /^#([0-9a-f]{3}){1,2}$/i.test(value.trim());
}

function normalizeHex(value: string): string {
  const v = value.trim();
  if (/^#([0-9a-f]{3})$/i.test(v)) {
    return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`;
  }
  return v;
}

const SWATCHES = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#f43f5e", "#10b981", "#0ea5e9", "#6366f1",
  "#ffffff", "#d4d4d8", "#71717a", "#18181b",
];

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

interface GradientCanvasProps {
  hue: number;
  saturation: number;
  lightness: number;
  onChange: (s: number, l: number) => void;
}

function GradientCanvas({ hue, saturation, lightness, onChange }: GradientCanvasProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  // Convert HSL -> pointer position on canvas
  // s: 0–100 => x: 0–100%  l: 0–100 => y mapped so top=light, bottom=dark
  // We model the canvas as:
  //   top-left = white (s=0, l=100), top-right = hue pure (s=100, l=50)
  //   bottom = black (l=0)
  // To simplify: x = saturation, y = inverted lightness (0 at top = 100 lightness)
  const thumbX = saturation; // 0–100
  const thumbY = 100 - lightness; // 0 (top, bright) – 100 (bottom, dark)

  const handlePointer = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      const newS = Math.round(x * 100);
      const newL = Math.round((1 - y) * 100);
      onChange(newS, newL);
    },
    [onChange]
  );

  React.useEffect(() => {
    const onMove = (e: PointerEvent) => { if (dragging.current) handlePointer(e); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [handlePointer]);

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
      onPointerDown={(e) => {
        dragging.current = true;
        handlePointer(e);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      }}
    >
      {/* Thumb */}
      <div
        className="absolute w-4 h-4 rounded-full border-2 border-white shadow-md -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          left: `${thumbX}%`,
          top: `${thumbY}%`,
          background: hslToHex(hue, saturation, lightness),
          boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 6px rgba(0,0,0,0.4)",
        }}
      />
    </div>
  );
}

interface SliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  trackStyle?: React.CSSProperties;
  "aria-label": string;
}

function Slider({ value, min, max, onChange, trackStyle, "aria-label": ariaLabel }: SliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  const pct = ((value - min) / (max - min)) * 100;

  const handlePointer = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement> | PointerEvent) => {
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onChange(Math.round(min + x * (max - min)));
    },
    [min, max, onChange]
  );

  React.useEffect(() => {
    const onMove = (e: PointerEvent) => { if (dragging.current) handlePointer(e); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [handlePointer]);

  return (
    <div
      ref={trackRef}
      role="slider"
      aria-label={ariaLabel}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      tabIndex={0}
      className="relative h-3 rounded-full cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={trackStyle}
      onPointerDown={(e) => {
        dragging.current = true;
        handlePointer(e);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowDown")
          onChange(Math.max(min, value - 1));
        if (e.key === "ArrowRight" || e.key === "ArrowUp")
          onChange(Math.min(max, value + 1));
      }}
    >
      <div
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border border-zinc-300 shadow pointer-events-none"
        style={{ left: `calc(${pct}% - 8px)` }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */

export interface ColorPickerPopoverProps {
  value?: string;
  defaultValue?: string;
  onChange?: (hex: string) => void;
  label?: string;
  align?: "start" | "center" | "end";
  className?: string;
}

export function ColorPickerPopover({
  value: controlledValue,
  defaultValue = "#3b82f6",
  onChange,
  label = "Color",
  align = "start",
  className,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const isControlled = controlledValue !== undefined;

  const [internalHex, setInternalHex] = React.useState<string>(
    defaultValue ?? "#3b82f6"
  );
  const hex = isControlled ? (controlledValue as string) : internalHex;

  const hsl = React.useMemo(() => hexToHsl(hex) ?? { h: 0, s: 0, l: 0 }, [hex]);

  const [localHue, setLocalHue] = React.useState(hsl.h);
  const [localSat, setLocalSat] = React.useState(hsl.s);
  const [localLig, setLocalLig] = React.useState(hsl.l);

  // Sync local state when hex changes externally
  React.useEffect(() => {
    const parsed = hexToHsl(hex);
    if (parsed) {
      setLocalHue(parsed.h);
      setLocalSat(parsed.s);
      setLocalLig(parsed.l);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hex]);

  const [hexInput, setHexInput] = React.useState(hex);
  const [hexInputError, setHexInputError] = React.useState(false);

  React.useEffect(() => {
    setHexInput(hex);
  }, [hex]);

  const commitColor = React.useCallback(
    (h: number, s: number, l: number) => {
      const newHex = hslToHex(h, s, l);
      if (!isControlled) setInternalHex(newHex);
      onChange?.(newHex);
    },
    [isControlled, onChange]
  );

  const handleHueChange = (h: number) => {
    setLocalHue(h);
    commitColor(h, localSat, localLig);
  };

  const handleAlphaChange = (a: number) => {
    // kept for future extension – unused in hex model
    void a;
  };
  void handleAlphaChange;

  const handleCanvasChange = (s: number, l: number) => {
    setLocalSat(s);
    setLocalLig(l);
    commitColor(localHue, s, l);
  };

  const handleSwatchClick = (swatchHex: string) => {
    const parsed = hexToHsl(swatchHex);
    if (!parsed) return;
    setLocalHue(parsed.h);
    setLocalSat(parsed.s);
    setLocalLig(parsed.l);
    if (!isControlled) setInternalHex(swatchHex);
    onChange?.(swatchHex);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    const normalized = normalizeHex(val);
    if (isValidHex(normalized)) {
      setHexInputError(false);
      const parsed = hexToHsl(normalized);
      if (parsed) {
        setLocalHue(parsed.h);
        setLocalSat(parsed.s);
        setLocalLig(parsed.l);
        if (!isControlled) setInternalHex(normalized);
        onChange?.(normalized);
      }
    } else {
      setHexInputError(true);
    }
  };

  const titleId = React.useId();
  const descId = React.useId();

  return (
    <div className={cn("inline-flex flex-col gap-1.5", className)}>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2">
          <Label htmlFor={titleId} className="text-sm font-medium text-foreground">
            {label}
          </Label>
          <PopoverPrimitive.Trigger asChild>
            <Button
              id={titleId}
              variant="outline"
              className="h-8 w-8 rounded-md p-0 border-2"
              style={{ backgroundColor: hex, borderColor: "transparent" }}
              aria-label={`Open color picker. Current color: ${hex}`}
            >
              <span className="sr-only">Pick color</span>
            </Button>
          </PopoverPrimitive.Trigger>
        </div>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align={align}
            sideOffset={8}
            role="dialog"
            aria-labelledby={titleId + "-popup"}
            aria-describedby={descId}
            className={cn(
              "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
              "@media (prefers-reduced-motion: reduce) { animation: none !important; }"
            )}
          >
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2
                  id={titleId + "-popup"}
                  className="text-sm font-semibold text-popover-foreground"
                >
                  Color picker
                </h2>
                <p id={descId} className="text-xs text-muted-foreground mt-0.5">
                  Choose a color for your theme.
                </p>
              </div>
              <PopoverPrimitive.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-md"
                  aria-label="Close color picker"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
              </PopoverPrimitive.Close>
            </div>

            {/* Gradient canvas */}
            <GradientCanvas
              hue={localHue}
              saturation={localSat}
              lightness={localLig}
              onChange={handleCanvasChange}
            />

            {/* Sliders */}
            <div className="mt-3 space-y-2">
              {/* Hue */}
              <Slider
                value={localHue}
                min={0}
                max={360}
                aria-label="Hue"
                onChange={handleHueChange}
                trackStyle={{
                  background:
                    "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
                }}
              />
            </div>

            {/* Hex input & preview */}
            <div className="mt-4 flex items-center gap-2">
              <div
                className="h-9 w-9 shrink-0 rounded-md border border-border shadow-inner"
                style={{ backgroundColor: hex }}
                aria-hidden="true"
              />
              <div className="relative flex-1">
                <Pipette
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  className={cn(
                    "h-9 pl-8 font-mono text-sm",
                    hexInputError && "border-destructive focus-visible:ring-destructive"
                  )}
                  value={hexInput}
                  onChange={handleHexInputChange}
                  aria-label="Hex color value"
                  aria-invalid={hexInputError}
                  spellCheck={false}
                  maxLength={7}
                />
              </div>
              <div className="flex flex-col items-end gap-0.5 min-w-[3.5rem]">
                <span className="text-[10px] text-muted-foreground font-medium">
                  H {localHue}°
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  S {localSat}%
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  L {localLig}%
                </span>
              </div>
            </div>

            {/* Swatches */}
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                Presets
              </p>
              <div className="grid grid-cols-8 gap-1.5">
                {SWATCHES.map((swatch) => (
                  <button
                    key={swatch}
                    type="button"
                    onClick={() => handleSwatchClick(swatch)}
                    className={cn(
                      "h-6 w-6 rounded-md border border-border transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                      hex.toLowerCase() === swatch.toLowerCase() &&
                        "ring-2 ring-ring ring-offset-1"
                    )}
                    style={{ backgroundColor: swatch }}
                    aria-label={`Select color ${swatch}`}
                    aria-pressed={hex.toLowerCase() === swatch.toLowerCase()}
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