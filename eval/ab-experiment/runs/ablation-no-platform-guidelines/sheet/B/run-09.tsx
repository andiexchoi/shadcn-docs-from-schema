"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Sheet primitives (no components/ui/sheet.tsx installed)
// ---------------------------------------------------------------------------

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
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "transition-all duration-300",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: "left" | "right" | "top" | "bottom";
  showCloseButton?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", showCloseButton = true, className, children, ...props }, ref) => {
  const sideClasses: Record<string, string> = {
    right:
      "inset-y-0 right-0 h-full w-full max-w-md border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
    left: "inset-y-0 left-0 h-full w-full max-w-md border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
    top: "inset-x-0 top-0 w-full border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
    bottom:
      "inset-x-0 bottom-0 w-full border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 flex flex-col bg-background shadow-2xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "duration-300 ease-in-out",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </SheetClose>
        )}
      </DialogPrimitive.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 px-6 py-5 border-b", className)} {...props} />
);

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-end gap-3 px-6 py-4 border-t mt-auto", className)}
    {...props}
  />
);

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-tight text-foreground", className)}
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
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

// ---------------------------------------------------------------------------
// Toggle Switch — no external dependency
// ---------------------------------------------------------------------------

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ id, checked, onCheckedChange, disabled }: ToggleSwitchProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
        "transition-colors duration-200 ease-in-out focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0",
          "transition-transform duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Notification preferences form types and data
// ---------------------------------------------------------------------------

type NotificationChannel = "email" | "push" | "sms" | "inApp";
type NotificationCategory = "marketing" | "security" | "updates" | "reminders" | "digest";

interface NotificationPreferences {
  channels: Record<NotificationChannel, boolean>;
  categories: Record<NotificationCategory, boolean>;
  frequency: "realtime" | "hourly" | "daily" | "weekly";
  doNotDisturb: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  channels: {
    email: true,
    push: true,
    sms: false,
    inApp: true,
  },
  categories: {
    marketing: false,
    security: true,
    updates: true,
    reminders: true,
    digest: false,
  },
  frequency: "realtime",
  doNotDisturb: false,
};

const CHANNEL_CONFIG: {
  key: NotificationChannel;
  label: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    key: "email",
    label: "Email",
    description: "Notifications sent to your inbox",
    icon: <Mail className="h-4 w-4 text-muted-foreground" />,
  },
  {
    key: "push",
    label: "Push notifications",
    description: "Alerts on your browser or device",
    icon: <Bell className="h-4 w-4 text-muted-foreground" />,
  },
  {
    key: "sms",
    label: "SMS",
    description: "Text messages to your phone",
    icon: <Smartphone className="h-4 w-4 text-muted-foreground" />,
  },
  {
    key: "inApp",
    label: "In-app",
    description: "Notifications inside the application",
    icon: <MessageSquare className="h-4 w-4 text-muted-foreground" />,
  },
];

const CATEGORY_CONFIG: {
  key: NotificationCategory;
  label: string;
  description: string;
  sensitive?: boolean;
}[] = [
  {
    key: "security",
    label: "Security alerts",
    description: "Login attempts, password changes, and suspicious activity",
    sensitive: true,
  },
  {
    key: "updates",
    label: "Product updates",
    description: "New features, improvements, and release notes",
  },
  {
    key: "reminders",
    label: "Reminders",
    description: "Upcoming events, deadlines, and tasks",
  },
  {
    key: "digest",
    label: "Weekly digest",
    description: "A summary of your activity each week",
  },
  {
    key: "marketing",
    label: "Marketing & promotions",
    description: "Offers, tips, and product announcements",
  },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [saved, setSaved] = React.useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [saveState, setSaveState] = React.useState<"idle" | "saving" | "saved">("idle");

  const isDirty = JSON.stringify(prefs) !== JSON.stringify(saved);

  function setChannel(key: NotificationChannel, value: boolean) {
    setPrefs((p) => ({ ...p, channels: { ...p.channels, [key]: value } }));
  }

  function setCategory(key: NotificationCategory, value: boolean) {
    setPrefs((p) => ({ ...p, categories: { ...p.categories, [key]: value } }));
  }

  function setFrequency(value: NotificationPreferences["frequency"]) {
    setPrefs((p) => ({ ...p, frequency: value }));
  }

  function handleReset() {
    setPrefs(saved);
  }

  async function handleSave() {
    setSaveState("saving");
    // Simulate async save
    await new Promise((r) => setTimeout(r, 900));
    setSaved(prefs);
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 2000);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notification settings
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col overflow-hidden">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <SheetTitle>Notification preferences</SheetTitle>
          </div>
          <SheetDescription>
            Choose how and when you want to receive notifications.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">
          {/* Do Not Disturb */}
          <section aria-labelledby="dnd-heading">
            <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-4 py-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <div>
                  <p
                    id="dnd-heading"
                    className="text-sm font-medium leading-tight text-foreground"
                  >
                    Do not disturb
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Pause all notifications except security alerts
                  </p>
                </div>
              </div>
              <ToggleSwitch
                id="dnd-toggle"
                checked={prefs.doNotDisturb}
                onCheckedChange={(v) => setPrefs((p) => ({ ...p, doNotDisturb: v }))}
              />
            </div>
          </section>

          {/* Channels */}
          <section aria-labelledby="channels-heading">
            <h3
              id="channels-heading"
              className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Delivery channels
            </h3>
            <div className="divide-y rounded-lg border">
              {CHANNEL_CONFIG.map(({ key, label, description, icon }) => {
                const toggleId = `channel-${key}`;
                return (
                  <div
                    key={key}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 transition-colors",
                      prefs.doNotDisturb && "opacity-60"
                    )}
                  >
                    <Label
                      htmlFor={toggleId}
                      className="flex cursor-pointer items-start gap-3"
                    >
                      <span className="mt-0.5 shrink-0">{icon}</span>
                      <span>
                        <span className="block text-sm font-medium leading-tight text-foreground">
                          {label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {description}
                        </span>
                      </span>
                    </Label>
                    <ToggleSwitch
                      id={toggleId}
                      checked={prefs.channels[key]}
                      onCheckedChange={(v) => setChannel(key, v)}
                      disabled={prefs.doNotDisturb}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Categories */}
          <section aria-labelledby="categories-heading">
            <h3
              id="categories-heading"
              className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Notification types
            </h3>
            <div className="divide-y rounded-lg border">
              {CATEGORY_CONFIG.map(({ key, label, description, sensitive }) => {
                const toggleId = `category-${key}`;
                const isDisabled = prefs.doNotDisturb && !sensitive;
                return (
                  <div
                    key={key}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 transition-colors",
                      isDisabled && "opacity-60"
                    )}
                  >
                    <Label
                      htmlFor={toggleId}
                      className="flex cursor-pointer items-start gap-3"
                    >
                      <span>
                        <span className="flex items-center gap-1.5 text-sm font-medium leading-tight text-foreground">
                          {label}
                          {sensitive && (
                            <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                              Always on
                            </span>
                          )}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {description}
                        </span>
                      </span>
                    </Label>
                    <ToggleSwitch
                      id={toggleId}
                      checked={sensitive ? true : prefs.categories[key]}
                      onCheckedChange={(v) => !sensitive && setCategory(key, v)}
                      disabled={isDisabled || sensitive}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Frequency */}
          <section aria-labelledby="frequency-heading">
            <h3
              id="frequency-heading"
              className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Delivery frequency
            </h3>
            <div
              className="grid grid-cols-2 gap-2"
              role="radiogroup"
              aria-labelledby="frequency-heading"
            >
              {(
                [
                  { value: "realtime", label: "Real-time", sub: "Instantly as they happen" },
                  { value: "hourly", label: "Hourly", sub: "Batched every hour" },
                  { value: "daily", label: "Daily", sub: "Once per day" },
                  { value: "weekly", label: "Weekly", sub: "One weekly summary" },
                ] as const
              ).map(({ value, label, sub }) => (
                <button
                  key={value}
                  role="radio"
                  aria-checked={prefs.frequency === value}
                  onClick={() => setFrequency(value)}
                  disabled={prefs.doNotDisturb}
                  className={cn(
                    "rounded-lg border px-3 py-2.5 text-left transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-60",
                    prefs.frequency === value
                      ? "border-primary bg-primary/10 ring-1 ring-primary"
                      : "hover:bg-muted/50"
                  )}
                >
                  <span className="block text-sm font-medium text-foreground">{label}</span>
                  <span className="block text-xs text-muted-foreground">{sub}</span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <SheetFooter>
          {saveState === "saved" && (
            <span className="mr-auto text-sm text-emerald-600 dark:text-emerald-400">
              ✓ Preferences saved
            </span>
          )}
          <Button
            variant="ghost"
            onClick={handleReset}
            disabled={!isDirty || saveState === "saving"}
          >
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isDirty || saveState === "saving"}
            className="min-w-24"
          >
            {saveState === "saving" ? "Saving…" : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}