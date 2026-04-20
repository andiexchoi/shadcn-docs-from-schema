"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─── Tiny visually-hidden helper ─────────────────────────────────────────── */
const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <span
    style={{
      position: "absolute",
      width: 1,
      height: 1,
      padding: 0,
      margin: -1,
      overflow: "hidden",
      clip: "rect(0,0,0,0)",
      whiteSpace: "nowrap",
      borderWidth: 0,
    }}
  >
    {children}
  </span>
);

/* ─── Popover primitives ───────────────────────────────────────────────────── */
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
        "z-50 w-80 rounded-xl border border-neutral-200 bg-white p-0 shadow-xl outline-none",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        "@media (prefers-reduced-motion: reduce) { animation: none !important; }",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

/* ─── Preset swatches ──────────────────────────────────────────────────────── */
const PRESETS: { label: string; value: string }[] = [
  { label: "Slate", value: "#64748b" },
  { label: "Red", value: "#ef4444" },
  { label: "Orange", value: "#f97316" },
  { label: "Amber", value: "#f59e0b" },
  { label: "Emerald", value: "#10b981" },
  { label: "Teal", value: "#14b8a6" },
  { label: "Sky", value: "#0ea5e9" },
  { label: "Violet", value: "#8b5cf6" },
  { label: "Pink", value: "#ec4899" },
  { label: "Rose", value: "#f43f5e" },
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#000000" },
];

/* ─── Helpers ──────────────────────────────────────────────────────────────── */
function isValidHex(value: string) {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const shorthand = /^#([a-f\d])([a-f\d])([a-f\d])$/i;
  const full = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const s = hex.replace(shorthand, (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`);
  const result = full.exec(s);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
      .join("")
  );
}

function perceivedLightness(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return 1;
  return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
}

/* ─── Main component ───────────────────────────────────────────────────────── */
export interface ColorPickerPopoverProps {
  /** Controlled color value (hex, e.g. "#3b82f6") */
  value?: string;
  /** Default color when uncontrolled */
  defaultValue?: string;
  /** Called whenever the selected color changes */
  onChange?: (color: string) => void;
  /** Label shown on the trigger button */
  label?: string;
  /** Optional className on the trigger button */
  className?: string;
  /** Whether the picker is disabled */
  disabled?: boolean;
}

export function ColorPickerPopover({
  value,
  defaultValue = "#3b82f6",
  onChange,
  label = "Color",
  className,
  disabled = false,
}: ColorPickerPopoverProps) {
  const isControlled = value !== undefined;

  const [internalColor, setInternalColor] = React.useState(defaultValue);
  const activeColor = isControlled ? value! : internalColor;

  const [hexInput, setHexInput] = React.useState(activeColor);
  const [rgbInputs, setRgbInputs] = React.useState(() => hexToRgb(activeColor) ?? { r: 0, g: 0, b: 0 });
  const [hexError, setHexError] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  /* Sync derived inputs when active color changes externally */
  React.useEffect(() => {
    setHexInput(activeColor);
    const rgb = hexToRgb(activeColor);
    if (rgb) setRgbInputs(rgb);
    setHexError(false);
  }, [activeColor]);

  const commit = React.useCallback(
    (hex: string) => {
      if (!isControlled) setInternalColor(hex);
      onChange?.(hex);
    },
    [isControlled, onChange]
  );

  /* Native color input change */
  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    commit(e.target.value);
  };

  /* Hex text input */
  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    if (isValidHex(raw)) {
      setHexError(false);
      commit(raw);
    } else {
      setHexError(true);
    }
  };

  /* RGB inputs */
  const handleRgbChange = (channel: "r" | "g" | "b", raw: string) => {
    const num = parseInt(raw, 10);
    const clamped = isNaN(num) ? 0 : Math.max(0, Math.min(255, num));
    const next = { ...rgbInputs, [channel]: clamped };
    setRgbInputs(next);
    const hex = rgbToHex(next.r, next.g, next.b);
    setHexInput(hex);
    setHexError(false);
    commit(hex);
  };

  /* Swatch click */
  const handleSwatch = (hex: string) => {
    commit(hex);
  };

  /* Copy */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeColor);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const lightness = perceivedLightness(activeColor);
  const foreground = lightness > 0.55 ? "#1e293b" : "#ffffff";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-9 gap-2 px-3 font-normal",
            className
          )}
          aria-label={`Open color picker for ${label}`}
        >
          <span
            className="h-4 w-4 rounded-sm border border-black/10 flex-shrink-0"
            style={{ backgroundColor: activeColor }}
            aria-hidden="true"
          />
          <span className="text-sm truncate max-w-[120px]">{activeColor}</span>
          <Pipette className="ml-auto h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent aria-labelledby="cp-title" aria-describedby="cp-desc">
        {/* Header */}
        <div
          className="flex items-center justify-between rounded-t-xl px-4 py-3"
          style={{ backgroundColor: activeColor }}
        >
          <div>
            <p
              id="cp-title"
              className="text-sm font-semibold leading-none"
              style={{ color: foreground }}
            >
              {label}
            </p>
            <p
              id="cp-desc"
              className="mt-1 text-xs opacity-80"
              style={{ color: foreground }}
            >
              Choose a color for your theme.
            </p>
          </div>
          <button
            onClick={handleCopy}
            aria-label="Copy hex color"
            className="rounded-md p-1.5 transition-colors hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {copied ? (
              <Check className="h-4 w-4" style={{ color: foreground }} />
            ) : (
              <Copy className="h-4 w-4" style={{ color: foreground }} />
            )}
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Native color wheel */}
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 flex-shrink-0 rounded-lg overflow-hidden border border-neutral-200 shadow-sm">
              <input
                type="color"
                value={activeColor}
                onChange={handleNativeChange}
                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                aria-label="Native color picker"
              />
              <span
                className="block h-full w-full"
                style={{ backgroundColor: activeColor }}
                aria-hidden="true"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="cp-hex" className="text-xs text-muted-foreground mb-1 block">
                Hex
              </Label>
              <Input
                id="cp-hex"
                value={hexInput}
                onChange={handleHexInputChange}
                spellCheck={false}
                className={cn(
                  "h-8 font-mono text-sm uppercase",
                  hexError && "border-red-500 focus-visible:ring-red-500"
                )}
                aria-invalid={hexError}
                aria-describedby={hexError ? "cp-hex-error" : undefined}
              />
              {hexError && (
                <p id="cp-hex-error" className="mt-1 text-xs text-red-500">
                  Enter a valid hex (e.g. #3b82f6)
                </p>
              )}
            </div>
          </div>

          {/* RGB inputs */}
          <div className="grid grid-cols-3 gap-2">
            {(["r", "g", "b"] as const).map((ch) => (
              <div key={ch}>
                <Label
                  htmlFor={`cp-${ch}`}
                  className="text-xs text-muted-foreground mb-1 block uppercase"
                >
                  {ch}
                </Label>
                <Input
                  id={`cp-${ch}`}
                  type="number"
                  min={0}
                  max={255}
                  value={rgbInputs[ch]}
                  onChange={(e) => handleRgbChange(ch, e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>

          {/* Preset swatches */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Presets</p>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handleSwatch(preset.value)}
                  aria-label={`Select ${preset.label} (${preset.value})`}
                  className={cn(
                    "h-8 w-full rounded-md border transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
                    activeColor.toLowerCase() === preset.value.toLowerCase()
                      ? "border-blue-500 ring-2 ring-blue-500 ring-offset-1"
                      : "border-black/10"
                  )}
                  style={{ backgroundColor: preset.value }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-100 px-4 py-3">
          <span className="text-xs text-muted-foreground font-mono">{activeColor.toUpperCase()}</span>
          <Button
            size="sm"
            className="h-7 text-xs"
            onClick={() => setOpen(false)}
          >
            Done
          </Button>
        </div>

        <VisuallyHidden>
          <PopoverPrimitive.Close />
        </VisuallyHidden>
      </PopoverContent>
    </Popover>
  );
}