"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  { label: "Slate",   value: "#64748b" },
  { label: "Red",     value: "#ef4444" },
  { label: "Orange",  value: "#f97316" },
  { label: "Amber",   value: "#f59e0b" },
  { label: "Yellow",  value: "#eab308" },
  { label: "Lime",    value: "#84cc16" },
  { label: "Green",   value: "#22c55e" },
  { label: "Teal",    value: "#14b8a6" },
  { label: "Cyan",    value: "#06b6d4" },
  { label: "Sky",     value: "#0ea5e9" },
  { label: "Blue",    value: "#3b82f6" },
  { label: "Violet",  value: "#8b5cf6" },
  { label: "Purple",  value: "#a855f7" },
  { label: "Pink",    value: "#ec4899" },
  { label: "Rose",    value: "#f43f5e" },
  { label: "White",   value: "#ffffff" },
  { label: "Gray",    value: "#9ca3af" },
  { label: "Black",   value: "#000000" },
];

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) return null;
  const num = parseInt(cleaned, 16);
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

  const titleId = React.useId();

  React.useEffect(() => {
    setInternalColor(value);
    setHexInput(value);
    setRgb(hexToRgb(value) ?? { r: 59, g: 130, b: 246 });
  }, [value]);

  const applyColor = React.useCallback(
    (hex: string) => {
      if (!isValidHex(hex)) return;
      setInternalColor(hex);
      setHexInput(hex);
      setRgb(hexToRgb(hex) ?? rgb);
      onChange?.(hex);
    },
    [onChange, rgb]
  );

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      applyColor(normalized);
    }
  };

  const handleHexInputBlur = () => {
    const normalized = hexInput.startsWith("#") ? hexInput : `#${hexInput}`;
    if (isValidHex(normalized)) {
      applyColor(normalized);
    } else {
      setHexInput(internalColor);
    }
  };

  const handleRgbChange = (channel: "r" | "g" | "b", raw: string) => {
    const parsed = parseInt(raw, 10);
    const clamped = isNaN(parsed) ? 0 : Math.max(0, Math.min(255, parsed));
    const next = { ...rgb, [channel]: clamped };
    setRgb(next);
    const hex = rgbToHex(next.r, next.g, next.b);
    setInternalColor(hex);
    setHexInput(hex);
    onChange?.(hex);
  };

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyColor(e.target.value);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          variant="outline"
          aria-haspopup="dialog"
          aria-expanded={open}
          className="flex items-center gap-2 h-9 px-3"
        >
          <span
            className="inline-block w-5 h-5 rounded-sm border border-black/10 shadow-sm flex-shrink-0"
            style={{ backgroundColor: internalColor }}
            aria-hidden="true"
          />
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-muted-foreground font-mono">
            {internalColor.toUpperCase()}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
        </Button>
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          role="dialog"
          aria-labelledby={titleId}
          align="start"
          sideOffset={8}
          className={cn(
            "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            "@media (prefers-reduced-motion: reduce) { animation: none }"
          )}
        >
          {/* Header */}
          <div className="mb-4">
            <p id={titleId} className="text-sm font-semibold text-foreground">
              {label} picker
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Choose a color for your theme.
            </p>
          </div>

          {/* Native color wheel */}
          <div className="flex items-center gap-3 mb-4">
            <label className="relative flex-shrink-0 cursor-pointer group" aria-label="Open color wheel">
              <span
                className="block w-12 h-12 rounded-lg border border-border shadow-inner overflow-hidden"
                style={{ backgroundColor: internalColor }}
              >
                <Pipette className="absolute bottom-1 right-1 w-3 h-3 text-white drop-shadow opacity-70 group-hover:opacity-100 transition-opacity" />
              </span>
              <input
                type="color"
                value={internalColor}
                onChange={handleNativeChange}
                className="sr-only"
                tabIndex={-1}
              />
            </label>
            <div className="flex-1 space-y-1">
              <Label htmlFor="hex-input" className="text-xs text-muted-foreground">
                Hex
              </Label>
              <Input
                id="hex-input"
                value={hexInput}
                onChange={handleHexInputChange}
                onBlur={handleHexInputBlur}
                placeholder="#000000"
                className="font-mono text-sm h-8"
                maxLength={7}
                spellCheck={false}
              />
            </div>
          </div>

          {/* RGB sliders */}
          <div className="space-y-3 mb-4">
            {(["r", "g", "b"] as const).map((channel) => {
              const channelLabel = channel.toUpperCase();
              const trackColors: Record<string, string> = {
                r: `linear-gradient(to right, rgb(0,${rgb.g},${rgb.b}), rgb(255,${rgb.g},${rgb.b}))`,
                g: `linear-gradient(to right, rgb(${rgb.r},0,${rgb.b}), rgb(${rgb.r},255,${rgb.b}))`,
                b: `linear-gradient(to right, rgb(${rgb.r},${rgb.g},0), rgb(${rgb.r},${rgb.g},255))`,
              };
              return (
                <div key={channel} className="flex items-center gap-2">
                  <span className="w-4 text-xs font-mono text-muted-foreground select-none">
                    {channelLabel}
                  </span>
                  <div className="relative flex-1 h-3 flex items-center">
                    <div
                      className="absolute inset-0 rounded-full border border-black/10"
                      style={{ background: trackColors[channel] }}
                    />
                    <input
                      type="range"
                      min={0}
                      max={255}
                      value={rgb[channel]}
                      onChange={(e) => handleRgbChange(channel, e.target.value)}
                      aria-label={`${channelLabel} channel`}
                      className="relative w-full h-3 appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-border [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-border [&::-moz-range-thumb]:shadow-md"
                    />
                  </div>
                  <Input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb[channel]}
                    onChange={(e) => handleRgbChange(channel, e.target.value)}
                    aria-label={`${channelLabel} value`}
                    className="w-14 h-7 text-xs font-mono px-1.5"
                  />
                </div>
              );
            })}
          </div>

          {/* Preset swatches */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Presets</p>
            <div className="grid grid-cols-9 gap-1.5">
              {PRESET_COLORS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  title={preset.label}
                  aria-label={`Select ${preset.label} (${preset.value})`}
                  onClick={() => applyColor(preset.value)}
                  className={cn(
                    "w-6 h-6 rounded-md border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                    internalColor.toLowerCase() === preset.value.toLowerCase()
                      ? "border-foreground ring-2 ring-ring ring-offset-1"
                      : "border-black/10"
                  )}
                  style={{ backgroundColor: preset.value }}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <span
                className="w-8 h-8 rounded-md border border-border shadow-inner"
                style={{ backgroundColor: internalColor }}
                aria-hidden="true"
              />
              <span className="text-xs font-mono text-muted-foreground">
                {internalColor.toUpperCase()}
              </span>
            </div>
            <PopoverPrimitive.Close asChild>
              <Button size="sm" variant="default" className="h-8 px-4 text-xs">
                Done
              </Button>
            </PopoverPrimitive.Close>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}