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
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max };
}

function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  const toHex = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`;
}

function isValidHex(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

function normalizeHex(hex: string): string {
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    return (
      "#" +
      hex[1] +
      hex[1] +
      hex[2] +
      hex[2] +
      hex[3] +
      hex[3]
    );
  }
  return hex.toLowerCase();
}

// ─── Sub-components ──────────────────────────────────────────────────────────

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
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const getPosition = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = canvasRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const v = Math.max(
        0,
        Math.min(1, 1 - (clientY - rect.top) / rect.height)
      );
      onChange(s, v);
    },
    [onChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    getPosition(e.clientX, e.clientY);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      getPosition(e.clientX, e.clientY);
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [getPosition]);

  const thumbLeft = `${saturation * 100}%`;
  const thumbTop = `${(1 - value) * 100}%`;

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-40 rounded-md cursor-crosshair select-none"
      style={{
        background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, hsl(${hue},100%,50%))`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md pointer-events-none"
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
  onChange: (hue: number) => void;
}

function HueSlider({ hue, onChange }: HueSliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const getHue = React.useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onChange(Math.round(ratio * 360));
    },
    [onChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    getHue(e.clientX);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      getHue(e.clientX);
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [getHue]);

  return (
    <div
      ref={trackRef}
      className="relative h-3 w-full rounded-full cursor-pointer select-none"
      style={{
        background:
          "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
        style={{
          left: `${(hue / 360) * 100}%`,
          background: `hsl(${hue},100%,50%)`,
        }}
      />
    </div>
  );
}

interface AlphaSliderProps {
  alpha: number;
  hex: string;
  onChange: (alpha: number) => void;
}

function AlphaSlider({ alpha, hex, onChange }: AlphaSliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const getAlpha = React.useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onChange(Math.round(ratio * 100) / 100);
    },
    [onChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    getAlpha(e.clientX);
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      getAlpha(e.clientX);
    };
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [getAlpha]);

  return (
    <div
      ref={trackRef}
      className="relative h-3 w-full rounded-full cursor-pointer select-none overflow-hidden"
      onMouseDown={handleMouseDown}
    >
      {/* Checkered background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='4' height='4' fill='%23ccc'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23ccc'/%3E%3Crect x='4' width='4' height='4' fill='%23fff'/%3E%3Crect y='4' width='4' height='4' fill='%23fff'/%3E%3C/svg%3E\")",
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `linear-gradient(to right, transparent, ${hex})`,
        }}
      />
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-white shadow-md pointer-events-none"
        style={{ left: `${alpha * 100}%`, background: hex }}
      />
    </div>
  );
}

// ─── Preset palette ──────────────────────────────────────────────────────────

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
  "#475569",
  "#0f172a",
];

// ─── Main component ──────────────────────────────────────────────────────────

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
  const safeValue = isValidHex(value) ? normalizeHex(value) : "#3b82f6";

  const initialHsv = React.useMemo(() => hexToHsv(safeValue), []);

  const [open, setOpen] = React.useState(false);
  const [hue, setHue] = React.useState(initialHsv.h);
  const [saturation, setSaturation] = React.useState(initialHsv.s);
  const [val, setVal] = React.useState(initialHsv.v);
  const [alpha, setAlpha] = React.useState(1);
  const [hexInput, setHexInput] = React.useState(safeValue);
  const [hexError, setHexError] = React.useState(false);

  const currentHex = React.useMemo(
    () => hsvToHex(hue, saturation, val),
    [hue, saturation, val]
  );

  // Sync hex input with picker state
  React.useEffect(() => {
    setHexInput(currentHex);
    setHexError(false);
  }, [currentHex]);

  // Notify parent
  React.useEffect(() => {
    onChange?.(currentHex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHex]);

  // When popover opens, re-sync from prop
  React.useEffect(() => {
    if (open) {
      const safe = isValidHex(value) ? normalizeHex(value) : "#3b82f6";
      const hsv = hexToHsv(safe);
      setHue(hsv.h);
      setSaturation(hsv.s);
      setVal(hsv.v);
      setHexInput(safe);
      setHexError(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSatVal = (s: number, v: number) => {
    setSaturation(s);
    setVal(v);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const withHash = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(withHash)) {
      setHexError(false);
      const norm = normalizeHex(withHash);
      const hsv = hexToHsv(norm);
      setHue(hsv.h);
      setSaturation(hsv.s);
      setVal(hsv.v);
    } else {
      setHexError(true);
    }
  };

  const handlePreset = (hex: string) => {
    const hsv = hexToHsv(hex);
    setHue(hsv.h);
    setSaturation(hsv.s);
    setVal(hsv.v);
  };

  const alphaHex = React.useMemo(() => {
    if (alpha === 1) return currentHex;
    const a = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0");
    return `${currentHex}${a}`;
  }, [currentHex, alpha]);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && <Label>{label}</Label>}
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            className={cn(
              "flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-background text-sm shadow-sm",
              "hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
            aria-label={`Open color picker. Current color: ${currentHex}`}
          >
            <span
              className="inline-block w-5 h-5 rounded-sm border border-border flex-shrink-0"
              style={{ background: alphaHex }}
            />
            <span className="font-mono text-xs tracking-wide">{currentHex}</span>
            <Pipette className="ml-auto w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </PopoverPrimitive.Trigger>
      </div>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={8}
          align="start"
          className={cn(
            "z-50 w-64 rounded-xl border border-border bg-popover p-4 shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
          )}
        >
          {/* Close button */}
          <PopoverPrimitive.Close
            className="absolute top-2.5 right-2.5 rounded-sm opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </PopoverPrimitive.Close>

          <div className="flex flex-col gap-3">
            {/* Saturation / Value canvas */}
            <SaturationValuePicker
              hue={hue}
              saturation={saturation}
              value={val}
              onChange={handleSatVal}
            />

            {/* Hue slider */}
            <HueSlider hue={hue} onChange={setHue} />

            {/* Alpha slider */}
            <AlphaSlider alpha={alpha} hex={currentHex} onChange={setAlpha} />

            {/* Preview + Hex input */}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-md border border-border flex-shrink-0"
                style={{ background: alphaHex }}
              />
              <div className="flex-1">
                <Input
                  value={hexInput}
                  onChange={handleHexInputChange}
                  className={cn(
                    "h-8 font-mono text-xs px-2",
                    hexError && "border-red-500 focus-visible:ring-red-500"
                  )}
                  spellCheck={false}
                  aria-label="Hex color value"
                />
                {hexError && (
                  <p className="text-[10px] text-red-500 mt-0.5">
                    Invalid hex color
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <Label className="text-[10px] text-muted-foreground">A</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={Math.round(alpha * 100)}
                  onChange={(e) => {
                    const n = Math.max(0, Math.min(100, Number(e.target.value)));
                    setAlpha(n / 100);
                  }}
                  className="w-12 h-8 text-xs px-2 font-mono"
                  aria-label="Alpha percentage"
                />
              </div>
            </div>

            {/* Preset colors */}
            <div>
              <Label className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1.5 block">
                Presets
              </Label>
              <div className="grid grid-cols-6 gap-1.5">
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    title={preset}
                    aria-label={`Select color ${preset}`}
                    onClick={() => handlePreset(preset)}
                    className={cn(
                      "w-7 h-7 rounded-md border border-border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      currentHex === preset && "ring-2 ring-ring scale-110"
                    )}
                    style={{ background: preset }}
                  />
                ))}
              </div>
            </div>

            {/* Apply / Copy */}
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs h-8"
                onClick={() => {
                  navigator.clipboard?.writeText(currentHex).catch(() => {});
                }}
              >
                Copy
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs h-8"
                onClick={() => {
                  onChange?.(alphaHex);
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </div>

          <PopoverPrimitive.Arrow className="fill-border" />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export default ColorPickerPopover;