"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ColorPickerPopoverProps {
  label?: string;
  value?: string;
  onChange?: (color: string) => void;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
  let r = 0,
    g = 0,
    b = 0;
  const i = Math.floor(hn * 6);
  const f = hn * 6 - i;
  const p = vn * (1 - sn);
  const q = vn * (1 - f * sn);
  const t = vn * (1 - (1 - f) * sn);
  switch (i % 6) {
    case 0: r = vn; g = t; b = p; break;
    case 1: r = q; g = vn; b = p; break;
    case 2: r = p; g = vn; b = t; break;
    case 3: r = p; g = q; b = vn; break;
    case 4: r = t; g = p; b = vn; break;
    case 5: r = vn; g = p; b = q; break;
  }
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#ffffff", "#d1d5db", "#6b7280", "#374151",
  "#111827", "#000000", "#fef9c3", "#dcfce7",
];

// ─── Gradient Canvas ──────────────────────────────────────────────────────────

interface GradientCanvasProps {
  hue: number;
  saturation: number;
  value: number;
  onChange: (s: number, v: number) => void;
}

function GradientCanvas({ hue, saturation, value, onChange }: GradientCanvasProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const updateFromEvent = React.useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      const el = canvasRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
      const y = Math.min(Math.max(e.clientY - rect.top, 0), rect.height);
      onChange((x / rect.width) * 100, (1 - y / rect.height) * 100);
    },
    [onChange]
  );

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) updateFromEvent(e);
    };
    const onMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [updateFromEvent]);

  const thumbLeft = `${saturation}%`;
  const thumbTop = `${100 - value}%`;

  return (
    <div
      ref={canvasRef}
      className="relative w-full h-40 rounded-md cursor-crosshair select-none"
      style={{
        background: `
          linear-gradient(to bottom, transparent, #000),
          linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))
        `,
      }}
      onMouseDown={(e) => {
        isDragging.current = true;
        updateFromEvent(e);
      }}
    >
      <div
        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md pointer-events-none"
        style={{
          left: thumbLeft,
          top: thumbTop,
          backgroundColor: hsvToHex(hue, saturation, value),
        }}
      />
    </div>
  );
}

// ─── Hue Slider ───────────────────────────────────────────────────────────────

interface HueSliderProps {
  hue: number;
  onChange: (hue: number) => void;
}

function HueSlider({ hue, onChange }: HueSliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const updateFromEvent = React.useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
      onChange((x / rect.width) * 360);
    },
    [onChange]
  );

  React.useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging.current) updateFromEvent(e);
    };
    const onMouseUp = () => {
      isDragging.current = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [updateFromEvent]);

  return (
    <div
      ref={trackRef}
      className="relative w-full h-4 rounded-full cursor-pointer select-none"
      style={{
        background:
          "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
      }}
      onMouseDown={(e) => {
        isDragging.current = true;
        updateFromEvent(e);
      }}
    >
      <div
        className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md pointer-events-none"
        style={{
          left: `${(hue / 360) * 100}%`,
          backgroundColor: `hsl(${hue}, 100%, 50%)`,
        }}
      />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ColorPickerPopover({
  label = "Color",
  value = "#3b82f6",
  onChange,
  className,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [internalColor, setInternalColor] = React.useState(
    isValidHex(value) ? value : "#3b82f6"
  );
  const [hexInput, setHexInput] = React.useState(internalColor);

  const { h, s, v } = React.useMemo(() => hexToHsv(internalColor), [internalColor]);
  const [hue, setHue] = React.useState(h);
  const [saturation, setSaturation] = React.useState(s);
  const [brightness, setBrightness] = React.useState(v);

  // Sync external value changes
  React.useEffect(() => {
    if (isValidHex(value) && value !== internalColor) {
      setInternalColor(value);
      setHexInput(value);
      const { h: nh, s: ns, v: nv } = hexToHsv(value);
      setHue(nh);
      setSaturation(ns);
      setBrightness(nv);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const applyHsv = React.useCallback(
    (nh: number, ns: number, nv: number) => {
      const hex = hsvToHex(nh, ns, nv);
      setInternalColor(hex);
      setHexInput(hex);
      onChange?.(hex);
    },
    [onChange]
  );

  const handleGradientChange = (ns: number, nv: number) => {
    setSaturation(ns);
    setBrightness(nv);
    applyHsv(hue, ns, nv);
  };

  const handleHueChange = (nh: number) => {
    setHue(nh);
    applyHsv(nh, saturation, brightness);
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
    setHexInput(val);
    if (isValidHex(val)) {
      const { h: nh, s: ns, v: nv } = hexToHsv(val);
      setHue(nh);
      setSaturation(ns);
      setBrightness(nv);
      setInternalColor(val);
      onChange?.(val);
    }
  };

  const handlePreset = (color: string) => {
    const { h: nh, s: ns, v: nv } = hexToHsv(color);
    setHue(nh);
    setSaturation(ns);
    setBrightness(nv);
    setInternalColor(color);
    setHexInput(color);
    onChange?.(color);
  };

  const rgb = React.useMemo(() => hexToRgb(internalColor), [internalColor]);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-10 px-3 font-normal"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded border border-gray-200 shadow-sm flex-shrink-0"
                style={{ backgroundColor: internalColor }}
              />
              <span className="font-mono text-sm">{internalColor.toUpperCase()}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={6}
            className={cn(
              "z-50 w-72 rounded-xl border bg-popover p-4 shadow-xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
            )}
          >
            {/* Close button */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Pipette className="w-4 h-4" />
                Color Picker
              </span>
              <PopoverPrimitive.Close asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md">
                  <X className="h-4 w-4" />
                </Button>
              </PopoverPrimitive.Close>
            </div>

            {/* Gradient canvas */}
            <GradientCanvas
              hue={hue}
              saturation={saturation}
              value={brightness}
              onChange={handleGradientChange}
            />

            {/* Hue slider */}
            <div className="mt-3">
              <HueSlider hue={hue} onChange={handleHueChange} />
            </div>

            {/* Preview + Hex input */}
            <div className="flex items-center gap-2 mt-4">
              <div
                className="w-10 h-10 rounded-lg border border-gray-200 shadow-sm flex-shrink-0"
                style={{ backgroundColor: internalColor }}
              />
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1 block">HEX</Label>
                <Input
                  value={hexInput}
                  onChange={handleHexInput}
                  className="font-mono text-sm h-8 uppercase"
                  maxLength={7}
                  spellCheck={false}
                />
              </div>
            </div>

            {/* RGB display */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {(["R", "G", "B"] as const).map((channel, i) => (
                <div key={channel}>
                  <Label className="text-xs text-muted-foreground mb-1 block">{channel}</Label>
                  <div className="h-8 flex items-center px-2 rounded-md border bg-muted text-sm font-mono">
                    {[rgb.r, rgb.g, rgb.b][i]}
                  </div>
                </div>
              ))}
            </div>

            {/* Preset swatches */}
            <div className="mt-4">
              <Label className="text-xs text-muted-foreground mb-2 block">Presets</Label>
              <div className="grid grid-cols-8 gap-1.5">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-7 h-7 rounded-md border border-gray-200 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring relative",
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => handlePreset(color)}
                    title={color}
                  >
                    {internalColor.toLowerCase() === color.toLowerCase() && (
                      <Check
                        className="absolute inset-0 m-auto w-3.5 h-3.5 drop-shadow"
                        style={{
                          color: hexToHsv(color).v > 60 ? "#000" : "#fff",
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm */}
            <Button
              className="w-full mt-4 h-9"
              onClick={() => setOpen(false)}
            >
              <Check className="w-4 h-4 mr-1.5" />
              Apply Color
            </Button>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}

export default ColorPickerPopover;