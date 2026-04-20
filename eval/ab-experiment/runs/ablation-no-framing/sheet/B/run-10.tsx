"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, Smartphone, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* ─── Local Sheet primitives built on Radix Dialog ─── */

const Sheet = Dialog.Root;
const SheetTrigger = Dialog.Trigger;
const SheetClose = Dialog.Close;
const SheetPortal = Dialog.Portal;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
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

interface SheetContentProps extends React.ComponentPropsWithoutRef<typeof Dialog.Content> {
  side?: "left" | "right" | "top" | "bottom";
  showCloseButton?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  SheetContentProps
>(({ className, side = "right", showCloseButton = true, children, ...props }, ref) => {
  const sideClasses: Record<string, string> = {
    right:
      "right-0 top-0 h-full w-full max-w-md border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
    left: "left-0 top-0 h-full w-full max-w-md border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
    top: "top-0 inset-x-0 h-auto border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
    bottom:
      "bottom-0 inset-x-0 h-auto border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        ref={ref}
        className={cn(
          "fixed z-50 bg-white shadow-2xl",
          "flex flex-col",
          "duration-300 ease-in-out",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "motion-reduce:transition-none motion-reduce:animate-none",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose
            className={cn(
              "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white",
              "transition-opacity hover:opacity-100",
              "focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
              "disabled:pointer-events-none"
            )}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </SheetClose>
        )}
      </Dialog.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 px-6 py-5 border-b", className)} {...props} />
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
  React.ElementRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn("text-lg font-semibold text-slate-900", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description
    ref={ref}
    className={cn("text-sm text-slate-500", className)}
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

function Toggle({ id, checked, onCheckedChange, disabled }: ToggleProps) {
  return (
    <button
      role="switch"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "transition-colors duration-200 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-slate-900" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

/* ─── Notification preference row ─── */

interface PreferenceRowProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function PreferenceRow({ id, icon, label, description, checked, onCheckedChange }: PreferenceRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </span>
        <div className="flex flex-col gap-0.5">
          <Label htmlFor={id} className="text-sm font-medium text-slate-900 cursor-pointer">
            {label}
          </Label>
          <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
        </div>
      </div>
      <Toggle id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

/* ─── Frequency selector ─── */

type Frequency = "realtime" | "daily" | "weekly";

interface FrequencyOption {
  value: Frequency;
  label: string;
}

const frequencyOptions: FrequencyOption[] = [
  { value: "realtime", label: "Real-time" },
  { value: "daily", label: "Daily digest" },
  { value: "weekly", label: "Weekly summary" },
];

/* ─── Main component ─── */

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  marketing: boolean;
  security: boolean;
  frequency: Frequency;
  emailAddress: string;
  phoneNumber: string;
}

const defaultPreferences: NotificationPreferences = {
  email: true,
  push: true,
  sms: false,
  inApp: true,
  marketing: false,
  security: true,
  frequency: "realtime",
  emailAddress: "",
  phoneNumber: "",
};

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [saved, setSaved] = React.useState(false);

  function setToggle(key: keyof NotificationPreferences) {
    return (checked: boolean) => {
      setSaved(false);
      setPrefs((prev) => ({ ...prev, [key]: checked }));
    };
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // Simulate save
    setSaved(true);
    setTimeout(() => setOpen(false), 800);
  }

  function handleCancel() {
    setPrefs(defaultPreferences);
    setSaved(false);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notification settings
        </Button>
      </SheetTrigger>

      <SheetContent side="right" aria-label="Notification preferences panel">
        <SheetHeader>
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Choose how and when you'd like to receive notifications from us.
          </SheetDescription>
        </SheetHeader>

        <form
          id="notification-form"
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto px-6 py-2"
        >
          {/* Channels section */}
          <section aria-labelledby="channels-heading" className="mb-2">
            <h3
              id="channels-heading"
              className="text-xs font-semibold uppercase tracking-wider text-slate-400 pt-4 pb-1"
            >
              Channels
            </h3>
            <div className="divide-y divide-slate-100">
              <PreferenceRow
                id="pref-email"
                icon={<Mail className="h-4 w-4" />}
                label="Email notifications"
                description="Receive updates and alerts via email."
                checked={prefs.email}
                onCheckedChange={setToggle("email")}
              />
              <PreferenceRow
                id="pref-push"
                icon={<Bell className="h-4 w-4" />}
                label="Push notifications"
                description="Instant alerts delivered to your browser or app."
                checked={prefs.push}
                onCheckedChange={setToggle("push")}
              />
              <PreferenceRow
                id="pref-sms"
                icon={<Smartphone className="h-4 w-4" />}
                label="SMS notifications"
                description="Text messages for critical updates only."
                checked={prefs.sms}
                onCheckedChange={setToggle("sms")}
              />
              <PreferenceRow
                id="pref-inapp"
                icon={<MessageSquare className="h-4 w-4" />}
                label="In-app notifications"
                description="Notifications visible within the application."
                checked={prefs.inApp}
                onCheckedChange={setToggle("inApp")}
              />
            </div>
          </section>

          {/* Contact details */}
          <section aria-labelledby="contact-heading" className="mb-2">
            <h3
              id="contact-heading"
              className="text-xs font-semibold uppercase tracking-wider text-slate-400 pt-4 pb-3"
            >
              Contact details
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email-address" className="text-sm font-medium text-slate-900">
                  Email address
                </Label>
                <Input
                  id="email-address"
                  type="email"
                  placeholder="you@example.com"
                  value={prefs.emailAddress}
                  onChange={(e) => {
                    setSaved(false);
                    setPrefs((p) => ({ ...p, emailAddress: e.target.value }));
                  }}
                  disabled={!prefs.email}
                  className="disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone-number" className="text-sm font-medium text-slate-900">
                  Phone number
                </Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={prefs.phoneNumber}
                  onChange={(e) => {
                    setSaved(false);
                    setPrefs((p) => ({ ...p, phoneNumber: e.target.value }));
                  }}
                  disabled={!prefs.sms}
                  className="disabled:opacity-50"
                />
              </div>
            </div>
          </section>

          {/* Frequency section */}
          <section aria-labelledby="frequency-heading" className="mb-2">
            <h3
              id="frequency-heading"
              className="text-xs font-semibold uppercase tracking-wider text-slate-400 pt-4 pb-3"
            >
              Frequency
            </h3>
            <div
              role="radiogroup"
              aria-labelledby="frequency-heading"
              className="flex flex-col gap-2"
            >
              {frequencyOptions.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors",
                    prefs.frequency === opt.value
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-200 hover:bg-slate-50"
                  )}
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={opt.value}
                    checked={prefs.frequency === opt.value}
                    onChange={() => {
                      setSaved(false);
                      setPrefs((p) => ({ ...p, frequency: opt.value }));
                    }}
                    className="accent-slate-900 h-4 w-4"
                  />
                  <span className="text-sm font-medium text-slate-900">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Categories section */}
          <section aria-labelledby="categories-heading" className="mb-6">
            <h3
              id="categories-heading"
              className="text-xs font-semibold uppercase tracking-wider text-slate-400 pt-4 pb-1"
            >
              Categories
            </h3>
            <div className="divide-y divide-slate-100">
              <PreferenceRow
                id="pref-security"
                icon={<AlertCircle className="h-4 w-4" />}
                label="Security alerts"
                description="Sign-ins, password changes, and account activity."
                checked={prefs.security}
                onCheckedChange={setToggle("security")}
              />
              <PreferenceRow
                id="pref-marketing"
                icon={<Mail className="h-4 w-4" />}
                label="Marketing & promotions"
                description="News, offers, and product updates from our team."
                checked={prefs.marketing}
                onCheckedChange={setToggle("marketing")}
              />
            </div>
          </section>
        </form>

        <SheetFooter>
          {saved && (
            <span className="mr-auto text-sm text-emerald-600 font-medium" role="status">
              Preferences saved ✓
            </span>
          )}
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" form="notification-form">
            Save preferences
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}