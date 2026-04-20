"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────── Radix wrappers ─────────────────────────── */
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
        "z-50 w-72 rounded-xl border border-border bg-popover p-0 shadow-xl outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "@media (prefers-reduced-motion: reduce) { animation: none !important }",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

/* ─────────────────────────── Preset palette ─────────────────────────── */
const PRESETS: { label: string; value: string }[] = [
  { label: "Rose",    value: "#f43f5e" },
  { label: "Orange",  value: "#f97316" },
  { label: "Amber",   value: "#f59e0b" },
  { label: "Yellow",  value: "#eab308" },
  { label: "Lime",    value: "#84cc16" },
  { label: "Green",   value: "#22c55e" },
  { label: "Teal",    value: "#14b8a6" },
  { label: "Cyan",    value: "#06b6d4" },
  { label: "Sky",     value: "#0ea5e9" },
  { label: "Blue",    value: "#3b82f6" },
  { label: "Indigo",  value: "#6366f1" },
  { label: "Violet",  value: "#8b5cf6" },
  { label: "Purple",  value: "#a855f7" },
  { label: "Pink",    value: "#ec4899" },
  { label: "Slate",   value: "#64748b" },
  { label: "Zinc",    value: "#71717a" },
];

/* ─────────────────────────── Helpers ────────────────────────────────── */
function isValidHex(v: string) {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace("#", "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  const num = parseInt(full, 16);
  if (isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number) {
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
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
    case g: h = ((b - r) / d + 2) / 6; break;
    case b: h = ((r - g) / d + 4) / 6; break;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function contrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#000";
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.55 ? "#1a1a1a" : "#ffffff";
}

/* ─────────────────────────── Color Picker Popover ───────────────────── */
interface ColorPickerPopoverProps {
  label?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (color: string) => void;
  className?: string;
}

export function ColorPickerPopover({
  label = "Color",
  value,
  defaultValue = "#6366f1",
  onChange,
  className,
}: ColorPickerPopoverProps) {
  const isControlled = value !== undefined;
  const [internalColor, setInternalColor] = React.useState(defaultValue);
  const color = isControlled ? (value as string) : internalColor;

  const [hexInput, setHexInput] = React.useState(color);
  const [open, setOpen] = React.useState(false);

  /* keep hex input in sync when color changes externally */
  React.useEffect(() => {
    setHexInput(color);
  }, [color]);

  const setColor = React.useCallback(
    (c: string) => {
      if (!isControlled) setInternalColor(c);
      onChange?.(c);
      setHexInput(c);
    },
    [isControlled, onChange]
  );

  /* ── hex input handler ── */
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.startsWith("#") ? e.target.value : `#${e.target.value}`;
    setHexInput(e.target.value);
    if (isValidHex(raw)) setColor(raw);
  };

  /* ── native color wheel handler ── */
  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  /* ── RGB sliders ── */
  const rgb = hexToRgb(color) ?? { r: 0, g: 0, b: 0 };
  const hsl = hexToHsl(color);

  const handleRgbChange =
    (channel: "r" | "g" | "b") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Number(e.target.value);
      const next = { ...rgb, [channel]: val };
      setColor(rgbToHex(next.r, next.g, next.b));
    };

  const titleId = React.useId();
  const descId = React.useId();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      {/* ── Trigger ── */}
      <PopoverTrigger asChild>
        <button
          aria-label={`Open ${label} color picker`}
          className={cn(
            "flex h-10 w-full items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm",
            "hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            "transition-colors",
            className
          )}
        >
          <span
            className="inline-block h-5 w-5 shrink-0 rounded-md border border-black/10 shadow-inner"
            style={{ backgroundColor: color }}
            aria-hidden
          />
          <span className="flex-1 text-left font-mono">{color}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>

      {/* ── Panel ── */}
      <PopoverContent
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between rounded-t-xl px-4 py-3"
          style={{ backgroundColor: color, color: contrastColor(color) }}
        >
          <div>
            <p id={titleId} className="text-sm font-semibold leading-none">
              {label}
            </p>
            <p id={descId} className="mt-1 text-xs opacity-80">
              {hsl ? `HSL ${hsl.h}° ${hsl.s}% ${hsl.l}%` : color}
            </p>
          </div>
          <Pipette className="h-4 w-4 opacity-70" aria-hidden />
        </div>

        <div className="space-y-4 p-4">
          {/* Native color wheel */}
          <div className="flex flex-col items-center gap-1">
            <Label className="self-start text-xs text-muted-foreground">
              Color wheel
            </Label>
            <div className="relative">
              <input
                type="color"
                value={color}
                onChange={handleNativeChange}
                aria-label="Color wheel"
                className="h-10 w-full cursor-pointer rounded-lg border border-input bg-transparent p-0.5"
                style={{ minWidth: "230px" }}
              />
            </div>
          </div>

          {/* RGB sliders */}
          <div className="space-y-2">
            {(["r", "g", "b"] as const).map((ch) => (
              <div key={ch} className="flex items-center gap-2">
                <Label className="w-4 text-xs font-semibold uppercase text-muted-foreground">
                  {ch}
                </Label>
                <input
                  type="range"
                  min={0}
                  max={255}
                  value={rgb[ch]}
                  onChange={handleRgbChange(ch)}
                  aria-label={`${ch.toUpperCase()} channel`}
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-muted accent-current"
                  style={{
                    accentColor:
                      ch === "r"
                        ? rgbToHex(rgb.r, 0, 0)
                        : ch === "g"
                        ? rgbToHex(0, rgb.g, 0)
                        : rgbToHex(0, 0, rgb.b),
                  }}
                />
                <span className="w-8 text-right font-mono text-xs text-muted-foreground">
                  {rgb[ch]}
                </span>
              </div>
            ))}
          </div>

          {/* Hex input */}
          <div className="flex items-end gap-2">
            <div className="flex-1 space-y-1">
              <Label htmlFor="hex-input" className="text-xs text-muted-foreground">
                Hex
              </Label>
              <Input
                id="hex-input"
                value={hexInput}
                onChange={handleHexChange}
                placeholder="#6366f1"
                className="font-mono text-sm uppercase"
                maxLength={7}
                spellCheck={false}
                autoComplete="off"
              />
            </div>
            <div
              className="h-10 w-10 shrink-0 rounded-md border border-input shadow-inner"
              style={{ backgroundColor: color }}
              aria-hidden
            />
          </div>

          {/* Preset swatches */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Presets</Label>
            <div className="grid grid-cols-8 gap-1.5">
              {PRESETS.map((preset) => {
                const isSelected =
                  preset.value.toLowerCase() === color.toLowerCase();
                return (
                  <button
                    key={preset.value}
                    title={preset.label}
                    aria-label={`${preset.label} — ${preset.value}`}
                    aria-pressed={isSelected}
                    onClick={() => setColor(preset.value)}
                    className={cn(
                      "relative h-7 w-7 rounded-md border border-black/10 shadow-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                      isSelected && "ring-2 ring-foreground ring-offset-1"
                    )}
                    style={{ backgroundColor: preset.value }}
                  >
                    {isSelected && (
                      <Check
                        className="absolute inset-0 m-auto h-3.5 w-3.5"
                        style={{ color: contrastColor(preset.value) }}
                        aria-hidden
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => {
                setColor(defaultValue);
              }}
            >
              Reset
            </Button>
            <Button
              size="sm"
              className="flex-1 text-xs"
              onClick={() => setOpen(false)}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}