"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pipette, X } from "lucide-react";

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
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = h * 60;
    if (h < 0) h += 360;
  }
  return { h, s, v };
}

function hsvToHex(h: number, s: number, v: number): string {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  const toHex = (n: number) =>
    Math.round(n * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(5))}${toHex(f(3))}${toHex(f(1))}`;
}

function isValidHex(hex: string) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
}

function normalizeHex(hex: string): string {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    return `#${clean
      .split("")
      .map((c) => c + c)
      .join("")}`;
  }
  return `#${clean}`;
}

// ─── Preset Palette ───────────────────────────────────────────────────────────

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
  "#d1d5db",
  "#6b7280",
  "#111827",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface GradientPickerProps {
  hue: number;
  saturation: number;
  brightness: number;
  onChange: (s: number, v: number) => void;
}

function GradientPicker({ hue, saturation, brightness, onChange }: GradientPickerProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const getCoords = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
      const s = x / rect.width;
      const v = 1 - y / rect.height;
      onChange(s, v);
    },
    [onChange]
  );

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      getCoords(e.clientX, e.clientY);

      const onMove = (ev: MouseEvent) => getCoords(ev.clientX, ev.clientY);
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [getCoords]
  );

  const handleTouchStart = React.useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      getCoords(touch.clientX, touch.clientY);

      const onMove = (ev: TouchEvent) => {
        const t = ev.touches[0];
        getCoords(t.clientX, t.clientY);
      };
      const onEnd = () => {
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
      };
      window.addEventListener("touchmove", onMove);
      window.addEventListener("touchend", onEnd);
    },
    [getCoords]
  );

  const cursorX = `${saturation * 100}%`;
  const cursorY = `${(1 - brightness) * 100}%`;

  return (
    <div
      ref={ref}
      className="relative w-full h-40 rounded-md cursor-crosshair select-none overflow-hidden"
      style={{ background: `hsl(${hue}, 100%, 50%)` }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* White gradient left→right */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, #fff 0%, transparent 100%)",
        }}
      />
      {/* Black gradient top→bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, #000 100%)",
        }}
      />
      {/* Cursor */}
      <div
        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow pointer-events-none"
        style={{ left: cursorX, top: cursorY }}
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
    (clientX: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      onChange((x / rect.width) * 360);
    },
    [onChange]
  );

  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      getHue(e.clientX);
      const onMove = (ev: MouseEvent) => getHue(ev.clientX);
      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [getHue]
  );

  const handleTouchStart = React.useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      getHue(touch.clientX);
      const onMove = (ev: TouchEvent) => getHue(ev.touches[0].clientX);
      const onEnd = () => {
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
      };
      window.addEventListener("touchmove", onMove);
      window.addEventListener("touchend", onEnd);
    },
    [getHue]
  );

  return (
    <div
      ref={ref}
      className="relative w-full h-4 rounded-full cursor-pointer select-none"
      style={{
        background:
          "linear-gradient(to right, #f00 0%, #ff0 16.67%, #0f0 33.33%, #0ff 50%, #00f 66.67%, #f0f 83.33%, #f00 100%)",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white shadow pointer-events-none"
        style={{
          left: `${(hue / 360) * 100}%`,
          background: `hsl(${hue}, 100%, 50%)`,
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

  // Internal color state (HSV + hex input)
  const [hue, setHue] = React.useState(() => hexToHsv(value).h);
  const [saturation, setSaturation] = React.useState(() => hexToHsv(value).s);
  const [brightness, setBrightness] = React.useState(() => hexToHsv(value).v);
  const [hexInput, setHexInput] = React.useState(value);

  // Sync from prop changes
  React.useEffect(() => {
    if (isValidHex(value)) {
      const { h, s, v } = hexToHsv(normalizeHex(value));
      setHue(h);
      setSaturation(s);
      setBrightness(v);
      setHexInput(normalizeHex(value));
    }
  }, [value]);

  const currentHex = React.useMemo(
    () => hsvToHex(hue, saturation, brightness),
    [hue, saturation, brightness]
  );

  // Notify parent & keep hex input in sync when sliders change
  React.useEffect(() => {
    setHexInput(currentHex);
    onChange?.(currentHex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentHex]);

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      const hex = normalizeHex(normalized);
      const { h, s, v } = hexToHsv(hex);
      setHue(h);
      setSaturation(s);
      setBrightness(v);
    }
  };

  const handleGradientChange = (s: number, v: number) => {
    setSaturation(s);
    setBrightness(v);
  };

  const handlePreset = (hex: string) => {
    const { h, s, v } = hexToHsv(hex);
    setHue(h);
    setSaturation(s);
    setBrightness(v);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            aria-label={`Pick color: ${currentHex}`}
            className={cn(
              "flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-background text-sm shadow-sm",
              "hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <span
              className="w-5 h-5 rounded-sm border border-black/10 flex-shrink-0"
              style={{ background: currentHex }}
            />
            <span className="font-mono tracking-wide text-muted-foreground">
              {currentHex.toUpperCase()}
            </span>
            <Pipette className="ml-auto w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            sideOffset={8}
            align="start"
            className={cn(
              "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
            )}
          >
            {/* Close button */}
            <PopoverPrimitive.Close
              className="absolute top-3 right-3 rounded-sm opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-opacity"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </PopoverPrimitive.Close>

            <div className="flex flex-col gap-4">
              {/* Gradient */}
              <GradientPicker
                hue={hue}
                saturation={saturation}
                brightness={brightness}
                onChange={handleGradientChange}
              />

              {/* Hue slider */}
              <HueSlider hue={hue} onChange={setHue} />

              {/* Preview + Hex input */}
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-md border border-black/10 flex-shrink-0 shadow-inner"
                  style={{ background: currentHex }}
                />
                <div className="flex flex-col flex-1 gap-1">
                  <Label htmlFor="hex-input" className="text-xs text-muted-foreground">
                    Hex
                  </Label>
                  <Input
                    id="hex-input"
                    value={hexInput}
                    onChange={handleHexInputChange}
                    className="h-8 font-mono text-sm"
                    maxLength={7}
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Preset swatches */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Presets</p>
                <div className="grid grid-cols-6 gap-1.5">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      title={preset}
                      aria-label={`Select color ${preset}`}
                      onClick={() => handlePreset(preset)}
                      className={cn(
                        "w-8 h-8 rounded-md border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        currentHex.toLowerCase() === preset.toLowerCase()
                          ? "border-primary ring-2 ring-primary ring-offset-1"
                          : "border-black/10"
                      )}
                      style={{ background: preset }}
                    />
                  ))}
                </div>
              </div>

              {/* Apply button */}
              <Button
                size="sm"
                className="w-full"
                onClick={() => {
                  onChange?.(currentHex);
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </div>

            <PopoverPrimitive.Arrow className="fill-border" />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}