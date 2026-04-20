"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, Copy, Check } from "lucide-react";
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
  { label: "Purple", value: "#a855f7" },
  { label: "Pink", value: "#ec4899" },
  { label: "Rose", value: "#f43f5e" },
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
];

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const sanitized = hex.replace("#", "");
  if (sanitized.length !== 6) return null;
  const num = parseInt(sanitized, 16);
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
      .map((v) => v.toString(16).padStart(2, "0"))
      .join("")
  );
}

function isValidHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

interface ColorPickerPopoverProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
}

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  label = "Color",
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [internalColor, setInternalColor] = React.useState(value);
  const [hexInput, setHexInput] = React.useState(value);
  const [rgb, setRgb] = React.useState(() => hexToRgb(value) ?? { r: 59, g: 130, b: 246 });
  const [copied, setCopied] = React.useState(false);
  const titleId = React.useId();
  const descriptionId = React.useId();

  React.useEffect(() => {
    if (isValidHex(value)) {
      setInternalColor(value);
      setHexInput(value);
      setRgb(hexToRgb(value) ?? { r: 0, g: 0, b: 0 });
    }
  }, [value]);

  function applyColor(hex: string) {
    if (!isValidHex(hex)) return;
    setInternalColor(hex);
    setHexInput(hex);
    setRgb(hexToRgb(hex) ?? { r: 0, g: 0, b: 0 });
    onChange?.(hex);
  }

  function handleHexInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    let raw = e.target.value.trim();
    if (!raw.startsWith("#")) raw = "#" + raw;
    setHexInput(raw);
    if (isValidHex(raw)) {
      applyColor(raw);
    }
  }

  function handleNativeColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    applyColor(e.target.value);
  }

  function handleRgbChange(channel: "r" | "g" | "b", raw: string) {
    const num = Math.min(255, Math.max(0, parseInt(raw, 10) || 0));
    const next = { ...rgb, [channel]: num };
    setRgb(next);
    const hex = rgbToHex(next.r, next.g, next.b);
    setInternalColor(hex);
    setHexInput(hex);
    onChange?.(hex);
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(internalColor);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable
    }
  }

  return (
    <div className="inline-flex flex-col gap-1.5">
      <Label htmlFor="color-trigger" className="text-sm font-medium text-foreground">
        {label}
      </Label>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <button
            id="color-trigger"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={`Pick color, current value ${internalColor}`}
            className={cn(
              "flex h-10 items-center gap-2.5 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm",
              "ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
          >
            <span
              className="h-5 w-5 rounded-sm border border-black/10 shadow-inner"
              style={{ backgroundColor: internalColor }}
              aria-hidden="true"
            />
            <span className="font-mono tracking-wide">{internalColor}</span>
            <Pipette className="ml-auto h-4 w-4 text-muted-foreground" aria-hidden="true" />
          </button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            role="dialog"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            align="start"
            sideOffset={8}
            className={cn(
              "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "@media (prefers-reduced-motion: reduce) { animation: none }"
            )}
          >
            {/* Header */}
            <div className="mb-3">
              <h2 id={titleId} className="text-sm font-semibold text-popover-foreground">
                Color picker
              </h2>
              <p id={descriptionId} className="text-xs text-muted-foreground mt-0.5">
                Select a color for your theme.
              </p>
            </div>

            {/* Native color wheel */}
            <div className="mb-4 flex items-center gap-3">
              <label className="relative cursor-pointer" aria-label="Open color wheel">
                <span
                  className="block h-10 w-10 rounded-md border border-input shadow-inner"
                  style={{ backgroundColor: internalColor }}
                  aria-hidden="true"
                />
                <input
                  type="color"
                  value={internalColor}
                  onChange={handleNativeColorChange}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Color wheel"
                />
              </label>
              <div className="flex-1">
                <Label htmlFor="hex-input" className="mb-1 block text-xs text-muted-foreground">
                  Hex
                </Label>
                <div className="relative flex items-center">
                  <Input
                    id="hex-input"
                    value={hexInput}
                    onChange={handleHexInputChange}
                    className="pr-9 font-mono text-sm uppercase"
                    maxLength={7}
                    spellCheck={false}
                    aria-label="Hex color value"
                  />
                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label="Copy hex value"
                    className={cn(
                      "absolute right-2 flex h-5 w-5 items-center justify-center rounded",
                      "text-muted-foreground transition-colors hover:text-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    )}
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-500" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* RGB inputs */}
            <div className="mb-4 grid grid-cols-3 gap-2">
              {(["r", "g", "b"] as const).map((ch) => (
                <div key={ch}>
                  <Label
                    htmlFor={`rgb-${ch}`}
                    className="mb-1 block text-center text-xs uppercase text-muted-foreground"
                  >
                    {ch}
                  </Label>
                  <Input
                    id={`rgb-${ch}`}
                    type="number"
                    min={0}
                    max={255}
                    value={rgb[ch]}
                    onChange={(e) => handleRgbChange(ch, e.target.value)}
                    className="text-center text-sm"
                    aria-label={`${ch.toUpperCase()} channel`}
                  />
                </div>
              ))}
            </div>

            {/* Preset swatches */}
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">Presets</p>
              <div className="flex flex-wrap gap-1.5" role="list" aria-label="Preset colors">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    role="listitem"
                    onClick={() => applyColor(preset.value)}
                    aria-label={`Select ${preset.label} (${preset.value})`}
                    aria-pressed={internalColor.toLowerCase() === preset.value.toLowerCase()}
                    className={cn(
                      "h-6 w-6 rounded-md border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                      internalColor.toLowerCase() === preset.value.toLowerCase()
                        ? "border-foreground ring-2 ring-foreground ring-offset-1"
                        : "border-black/10"
                    )}
                    style={{ backgroundColor: preset.value }}
                  />
                ))}
              </div>
            </div>

            {/* Apply / Close */}
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  applyColor(internalColor);
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