"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, Smartphone, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/* ─────────────────────────────────────────────
   Minimal Sheet built from Radix Dialog primitives
───────────────────────────────────────────── */

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetPortal = DialogPrimitive.Portal;
const SheetClose = DialogPrimitive.Close;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: "top" | "right" | "bottom" | "left";
    showCloseButton?: boolean;
  }
>(({ className, children, side = "right", showCloseButton = true, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 flex flex-col bg-white shadow-xl transition ease-in-out",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        side === "right" && [
          "inset-y-0 right-0 h-full w-full max-w-md",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        ],
        side === "left" && [
          "inset-y-0 left-0 h-full w-full max-w-md",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        ],
        side === "top" && [
          "inset-x-0 top-0 w-full",
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        ],
        side === "bottom" && [
          "inset-x-0 bottom-0 w-full",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        ],
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </SheetClose>
      )}
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 px-6 pt-6 pb-4 border-b", className)} {...props} />
);

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-gray-900", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-end gap-3 px-6 py-4 border-t mt-auto", className)}
    {...props}
  />
);

/* ─────────────────────────────────────────────
   Notification preference types & defaults
───────────────────────────────────────────── */

type Channel = "email" | "push" | "sms" | "inApp";
type Frequency = "realtime" | "daily" | "weekly" | "never";

interface NotificationCategory {
  id: string;
  label: string;
  description: string;
  channels: Record<Channel, boolean>;
}

interface NotificationPreferences {
  categories: NotificationCategory[];
  globalFrequency: Frequency;
  doNotDisturb: boolean;
  doNotDisturbStart: string;
  doNotDisturbEnd: string;
}

const defaultPreferences: NotificationPreferences = {
  globalFrequency: "realtime",
  doNotDisturb: false,
  doNotDisturbStart: "22:00",
  doNotDisturbEnd: "08:00",
  categories: [
    {
      id: "account",
      label: "Account activity",
      description: "Sign-ins, password changes, and security alerts",
      channels: { email: true, push: true, sms: false, inApp: true },
    },
    {
      id: "updates",
      label: "Product updates",
      description: "New features, improvements, and release notes",
      channels: { email: true, push: false, sms: false, inApp: true },
    },
    {
      id: "messages",
      label: "Messages",
      description: "Direct messages and mentions from teammates",
      channels: { email: false, push: true, sms: false, inApp: true },
    },
    {
      id: "reminders",
      label: "Reminders",
      description: "Scheduled tasks, deadlines, and follow-ups",
      channels: { email: true, push: true, sms: true, inApp: true },
    },
    {
      id: "marketing",
      label: "Tips & promotions",
      description: "Tutorials, offers, and newsletter content",
      channels: { email: false, push: false, sms: false, inApp: false },
    },
  ],
};

const channelMeta: { id: Channel; label: string; icon: React.ElementType }[] = [
  { id: "email", label: "Email", icon: Mail },
  { id: "push", label: "Push", icon: Bell },
  { id: "sms", label: "SMS", icon: Smartphone },
  { id: "inApp", label: "In-app", icon: MessageSquare },
];

const frequencyOptions: { value: Frequency; label: string }[] = [
  { value: "realtime", label: "Real-time" },
  { value: "daily", label: "Daily digest" },
  { value: "weekly", label: "Weekly digest" },
  { value: "never", label: "Never" },
];

/* ─────────────────────────────────────────────
   Toggle switch component
───────────────────────────────────────────── */

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  label?: string;
  disabled?: boolean;
}

function Toggle({ checked, onChange, id, label, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-gray-900" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm ring-0 transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(
    () => JSON.parse(JSON.stringify(defaultPreferences))
  );
  const [saved, setSaved] = React.useState(false);

  function handleChannelToggle(categoryId: string, channel: Channel, value: boolean) {
    setPrefs((prev) => ({
      ...prev,
      categories: prev.categories.map((cat) =>
        cat.id === categoryId
          ? { ...cat, channels: { ...cat.channels, [channel]: value } }
          : cat
      ),
    }));
  }

  function handleFrequencyChange(value: Frequency) {
    setPrefs((prev) => ({ ...prev, globalFrequency: value }));
  }

  function handleDndToggle(value: boolean) {
    setPrefs((prev) => ({ ...prev, doNotDisturb: value }));
  }

  function handleTimeChange(field: "doNotDisturbStart" | "doNotDisturbEnd", value: string) {
    setPrefs((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    // In a real app, persist to API here
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    setPrefs(JSON.parse(JSON.stringify(defaultPreferences)));
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notification settings
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="overflow-y-auto duration-300">
        <SheetHeader>
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Choose how and when you want to receive notifications for each category.
          </SheetDescription>
        </SheetHeader>

        <form
          className="flex flex-col gap-8 px-6 py-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          {/* Global frequency */}
          <section aria-labelledby="section-frequency">
            <h3
              id="section-frequency"
              className="text-sm font-semibold text-gray-900 mb-3"
            >
              Delivery frequency
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {frequencyOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer text-sm transition-colors",
                    prefs.globalFrequency === opt.value
                      ? "border-gray-900 bg-gray-50 font-medium text-gray-900"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  )}
                >
                  <input
                    type="radio"
                    name="globalFrequency"
                    value={opt.value}
                    checked={prefs.globalFrequency === opt.value}
                    onChange={() => handleFrequencyChange(opt.value)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "h-3.5 w-3.5 rounded-full border-2 shrink-0",
                      prefs.globalFrequency === opt.value
                        ? "border-gray-900 bg-gray-900"
                        : "border-gray-300 bg-white"
                    )}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </section>

          {/* Do not disturb */}
          <section aria-labelledby="section-dnd">
            <h3
              id="section-dnd"
              className="text-sm font-semibold text-gray-900 mb-3"
            >
              Do not disturb
            </h3>
            <div className="rounded-lg border border-gray-200 divide-y divide-gray-100">
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <Label htmlFor="dnd-toggle" className="text-sm font-medium text-gray-800">
                    Enable quiet hours
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Suppress all notifications during the set window.
                  </p>
                </div>
                <Toggle
                  id="dnd-toggle"
                  checked={prefs.doNotDisturb}
                  onChange={handleDndToggle}
                  label="Enable quiet hours"
                />
              </div>

              {prefs.doNotDisturb && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="flex flex-col gap-1 flex-1">
                    <Label htmlFor="dnd-start" className="text-xs text-gray-500">
                      Start
                    </Label>
                    <input
                      id="dnd-start"
                      type="time"
                      value={prefs.doNotDisturbStart}
                      onChange={(e) => handleTimeChange("doNotDisturbStart", e.target.value)}
                      className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>
                  <span className="text-gray-400 mt-5 text-xs">to</span>
                  <div className="flex flex-col gap-1 flex-1">
                    <Label htmlFor="dnd-end" className="text-xs text-gray-500">
                      End
                    </Label>
                    <input
                      id="dnd-end"
                      type="time"
                      value={prefs.doNotDisturbEnd}
                      onChange={(e) => handleTimeChange("doNotDisturbEnd", e.target.value)}
                      className="rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Per-category channel toggles */}
          <section aria-labelledby="section-categories">
            <h3
              id="section-categories"
              className="text-sm font-semibold text-gray-900 mb-1"
            >
              Notification categories
            </h3>
            <p className="text-xs text-gray-500 mb-3">
              Toggle individual channels for each notification type.
            </p>

            {/* Channel header row */}
            <div className="hidden sm:grid grid-cols-[1fr_repeat(4,_2.5rem)] gap-2 px-4 mb-1">
              <span />
              {channelMeta.map((ch) => {
                const Icon = ch.icon;
                return (
                  <div
                    key={ch.id}
                    className="flex flex-col items-center gap-0.5"
                    aria-label={ch.label}
                  >
                    <Icon className="h-3.5 w-3.5 text-gray-400" />
                    <span className="text-[10px] text-gray-400">{ch.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="rounded-lg border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {prefs.categories.map((cat) => (
                <div key={cat.id} className="px-4 py-3">
                  <div className="sm:grid sm:grid-cols-[1fr_repeat(4,_2.5rem)] sm:items-center sm:gap-2">
                    <div className="mb-2 sm:mb-0">
                      <p className="text-sm font-medium text-gray-800">{cat.label}</p>
                      <p className="text-xs text-gray-500">{cat.description}</p>
                    </div>
                    <div className="flex gap-4 sm:contents">
                      {channelMeta.map((ch) => {
                        const Icon = ch.icon;
                        return (
                          <div
                            key={ch.id}
                            className="flex sm:flex-col sm:items-center gap-1.5 sm:gap-0.5 items-center"
                          >
                            {/* Mobile label */}
                            <span className="sm:hidden text-xs text-gray-500 flex items-center gap-1">
                              <Icon className="h-3 w-3" />
                              {ch.label}
                            </span>
                            <Toggle
                              checked={cat.channels[ch.id]}
                              onChange={(val) => handleChannelToggle(cat.id, ch.id, val)}
                              label={`${cat.label} — ${ch.label}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Save feedback */}
          {saved && (
            <div
              role="status"
              aria-live="polite"
              className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-4 py-2.5 text-sm text-green-800"
            >
              <AlertCircle className="h-4 w-4 shrink-0 text-green-600" />
              Preferences saved successfully.
            </div>
          )}
        </form>

        <SheetFooter>
          <Button
            type="button"
            variant="ghost"
            className="text-gray-600"
            onClick={handleReset}
          >
            Reset to defaults
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <Button type="button" onClick={handleSave}>
            Save preferences
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}