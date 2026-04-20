"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  { label: "Slate", value: "#64748b" },
  { label: "Red", value: "#ef4444" },
  { label: "Orange", value: "#f97316" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Yellow", value: "#eab308" },
  { label: "Lime", value: "#84cc16" },
  { label: "Green", value: "#22c55e" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Cyan", value: "#06b6d4" },
  { label: "Sky", value: "#0ea5e9" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Indigo", value: "#6366f1" },
  { label: "Violet", value: "#8b5cf6" },
  { label: "Purple", value: "#a855f7" },
  { label: "Pink", value: "#ec4899" },
  { label: "Rose", value: "#f43f5e" },
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
];

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
      .join("")
  );
}

function isValidHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

interface ColorPickerPopoverProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
  disabled?: boolean;
}

export function ColorPickerPopover({
  value = "#6366f1",
  onChange,
  label = "Color",
  disabled = false,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [internalColor, setInternalColor] = React.useState(value);
  const [hexInput, setHexInput] = React.useState(value);
  const [rgbInput, setRgbInput] = React.useState<{
    r: string;
    g: string;
    b: string;
  }>(() => {
    const rgb = hexToRgb(value);
    return rgb
      ? { r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) }
      : { r: "99", g: "102", b: "241" };
  });

  const titleId = React.useId();
  const descId = React.useId();

  React.useEffect(() => {
    setInternalColor(value);
    setHexInput(value);
    const rgb = hexToRgb(value);
    if (rgb) {
      setRgbInput({ r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) });
    }
  }, [value]);

  const applyColor = React.useCallback(
    (hex: string) => {
      if (!isValidHex(hex)) return;
      setInternalColor(hex);
      setHexInput(hex);
      const rgb = hexToRgb(hex);
      if (rgb) {
        setRgbInput({ r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) });
      }
      onChange?.(hex);
    },
    [onChange]
  );

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      applyColor(normalized);
    }
  };

  const handleHexBlur = () => {
    if (!isValidHex(hexInput)) {
      setHexInput(internalColor);
    }
  };

  const handleRgbChange =
    (channel: "r" | "g" | "b") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setRgbInput((prev) => ({ ...prev, [channel]: val }));
      const updated = { ...rgbInput, [channel]: val };
      const r = parseInt(updated.r);
      const g = parseInt(updated.g);
      const b = parseInt(updated.b);
      if (
        !isNaN(r) &&
        !isNaN(g) &&
        !isNaN(b) &&
        r >= 0 &&
        r <= 255 &&
        g >= 0 &&
        g <= 255 &&
        b >= 0 &&
        b <= 255
      ) {
        const hex = rgbToHex(r, g, b);
        setInternalColor(hex);
        setHexInput(hex);
        onChange?.(hex);
      }
    };

  const handleRgbBlur = (channel: "r" | "g" | "b") => () => {
    const val = parseInt(rgbInput[channel]);
    if (isNaN(val) || val < 0 || val > 255) {
      const rgb = hexToRgb(internalColor);
      if (rgb) {
        setRgbInput({ r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) });
      }
    }
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyColor(e.target.value);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        <button
          aria-label={`Open ${label} color picker`}
          className={cn(
            "flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          <span
            className="inline-block h-5 w-5 rounded-sm border border-black/10 shadow-inner flex-shrink-0"
            style={{ backgroundColor: internalColor }}
            aria-hidden="true"
          />
          <span className="font-mono tracking-wide uppercase">
            {internalColor}
          </span>
          <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" aria-hidden="true" />
        </button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          aria-labelledby={titleId}
          aria-describedby={descId}
          align="start"
          sideOffset={8}
          className={cn(
            "z-50 w-72 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-xl",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            "@media (prefers-reduced-motion: reduce) { animation: none !important; }"
          )}
        >
          {/* Header */}
          <div className="mb-3">
            <p id={titleId} className="text-sm font-semibold leading-none">
              {label}
            </p>
            <p id={descId} className="mt-1 text-xs text-muted-foreground">
              Choose a color using the palette, presets, or enter a value directly.
            </p>
          </div>

          {/* Native color picker */}
          <div className="mb-4 flex items-center justify-center">
            <label className="relative cursor-pointer group">
              <span
                className="block h-24 w-full rounded-lg border border-border shadow-inner cursor-pointer overflow-hidden"
                style={{ backgroundColor: internalColor }}
              >
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="flex items-center gap-1 rounded-md bg-black/30 px-2 py-1 text-xs text-white backdrop-blur-sm">
                    <Pipette className="h-3 w-3" />
                    Pick color
                  </span>
                </span>
              </span>
              <input
                type="color"
                value={internalColor}
                onChange={handleNativeChange}
                className="sr-only"
                aria-label={`${label} color wheel`}
                tabIndex={0}
              />
            </label>
          </div>

          {/* Preset swatches */}
          <div className="mb-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Presets
            </p>
            <div className="grid grid-cols-9 gap-1.5" role="group" aria-label="Preset colors">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  title={preset.label}
                  aria-label={`${preset.label} (${preset.value})`}
                  aria-pressed={internalColor.toLowerCase() === preset.value.toLowerCase()}
                  onClick={() => applyColor(preset.value)}
                  className={cn(
                    "relative h-6 w-6 rounded-md border border-black/10 shadow-sm transition-transform",
                    "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                  )}
                  style={{ backgroundColor: preset.value }}
                >
                  {internalColor.toLowerCase() === preset.value.toLowerCase() && (
                    <Check
                      className={cn(
                        "absolute inset-0 m-auto h-3 w-3",
                        preset.value === "#ffffff" ? "text-black" : "text-white"
                      )}
                      aria-hidden="true"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Hex input */}
          <div className="mb-3">
            <Label htmlFor="hex-input" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Hex
            </Label>
            <div className="mt-1 flex items-center gap-2">
              <span
                className="h-8 w-8 flex-shrink-0 rounded-md border border-border shadow-inner"
                style={{ backgroundColor: internalColor }}
                aria-hidden="true"
              />
              <Input
                id="hex-input"
                value={hexInput}
                onChange={handleHexChange}
                onBlur={handleHexBlur}
                spellCheck={false}
                className="font-mono text-sm h-8 uppercase"
                maxLength={7}
                placeholder="#000000"
              />
            </div>
          </div>

          {/* RGB inputs */}
          <div>
            <p className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
              RGB
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["r", "g", "b"] as const).map((channel) => (
                <div key={channel}>
                  <Label
                    htmlFor={`rgb-${channel}`}
                    className="text-xs text-muted-foreground uppercase"
                  >
                    {channel}
                  </Label>
                  <Input
                    id={`rgb-${channel}`}
                    type="number"
                    min={0}
                    max={255}
                    value={rgbInput[channel]}
                    onChange={handleRgbChange(channel)}
                    onBlur={handleRgbBlur(channel)}
                    className="mt-1 h-8 text-sm font-mono"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="h-6 w-6 rounded-full border border-border shadow-inner"
                style={{ backgroundColor: internalColor }}
                aria-hidden="true"
              />
              <span className="text-xs font-mono text-muted-foreground uppercase">
                {internalColor}
              </span>
            </div>
            <PopoverPrimitive.Close asChild>
              <Button size="sm" variant="default">
                Done
              </Button>
            </PopoverPrimitive.Close>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}