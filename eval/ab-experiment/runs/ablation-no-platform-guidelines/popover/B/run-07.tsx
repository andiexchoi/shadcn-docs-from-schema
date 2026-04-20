"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Pipette, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────── helpers ─────────────────────────── */

function hexToHsv(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, max === 0 ? 0 : d / max, max];
}

function hsvToHex(h: number, s: number, v: number): string {
  h = h / 360;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return (
    "#" +
    [r, g, b]
      .map((c) => Math.round(c * 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

function isValidHex(value: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(value);
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

const SWATCHES = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#ffffff", "#d1d5db", "#6b7280", "#374151",
  "#111827", "#000000", "#fef3c7", "#ecfdf5",
];

/* ─────────────────────────── sub-components ──────────────────── */

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
      role="dialog"
      className={cn(
        "z-50 w-72 rounded-xl border border-neutral-200 bg-white p-4 shadow-xl outline-none",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "@media (prefers-reduced-motion: reduce) { animation: none }",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

/* ─────────────────────────── gradient canvas ─────────────────── */

interface GradientPickerProps {
  hue: number;
  saturation: number;
  value: number;
  onChange: (s: number, v: number) => void;
}

function GradientPicker({ hue, saturation, value, onChange }: GradientPickerProps) {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const updateFromEvent = React.useCallback(
    (clientX: number, clientY: number) => {
      const el = canvasRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const v = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
      onChange(s, v);
    },
    [onChange]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromEvent(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updateFromEvent(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const thumbX = `${saturation * 100}%`;
  const thumbY = `${(1 - value) * 100}%`;

  return (
    <div
      ref={canvasRef}
      className="relative h-36 w-full cursor-crosshair rounded-lg select-none touch-none overflow-hidden"
      style={{
        background: `linear-gradient(to top, #000, transparent),
                     linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%))`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
        style={{
          left: thumbX,
          top: thumbY,
          backgroundColor: hsvToHex(hue, saturation, value),
        }}
      />
    </div>
  );
}

/* ─────────────────────────── hue slider ──────────────────────── */

interface HueSliderProps {
  hue: number;
  onChange: (hue: number) => void;
}

function HueSlider({ hue, onChange }: HueSliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const updateFromEvent = React.useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onChange(ratio * 360);
    },
    [onChange]
  );

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateFromEvent(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updateFromEvent(e.clientX);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  return (
    <div
      ref={trackRef}
      className="relative h-3 w-full cursor-pointer rounded-full select-none touch-none"
      style={{
        background:
          "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-md"
        style={{
          left: `${(hue / 360) * 100}%`,
          backgroundColor: `hsl(${hue}, 100%, 50%)`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────── main component ──────────────────── */

export interface ColorPickerPopoverProps {
  value?: string;
  onChange?: (color: string) => void;
  label?: string;
  id?: string;
}

export function ColorPickerPopover({
  value = "#3b82f6",
  onChange,
  label = "Color",
  id = "color-picker",
}: ColorPickerPopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [hex, setHex] = React.useState(isValidHex(value) ? value : "#3b82f6");
  const [hexInput, setHexInput] = React.useState(hex.toUpperCase());

  const [hsv, setHsv] = React.useState<[number, number, number]>(() =>
    hexToHsv(hex)
  );

  /* sync external value */
  React.useEffect(() => {
    if (isValidHex(value) && value.toLowerCase() !== hex.toLowerCase()) {
      setHex(value);
      setHexInput(value.toUpperCase());
      setHsv(hexToHsv(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const applyHex = React.useCallback(
    (newHex: string) => {
      setHex(newHex);
      setHexInput(newHex.toUpperCase());
      setHsv(hexToHsv(newHex));
      onChange?.(newHex);
    },
    [onChange]
  );

  const handleGradientChange = (s: number, v: number) => {
    const newHex = hsvToHex(hsv[0], s, v);
    setHsv([hsv[0], s, v]);
    setHex(newHex);
    setHexInput(newHex.toUpperCase());
    onChange?.(newHex);
  };

  const handleHueChange = (h: number) => {
    const newHex = hsvToHex(h, hsv[1], hsv[2]);
    setHsv([h, hsv[1], hsv[2]]);
    setHex(newHex);
    setHexInput(newHex.toUpperCase());
    onChange?.(newHex);
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setHexInput(raw);
    const normalized = raw.startsWith("#") ? raw : `#${raw}`;
    if (isValidHex(normalized)) {
      applyHex(normalized);
    }
  };

  const handleHexInputBlur = () => {
    if (!isValidHex(hexInput) && !isValidHex(`#${hexInput}`)) {
      setHexInput(hex.toUpperCase());
    }
  };

  const [r, g, b] = hexToRgb(hex);
  const titleId = `${id}-title`;
  const descId = `${id}-desc`;

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={`${id}-trigger`}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={`${id}-trigger`}
            variant="outline"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-label={`${label}: ${hex}`}
            className="flex h-10 w-48 items-center justify-between gap-2 px-3"
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-5 w-5 rounded-md border border-neutral-200 shadow-sm"
                style={{ backgroundColor: hex }}
                aria-hidden="true"
              />
              <span className="font-mono text-sm">{hex.toUpperCase()}</span>
            </span>
            <ChevronDown className="h-4 w-4 text-neutral-500" aria-hidden="true" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="flex flex-col gap-4"
        >
          {/* header */}
          <div>
            <h2
              id={titleId}
              className="text-sm font-semibold leading-none text-neutral-900"
            >
              {label}
            </h2>
            <p
              id={descId}
              className="mt-1 text-xs text-neutral-500"
            >
              Pick a color for your theme.
            </p>
          </div>

          {/* gradient canvas */}
          <GradientPicker
            hue={hsv[0]}
            saturation={hsv[1]}
            value={hsv[2]}
            onChange={handleGradientChange}
          />

          {/* hue slider */}
          <div className="flex items-center gap-2">
            <Pipette className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden="true" />
            <HueSlider hue={hsv[0]} onChange={handleHueChange} />
          </div>

          {/* hex + rgb inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor={`${id}-hex`} className="text-xs text-neutral-500">
                Hex
              </Label>
              <Input
                id={`${id}-hex`}
                value={hexInput}
                onChange={handleHexInputChange}
                onBlur={handleHexInputBlur}
                maxLength={7}
                className="h-8 font-mono text-xs"
                spellCheck={false}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-xs text-neutral-500">RGB</Label>
              <div className="flex h-8 items-center rounded-md border border-neutral-200 bg-neutral-50 px-2">
                <span className="font-mono text-xs text-neutral-600 select-all">
                  {r}, {g}, {b}
                </span>
              </div>
            </div>
          </div>

          {/* swatches */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-neutral-500">Swatches</span>
            <div className="grid grid-cols-8 gap-1.5">
              {SWATCHES.map((swatch) => (
                <button
                  key={swatch}
                  type="button"
                  aria-label={`Select ${swatch}`}
                  onClick={() => applyHex(swatch)}
                  className={cn(
                    "h-6 w-6 rounded-md border transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    hex.toLowerCase() === swatch.toLowerCase()
                      ? "border-blue-500 ring-2 ring-blue-500 ring-offset-1"
                      : "border-neutral-200"
                  )}
                  style={{ backgroundColor: swatch }}
                />
              ))}
            </div>
          </div>

          {/* preview */}
          <div
            className="h-8 w-full rounded-lg border border-neutral-200 shadow-inner transition-colors"
            style={{ backgroundColor: hex }}
            aria-label={`Color preview: ${hex}`}
            role="img"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}