"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, Copy, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HSV {
  h: number; // 0–360
  s: number; // 0–100
  v: number; // 0–100
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

// ─── Conversion helpers ───────────────────────────────────────────────────────

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 3 && clean.length !== 6) return null;
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const n = parseInt(full, 16);
  if (isNaN(n)) return null;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function rgbToHex({ r, g, b }: RGB): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

function rgbToHsv({ r, g, b }: RGB): HSV {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  if (d !== 0) {
    if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
    else if (max === gg) h = ((bb - rr) / d + 2) / 6;
    else h = ((rr - gg) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, v: v * 100 };
}

function hsvToRgb({ h, s, v }: HSV): RGB {
  const hh = h / 360;
  const ss = s / 100;
  const vv = v / 100;
  let r = 0,
    g = 0,
    b = 0;
  const i = Math.floor(hh * 6);
  const f = hh * 6 - i;
  const p = vv * (1 - ss);
  const q = vv * (1 - f * ss);
  const t = vv * (1 - (1 - f) * ss);
  switch (i % 6) {
    case 0: r = vv; g = t; b = p; break;
    case 1: r = q; g = vv; b = p; break;
    case 2: r = p; g = vv; b = t; break;
    case 3: r = p; g = q; b = vv; break;
    case 4: r = t; g = p; b = vv; break;
    case 5: r = vv; g = p; b = q; break;
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function hexToHsv(hex: string): HSV {
  const rgb = hexToRgb(hex);
  return rgb ? rgbToHsv(rgb) : { h: 0, s: 100, v: 100 };
}

function hsvToHex(hsv: HSV): string {
  return rgbToHex(hsvToRgb(hsv));
}

function hsvToHslString({ h, s, v }: HSV): string {
  const l = (v / 100) * (1 - s / 200);
  const sl = l === 0 || l === 1 ? 0 : ((v / 100 - l) / Math.min(l, 1 - l)) * 100;
  return `hsl(${Math.round(h)}, ${Math.round(sl)}%, ${Math.round(l * 100)}%)`;
}

// ─── Preset palette ──────────────────────────────────────────────────────────

const PRESETS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
  "#ffffff", "#d1d5db", "#6b7280", "#374151",
  "#111827", "#000000", "#f9fafb", "#fef9c3",
];

// ─── SatVal canvas ────────────────────────────────────────────────────────────

interface SatValProps {
  hue: number;
  saturation: number;
  value: number;
  onChange: (s: number, v: number) => void;
}

function SatValPicker({ hue, saturation, value, onChange }: SatValProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const getCoords = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * 100;
      const v = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height)) * 100;
      onChange(s, v);
    },
    [onChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    getCoords(e.clientX, e.clientY);
    const onMove = (me: MouseEvent) => getCoords(me.clientX, me.clientY);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    getCoords(touch.clientX, touch.clientY);
    const onMove = (te: TouchEvent) => {
      const t = te.touches[0];
      getCoords(t.clientX, t.clientY);
    };
    const onEnd = () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);
  };

  const thumbX = `${saturation}%`;
  const thumbY = `${100 - value}%`;

  return (
    <div
      ref={ref}
      className="relative w-full h-40 rounded-md cursor-crosshair select-none overflow-hidden"
      style={{
        background: `hsl(${hue}, 100%, 50%)`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* white left-to-right */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to right, #fff 0%, transparent 100%)",
        }}
      />
      {/* black bottom-to-top */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, #000 0%, transparent 100%)",
        }}
      />
      {/* thumb */}
      <div
        className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md pointer-events-none"
        style={{
          left: thumbX,
          top: thumbY,
          boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.4)",
        }}
      />
    </div>
  );
}

// ─── Hue slider ───────────────────────────────────────────────────────────────

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
      const h = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * 360;
      onChange(h);
    },
    [onChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    getHue(e.clientX);
    const onMove = (me: MouseEvent) => getHue(me.clientX);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    getHue(touch.clientX);
    const onMove = (te: TouchEvent) => getHue(te.touches[0].clientX);
    const onEnd = () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);
  };

  return (
    <div
      ref={ref}
      className="relative w-full h-4 rounded-full cursor-pointer select-none"
      style={{
        background:
          "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        className="absolute top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white pointer-events-none"
        style={{
          left: `${(hue / 360) * 100}%`,
          boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.4)",
          background: `hsl(${hue}, 100%, 50%)`,
        }}
      />
    </div>
  );
}

// ─── Alpha slider ─────────────────────────────────────────────────────────────

interface AlphaSliderProps {
  alpha: number; // 0–100
  color: string;
  onChange: (a: number) => void;
}

function AlphaSlider({ alpha, color, onChange }: AlphaSliderProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  const getAlpha = React.useCallback(
    (clientX: number) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const a = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * 100;
      onChange(a);
    },
    [onChange]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    getAlpha(e.clientX);
    const onMove = (me: MouseEvent) => getAlpha(me.clientX);
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    getAlpha(touch.clientX);
    const onMove = (te: TouchEvent) => getAlpha(te.touches[0].clientX);
    const onEnd = () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onEnd);
  };

  const rgb = hexToRgb(color) ?? { r: 0, g: 0, b: 0 };

  return (
    <div
      ref={ref}
      className="relative w-full h-4 rounded-full cursor-pointer select-none"
      style={{
        background: `linear-gradient(to right, rgba(${rgb.r},${rgb.g},${rgb.b},0), rgb(${rgb.r},${rgb.g},${rgb.b}))`,
        backgroundImage: `
          linear-gradient(to right, rgba(${rgb.r},${rgb.g},${rgb.b},0), rgb(${rgb.r},${rgb.g},${rgb.b})),
          repeating-conic-gradient(#aaa 0% 25%, #fff 0% 50%)
        `,
        backgroundSize: "100% 100%, 12px 12px",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        className="absolute top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white pointer-events-none"
        style={{
          left: `${alpha}%`,
          boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.4)",
          background: `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha / 100})`,
        }}
      />
    </div>
  );
}

// ─── Main color picker popover ────────────────────────────────────────────────

export interface ColorPickerPopoverProps {
  value?: string;
  onChange?: (hex: string, alpha: number) => void;
  label?: string;
  className?: string;
}

type InputMode = "hex" | "rgb" | "hsl";

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  label = "Color",
  className,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [hsv, setHsv] = React.useState<HSV>(() => hexToHsv(value));
  const [alpha, setAlpha] = React.useState(100);
  const [hexInput, setHexInput] = React.useState(value);
  const [inputMode, setInputMode] = React.useState<InputMode>("hex");
  const [copied, setCopied] = React.useState(false);

  // Derived hex
  const currentHex = hsvToHex(hsv);
  const rgb = hsvToRgb(hsv);
  const hslString = hsvToHslString(hsv);

  // Sync external value
  React.useEffect(() => {
    const newHsv = hexToHsv(value);
    setHsv(newHsv);
    setHexInput(hsvToHex(newHsv));
  }, [value]);

  const notifyChange = React.useCallback(
    (newHsv: HSV, newAlpha: number) => {
      onChange?.(hsvToHex(newHsv), newAlpha);
    },
    [onChange]
  );

  const handleSatVal = (s: number, v: number) => {
    const next = { ...hsv, s, v };
    setHsv(next);
    setHexInput(hsvToHex(next));
    notifyChange(next, alpha);
  };

  const handleHue = (h: number) => {
    const next = { ...hsv, h };
    setHsv(next);
    setHexInput(hsvToHex(next));
    notifyChange(next, alpha);
  };

  const handleAlpha = (a: number) => {
    setAlpha(a);
    notifyChange(hsv, a);
  };

  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    const rgb = hexToRgb(normalized);
    if (rgb) {
      const newHsv = rgbToHsv(rgb);
      setHsv(newHsv);
      notifyChange(newHsv, alpha);
    }
  };

  const handlePreset = (hex: string) => {
    const newHsv = hexToHsv(hex);
    setHsv(newHsv);
    setHexInput(hex);
    notifyChange(newHsv, alpha);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentHex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const cycleMode = () => {
    setInputMode((m) => (m === "hex" ? "rgb" : m === "rgb" ? "hsl" : "hex"));
  };

  const previewStyle: React.CSSProperties = {
    background:
      alpha < 100
        ? `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha / 100})`
        : currentHex,
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <Label className="text-sm font-medium text-foreground">{label}</Label>
      )}
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            type="button"
            className={cn(
              "flex items-center gap-2 h-9 px-3 rounded-md border border-input bg-background text-sm shadow-sm",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              "transition-colors w-full"
            )}
            aria-label={`Pick ${label}`}
          >
            {/* swatch */}
            <span
              className="inline-block w-5 h-5 rounded border border-black/10 flex-shrink-0"
              style={previewStyle}
            />
            <span className="flex-1 text-left font-mono tracking-tight">
              {currentHex.toUpperCase()}
            </span>
            {alpha < 100 && (
              <span className="text-xs text-muted-foreground">{Math.round(alpha)}%</span>
            )}
            <ChevronDown className="w-4 h-4 text-muted-foreground ml-auto" />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align="start"
            sideOffset={6}
            className={cn(
              "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
              "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
            )}
          >
            <div className="space-y-3">
              {/* Saturation / Value canvas */}
              <SatValPicker
                hue={hsv.h}
                saturation={hsv.s}
                value={hsv.v}
                onChange={handleSatVal}
              />

              {/* Hue + preview row */}
              <div className="flex items-center gap-3">
                <div className="flex-1 space-y-2">
                  <HueSlider hue={hsv.h} onChange={handleHue} />
                  <AlphaSlider alpha={alpha} color={currentHex} onChange={handleAlpha} />
                </div>
                {/* preview swatch */}
                <div
                  className="w-10 h-10 rounded-lg border border-black/10 flex-shrink-0"
                  style={{
                    background: `repeating-conic-gradient(#aaa 0% 25%, #fff 0% 50%) 0 0 / 10px 10px`,
                  }}
                >
                  <div
                    className="w-full h-full rounded-lg"
                    style={previewStyle}
                  />
                </div>
              </div>

              {/* Input row */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs font-mono px-2 h-8 flex-shrink-0 w-10"
                  onClick={cycleMode}
                  title="Cycle input mode"
                >
                  {inputMode.toUpperCase()}
                </Button>

                {inputMode === "hex" && (
                  <Input
                    value={hexInput}
                    onChange={handleHexInput}
                    className="h-8 font-mono text-xs flex-1"
                    placeholder="#000000"
                    maxLength={7}
                  />
                )}

                {inputMode === "rgb" && (
                  <div className="flex gap-1 flex-1">
                    {["R", "G", "B"].map((ch, i) => {
                      const keys = ["r", "g", "b"] as const;
                      return (
                        <div key={ch} className="flex flex-col items-center gap-0.5 flex-1">
                          <Input
                            className="h-8 font-mono text-xs text-center px-1"
                            value={rgb[keys[i]]}
                            onChange={(e) => {
                              const n = Math.max(0, Math.min(255, parseInt(e.target.value) || 0));
                              const newRgb = { ...rgb, [keys[i]]: n };
                              const newHsv = rgbToHsv(newRgb);
                              setHsv(newHsv);
                              setHexInput(rgbToHex(newRgb));
                              notifyChange(newHsv, alpha);
                            }}
                            type="number"
                            min={0}
                            max={255}
                          />
                          <span className="text-[10px] text-muted-foreground">{ch}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {inputMode === "hsl" && (
                  <Input
                    readOnly
                    value={hslString}
                    className="h-8 font-mono text-xs flex-1"
                  />
                )}

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={handleCopy}
                  title="Copy hex"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  title="Eyedropper (browser support required)"
                  onClick={async () => {
                    if (!("EyeDropper" in window)) return;
                    try {
                      // @ts-ignore
                      const dropper = new window.EyeDropper();
                      const result = await dropper.open();
                      handlePreset(result.sRGBHex);
                    } catch {
                      // dismissed
                    }
                  }}
                >
                  <Pipette className="w-3.5 h-3.5" />
                </Button>
              </div>

              {/* Presets */}
              <div>
                <p className="text-[11px] text-muted-foreground mb-1.5 font-medium uppercase tracking-wider">
                  Presets
                </p>
                <div className="grid grid-cols-8 gap-1.5">
                  {PRESETS.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      title={hex}
                      onClick={() => handlePreset(hex)}
                      className={cn(
                        "w-7 h-7 rounded-md border border-black/10 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring",
                        currentHex.toLowerCase() === hex.toLowerCase() &&
                          "ring-2 ring-ring ring-offset-1"
                      )}
                      style={{ background: hex }}
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-border">
                <span className="text-[11px] text-muted-foreground font-mono">
                  {currentHex.toUpperCase()}{" "}
                  {alpha < 100 && (
                    <span className="text-muted-foreground/70">/ {Math.round(alpha)}%</span>
                  )}
                </span>
                <Button
                  type="button"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setOpen(false)}
                >
                  Done
                </Button>
              </div>
            </div>
            <PopoverPrimitive.Arrow className="fill-border" />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}

export default ColorPickerPopover;