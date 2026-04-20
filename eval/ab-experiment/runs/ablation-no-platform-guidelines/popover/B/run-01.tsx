"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ─── Popover primitives wired up locally ────────────────────────────────────

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
        "z-50 w-72 rounded-xl border border-zinc-200 bg-white p-4 shadow-xl",
        "outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        "dark:border-zinc-700 dark:bg-zinc-900",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

// ─── Popover header / title / description ───────────────────────────────────

function PopoverHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-3 space-y-0.5">{children}</div>;
}

function PopoverTitle({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <p id={id} className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
      {children}
    </p>
  );
}

function PopoverDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs text-zinc-500 dark:text-zinc-400">{children}</p>
  );
}

// ─── Preset palette ──────────────────────────────────────────────────────────

const PRESETS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#f43f5e", "#10b981", "#6366f1", "#14b8a6",
  "#a855f7", "#f59e0b", "#84cc16", "#0ea5e9",
];

// ─── Utility helpers ─────────────────────────────────────────────────────────

function isValidHex(value: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  if (isNaN(num)) return null;
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
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
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
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

// ─── Main component ──────────────────────────────────────────────────────────

export interface ColorPickerPopoverProps {
  label?: string;
  value?: string;
  onChange?: (color: string) => void;
  className?: string;
}

export function ColorPickerPopover({
  label = "Color",
  value = "#3b82f6",
  onChange,
  className,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [internalColor, setInternalColor] = React.useState(value);
  const [hexInput, setHexInput] = React.useState(value);
  const [hexError, setHexError] = React.useState(false);

  const titleId = React.useId();

  // Sync if controlled value changes externally
  React.useEffect(() => {
    setInternalColor(value);
    setHexInput(value);
  }, [value]);

  const hsl = hexToHsl(internalColor);

  function applyColor(hex: string) {
    const normalized = hex.startsWith("#") ? hex : `#${hex}`;
    setInternalColor(normalized);
    setHexInput(normalized);
    setHexError(false);
    onChange?.(normalized);
  }

  function handleNativeChange(e: React.ChangeEvent<HTMLInputElement>) {
    applyColor(e.target.value);
  }

  function handleHexInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      setHexError(false);
      setInternalColor(normalized);
      onChange?.(normalized);
    } else {
      setHexError(true);
    }
  }

  function handleHexBlur() {
    if (hexError) {
      setHexInput(internalColor);
      setHexError(false);
    }
  }

  function handleRgbChange(channel: "r" | "g" | "b", rawVal: string) {
    const num = parseInt(rawVal, 10);
    if (isNaN(num)) return;
    const rgb = hexToRgb(internalColor) ?? { r: 0, g: 0, b: 0 };
    rgb[channel] = num;
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    applyColor(hex);
  }

  const rgb = hexToRgb(internalColor) ?? { r: 0, g: 0, b: 0 };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={`Pick ${label} color, current value ${internalColor}`}
            className="flex h-9 items-center gap-2 px-3"
          >
            <span
              className="h-5 w-5 flex-shrink-0 rounded-md border border-zinc-300 shadow-inner dark:border-zinc-600"
              style={{ backgroundColor: internalColor }}
              aria-hidden="true"
            />
            <span className="font-mono text-xs tracking-wide">
              {internalColor.toUpperCase()}
            </span>
            <Pipette className="ml-1 h-3.5 w-3.5 text-zinc-500" aria-hidden="true" />
          </Button>
        </PopoverTrigger>

        <PopoverContent aria-labelledby={titleId}>
          {/* ── Close button ── */}
          <PopoverPrimitive.Close
            className="absolute right-3 top-3 rounded-sm opacity-60 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
            aria-label="Close color picker"
          >
            <X className="h-4 w-4" />
          </PopoverPrimitive.Close>

          <PopoverHeader>
            <PopoverTitle id={titleId}>{label}</PopoverTitle>
            <PopoverDescription>
              Choose a color for your theme.
            </PopoverDescription>
          </PopoverHeader>

          {/* ── Native color wheel ── */}
          <div className="mb-4 flex items-center gap-3">
            <label
              htmlFor="native-color"
              className="flex h-12 w-12 flex-shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-zinc-200 shadow-sm dark:border-zinc-700"
              style={{ backgroundColor: internalColor }}
              aria-label="Open system color picker"
            >
              <input
                id="native-color"
                type="color"
                value={internalColor}
                onChange={handleNativeChange}
                className="h-0 w-0 opacity-0"
                aria-label="System color picker"
              />
            </label>

            {/* HSL read-out */}
            {hsl && (
              <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-0.5">
                <p>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">H </span>
                  {hsl.h}°
                </p>
                <p>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">S </span>
                  {hsl.s}%
                </p>
                <p>
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">L </span>
                  {hsl.l}%
                </p>
              </div>
            )}
          </div>

          {/* ── Hex input ── */}
          <div className="mb-4 space-y-1">
            <Label htmlFor="hex-input" className="text-xs font-medium">
              Hex
            </Label>
            <Input
              id="hex-input"
              value={hexInput}
              onChange={handleHexInput}
              onBlur={handleHexBlur}
              placeholder="#000000"
              spellCheck={false}
              className={cn(
                "font-mono text-xs",
                hexError &&
                  "border-red-400 focus-visible:ring-red-400 dark:border-red-500"
              )}
              aria-invalid={hexError}
              aria-describedby={hexError ? "hex-error" : undefined}
            />
            {hexError && (
              <p id="hex-error" className="text-xs text-red-500" role="alert">
                Enter a valid hex color (e.g. #3b82f6).
              </p>
            )}
          </div>

          {/* ── RGB inputs ── */}
          <div className="mb-4 grid grid-cols-3 gap-2">
            {(["r", "g", "b"] as const).map((channel) => (
              <div key={channel} className="space-y-1">
                <Label
                  htmlFor={`rgb-${channel}`}
                  className="text-xs font-medium uppercase"
                >
                  {channel}
                </Label>
                <Input
                  id={`rgb-${channel}`}
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[channel]}
                  onChange={(e) => handleRgbChange(channel, e.target.value)}
                  className="h-8 text-center font-mono text-xs"
                />
              </div>
            ))}
          </div>

          {/* ── Preset swatches ── */}
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
              Presets
            </p>
            <div
              className="grid grid-cols-8 gap-1.5"
              role="group"
              aria-label="Color presets"
            >
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => applyColor(preset)}
                  title={preset.toUpperCase()}
                  aria-label={`Select color ${preset.toUpperCase()}`}
                  aria-pressed={internalColor.toLowerCase() === preset.toLowerCase()}
                  className={cn(
                    "h-6 w-6 rounded-md border transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1",
                    internalColor.toLowerCase() === preset.toLowerCase()
                      ? "border-zinc-800 ring-2 ring-zinc-800 ring-offset-1 dark:border-zinc-100 dark:ring-zinc-100"
                      : "border-zinc-200 dark:border-zinc-700"
                  )}
                  style={{ backgroundColor: preset }}
                />
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* External label */}
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
    </div>
  );
}