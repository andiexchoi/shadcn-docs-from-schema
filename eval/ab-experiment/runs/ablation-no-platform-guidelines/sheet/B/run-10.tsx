"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Bell, BellOff, Mail, MessageSquare, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Local Sheet primitives (no components/ui/sheet installed)
───────────────────────────────────────────── */

const Sheet = Dialog.Root;
const SheetTrigger = Dialog.Trigger;
const SheetPortal = Dialog.Portal;
const SheetClose = Dialog.Close;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "transition-all duration-200",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof Dialog.Content> {
  side?: "left" | "right" | "top" | "bottom";
  showCloseButton?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  SheetContentProps
>(({ side = "right", showCloseButton = true, className, children, ...props }, ref) => {
  const sideClasses = {
    right:
      "inset-y-0 right-0 h-full w-full max-w-sm border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
    left: "inset-y-0 left-0 h-full w-full max-w-sm border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
    top: "inset-x-0 top-0 w-full border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
    bottom:
      "inset-x-0 bottom-0 w-full border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        ref={ref}
        className={cn(
          "fixed z-50 bg-white shadow-xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "duration-300",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose asChild>
            <button
              aria-label="Close panel"
              className={cn(
                "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity",
                "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
                "disabled:pointer-events-none"
              )}
            >
              <X className="h-5 w-5" />
            </button>
          </SheetClose>
        )}
      </Dialog.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 px-6 pb-4 pt-6", className)} {...props} />
);

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-end gap-2 border-t px-6 py-4", className)}
    {...props}
  />
);

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

/* ─────────────────────────────────────────────
   Toggle Switch (custom, no extra dep)
───────────────────────────────────────────── */

interface ToggleProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

function Toggle({ id, checked, onCheckedChange, disabled = false }: ToggleProps) {
  return (
    <button
      role="switch"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-slate-900" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

/* ─────────────────────────────────────────────
   Notification preference form state
───────────────────────────────────────────── */

interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  emailAddress: string;
  phoneNumber: string;
  digestFrequency: "realtime" | "daily" | "weekly";
  marketingEmails: boolean;
  securityAlerts: boolean;
  productUpdates: boolean;
  mentionsOnly: boolean;
}

const defaultPrefs: NotificationPreferences = {
  emailEnabled: true,
  smsEnabled: false,
  pushEnabled: true,
  emailAddress: "",
  phoneNumber: "",
  digestFrequency: "daily",
  marketingEmails: false,
  securityAlerts: true,
  productUpdates: true,
  mentionsOnly: false,
};

/* ─────────────────────────────────────────────
   Section heading
───────────────────────────────────────────── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </h3>
  );
}

/* ─────────────────────────────────────────────
   Preference row
───────────────────────────────────────────── */

interface PrefRowProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}

function PrefRow({
  id,
  icon,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: PrefRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            checked ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
          )}
        >
          {icon}
        </span>
        <div className="flex flex-col">
          <Label
            htmlFor={id}
            className={cn(
              "cursor-pointer text-sm font-medium leading-snug",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {label}
          </Label>
          <p className="mt-0.5 text-xs text-slate-500 leading-snug">{description}</p>
        </div>
      </div>
      <Toggle
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
───────────────────────────────────────────── */

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPrefs);
  const [saved, setSaved] = React.useState(false);

  function set<K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) {
    setSaved(false);
    setPrefs((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    /* In a real app, call an API here. */
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    setSaved(false);
    setPrefs(defaultPrefs);
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
            Choose how and when you receive notifications from us.
          </SheetDescription>
        </SheetHeader>

        <form
          id="notification-settings-form"
          onSubmit={handleSave}
          className="flex flex-col gap-0 overflow-y-auto"
          style={{ maxHeight: "calc(100dvh - 160px)" }}
        >
          {/* ── Channels ── */}
          <div className="px-6 py-2">
            <SectionHeading>Channels</SectionHeading>

            <PrefRow
              id="toggle-email"
              icon={<Mail className="h-4 w-4" />}
              label="Email notifications"
              description="Receive updates directly to your inbox."
              checked={prefs.emailEnabled}
              onCheckedChange={(v) => set("emailEnabled", v)}
            />

            {prefs.emailEnabled && (
              <div className="mb-3 ml-11 flex flex-col gap-1.5">
                <Label htmlFor="email-address" className="text-xs text-slate-600">
                  Delivery address
                </Label>
                <Input
                  id="email-address"
                  type="email"
                  placeholder="you@example.com"
                  value={prefs.emailAddress}
                  onChange={(e) => set("emailAddress", e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            )}

            <PrefRow
              id="toggle-sms"
              icon={<Smartphone className="h-4 w-4" />}
              label="SMS notifications"
              description="Get text messages for urgent alerts."
              checked={prefs.smsEnabled}
              onCheckedChange={(v) => set("smsEnabled", v)}
            />

            {prefs.smsEnabled && (
              <div className="mb-3 ml-11 flex flex-col gap-1.5">
                <Label htmlFor="phone-number" className="text-xs text-slate-600">
                  Phone number
                </Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={prefs.phoneNumber}
                  onChange={(e) => set("phoneNumber", e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            )}

            <PrefRow
              id="toggle-push"
              icon={<MessageSquare className="h-4 w-4" />}
              label="Push notifications"
              description="Browser and mobile push alerts."
              checked={prefs.pushEnabled}
              onCheckedChange={(v) => set("pushEnabled", v)}
            />

            <div className="mt-1 border-t" />
          </div>

          {/* ── Frequency ── */}
          <div className="px-6 py-2">
            <SectionHeading>Digest frequency</SectionHeading>
            <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Digest frequency">
              {(["realtime", "daily", "weekly"] as const).map((freq) => (
                <button
                  key={freq}
                  type="button"
                  role="radio"
                  aria-checked={prefs.digestFrequency === freq}
                  onClick={() => set("digestFrequency", freq)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-xs font-medium capitalize transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-1",
                    prefs.digestFrequency === freq
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"
                  )}
                >
                  {freq}
                </button>
              ))}
            </div>
            <div className="mt-4 border-t" />
          </div>

          {/* ── Notification types ── */}
          <div className="px-6 py-2">
            <SectionHeading>Notification types</SectionHeading>

            <PrefRow
              id="toggle-security"
              icon={<Bell className="h-4 w-4" />}
              label="Security alerts"
              description="Login attempts, password changes, and more."
              checked={prefs.securityAlerts}
              onCheckedChange={(v) => set("securityAlerts", v)}
            />

            <PrefRow
              id="toggle-product"
              icon={<Bell className="h-4 w-4" />}
              label="Product updates"
              description="New features, improvements, and changelog."
              checked={prefs.productUpdates}
              onCheckedChange={(v) => set("productUpdates", v)}
            />

            <PrefRow
              id="toggle-marketing"
              icon={<BellOff className="h-4 w-4" />}
              label="Marketing emails"
              description="Tips, offers, and promotional content."
              checked={prefs.marketingEmails}
              onCheckedChange={(v) => set("marketingEmails", v)}
            />

            <PrefRow
              id="toggle-mentions"
              icon={<MessageSquare className="h-4 w-4" />}
              label="Mentions only"
              description="Only notify when you're directly mentioned."
              checked={prefs.mentionsOnly}
              onCheckedChange={(v) => set("mentionsOnly", v)}
            />
          </div>
        </form>

        <SheetFooter>
          <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
            Reset to defaults
          </Button>
          <Button
            type="submit"
            form="notification-settings-form"
            size="sm"
            className={cn(
              "min-w-[80px] transition-colors",
              saved && "bg-green-600 hover:bg-green-700"
            )}
          >
            {saved ? "Saved!" : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}