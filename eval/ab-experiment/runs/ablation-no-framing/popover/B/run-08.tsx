"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─── Radix-based Popover wrappers ───────────────────────────────────────── */

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
        "z-50 w-72 rounded-xl border border-zinc-200 bg-white p-4 shadow-xl",
        "outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        "@media (prefers-reduced-motion: reduce) { animation: none !important }",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

const PopoverClose = PopoverPrimitive.Close;

/* ─── Visually hidden utility ─────────────────────────────────────────────── */

function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0"
      style={{ clip: "rect(0,0,0,0)" }}
    >
      {children}
    </span>
  );
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
  "#f43f5e", "#84cc16", "#06b6d4", "#6366f1",
  "#a855f7", "#f59e0b", "#10b981", "#64748b",
];

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

/* ─── Main component ──────────────────────────────────────────────────────── */

interface ColorPickerPopoverProps {
  label?: string;
  value?: string;
  onChange?: (color: string) => void;
  disabled?: boolean;
}

export function ColorPickerPopover({
  label = "Color",
  value = "#3b82f6",
  onChange,
  disabled = false,
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(value);
  const [rgb, setRgb] = React.useState(() => hexToRgb(value) ?? { r: 59, g: 130, b: 246 });

  /* Keep internal state in sync when value prop changes externally */
  React.useEffect(() => {
    const parsed = hexToRgb(value);
    if (parsed) {
      setRgb(parsed);
      setInputValue(value);
    }
  }, [value]);

  const currentHex = isValidHex(inputValue) ? inputValue : rgbToHex(rgb.r, rgb.g, rgb.b);

  function applyHex(hex: string) {
    const parsed = hexToRgb(hex);
    if (!parsed) return;
    setRgb(parsed);
    setInputValue(hex);
    onChange?.(hex);
  }

  function handleHexInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setInputValue(raw);
    if (isValidHex(raw)) {
      const parsed = hexToRgb(raw)!;
      setRgb(parsed);
      onChange?.(raw);
    }
  }

  function handleRgbChange(channel: "r" | "g" | "b", raw: string) {
    const num = Math.max(0, Math.min(255, parseInt(raw, 10) || 0));
    const next = { ...rgb, [channel]: num };
    setRgb(next);
    const hex = rgbToHex(next.r, next.g, next.b);
    setInputValue(hex);
    onChange?.(hex);
  }

  function handleNativeInput(e: React.ChangeEvent<HTMLInputElement>) {
    applyHex(e.target.value);
  }

  const titleId = React.useId();
  const descId = React.useId();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <Label htmlFor={titleId} className="shrink-0 text-sm font-medium text-zinc-700">
          {label}
        </Label>
        <PopoverTrigger asChild>
          <button
            id={titleId}
            disabled={disabled}
            aria-label={`Open color picker for ${label}, current color ${currentHex}`}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg border-2 border-zinc-300 shadow-sm",
              "transition-all hover:scale-105 hover:border-zinc-400 focus-visible:outline-none",
              "focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-50"
            )}
            style={{ backgroundColor: currentHex }}
          >
            <Pipette
              className="h-4 w-4 drop-shadow"
              style={{ color: isLightColor(currentHex) ? "#18181b" : "#fafafa" }}
              aria-hidden
            />
          </button>
        </PopoverTrigger>
        <span className="font-mono text-xs text-zinc-500">{currentHex}</span>
      </div>

      <PopoverContent
        aria-labelledby={titleId + "-title"}
        aria-describedby={descId}
        className="flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p id={titleId + "-title"} className="text-sm font-semibold text-zinc-800">
              {label}
            </p>
            <p id={descId} className="text-xs text-zinc-500">
              Pick a color for your theme.
            </p>
          </div>
          <PopoverClose asChild>
            <button
              aria-label="Close color picker"
              className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </PopoverClose>
        </div>

        {/* Native color swatch */}
        <div className="flex items-center gap-3">
          <div
            className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-zinc-200 shadow-inner"
            style={{ backgroundColor: currentHex }}
          >
            <input
              type="color"
              value={currentHex}
              onChange={handleNativeInput}
              aria-label="Native color picker"
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xs text-zinc-500">Click the swatch to use the native picker.</p>
            <p
              className="font-mono text-lg font-bold tracking-tight"
              style={{ color: currentHex }}
            >
              {currentHex.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Preset palette */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-zinc-400">
            Presets
          </p>
          <div className="grid grid-cols-8 gap-1.5">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => applyHex(color)}
                aria-label={`Select color ${color}`}
                aria-pressed={currentHex.toLowerCase() === color.toLowerCase()}
                className={cn(
                  "h-6 w-6 rounded-md border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1",
                  currentHex.toLowerCase() === color.toLowerCase()
                    ? "border-zinc-700 ring-2 ring-zinc-700 ring-offset-1"
                    : "border-zinc-200"
                )}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Hex input */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="hex-input" className="text-xs font-medium text-zinc-500">
            Hex
          </Label>
          <Input
            id="hex-input"
            value={inputValue}
            onChange={handleHexInput}
            maxLength={7}
            spellCheck={false}
            placeholder="#000000"
            className={cn(
              "font-mono text-sm",
              !isValidHex(inputValue) && "border-red-400 focus-visible:ring-red-400"
            )}
          />
          {!isValidHex(inputValue) && (
            <p role="alert" className="text-xs text-red-500">
              Enter a valid hex color (e.g. #3b82f6).
            </p>
          )}
        </div>

        {/* RGB sliders */}
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-zinc-500">RGB channels</p>
          {(["r", "g", "b"] as const).map((ch) => (
            <div key={ch} className="flex items-center gap-2">
              <span className="w-3 text-xs font-bold uppercase text-zinc-400">{ch}</span>
              <input
                type="range"
                min={0}
                max={255}
                value={rgb[ch]}
                onChange={(e) => handleRgbChange(ch, e.target.value)}
                aria-label={`${ch.toUpperCase()} channel`}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-200 accent-zinc-700"
                style={{
                  accentColor: ch === "r" ? "#ef4444" : ch === "g" ? "#22c55e" : "#3b82f6",
                }}
              />
              <Input
                type="number"
                min={0}
                max={255}
                value={rgb[ch]}
                onChange={(e) => handleRgbChange(ch, e.target.value)}
                aria-label={`${ch.toUpperCase()} value`}
                className="h-7 w-14 px-1.5 text-center font-mono text-xs"
              />
            </div>
          ))}
        </div>

        {/* Apply / Reset footer */}
        <div className="flex gap-2 border-t border-zinc-100 pt-3">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => {
              applyHex(currentHex);
              setOpen(false);
            }}
          >
            Apply
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => applyHex("#3b82f6")}
            className="flex-1"
          >
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ─── Utility ─────────────────────────────────────────────────────────────── */

function isLightColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  // Relative luminance (WCAG)
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5;
}