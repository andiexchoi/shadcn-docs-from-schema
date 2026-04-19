"use client";

import { useState, useId } from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
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
  { label: "Black", value: "#000000" },
  { label: "Gray", value: "#6b7280" },
];

function isValidHex(value: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
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

interface ColorPickerPopoverProps {
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
  const [open, setOpen] = useState(false);
  const [internalColor, setInternalColor] = useState(value);
  const [hexInput, setHexInput] = useState(value);
  const [hexError, setHexError] = useState(false);

  const titleId = useId();
  const descId = useId();

  const activeColor = value ?? internalColor;

  const rgb = hexToRgb(activeColor) ?? { r: 59, g: 130, b: 246 };

  function applyColor(hex: string) {
    const normalized = hex.startsWith("#") ? hex : `#${hex}`;
    setInternalColor(normalized);
    setHexInput(normalized);
    setHexError(false);
    onChange?.(normalized);
  }

  function handleHexChange(raw: string) {
    const input = raw.startsWith("#") ? raw : `#${raw}`;
    setHexInput(raw);
    if (isValidHex(input)) {
      setHexError(false);
      setInternalColor(input);
      onChange?.(input);
    } else {
      setHexError(true);
    }
  }

  function handleChannelChange(
    channel: "r" | "g" | "b",
    rawVal: string
  ) {
    const num = Math.max(0, Math.min(255, parseInt(rawVal, 10) || 0));
    const updated = { ...rgb, [channel]: num };
    const hex = rgbToHex(updated.r, updated.g, updated.b);
    applyColor(hex);
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>

      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 px-3 py-1.5 h-9"
            aria-label={`Pick ${label}: currently ${activeColor}`}
          >
            <span
              className="inline-block h-5 w-5 rounded-sm border border-border shadow-sm"
              style={{ backgroundColor: activeColor }}
              aria-hidden="true"
            />
            <span className="font-mono text-xs">{activeColor}</span>
            <Pipette className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          </Button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            side="bottom"
            align="start"
            sideOffset={8}
            aria-labelledby={titleId}
            aria-describedby={descId}
            className={cn(
              "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "@media (prefers-reduced-motion: reduce) { animation: none !important; }"
            )}
          >
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p id={titleId} className="text-sm font-semibold text-foreground">
                  Color picker
                </p>
                <p id={descId} className="text-xs text-muted-foreground">
                  Choose a color for your theme.
                </p>
              </div>
              <PopoverPrimitive.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  aria-label="Close color picker"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </PopoverPrimitive.Close>
            </div>

            {/* Native color input */}
            <div className="mb-4">
              <Label htmlFor="native-color" className="sr-only">
                Color canvas
              </Label>
              <div
                className="relative h-36 w-full overflow-hidden rounded-lg border border-border"
                style={{ backgroundColor: activeColor }}
              >
                <input
                  id="native-color"
                  type="color"
                  value={activeColor}
                  onChange={(e) => applyColor(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Color canvas — click to open system color picker"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="rounded-md bg-black/30 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                    Click to open picker
                  </span>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="mb-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">Presets</p>
              <div className="flex flex-wrap gap-1.5" role="listbox" aria-label="Color presets">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.value}
                    role="option"
                    aria-selected={activeColor.toLowerCase() === preset.value.toLowerCase()}
                    aria-label={preset.label}
                    title={preset.label}
                    onClick={() => applyColor(preset.value)}
                    className={cn(
                      "h-6 w-6 rounded-md border transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring",
                      activeColor.toLowerCase() === preset.value.toLowerCase()
                        ? "border-foreground ring-2 ring-foreground ring-offset-1"
                        : "border-border"
                    )}
                    style={{ backgroundColor: preset.value }}
                  />
                ))}
              </div>
            </div>

            {/* Hex input */}
            <div className="mb-4">
              <Label htmlFor="hex-input" className="mb-1 block text-xs font-medium text-muted-foreground">
                Hex
              </Label>
              <Input
                id="hex-input"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#000000"
                className={cn(
                  "font-mono text-sm h-8",
                  hexError && "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={hexError}
                aria-describedby={hexError ? "hex-error" : undefined}
                maxLength={7}
              />
              {hexError && (
                <p id="hex-error" className="mt-1 text-xs text-destructive">
                  Enter a valid hex color (e.g. #3b82f6).
                </p>
              )}
            </div>

            {/* RGB inputs */}
            <div>
              <p className="mb-1 text-xs font-medium text-muted-foreground">RGB</p>
              <div className="grid grid-cols-3 gap-2">
                {(["r", "g", "b"] as const).map((channel) => (
                  <div key={channel}>
                    <Label
                      htmlFor={`channel-${channel}`}
                      className="mb-0.5 block text-center text-xs text-muted-foreground uppercase"
                    >
                      {channel}
                    </Label>
                    <Input
                      id={`channel-${channel}`}
                      type="number"
                      min={0}
                      max={255}
                      value={rgb[channel]}
                      onChange={(e) => handleChannelChange(channel, e.target.value)}
                      className="h-8 text-center text-sm font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}