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

function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let r = 0,
    g = 0,
    b = 0;
  const clean = hex.replace("#", "");
  if (clean.length === 6) {
    r = parseInt(clean.slice(0, 2), 16) / 255;
    g = parseInt(clean.slice(2, 4), 16) / 255;
    b = parseInt(clean.slice(4, 6), 16) / 255;
  }
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0,
    s = 0;
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
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
}

/* ─────────────────────────────────────────────
   Preset palette
───────────────────────────────────────────── */

const PRESETS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#6b7280",
  "#0f172a",
  "#ffffff",
  "#f8fafc",
];

/* ─────────────────────────────────────────────
   Sub-components (local Radix wrappers)
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
      className={cn(
        "z-50 w-72 rounded-xl border border-border bg-popover p-4 shadow-xl outline-none",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        "@media (prefers-reduced-motion: reduce) { animation: none !important; }",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

/* ─────────────────────────────────────────────
   Gradient canvas picker
───────────────────────────────────────────── */

interface GradientPickerProps {
  hue: number;
  saturation: number;
  lightness: number;
  onChange: (s: number, l: number) => void;
}

function GradientPicker({
  hue,
  saturation,
  lightness,
  onChange,
}: GradientPickerProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  // Convert HSL → canvas XY
  // Canvas: X = saturation (0→100), Y = inverted lightness (100→0 from top)
  const thumbX = `${saturation}%`;
  const thumbY = `${100 - lightness}%`;

  const pickFromEvent = React.useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const el = canvasRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      onChange(Math.round(x * 100), Math.round((1 - y) * 100));
    },
    [onChange]
  );

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    pickFromEvent(e);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    pickFromEvent(e);
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      ref={canvasRef}
      role="presentation"
      className="relative h-40 w-full cursor-crosshair rounded-lg overflow-hidden select-none touch-none"
      style={{
        background: `
          linear-gradient(to top, #000, transparent),
          linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))
        `,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Thumb */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
        style={{
          left: thumbX,
          top: thumbY,
          backgroundColor: hslToHex(hue, saturation, lightness),
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main ColorPickerPopover
───────────────────────────────────────────── */

export interface ColorPickerPopoverProps {
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
  const [open, setOpen] = React.useState(false);
  const [hex, setHex] = React.useState(value);
  const [hexInput, setHexInput] = React.useState(value);

  // Sync if controlled value changes externally
  React.useEffect(() => {
    setHex(value);
    setHexInput(value);
  }, [value]);

  const { h, s, l } = React.useMemo(() => hexToHsl(hex), [hex]);

  const commit = React.useCallback(
    (newHex: string) => {
      setHex(newHex);
      setHexInput(newHex);
      onChange?.(newHex);
    },
    [onChange]
  );

  /* Gradient canvas handler */
  const handleGradientChange = (newS: number, newL: number) => {
    commit(hslToHex(h, newS, newL));
  };

  /* Hue slider */
  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    commit(hslToHex(Number(e.target.value), s, l));
  };

  /* Hex input */
  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setHexInput(v);
    if (isValidHex(v)) {
      commit(v);
    }
  };

  const handleHexBlur = () => {
    if (!isValidHex(hexInput)) {
      setHexInput(hex);
    }
  };

  /* HSL inputs */
  const handleHslChange = (
    channel: "h" | "s" | "l",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = Math.max(
      0,
      Math.min(channel === "h" ? 360 : 100, Number(e.target.value))
    );
    const nh = channel === "h" ? val : h;
    const ns = channel === "s" ? val : s;
    const nl = channel === "l" ? val : l;
    commit(hslToHex(nh, ns, nl));
  };

  const titleId = React.useId();
  const descId = React.useId();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label={`${label}: ${hex}`}
          className={cn(
            "flex h-9 items-center gap-2 px-3 font-mono text-sm",
            className
          )}
        >
          <span
            aria-hidden="true"
            className="h-5 w-5 flex-shrink-0 rounded-sm border border-border shadow-sm"
            style={{ backgroundColor: hex }}
          />
          <span className="text-muted-foreground">{hex}</span>
          <Pipette aria-hidden="true" className="ml-auto h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        aria-labelledby={titleId}
        aria-describedby={descId}
        className="space-y-4"
      >
        {/* Header */}
        <div>
          <p id={titleId} className="text-sm font-semibold leading-none">
            {label}
          </p>
          <p id={descId} className="mt-1 text-xs text-muted-foreground">
            Pick a color for your theme.
          </p>
        </div>

        {/* Close button */}
        <PopoverPrimitive.Close
          aria-label="Close color picker"
          className="absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </PopoverPrimitive.Close>

        {/* Gradient canvas */}
        <GradientPicker
          hue={h}
          saturation={s}
          lightness={l}
          onChange={handleGradientChange}
        />

        {/* Hue slider */}
        <div className="space-y-1">
          <Label htmlFor="hue-slider" className="text-xs text-muted-foreground">
            Hue
          </Label>
          <input
            id="hue-slider"
            type="range"
            min={0}
            max={360}
            value={h}
            onChange={handleHueChange}
            className="h-3 w-full cursor-pointer appearance-none rounded-full border-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            style={{
              background: `linear-gradient(to right,
                hsl(0,100%,50%), hsl(30,100%,50%), hsl(60,100%,50%),
                hsl(90,100%,50%), hsl(120,100%,50%), hsl(150,100%,50%),
                hsl(180,100%,50%), hsl(210,100%,50%), hsl(240,100%,50%),
                hsl(270,100%,50%), hsl(300,100%,50%), hsl(330,100%,50%),
                hsl(360,100%,50%))`,
            }}
          />
        </div>

        {/* Hex + HSL inputs */}
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-2 space-y-1">
            <Label htmlFor="hex-input" className="text-xs text-muted-foreground">
              Hex
            </Label>
            <Input
              id="hex-input"
              value={hexInput}
              onChange={handleHexInput}
              onBlur={handleHexBlur}
              maxLength={7}
              className="h-8 font-mono text-xs"
              spellCheck={false}
            />
          </div>
          {(["H", "S", "L"] as const).map((ch) => (
            <div key={ch} className="space-y-1">
              <Label
                htmlFor={`${ch.toLowerCase()}-input`}
                className="text-xs text-muted-foreground"
              >
                {ch}
              </Label>
              <Input
                id={`${ch.toLowerCase()}-input`}
                type="number"
                min={0}
                max={ch === "H" ? 360 : 100}
                value={ch === "H" ? h : ch === "S" ? s : l}
                onChange={(e) =>
                  handleHslChange(ch.toLowerCase() as "h" | "s" | "l", e)
                }
                className="h-8 text-xs"
              />
            </div>
          ))}
        </div>

        {/* Preset swatches */}
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground">Presets</p>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-label={`Select color ${preset}`}
                aria-pressed={hex.toLowerCase() === preset.toLowerCase()}
                onClick={() => commit(preset)}
                className={cn(
                  "h-6 w-6 rounded-md border shadow-sm transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  hex.toLowerCase() === preset.toLowerCase()
                    ? "ring-2 ring-ring ring-offset-1"
                    : "border-border"
                )}
                style={{ backgroundColor: preset }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="flex items-center gap-3 rounded-lg border border-border p-2">
          <div
            aria-hidden="true"
            className="h-8 w-8 flex-shrink-0 rounded-md border border-border shadow-inner"
            style={{ backgroundColor: hex }}
          />
          <div className="min-w-0">
            <p className="truncate font-mono text-xs font-medium">{hex}</p>
            <p className="text-xs text-muted-foreground">
              hsl({h}, {s}%, {l}%)
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}