"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Tiny Radix-based Popover wrappers (no shadcn dialog needed)
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
        "z-50 w-72 rounded-xl border border-zinc-200 bg-white p-4 shadow-xl outline-none",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        "motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

const PopoverHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-3 flex flex-col gap-0.5", className)} {...props} />
);

const PopoverTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-sm font-semibold text-zinc-900 leading-tight", className)}
      {...props}
    />
  )
);
PopoverTitle.displayName = "PopoverTitle";

const PopoverDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-xs text-zinc-500", className)} {...props} />
));
PopoverDescription.displayName = "PopoverDescription";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function isValidHex(value: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const int = parseInt(h, 16);
  if (isNaN(int)) return null;
  return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
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
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

const SWATCHES = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#f43f5e", "#84cc16", "#14b8a6", "#6366f1",
  "#ffffff", "#d4d4d8", "#71717a", "#18181b",
];

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */
export interface ColorPickerPopoverProps {
  /** Controlled hex color value, e.g. "#3b82f6" */
  value?: string;
  /** Called whenever the selected color changes */
  onChange?: (hex: string) => void;
  /** Label shown above the trigger button */
  label?: string;
  /** Accessible name for the trigger when no label is provided */
  triggerAriaLabel?: string;
}

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  label = "Color",
  triggerAriaLabel,
}: ColorPickerPopoverProps) {
  const titleId = React.useId();
  const descId = React.useId();
  const hexInputId = React.useId();
  const rInputId = React.useId();
  const gInputId = React.useId();
  const bInputId = React.useId();

  const [open, setOpen] = React.useState(false);
  const [hexDraft, setHexDraft] = React.useState(value);

  /* Sync draft when value prop changes externally */
  React.useEffect(() => {
    setHexDraft(value);
  }, [value]);

  const rgb = hexToRgb(isValidHex(hexDraft) ? hexDraft : value) ?? { r: 0, g: 0, b: 0 };
  const hsl = hexToHsl(isValidHex(hexDraft) ? hexDraft : value);
  const safeHex = isValidHex(hexDraft) ? hexDraft : value;

  function commitHex(hex: string) {
    if (isValidHex(hex)) {
      onChange?.(hex);
    }
  }

  function handleHexChange(raw: string) {
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    setHexDraft(normalized);
    if (isValidHex(normalized)) {
      onChange?.(normalized);
    }
  }

  function handleChannelChange(channel: "r" | "g" | "b", raw: string) {
    const num = Math.min(255, Math.max(0, parseInt(raw, 10) || 0));
    const next = { ...rgb, [channel]: num };
    const hex = rgbToHex(next.r, next.g, next.b);
    setHexDraft(hex);
    onChange?.(hex);
  }

  function handleHueChange(h: number) {
    if (!hsl) return;
    const s = hsl.s / 100, l = hsl.l / 100;
    const hex = hslToHex(h, s, l);
    setHexDraft(hex);
    onChange?.(hex);
  }

  function handleNativeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const hex = e.target.value;
    setHexDraft(hex);
    onChange?.(hex);
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label htmlFor={triggerAriaLabel ?? label} className="text-sm font-medium text-zinc-700">
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={triggerAriaLabel ?? label}
            aria-label={triggerAriaLabel ?? `Pick ${label} color, current: ${safeHex}`}
            aria-haspopup="dialog"
            aria-expanded={open}
            className={cn(
              "flex h-10 w-full items-center gap-2.5 rounded-lg border border-zinc-200 bg-white px-3 shadow-sm",
              "hover:border-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400",
              "transition-colors"
            )}
          >
            <span
              className="h-5 w-5 shrink-0 rounded-md border border-zinc-200 shadow-inner"
              style={{ backgroundColor: safeHex }}
              aria-hidden="true"
            />
            <span className="font-mono text-sm text-zinc-700">{safeHex.toUpperCase()}</span>
            <Pipette className="ml-auto h-4 w-4 text-zinc-400" aria-hidden="true" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="flex flex-col gap-4"
        >
          {/* Header */}
          <PopoverHeader>
            <div className="flex items-center justify-between">
              <PopoverTitle id={titleId}>Color picker</PopoverTitle>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-0.5 text-zinc-400 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                aria-label="Close color picker"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <PopoverDescription id={descId}>
              Choose a color using the swatches, sliders, or input fields below.
            </PopoverDescription>
          </PopoverHeader>

          {/* Native color wheel + preview */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-zinc-200 shadow-inner">
              <span
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: safeHex }}
                aria-hidden="true"
              />
              <input
                type="color"
                value={safeHex}
                onChange={handleNativeChange}
                aria-label="Color wheel"
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor={hexInputId} className="mb-1 block text-xs font-medium text-zinc-500">
                Hex
              </Label>
              <Input
                id={hexInputId}
                value={hexDraft}
                onChange={(e) => handleHexChange(e.target.value)}
                onBlur={() => {
                  if (!isValidHex(hexDraft)) setHexDraft(safeHex);
                }}
                className="h-8 font-mono text-sm uppercase"
                maxLength={7}
                spellCheck={false}
                aria-label="Hex color value"
              />
            </div>
          </div>

          {/* Hue slider */}
          {hsl && (
            <div>
              <Label className="mb-1.5 block text-xs font-medium text-zinc-500">Hue</Label>
              <div className="relative flex items-center">
                <div
                  className="h-3 w-full rounded-full border border-zinc-200"
                  style={{
                    background:
                      "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
                  }}
                  aria-hidden="true"
                />
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={hsl.h}
                  onChange={(e) => handleHueChange(Number(e.target.value))}
                  aria-label="Hue"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
            </div>
          )}

          {/* RGB channels */}
          <div className="grid grid-cols-3 gap-2">
            {(["r", "g", "b"] as const).map((ch, i) => (
              <div key={ch}>
                <Label
                  htmlFor={[rInputId, gInputId, bInputId][i]}
                  className="mb-1 block text-xs font-medium text-zinc-500"
                >
                  {ch.toUpperCase()}
                </Label>
                <Input
                  id={[rInputId, gInputId, bInputId][i]}
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[ch]}
                  onChange={(e) => handleChannelChange(ch, e.target.value)}
                  className="h-8 text-sm"
                  aria-label={`${ch.toUpperCase()} channel`}
                />
              </div>
            ))}
          </div>

          {/* Swatches */}
          <div>
            <p className="mb-2 text-xs font-medium text-zinc-500">Swatches</p>
            <div className="grid grid-cols-8 gap-1.5">
              {SWATCHES.map((swatch) => (
                <button
                  key={swatch}
                  onClick={() => {
                    setHexDraft(swatch);
                    commitHex(swatch);
                  }}
                  aria-label={`Select color ${swatch}`}
                  aria-pressed={safeHex.toLowerCase() === swatch.toLowerCase()}
                  style={{ backgroundColor: swatch }}
                  className={cn(
                    "h-6 w-6 rounded-md border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1",
                    safeHex.toLowerCase() === swatch.toLowerCase()
                      ? "border-zinc-900 ring-2 ring-zinc-900 ring-offset-1"
                      : "border-zinc-200"
                  )}
                />
              ))}
            </div>
          </div>

          {/* Apply button */}
          <Button
            size="sm"
            className="w-full"
            onClick={() => setOpen(false)}
            style={{ backgroundColor: safeHex }}
          >
            <span
              className={cn(
                "font-medium",
                isLightColor(safeHex) ? "text-zinc-900" : "text-white"
              )}
            >
              Apply color
            </span>
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Additional color utilities
───────────────────────────────────────────── */
function hslToHex(h: number, s: number, l: number): string {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return rgbToHex(
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  );
}

function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}