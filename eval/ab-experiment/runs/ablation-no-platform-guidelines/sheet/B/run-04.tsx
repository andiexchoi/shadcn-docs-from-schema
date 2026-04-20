"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

/* ─────────────────────────────────────────────
   Local Sheet primitives (no components/ui/sheet.tsx installed)
───────────────────────────────────────────── */

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
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", showCloseButton = true, className, children, ...props }, ref) => {
  const sideClasses = {
    top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
    bottom:
      "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
    left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
    right:
      "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-md",
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 bg-white shadow-xl transition ease-in-out",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:duration-300 data-[state=open]:duration-500",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none">
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
  <div className={cn("flex flex-col space-y-1.5 px-6 py-5 border-b", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-slate-900", className)}
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
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-end gap-3 px-6 py-4 border-t bg-slate-50", className)}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

/* ─────────────────────────────────────────────
   Toggle Switch (native checkbox styled as toggle)
───────────────────────────────────────────── */

interface ToggleProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

function Toggle({ id, checked, onCheckedChange, disabled }: ToggleProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-slate-900" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

/* ─────────────────────────────────────────────
   Notification preferences types & defaults
───────────────────────────────────────────── */

interface NotificationPreferences {
  emailEnabled: boolean;
  emailAddress: string;
  pushEnabled: boolean;
  smsEnabled: boolean;
  smsNumber: string;
  inAppEnabled: boolean;
  digest: "realtime" | "daily" | "weekly";
  categories: {
    security: boolean;
    updates: boolean;
    marketing: boolean;
    reminders: boolean;
  };
}

const defaultPreferences: NotificationPreferences = {
  emailEnabled: true,
  emailAddress: "",
  pushEnabled: true,
  smsEnabled: false,
  smsNumber: "",
  inAppEnabled: true,
  digest: "realtime",
  categories: {
    security: true,
    updates: true,
    marketing: false,
    reminders: true,
  },
};

/* ─────────────────────────────────────────────
   Section wrapper
───────────────────────────────────────────── */

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Row: toggle + label + optional description
───────────────────────────────────────────── */

function PreferenceRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-sm font-medium text-slate-800 cursor-pointer">
          {label}
        </Label>
        {description && <p className="text-xs text-slate-500">{description}</p>}
      </div>
      <Toggle id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main exported component
───────────────────────────────────────────── */

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [saved, setSaved] = React.useState(false);

  function update<K extends keyof NotificationPreferences>(key: K, value: NotificationPreferences[K]) {
    setSaved(false);
    setPrefs((prev) => ({ ...prev, [key]: value }));
  }

  function updateCategory(key: keyof NotificationPreferences["categories"], value: boolean) {
    setSaved(false);
    setPrefs((prev) => ({
      ...prev,
      categories: { ...prev.categories, [key]: value },
    }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // In a real app, persist preferences here.
    setSaved(true);
  }

  function handleReset() {
    setPrefs(defaultPreferences);
    setSaved(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notification settings
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col p-0 overflow-hidden">
        <SheetHeader>
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Choose how and when you want to receive notifications.
          </SheetDescription>
        </SheetHeader>

        <form
          id="notification-settings-form"
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-8"
        >
          {/* ── Channels ── */}
          <Section title="Channels" icon={Bell}>
            <PreferenceRow
              id="email-enabled"
              label="Email notifications"
              description="Receive notifications via email."
              checked={prefs.emailEnabled}
              onCheckedChange={(v) => update("emailEnabled", v)}
            />
            {prefs.emailEnabled && (
              <div className="pl-0 space-y-1.5">
                <Label htmlFor="email-address" className="text-xs text-slate-600">
                  Email address
                </Label>
                <Input
                  id="email-address"
                  type="email"
                  placeholder="you@example.com"
                  value={prefs.emailAddress}
                  onChange={(e) => update("emailAddress", e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            )}

            <div className="border-t border-slate-100" />

            <PreferenceRow
              id="push-enabled"
              label="Push notifications"
              description="Receive browser or mobile push alerts."
              checked={prefs.pushEnabled}
              onCheckedChange={(v) => update("pushEnabled", v)}
            />

            <div className="border-t border-slate-100" />

            <PreferenceRow
              id="sms-enabled"
              label="SMS notifications"
              description="Receive text messages for critical alerts."
              checked={prefs.smsEnabled}
              onCheckedChange={(v) => update("smsEnabled", v)}
            />
            {prefs.smsEnabled && (
              <div className="space-y-1.5">
                <Label htmlFor="sms-number" className="text-xs text-slate-600">
                  Phone number
                </Label>
                <Input
                  id="sms-number"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={prefs.smsNumber}
                  onChange={(e) => update("smsNumber", e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            )}

            <div className="border-t border-slate-100" />

            <PreferenceRow
              id="in-app-enabled"
              label="In-app notifications"
              description="Show notifications inside the application."
              checked={prefs.inAppEnabled}
              onCheckedChange={(v) => update("inAppEnabled", v)}
            />
          </Section>

          {/* ── Delivery cadence ── */}
          <Section title="Delivery cadence" icon={Mail}>
            <div className="space-y-2">
              <p className="text-sm text-slate-600">
                How often should non-urgent notifications be bundled?
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(["realtime", "daily", "weekly"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update("digest", opt)}
                    className={cn(
                      "rounded-md border px-3 py-2 text-sm font-medium transition-colors capitalize",
                      prefs.digest === opt
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                    )}
                  >
                    {opt === "realtime" ? "Real-time" : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* ── Categories ── */}
          <Section title="Categories" icon={MessageSquare}>
            <PreferenceRow
              id="cat-security"
              label="Security alerts"
              description="Login attempts, password changes, and suspicious activity."
              checked={prefs.categories.security}
              onCheckedChange={(v) => updateCategory("security", v)}
            />
            <div className="border-t border-slate-100" />
            <PreferenceRow
              id="cat-updates"
              label="Product updates"
              description="New features, improvements, and release notes."
              checked={prefs.categories.updates}
              onCheckedChange={(v) => updateCategory("updates", v)}
            />
            <div className="border-t border-slate-100" />
            <PreferenceRow
              id="cat-marketing"
              label="Marketing &amp; promotions"
              description="Offers, tips, and recommendations tailored to you."
              checked={prefs.categories.marketing}
              onCheckedChange={(v) => updateCategory("marketing", v)}
            />
            <div className="border-t border-slate-100" />
            <PreferenceRow
              id="cat-reminders"
              label="Reminders"
              description="Upcoming events, due dates, and follow-up tasks."
              checked={prefs.categories.reminders}
              onCheckedChange={(v) => updateCategory("reminders", v)}
            />
          </Section>

          {/* ── Critical alerts notice ── */}
          <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Security alerts are always delivered regardless of your channel or category settings
              to keep your account safe.
            </p>
          </div>
        </form>

        <SheetFooter>
          {saved && (
            <span className="mr-auto flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <Smartphone className="h-3.5 w-3.5" />
              Preferences saved
            </span>
          )}
          <Button type="button" variant="ghost" onClick={handleReset} className="text-slate-600">
            Reset
          </Button>
          <Button type="submit" form="notification-settings-form">
            Save preferences
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}