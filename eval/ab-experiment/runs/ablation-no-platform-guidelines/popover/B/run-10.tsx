"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, Check, X } from "lucide-react";
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
  { label: "Blue", value: "#3b82f6" },
  { label: "Indigo", value: "#6366f1" },
  { label: "Violet", value: "#8b5cf6" },
  { label: "Purple", value: "#a855f7" },
  { label: "Pink", value: "#ec4899" },
  { label: "Rose", value: "#f43f5e" },
  { label: "White", value: "#ffffff" },
  { label: "Gray", value: "#6b7280" },
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

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#000000";
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
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
  const [rgbInputs, setRgbInputs] = React.useState(() => {
    const rgb = hexToRgb(value);
    return rgb ? { r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) } : { r: "99", g: "102", b: "241" };
  });

  const titleId = React.useId();
  const descId = React.useId();

  React.useEffect(() => {
    if (isValidHex(value)) {
      setInternalColor(value);
      setHexInput(value);
      const rgb = hexToRgb(value);
      if (rgb) setRgbInputs({ r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) });
    }
  }, [value]);

  const applyColor = React.useCallback(
    (hex: string) => {
      if (!isValidHex(hex)) return;
      setInternalColor(hex);
      setHexInput(hex);
      const rgb = hexToRgb(hex);
      if (rgb) setRgbInputs({ r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) });
      onChange?.(hex);
    },
    [onChange]
  );

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      setInternalColor(normalized);
      const rgb = hexToRgb(normalized);
      if (rgb) setRgbInputs({ r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) });
    }
  };

  const handleHexCommit = () => {
    const normalized = hexInput.startsWith("#") ? hexInput : `#${hexInput}`;
    if (isValidHex(normalized)) {
      applyColor(normalized);
    } else {
      setHexInput(internalColor);
    }
  };

  const handleRgbChange = (channel: "r" | "g" | "b", raw: string) => {
    setRgbInputs((prev) => ({ ...prev, [channel]: raw }));
    const num = parseInt(raw, 10);
    if (!isNaN(num) && num >= 0 && num <= 255) {
      const current = hexToRgb(internalColor) ?? { r: 0, g: 0, b: 0 };
      const updated = { ...current, [channel]: num };
      const hex = rgbToHex(updated.r, updated.g, updated.b);
      setInternalColor(hex);
      setHexInput(hex);
    }
  };

  const handleRgbCommit = () => {
    const r = Math.max(0, Math.min(255, parseInt(rgbInputs.r, 10) || 0));
    const g = Math.max(0, Math.min(255, parseInt(rgbInputs.g, 10) || 0));
    const b = Math.max(0, Math.min(255, parseInt(rgbInputs.b, 10) || 0));
    const hex = rgbToHex(r, g, b);
    applyColor(hex);
    setRgbInputs({ r: String(r), g: String(g), b: String(b) });
  };

  const contrastColor = getContrastColor(internalColor);

  return (
    <div className="flex items-center gap-3">
      <Label className="text-sm font-medium text-foreground shrink-0">{label}</Label>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild disabled={disabled}>
          <button
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={`Pick ${label.toLowerCase()} color, current value ${internalColor}`}
            className={cn(
              "flex items-center gap-2 rounded-md border border-input px-3 py-2 text-sm shadow-sm transition-colors",
              "hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <span
              className="inline-block h-5 w-5 rounded-sm border border-black/10 shadow-inner shrink-0"
              style={{ backgroundColor: internalColor }}
              aria-hidden="true"
            />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {internalColor}
            </span>
            <Pipette className="ml-1 h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            role="dialog"
            aria-labelledby={titleId}
            aria-describedby={descId}
            align="start"
            sideOffset={8}
            className={cn(
              "z-50 w-72 rounded-xl border border-border bg-popover p-0 text-popover-foreground shadow-xl",
              "data-[state=open]:animate-in data-[state=closed]:animate-out",
              "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
              "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
              <div>
                <p id={titleId} className="text-sm font-semibold leading-none">
                  Color picker
                </p>
                <p id={descId} className="mt-1 text-xs text-muted-foreground">
                  Choose a color for your theme.
                </p>
              </div>
              <PopoverPrimitive.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-md"
                  aria-label="Close color picker"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </PopoverPrimitive.Close>
            </div>

            <div className="p-4 space-y-4">
              {/* Large color preview */}
              <div
                className="relative h-16 w-full rounded-lg border border-black/10 shadow-inner flex items-center justify-center transition-colors duration-150"
                style={{ backgroundColor: internalColor }}
              >
                <span
                  className="text-sm font-mono font-semibold tracking-widest uppercase select-none"
                  style={{ color: contrastColor }}
                >
                  {internalColor}
                </span>
              </div>

              {/* Native color input */}
              <div className="flex items-center gap-2">
                <Label htmlFor="native-color" className="text-xs text-muted-foreground shrink-0">
                  Palette
                </Label>
                <input
                  id="native-color"
                  type="color"
                  value={internalColor}
                  onChange={(e) => {
                    const hex = e.target.value;
                    setInternalColor(hex);
                    setHexInput(hex);
                    const rgb = hexToRgb(hex);
                    if (rgb) setRgbInputs({ r: String(rgb.r), g: String(rgb.g), b: String(rgb.b) });
                    onChange?.(hex);
                  }}
                  className="h-8 w-full cursor-pointer rounded-md border border-input bg-transparent p-0.5"
                  aria-label="Open native color palette"
                />
              </div>

              {/* Hex input */}
              <div className="flex items-center gap-2">
                <Label htmlFor="hex-input" className="text-xs font-medium text-muted-foreground w-8 shrink-0">
                  HEX
                </Label>
                <Input
                  id="hex-input"
                  value={hexInput}
                  onChange={handleHexInputChange}
                  onBlur={handleHexCommit}
                  onKeyDown={(e) => e.key === "Enter" && handleHexCommit()}
                  placeholder="#000000"
                  className="font-mono text-xs h-8"
                  maxLength={7}
                />
              </div>

              {/* RGB inputs */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground w-8 shrink-0">RGB</span>
                {(["r", "g", "b"] as const).map((ch) => (
                  <div key={ch} className="flex flex-col items-center gap-1 flex-1">
                    <Input
                      id={`rgb-${ch}`}
                      value={rgbInputs[ch]}
                      onChange={(e) => handleRgbChange(ch, e.target.value)}
                      onBlur={handleRgbCommit}
                      onKeyDown={(e) => e.key === "Enter" && handleRgbCommit()}
                      className="font-mono text-xs h-8 text-center px-1"
                      maxLength={3}
                      aria-label={`${ch.toUpperCase()} channel`}
                    />
                    <Label htmlFor={`rgb-${ch}`} className="text-[10px] text-muted-foreground uppercase">
                      {ch}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Preset swatches */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted-foreground">Presets</p>
                <div className="grid grid-cols-9 gap-1.5">
                  {PRESET_COLORS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => applyColor(preset.value)}
                      className={cn(
                        "relative h-6 w-6 rounded-md border border-black/10 shadow-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                        internalColor.toLowerCase() === preset.value.toLowerCase() &&
                          "ring-2 ring-ring ring-offset-1"
                      )}
                      style={{ backgroundColor: preset.value }}
                      aria-label={`Select ${preset.label} (${preset.value})`}
                      title={preset.label}
                    >
                      {internalColor.toLowerCase() === preset.value.toLowerCase() && (
                        <Check
                          className="absolute inset-0 m-auto h-3 w-3"
                          style={{ color: getContrastColor(preset.value) }}
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply button */}
              <Button
                className="w-full h-8 text-sm"
                onClick={() => {
                  applyColor(internalColor);
                  setOpen(false);
                }}
              >
                Apply color
              </Button>
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}