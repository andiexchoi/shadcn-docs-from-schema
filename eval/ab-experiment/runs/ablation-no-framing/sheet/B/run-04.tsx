"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, Smartphone, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// ---------------------------------------------------------------------------
// Local Sheet primitives (no components/ui/sheet.tsx installed)
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
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
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
    side?: "left" | "right" | "top" | "bottom";
  }
>(({ className, children, side = "right", ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed z-50 flex flex-col bg-white shadow-xl transition ease-in-out",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "duration-300",
        side === "right" && [
          "inset-y-0 right-0 h-full w-full max-w-md border-l",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        ],
        side === "left" && [
          "inset-y-0 left-0 h-full w-full max-w-md border-r",
          "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
        ],
        side === "top" && [
          "inset-x-0 top-0 w-full border-b",
          "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        ],
        side === "bottom" && [
          "inset-x-0 bottom-0 w-full border-t",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        ],
        className
      )}
      {...props}
    >
      {children}
      <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetClose>
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 px-6 pt-6 pb-4 border-b", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 py-4 border-t mt-auto", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

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

// ---------------------------------------------------------------------------
// Toggle switch (no extra package needed)
// ---------------------------------------------------------------------------

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
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
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
        checked ? "bg-slate-900" : "bg-slate-200",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg transform transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Notification preferences form state
// ---------------------------------------------------------------------------

interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  browserNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  weeklyDigest: boolean;
  emailAddress: string;
  phoneNumber: string;
}

const defaultPreferences: NotificationPreferences = {
  emailNotifications: true,
  pushNotifications: false,
  smsNotifications: false,
  browserNotifications: true,
  marketingEmails: false,
  securityAlerts: true,
  weeklyDigest: false,
  emailAddress: "",
  phoneNumber: "",
};

// ---------------------------------------------------------------------------
// Reusable preference row
// ---------------------------------------------------------------------------

interface PreferenceRowProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

function PreferenceRow({ id, icon, label, description, checked, onCheckedChange, disabled }: PreferenceRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          {icon}
        </div>
        <div className="space-y-0.5">
          <Label htmlFor={id} className="text-sm font-medium text-slate-900 cursor-pointer">
            {label}
          </Label>
          <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
        </div>
      </div>
      <ToggleSwitch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </h3>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [saved, setSaved] = React.useState(false);

  function update<K extends keyof NotificationPreferences>(key: K, value: NotificationPreferences[K]) {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // Persist / submit logic goes here
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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

      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Choose how and when you want to receive notifications from us.
          </SheetDescription>
        </SheetHeader>

        <form
          id="notification-settings-form"
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-7"
        >
          {/* Channels */}
          <section>
            <SectionHeading>Notification channels</SectionHeading>
            <div className="divide-y divide-slate-100">
              <PreferenceRow
                id="email-notifications"
                icon={<Mail className="h-4 w-4" />}
                label="Email notifications"
                description="Receive updates and alerts via email."
                checked={prefs.emailNotifications}
                onCheckedChange={(v) => update("emailNotifications", v)}
              />
              <PreferenceRow
                id="push-notifications"
                icon={<Bell className="h-4 w-4" />}
                label="Push notifications"
                description="Get real-time alerts on your mobile device."
                checked={prefs.pushNotifications}
                onCheckedChange={(v) => update("pushNotifications", v)}
              />
              <PreferenceRow
                id="sms-notifications"
                icon={<Smartphone className="h-4 w-4" />}
                label="SMS notifications"
                description="Receive text messages for urgent updates."
                checked={prefs.smsNotifications}
                onCheckedChange={(v) => update("smsNotifications", v)}
              />
              <PreferenceRow
                id="browser-notifications"
                icon={<Globe className="h-4 w-4" />}
                label="Browser notifications"
                description="Show desktop alerts while you're using the web app."
                checked={prefs.browserNotifications}
                onCheckedChange={(v) => update("browserNotifications", v)}
              />
            </div>
          </section>

          {/* Types */}
          <section>
            <SectionHeading>Notification types</SectionHeading>
            <div className="divide-y divide-slate-100">
              <PreferenceRow
                id="security-alerts"
                icon={<Bell className="h-4 w-4" />}
                label="Security alerts"
                description="Be notified of sign-ins, password changes, and suspicious activity."
                checked={prefs.securityAlerts}
                onCheckedChange={(v) => update("securityAlerts", v)}
              />
              <PreferenceRow
                id="marketing-emails"
                icon={<MessageSquare className="h-4 w-4" />}
                label="Marketing emails"
                description="Stay up to date with product news, tips, and promotions."
                checked={prefs.marketingEmails}
                onCheckedChange={(v) => update("marketingEmails", v)}
              />
              <PreferenceRow
                id="weekly-digest"
                icon={<Mail className="h-4 w-4" />}
                label="Weekly digest"
                description="A summary of your activity and highlights delivered every Monday."
                checked={prefs.weeklyDigest}
                onCheckedChange={(v) => update("weeklyDigest", v)}
              />
            </div>
          </section>

          {/* Contact details */}
          <section className="space-y-4">
            <SectionHeading>Contact details</SectionHeading>
            <div className="space-y-2">
              <Label htmlFor="email-address" className="text-sm font-medium text-slate-900">
                Email address
              </Label>
              <Input
                id="email-address"
                type="email"
                placeholder="you@example.com"
                value={prefs.emailAddress}
                onChange={(e) => update("emailAddress", e.target.value)}
                disabled={!prefs.emailNotifications && !prefs.marketingEmails && !prefs.weeklyDigest}
                className="text-sm"
              />
              {!prefs.emailNotifications && !prefs.marketingEmails && !prefs.weeklyDigest && (
                <p className="text-xs text-slate-400">Enable an email notification type to edit this field.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-number" className="text-sm font-medium text-slate-900">
                Phone number
              </Label>
              <Input
                id="phone-number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={prefs.phoneNumber}
                onChange={(e) => update("phoneNumber", e.target.value)}
                disabled={!prefs.smsNotifications}
                className="text-sm"
              />
              {!prefs.smsNotifications && (
                <p className="text-xs text-slate-400">Enable SMS notifications to edit this field.</p>
              )}
            </div>
          </section>
        </form>

        <SheetFooter>
          <div className="flex w-full items-center justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-slate-500"
            >
              Reset to defaults
            </Button>
            <div className="flex items-center gap-3">
              {saved && (
                <span className="text-xs font-medium text-emerald-600 animate-in fade-in slide-in-from-right-2 duration-200">
                  Saved!
                </span>
              )}
              <SheetClose asChild>
                <Button type="button" variant="outline" size="sm">
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="submit"
                form="notification-settings-form"
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                Save preferences
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}