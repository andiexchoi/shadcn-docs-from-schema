"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertTriangle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Sheet primitives built on top of @radix-ui/react-dialog
// ---------------------------------------------------------------------------

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;
const SheetPortal = DialogPrimitive.Portal;

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
  const sideStyles = {
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
          "fixed z-50 bg-white shadow-xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "duration-300 ease-in-out",
          sideStyles[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        )}
      </DialogPrimitive.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 p-6 pb-4", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-end gap-3 border-t bg-gray-50 px-6 py-4", className)}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

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

// ---------------------------------------------------------------------------
// Toggle switch component
// ---------------------------------------------------------------------------

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function Toggle({ id, checked, onChange, disabled }: ToggleProps) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "transition-colors duration-200 ease-in-out",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-blue-600" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md",
          "transform transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Notification settings types & data
// ---------------------------------------------------------------------------

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  category: "channel" | "activity";
}

const NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    id: "email",
    label: "Email notifications",
    description: "Receive updates and alerts via email.",
    icon: <Mail className="h-4 w-4 text-blue-500" />,
    category: "channel",
  },
  {
    id: "push",
    label: "Push notifications",
    description: "Get real-time alerts on your device.",
    icon: <Smartphone className="h-4 w-4 text-purple-500" />,
    category: "channel",
  },
  {
    id: "sms",
    label: "SMS notifications",
    description: "Receive text messages for critical alerts.",
    icon: <MessageSquare className="h-4 w-4 text-green-500" />,
    category: "channel",
  },
  {
    id: "mentions",
    label: "Mentions & replies",
    description: "Notify me when someone mentions or replies to me.",
    icon: <Bell className="h-4 w-4 text-orange-500" />,
    category: "activity",
  },
  {
    id: "security",
    label: "Security alerts",
    description: "Important alerts about your account security.",
    icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
    category: "activity",
  },
];

type FrequencyOption = "immediately" | "daily" | "weekly";

interface FormState {
  toggles: Record<string, boolean>;
  frequency: FrequencyOption;
  quietHoursEnabled: boolean;
  quietStart: string;
  quietEnd: string;
}

const DEFAULT_STATE: FormState = {
  toggles: {
    email: true,
    push: true,
    sms: false,
    mentions: true,
    security: true,
  },
  frequency: "immediately",
  quietHoursEnabled: false,
  quietStart: "22:00",
  quietEnd: "08:00",
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<FormState>(DEFAULT_STATE);
  const [saved, setSaved] = React.useState(false);

  function handleToggle(id: string, value: boolean) {
    setForm((prev) => ({
      ...prev,
      toggles: { ...prev.toggles, [id]: value },
    }));
    setSaved(false);
  }

  function handleFrequency(value: FrequencyOption) {
    setForm((prev) => ({ ...prev, frequency: value }));
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // In a real app, persist the form state here.
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleReset() {
    setForm(DEFAULT_STATE);
    setSaved(false);
  }

  const channelSettings = NOTIFICATION_SETTINGS.filter((s) => s.category === "channel");
  const activitySettings = NOTIFICATION_SETTINGS.filter((s) => s.category === "activity");

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
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Choose how and when you'd like to be notified about activity.
          </SheetDescription>
        </SheetHeader>

        <form
          id="notification-form"
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto px-6 pb-2"
        >
          {/* Delivery channels */}
          <section aria-labelledby="channels-heading" className="mb-6">
            <h3
              id="channels-heading"
              className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Delivery channels
            </h3>
            <div className="space-y-1 rounded-xl border border-gray-200 divide-y divide-gray-100 bg-white overflow-hidden">
              {channelSettings.map((setting) => (
                <SettingRow
                  key={setting.id}
                  setting={setting}
                  checked={form.toggles[setting.id]}
                  onChange={(val) => handleToggle(setting.id, val)}
                />
              ))}
            </div>
          </section>

          {/* Activity types */}
          <section aria-labelledby="activity-heading" className="mb-6">
            <h3
              id="activity-heading"
              className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Activity types
            </h3>
            <div className="space-y-1 rounded-xl border border-gray-200 divide-y divide-gray-100 bg-white overflow-hidden">
              {activitySettings.map((setting) => (
                <SettingRow
                  key={setting.id}
                  setting={setting}
                  checked={form.toggles[setting.id]}
                  onChange={(val) => handleToggle(setting.id, val)}
                />
              ))}
            </div>
          </section>

          {/* Notification frequency */}
          <section aria-labelledby="frequency-heading" className="mb-6">
            <h3
              id="frequency-heading"
              className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Notification frequency
            </h3>
            <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 overflow-hidden">
              {(
                [
                  { value: "immediately", label: "Immediately", desc: "As events happen" },
                  { value: "daily", label: "Daily digest", desc: "Once a day summary" },
                  { value: "weekly", label: "Weekly digest", desc: "Once a week summary" },
                ] as { value: FrequencyOption; label: string; desc: string }[]
              ).map(({ value, label, desc }) => {
                const radioId = `freq-${value}`;
                return (
                  <label
                    key={value}
                    htmlFor={radioId}
                    className={cn(
                      "flex cursor-pointer items-center gap-4 px-4 py-3 transition-colors",
                      form.frequency === value ? "bg-blue-50" : "hover:bg-gray-50"
                    )}
                  >
                    <input
                      type="radio"
                      id={radioId}
                      name="frequency"
                      value={value}
                      checked={form.frequency === value}
                      onChange={() => handleFrequency(value)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{label}</p>
                      <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Quiet hours */}
          <section aria-labelledby="quiet-heading" className="mb-6">
            <h3
              id="quiet-heading"
              className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Quiet hours
            </h3>
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div className="flex-1 min-w-0 mr-4">
                  <p className="text-sm font-medium text-gray-900">Enable quiet hours</p>
                  <p className="text-xs text-gray-500">Pause notifications during set times.</p>
                </div>
                <Toggle
                  id="quiet-hours-toggle"
                  checked={form.quietHoursEnabled}
                  onChange={(val) => {
                    setForm((prev) => ({ ...prev, quietHoursEnabled: val }));
                    setSaved(false);
                  }}
                />
              </div>

              <div
                className={cn(
                  "grid grid-cols-2 gap-4 px-4 py-4 transition-opacity",
                  !form.quietHoursEnabled && "pointer-events-none opacity-40"
                )}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="quiet-start" className="text-xs text-gray-600">
                    Start time
                  </Label>
                  <input
                    type="time"
                    id="quiet-start"
                    value={form.quietStart}
                    disabled={!form.quietHoursEnabled}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, quietStart: e.target.value }));
                      setSaved(false);
                    }}
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="quiet-end" className="text-xs text-gray-600">
                    End time
                  </Label>
                  <input
                    type="time"
                    id="quiet-end"
                    value={form.quietEnd}
                    disabled={!form.quietHoursEnabled}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, quietEnd: e.target.value }));
                      setSaved(false);
                    }}
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </section>
        </form>

        <SheetFooter>
          {saved && (
            <p role="status" className="mr-auto text-sm font-medium text-green-600">
              Preferences saved!
            </p>
          )}
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="submit" form="notification-form">
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// SettingRow sub-component
// ---------------------------------------------------------------------------

interface SettingRowProps {
  setting: NotificationSetting;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function SettingRow({ setting, checked, onChange }: SettingRowProps) {
  const toggleId = `toggle-${setting.id}`;
  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100">
        {setting.icon}
      </div>
      <div className="flex-1 min-w-0">
        <Label
          htmlFor={toggleId}
          className="block cursor-pointer text-sm font-medium text-gray-900 leading-none mb-0.5"
        >
          {setting.label}
        </Label>
        <p className="text-xs text-gray-500 leading-snug">{setting.description}</p>
      </div>
      <Toggle id={toggleId} checked={checked} onChange={onChange} />
    </div>
  );
}