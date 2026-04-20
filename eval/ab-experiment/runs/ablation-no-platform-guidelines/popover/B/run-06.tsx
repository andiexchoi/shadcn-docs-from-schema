"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────── helpers ─────────────────────────── */

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };
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
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
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
  const k = (n: number) => (n + h / 30) % 12;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) =>
    Math.round(255 * (ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));
  return `#${[f(0), f(8), f(4)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function isValidHex(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}

const PRESET_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#ffffff", "#d1d5db", "#6b7280", "#111827",
];

/* ─────────────────────────── sub-components ──────────────────── */

const PopoverHeader = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("mb-3", className)}>{children}</div>
);

const PopoverTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ children, className, id, ...props }, ref) => (
    <h2
      ref={ref}
      id={id}
      className={cn("text-sm font-semibold leading-none tracking-tight text-foreground", className)}
      {...props}
    >
      {children}
    </h2>
  )
);
PopoverTitle.displayName = "PopoverTitle";

const PopoverDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={cn("mt-1 text-xs text-muted-foreground", className)}>{children}</p>
);

/* ─────────────────────────── main component ──────────────────── */

export interface ColorPickerPopoverProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
  align?: "start" | "center" | "end";
}

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  label = "Color",
  align = "start",
}: ColorPickerPopoverProps) {
  const titleId = React.useId();
  const [open, setOpen] = React.useState(false);

  /* internal state mirrors `value` but stays editable while popover is open */
  const [hex, setHex] = React.useState(isValidHex(value) ? value : "#3b82f6");
  const [hexInput, setHexInput] = React.useState(hex);
  const hsl = hexToHsl(hex);
  const [hue, setHue] = React.useState(hsl.h);
  const [sat, setSat] = React.useState(hsl.s);
  const [lit, setLit] = React.useState(hsl.l);

  /* sync external value → internal when popover opens */
  React.useEffect(() => {
    if (open && isValidHex(value)) {
      const { h, s, l } = hexToHsl(value);
      setHex(value);
      setHexInput(value);
      setHue(h);
      setSat(s);
      setLit(l);
    }
  }, [open, value]);

  function commitColor(newHex: string) {
    setHex(newHex);
    setHexInput(newHex);
    const { h, s, l } = hexToHsl(newHex);
    setHue(h);
    setSat(s);
    setLit(l);
    onChange?.(newHex);
  }

  function handleSliderChange(type: "h" | "s" | "l", raw: number) {
    const h2 = type === "h" ? raw : hue;
    const s2 = type === "s" ? raw : sat;
    const l2 = type === "l" ? raw : lit;
    if (type === "h") setHue(raw);
    if (type === "s") setSat(raw);
    if (type === "l") setLit(raw);
    const newHex = hslToHex(h2, s2, l2);
    setHex(newHex);
    setHexInput(newHex);
    onChange?.(newHex);
  }

  function handleHexInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      const { h, s, l } = hexToHsl(normalized);
      setHex(normalized);
      setHue(h);
      setSat(s);
      setLit(l);
      onChange?.(normalized);
    }
  }

  function handleHexInputBlur() {
    if (!isValidHex(hexInput)) {
      setHexInput(hex);
    }
  }

  const swatch = isValidHex(hex) ? hex : "#3b82f6";

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        <PopoverPrimitive.Trigger asChild>
          <Button
            variant="outline"
            aria-haspopup="dialog"
            aria-expanded={open}
            className="flex h-9 w-full items-center gap-2 px-3 font-mono text-xs"
          >
            <span
              className="h-4 w-4 shrink-0 rounded-sm border border-border shadow-sm"
              style={{ backgroundColor: swatch }}
              aria-hidden="true"
            />
            <span className="flex-1 text-left">{swatch}</span>
            <Pipette className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          </Button>
        </PopoverPrimitive.Trigger>

        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
            align={align}
            sideOffset={8}
            role="dialog"
            aria-labelledby={titleId}
            className={cn(
              "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl",
              "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
              "@media (prefers-reduced-motion: reduce) { animation: none }"
            )}
          >
            {/* close button */}
            <PopoverPrimitive.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close color picker"
                className="absolute right-2 top-2 h-6 w-6 rounded-md text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </PopoverPrimitive.Close>

            <PopoverHeader>
              <PopoverTitle id={titleId}>Color picker</PopoverTitle>
              <PopoverDescription>
                Choose a color for your theme using sliders or a hex value.
              </PopoverDescription>
            </PopoverHeader>

            {/* preview swatch */}
            <div
              className="mb-4 h-12 w-full rounded-lg border border-border shadow-inner"
              style={{ backgroundColor: swatch }}
              aria-hidden="true"
            />

            {/* HSL sliders */}
            <div className="space-y-3">
              {/* Hue */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hue-slider" className="text-xs text-muted-foreground">
                    Hue
                  </Label>
                  <span className="text-xs tabular-nums text-muted-foreground">{hue}°</span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(to right, hsl(0,100%,50%), hsl(30,100%,50%), hsl(60,100%,50%), hsl(90,100%,50%), hsl(120,100%,50%), hsl(150,100%,50%), hsl(180,100%,50%), hsl(210,100%,50%), hsl(240,100%,50%), hsl(270,100%,50%), hsl(300,100%,50%), hsl(330,100%,50%), hsl(360,100%,50%))",
                    }}
                    aria-hidden="true"
                  />
                  <input
                    id="hue-slider"
                    type="range"
                    min={0}
                    max={360}
                    value={hue}
                    onChange={(e) => handleSliderChange("h", Number(e.target.value))}
                    className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
                    aria-label="Hue"
                  />
                  {/* thumb */}
                  <div
                    className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
                    style={{
                      left: `${(hue / 360) * 100}%`,
                      backgroundColor: `hsl(${hue}, 100%, 50%)`,
                    }}
                  />
                </div>
              </div>

              {/* Saturation */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sat-slider" className="text-xs text-muted-foreground">
                    Saturation
                  </Label>
                  <span className="text-xs tabular-nums text-muted-foreground">{sat}%</span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `linear-gradient(to right, hsl(${hue}, 0%, ${lit}%), hsl(${hue}, 100%, ${lit}%))`,
                    }}
                    aria-hidden="true"
                  />
                  <input
                    id="sat-slider"
                    type="range"
                    min={0}
                    max={100}
                    value={sat}
                    onChange={(e) => handleSliderChange("s", Number(e.target.value))}
                    className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
                    aria-label="Saturation"
                  />
                  <div
                    className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
                    style={{
                      left: `${sat}%`,
                      backgroundColor: `hsl(${hue}, ${sat}%, ${lit}%)`,
                    }}
                  />
                </div>
              </div>

              {/* Lightness */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="lit-slider" className="text-xs text-muted-foreground">
                    Lightness
                  </Label>
                  <span className="text-xs tabular-nums text-muted-foreground">{lit}%</span>
                </div>
                <div className="relative h-3 w-full overflow-hidden rounded-full">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: `linear-gradient(to right, hsl(${hue}, ${sat}%, 0%), hsl(${hue}, ${sat}%, 50%), hsl(${hue}, ${sat}%, 100%))`,
                    }}
                    aria-hidden="true"
                  />
                  <input
                    id="lit-slider"
                    type="range"
                    min={0}
                    max={100}
                    value={lit}
                    onChange={(e) => handleSliderChange("l", Number(e.target.value))}
                    className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
                    aria-label="Lightness"
                  />
                  <div
                    className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
                    style={{
                      left: `${lit}%`,
                      backgroundColor: `hsl(${hue}, ${sat}%, ${lit}%)`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* hex input */}
            <div className="mt-4 space-y-1.5">
              <Label htmlFor="hex-input" className="text-xs text-muted-foreground">
                Hex value
              </Label>
              <div className="flex items-center gap-2">
                <span
                  className="h-8 w-8 shrink-0 rounded-md border border-border"
                  style={{ backgroundColor: swatch }}
                  aria-hidden="true"
                />
                <Input
                  id="hex-input"
                  value={hexInput}
                  onChange={handleHexInputChange}
                  onBlur={handleHexInputBlur}
                  spellCheck={false}
                  maxLength={7}
                  className="h-8 font-mono text-xs"
                  aria-label="Hex color value"
                />
              </div>
            </div>

            {/* preset swatches */}
            <div className="mt-4 space-y-1.5">
              <p className="text-xs text-muted-foreground">Presets</p>
              <div className="grid grid-cols-6 gap-1.5" role="group" aria-label="Preset colors">
                {PRESET_COLORS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => commitColor(preset)}
                    aria-label={`Select color ${preset}`}
                    aria-pressed={hex.toLowerCase() === preset.toLowerCase()}
                    className={cn(
                      "h-8 w-full rounded-md border border-border transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                      hex.toLowerCase() === preset.toLowerCase() &&
                        "ring-2 ring-ring ring-offset-1"
                    )}
                    style={{ backgroundColor: preset }}
                  />
                ))}
              </div>
            </div>

            <PopoverPrimitive.Arrow className="fill-border" />
          </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
}