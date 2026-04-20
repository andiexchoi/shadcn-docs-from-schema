"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

/* ─── Local Sheet primitives built on @radix-ui/react-dialog ─── */

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
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "motion-reduce:transition-none",
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
  const sideStyles: Record<string, string> = {
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
          "fixed z-50 bg-white shadow-xl flex flex-col",
          "duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out",
          "motion-reduce:transition-none",
          sideStyles[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose
            className={cn(
              "absolute top-4 right-4 rounded-sm opacity-70 ring-offset-white",
              "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2",
              "transition-opacity"
            )}
          >
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
  <div className={cn("flex flex-col gap-1.5 px-6 pt-6 pb-4 border-b", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-end gap-3 px-6 py-4 border-t mt-auto", className)}
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
    className={cn("text-lg font-semibold text-neutral-900", className)}
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
    className={cn("text-sm text-neutral-500", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

/* ─── Toggle Switch ─── */

interface ToggleProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

function Toggle({ id, checked, onCheckedChange, disabled = false }: ToggleProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-neutral-900" : "bg-neutral-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

/* ─── Preference Row ─── */

interface PreferenceRowProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

function PreferenceRow({
  id,
  icon,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: PreferenceRowProps) {
  const toggleId = `toggle-${id}`;
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
          {icon}
        </div>
        <div className="flex flex-col gap-0.5">
          <Label htmlFor={toggleId} className="text-sm font-medium text-neutral-900 cursor-pointer">
            {label}
          </Label>
          <p className="text-xs text-neutral-500 leading-relaxed">{description}</p>
        </div>
      </div>
      <Toggle
        id={toggleId}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
}

/* ─── Notification Preferences State ─── */

interface NotificationPrefs {
  emailDigest: boolean;
  pushNotifications: boolean;
  smsAlerts: boolean;
  inAppMessages: boolean;
  criticalAlerts: boolean;
  emailAddress: string;
  phoneNumber: string;
  digestFrequency: "daily" | "weekly" | "never";
}

const defaultPrefs: NotificationPrefs = {
  emailDigest: true,
  pushNotifications: true,
  smsAlerts: false,
  inAppMessages: true,
  criticalAlerts: true,
  emailAddress: "",
  phoneNumber: "",
  digestFrequency: "daily",
};

/* ─── Main Component ─── */

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPrefs>(defaultPrefs);
  const [saved, setSaved] = React.useState<NotificationPrefs>(defaultPrefs);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved">("idle");

  const isDirty = JSON.stringify(prefs) !== JSON.stringify(saved);

  function setField<K extends keyof NotificationPrefs>(key: K, value: NotificationPrefs[K]) {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  }

  function handleReset() {
    setPrefs(saved);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveStatus("saving");
    // Simulate async save
    await new Promise((res) => setTimeout(res, 800));
    setSaved(prefs);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 2000);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      // Discard unsaved changes on close
      setPrefs(saved);
      setSaveStatus("idle");
    }
    setOpen(nextOpen);
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notification settings
        </Button>
      </SheetTrigger>

      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Choose how and when you want to receive updates from us.
          </SheetDescription>
        </SheetHeader>

        <form
          id="notification-form"
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto px-6 py-2"
        >
          {/* Channel toggles */}
          <section aria-labelledby="channels-heading" className="mb-2">
            <h3
              id="channels-heading"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-400 pt-4 pb-1"
            >
              Notification channels
            </h3>
            <div className="divide-y divide-neutral-100">
              <PreferenceRow
                id="email-digest"
                icon={<Mail className="h-4 w-4" />}
                label="Email digest"
                description="Receive a summary of activity delivered to your inbox."
                checked={prefs.emailDigest}
                onCheckedChange={(v) => setField("emailDigest", v)}
              />
              <PreferenceRow
                id="push-notifications"
                icon={<Smartphone className="h-4 w-4" />}
                label="Push notifications"
                description="Get real-time alerts sent directly to your device."
                checked={prefs.pushNotifications}
                onCheckedChange={(v) => setField("pushNotifications", v)}
              />
              <PreferenceRow
                id="sms-alerts"
                icon={<MessageSquare className="h-4 w-4" />}
                label="SMS alerts"
                description="Receive text messages for time-sensitive updates."
                checked={prefs.smsAlerts}
                onCheckedChange={(v) => setField("smsAlerts", v)}
              />
              <PreferenceRow
                id="in-app-messages"
                icon={<Bell className="h-4 w-4" />}
                label="In-app messages"
                description="Show notifications inside the application while you're active."
                checked={prefs.inAppMessages}
                onCheckedChange={(v) => setField("inAppMessages", v)}
              />
              <PreferenceRow
                id="critical-alerts"
                icon={<AlertCircle className="h-4 w-4" />}
                label="Critical alerts"
                description="Always-on alerts for security events and urgent issues."
                checked={prefs.criticalAlerts}
                onCheckedChange={(v) => setField("criticalAlerts", v)}
                disabled
              />
            </div>
          </section>

          {/* Delivery details */}
          <section aria-labelledby="delivery-heading" className="mb-2">
            <h3
              id="delivery-heading"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-400 pt-4 pb-1"
            >
              Delivery details
            </h3>
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email-address">Email address</Label>
                <Input
                  id="email-address"
                  type="email"
                  placeholder="you@example.com"
                  value={prefs.emailAddress}
                  onChange={(e) => setField("emailAddress", e.target.value)}
                  disabled={!prefs.emailDigest}
                  aria-describedby="email-hint"
                />
                <p id="email-hint" className="text-xs text-neutral-400">
                  {prefs.emailDigest
                    ? "Digest emails will be sent to this address."
                    : "Enable email digest above to configure this field."}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone-number">Phone number</Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={prefs.phoneNumber}
                  onChange={(e) => setField("phoneNumber", e.target.value)}
                  disabled={!prefs.smsAlerts}
                  aria-describedby="phone-hint"
                />
                <p id="phone-hint" className="text-xs text-neutral-400">
                  {prefs.smsAlerts
                    ? "SMS alerts will be sent to this number."
                    : "Enable SMS alerts above to configure this field."}
                </p>
              </div>
            </div>
          </section>

          {/* Frequency */}
          <section aria-labelledby="frequency-heading" className="mb-6">
            <h3
              id="frequency-heading"
              className="text-xs font-semibold uppercase tracking-wider text-neutral-400 pt-4 pb-1"
            >
              Digest frequency
            </h3>
            <div
              role="radiogroup"
              aria-labelledby="frequency-heading"
              className="mt-2 flex flex-col gap-2"
            >
              {(
                [
                  { value: "daily", label: "Daily", description: "One email every day at 8 AM." },
                  {
                    value: "weekly",
                    label: "Weekly",
                    description: "One email every Monday morning.",
                  },
                  { value: "never", label: "Never", description: "No digest emails." },
                ] as const
              ).map((option) => {
                const radioId = `frequency-${option.value}`;
                const selected = prefs.digestFrequency === option.value;
                return (
                  <label
                    key={option.value}
                    htmlFor={radioId}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors",
                      selected
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300",
                      !prefs.emailDigest && "pointer-events-none opacity-40"
                    )}
                  >
                    <input
                      id={radioId}
                      type="radio"
                      name="digestFrequency"
                      value={option.value}
                      checked={selected}
                      onChange={() => setField("digestFrequency", option.value)}
                      disabled={!prefs.emailDigest}
                      className="mt-0.5 accent-neutral-900"
                    />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{option.label}</p>
                      <p className="text-xs text-neutral-500">{option.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>
        </form>

        <SheetFooter>
          {saveStatus === "saved" && (
            <p className="mr-auto text-sm text-green-600 font-medium">Settings saved!</p>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            disabled={!isDirty || saveStatus === "saving"}
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="notification-form"
            disabled={!isDirty || saveStatus === "saving"}
          >
            {saveStatus === "saving" ? "Saving…" : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}