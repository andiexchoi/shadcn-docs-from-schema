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

function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100;
  const ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ln - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function isValidHex(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value.trim());
}

/* ─────────────────────────────────────────────
   Preset swatches
───────────────────────────────────────────── */

const PRESETS: { label: string; value: string }[] = [
  { label: "Slate", value: "#64748b" },
  { label: "Red", value: "#ef4444" },
  { label: "Orange", value: "#f97316" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Yellow", value: "#eab308" },
  { label: "Lime", value: "#84cc16" },
  { label: "Green", value: "#22c55e" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Indigo", value: "#6366f1" },
  { label: "Purple", value: "#a855f7" },
  { label: "Pink", value: "#ec4899" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Black", value: "#000000" },
  { label: "White", value: "#ffffff" },
];

/* ─────────────────────────────────────────────
   Sub-components: Popover wrappers
───────────────────────────────────────────── */

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Trigger ref={ref} className={className} {...props} />
));
PopoverTrigger.displayName = "PopoverTrigger";

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
        "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        "outline-none",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */

export interface ColorPickerPopoverProps {
  /** Controlled color value as a 6-digit hex string, e.g. "#3b82f6" */
  value?: string;
  /** Called with a valid 6-digit hex string whenever the color changes */
  onChange?: (color: string) => void;
  /** Label shown on the trigger button */
  label?: string;
  /** Optional extra class names for the trigger button */
  className?: string;
}

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  label = "Color",
  className,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<string>(value);
  const [hexInput, setHexInput] = React.useState<string>(value);

  // Sync external value
  React.useEffect(() => {
    setDraft(value);
    setHexInput(value);
  }, [value]);

  const hsl = React.useMemo(() => hexToHsl(draft), [draft]);
  const h = hsl?.h ?? 0;
  const s = hsl?.s ?? 100;
  const l = hsl?.l ?? 50;

  function commit(hex: string) {
    setDraft(hex);
    setHexInput(hex);
    onChange?.(hex);
  }

  /* ── Hue slider ── */
  function handleHueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newH = Number(e.target.value);
    const hex = hslToHex(newH, s, l);
    commit(hex);
  }

  /* ── Saturation slider ── */
  function handleSatChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newS = Number(e.target.value);
    const hex = hslToHex(h, newS, l);
    commit(hex);
  }

  /* ── Lightness slider ── */
  function handleLightChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newL = Number(e.target.value);
    const hex = hslToHex(h, s, newL);
    commit(hex);
  }

  /* ── Hex input ── */
  function handleHexInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      commit(normalized);
    }
  }

  function handleHexBlur() {
    const normalized = hexInput.startsWith("#") ? hexInput : `#${hexInput}`;
    if (isValidHex(normalized)) {
      commit(normalized);
    } else {
      // Revert to last valid
      setHexInput(draft);
    }
  }

  const titleId = React.useId();
  const descId = React.useId();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn("flex items-center gap-2 px-3", className)}
        >
          {/* Color swatch */}
          <span
            className="h-5 w-5 shrink-0 rounded-md border border-border shadow-sm"
            style={{ backgroundColor: isValidHex(draft) ? draft : "#000000" }}
            aria-hidden="true"
          />
          <span className="text-sm font-medium">{label}</span>
          <span className="ml-1 font-mono text-xs text-muted-foreground">
            {draft.toUpperCase()}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent aria-labelledby={titleId} aria-describedby={descId}>
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2
              id={titleId}
              className="text-sm font-semibold leading-none tracking-tight"
            >
              Color picker
            </h2>
            <p id={descId} className="mt-1 text-xs text-muted-foreground">
              Select a color for your theme.
            </p>
          </div>
          <PopoverPrimitive.Close asChild>
            <Button
              variant="ghost"
              size="icon"
              className="-mr-1 -mt-1 h-7 w-7 text-muted-foreground hover:text-foreground"
              aria-label="Close color picker"
            >
              <X className="h-4 w-4" />
            </Button>
          </PopoverPrimitive.Close>
        </div>

        {/* Large preview swatch */}
        <div
          className="mb-4 h-12 w-full rounded-lg border border-border shadow-inner"
          style={{ backgroundColor: draft }}
          aria-hidden="true"
        />

        {/* Sliders */}
        <div className="space-y-3">
          {/* Hue */}
          <div>
            <Label htmlFor="hue-slider" className="mb-1 block text-xs">
              Hue — {h}°
            </Label>
            <input
              id="hue-slider"
              type="range"
              min={0}
              max={360}
              value={h}
              onChange={handleHueChange}
              className="hue-slider w-full cursor-pointer appearance-none rounded-full"
              style={
                {
                  "--thumb-color": draft,
                  background: `linear-gradient(to right,
                    hsl(0,${s}%,${l}%),
                    hsl(30,${s}%,${l}%),
                    hsl(60,${s}%,${l}%),
                    hsl(90,${s}%,${l}%),
                    hsl(120,${s}%,${l}%),
                    hsl(150,${s}%,${l}%),
                    hsl(180,${s}%,${l}%),
                    hsl(210,${s}%,${l}%),
                    hsl(240,${s}%,${l}%),
                    hsl(270,${s}%,${l}%),
                    hsl(300,${s}%,${l}%),
                    hsl(330,${s}%,${l}%),
                    hsl(360,${s}%,${l}%))`,
                } as React.CSSProperties
              }
              aria-label={`Hue: ${h} degrees`}
            />
          </div>

          {/* Saturation */}
          <div>
            <Label htmlFor="sat-slider" className="mb-1 block text-xs">
              Saturation — {s}%
            </Label>
            <input
              id="sat-slider"
              type="range"
              min={0}
              max={100}
              value={s}
              onChange={handleSatChange}
              className="w-full cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, hsl(${h},0%,${l}%), hsl(${h},100%,${l}%))`,
              }}
              aria-label={`Saturation: ${s} percent`}
            />
          </div>

          {/* Lightness */}
          <div>
            <Label htmlFor="light-slider" className="mb-1 block text-xs">
              Lightness — {l}%
            </Label>
            <input
              id="light-slider"
              type="range"
              min={0}
              max={100}
              value={l}
              onChange={handleLightChange}
              className="w-full cursor-pointer appearance-none rounded-full"
              style={{
                background: `linear-gradient(to right, hsl(${h},${s}%,0%), hsl(${h},${s}%,50%), hsl(${h},${s}%,100%))`,
              }}
              aria-label={`Lightness: ${l} percent`}
            />
          </div>
        </div>

        {/* Hex input */}
        <div className="mt-4 flex items-center gap-2">
          <Pipette className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="flex flex-1 items-center gap-2">
            <Label htmlFor="hex-input" className="sr-only">
              Hex color value
            </Label>
            <Input
              id="hex-input"
              value={hexInput}
              onChange={handleHexInputChange}
              onBlur={handleHexBlur}
              maxLength={7}
              spellCheck={false}
              className={cn(
                "h-8 flex-1 font-mono text-xs uppercase",
                !isValidHex(
                  hexInput.startsWith("#") ? hexInput : `#${hexInput}`
                ) && "border-destructive focus-visible:ring-destructive"
              )}
              aria-label="Hex color value"
              placeholder="#000000"
            />
            <span
              className="h-8 w-8 shrink-0 rounded-md border border-border"
              style={{ backgroundColor: draft }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Preset swatches */}
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Presets
          </p>
          <div className="grid grid-cols-8 gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                title={preset.label}
                aria-label={`Select ${preset.label} (${preset.value})`}
                onClick={() => commit(preset.value)}
                className={cn(
                  "h-6 w-6 rounded-md border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  draft.toLowerCase() === preset.value.toLowerCase()
                    ? "border-ring ring-2 ring-ring ring-offset-2"
                    : "border-border"
                )}
                style={{ backgroundColor: preset.value }}
              />
            ))}
          </div>
        </div>

        {/* Range input styles */}
        <style>{`
          input[type="range"] {
            height: 8px;
          }
          input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: white;
            border: 2px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            cursor: pointer;
          }
          input[type="range"]::-moz-range-thumb {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: white;
            border: 2px solid #e2e8f0;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            cursor: pointer;
          }
        `}</style>
      </PopoverContent>
    </Popover>
  );
}