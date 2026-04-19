"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ── Local Sheet primitives ────────────────────────────────────────────────────

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
      "transition-all duration-300",
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
  const sideStyles: Record<string, string> = {
    top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
    right:
      "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
    bottom:
      "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
    left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left",
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 bg-background shadow-xl",
          "flex flex-col",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:duration-200 data-[state=open]:duration-300",
          sideStyles[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
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

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse gap-2 px-6 py-4 border-t sm:flex-row sm:justify-end sm:gap-3", className)}
    {...props}
  />
);

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
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

// ── Toggle Switch ─────────────────────────────────────────────────────────────

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
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
        "transition-colors duration-200 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-4 w-4 rounded-full bg-background shadow-lg",
          "transform ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ── Notification preference types ─────────────────────────────────────────────

interface NotificationPreferences {
  emailMarketing: boolean;
  emailProductUpdates: boolean;
  emailSecurityAlerts: boolean;
  pushAll: boolean;
  pushMentions: boolean;
  pushReplies: boolean;
  smsOrderUpdates: boolean;
  smsSecurityAlerts: boolean;
  inAppAll: boolean;
  inAppSoundEnabled: boolean;
}

const defaultPreferences: NotificationPreferences = {
  emailMarketing: false,
  emailProductUpdates: true,
  emailSecurityAlerts: true,
  pushAll: true,
  pushMentions: true,
  pushReplies: false,
  smsOrderUpdates: false,
  smsSecurityAlerts: true,
  inAppAll: true,
  inAppSoundEnabled: false,
};

// ── Preference Row ────────────────────────────────────────────────────────────

interface PreferenceRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

function PreferenceRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: PreferenceRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex-1 min-w-0">
        <Label
          htmlFor={id}
          className="text-sm font-medium text-foreground cursor-pointer"
        >
          {label}
        </Label>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
      </div>
      <ToggleSwitch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 mb-1 pt-2">
      <span className="text-muted-foreground">{icon}</span>
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">{title}</h3>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [saved, setSaved] = React.useState(false);
  const [isDirty, setIsDirty] = React.useState(false);

  function updatePref<K extends keyof NotificationPreferences>(key: K, value: NotificationPreferences[K]) {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // Simulate async save
    setTimeout(() => {
      setSaved(true);
      setIsDirty(false);
    }, 400);
  }

  function handleReset() {
    setPrefs(defaultPreferences);
    setIsDirty(false);
    setSaved(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      // Reset dirty state on close without saving
      setIsDirty(false);
      setSaved(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notification settings
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Choose how and when you want to be notified about activity.
          </SheetDescription>
        </SheetHeader>

        <form
          id="notification-prefs-form"
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto px-6 py-2"
          aria-label="Notification preferences form"
        >
          {/* Email */}
          <section aria-labelledby="section-email">
            <SectionHeader
              icon={<Mail className="h-4 w-4" />}
              title="Email"
            />
            <div
              id="section-email"
              className="divide-y divide-border rounded-md border bg-muted/30 px-4"
            >
              <PreferenceRow
                id="emailMarketing"
                label="Marketing & promotions"
                description="Receive news about new features, offers, and product announcements."
                checked={prefs.emailMarketing}
                onCheckedChange={(v) => updatePref("emailMarketing", v)}
              />
              <PreferenceRow
                id="emailProductUpdates"
                label="Product updates"
                description="Get notified when we release important changes to the platform."
                checked={prefs.emailProductUpdates}
                onCheckedChange={(v) => updatePref("emailProductUpdates", v)}
              />
              <PreferenceRow
                id="emailSecurityAlerts"
                label="Security alerts"
                description="Receive emails about sign-ins, password changes, and account activity."
                checked={prefs.emailSecurityAlerts}
                onCheckedChange={(v) => updatePref("emailSecurityAlerts", v)}
              />
            </div>
          </section>

          {/* Push */}
          <section aria-labelledby="section-push" className="mt-5">
            <SectionHeader
              icon={<Smartphone className="h-4 w-4" />}
              title="Push notifications"
            />
            <div
              id="section-push"
              className="divide-y divide-border rounded-md border bg-muted/30 px-4"
            >
              <PreferenceRow
                id="pushAll"
                label="Enable push notifications"
                description="Allow the app to send push notifications to your device."
                checked={prefs.pushAll}
                onCheckedChange={(v) => updatePref("pushAll", v)}
              />
              <PreferenceRow
                id="pushMentions"
                label="Mentions"
                description="Get a notification whenever someone mentions you in a comment."
                checked={prefs.pushMentions}
                onCheckedChange={(v) => updatePref("pushMentions", v)}
                disabled={!prefs.pushAll}
              />
              <PreferenceRow
                id="pushReplies"
                label="Replies to your posts"
                description="Be notified when someone replies to content you've posted."
                checked={prefs.pushReplies}
                onCheckedChange={(v) => updatePref("pushReplies", v)}
                disabled={!prefs.pushAll}
              />
            </div>
          </section>

          {/* SMS */}
          <section aria-labelledby="section-sms" className="mt-5">
            <SectionHeader
              icon={<MessageSquare className="h-4 w-4" />}
              title="SMS"
            />
            <div
              id="section-sms"
              className="divide-y divide-border rounded-md border bg-muted/30 px-4"
            >
              <PreferenceRow
                id="smsOrderUpdates"
                label="Order & delivery updates"
                description="Receive text messages about the status of your orders."
                checked={prefs.smsOrderUpdates}
                onCheckedChange={(v) => updatePref("smsOrderUpdates", v)}
              />
              <PreferenceRow
                id="smsSecurityAlerts"
                label="Security alerts"
                description="Get a text when unusual activity is detected on your account."
                checked={prefs.smsSecurityAlerts}
                onCheckedChange={(v) => updatePref("smsSecurityAlerts", v)}
              />
            </div>
          </section>

          {/* In-app */}
          <section aria-labelledby="section-inapp" className="mt-5 mb-4">
            <SectionHeader
              icon={<AlertCircle className="h-4 w-4" />}
              title="In-app"
            />
            <div
              id="section-inapp"
              className="divide-y divide-border rounded-md border bg-muted/30 px-4"
            >
              <PreferenceRow
                id="inAppAll"
                label="In-app notifications"
                description="Show a notification badge and feed inside the application."
                checked={prefs.inAppAll}
                onCheckedChange={(v) => updatePref("inAppAll", v)}
              />
              <PreferenceRow
                id="inAppSoundEnabled"
                label="Notification sounds"
                description="Play a sound when a new in-app notification arrives."
                checked={prefs.inAppSoundEnabled}
                onCheckedChange={(v) => updatePref("inAppSoundEnabled", v)}
                disabled={!prefs.inAppAll}
              />
            </div>
          </section>
        </form>

        <SheetFooter>
          {saved && !isDirty && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium mr-auto">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Preferences saved
            </span>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            disabled={!isDirty}
          >
            Reset to defaults
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="submit"
            form="notification-prefs-form"
            disabled={!isDirty}
          >
            Save preferences
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}