"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Minimal Sheet built on Radix Dialog primitives
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

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", showCloseButton = true, className, children, ...props }, ref) => {
  const sideClasses: Record<NonNullable<SheetContentProps["side"]>, string> = {
    top: "inset-x-0 top-0 border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
    bottom:
      "inset-x-0 bottom-0 border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
    left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left sm:max-w-sm",
    right:
      "inset-y-0 right-0 h-full w-3/4 border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right sm:max-w-sm",
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 flex flex-col gap-0 bg-background shadow-xl",
          "transition ease-in-out",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:duration-300 data-[state=open]:duration-500",
          sideClasses[side ?? "right"],
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
  <div className={cn("flex flex-col gap-1.5 p-6 pb-4", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse gap-2 p-6 pt-4 sm:flex-row sm:justify-end", className)}
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

/* ─────────────────────────────────────────────
   Toggle switch built with a plain <button>
   ───────────────────────────────────────────── */

interface ToggleProps {
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
  id?: string;
  disabled?: boolean;
}

function Toggle({ checked, onCheckedChange, id, disabled }: ToggleProps) {
  return (
    <button
      id={id}
      role="switch"
      type="button"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "transition-colors duration-200 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0",
          "transition-transform duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

/* ─────────────────────────────────────────────
   Notification preference types & defaults
   ───────────────────────────────────────────── */

interface NotificationPreferences {
  emailMarketing: boolean;
  emailProductUpdates: boolean;
  emailSecurityAlerts: boolean;
  pushAll: boolean;
  pushMentions: boolean;
  pushDirectMessages: boolean;
  smsAccountActivity: boolean;
  inAppSounds: boolean;
  inAppBadges: boolean;
}

const defaultPreferences: NotificationPreferences = {
  emailMarketing: false,
  emailProductUpdates: true,
  emailSecurityAlerts: true,
  pushAll: false,
  pushMentions: true,
  pushDirectMessages: true,
  smsAccountActivity: false,
  inAppSounds: true,
  inAppBadges: true,
};

/* ─────────────────────────────────────────────
   Reusable preference row
   ───────────────────────────────────────────── */

interface PreferenceRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}

function PreferenceRow({ id, label, description, checked, onCheckedChange }: PreferenceRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex flex-col gap-0.5">
        <Label htmlFor={id} className="cursor-pointer text-sm font-medium leading-none">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Toggle id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section header
   ───────────────────────────────────────────── */

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

function SectionHeader({ icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 pb-1 pt-2">
      <span className="text-muted-foreground">{icon}</span>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────── */

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [saved, setSaved] = React.useState<NotificationPreferences>(defaultPreferences);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "saving" | "saved">("idle");

  const isDirty = JSON.stringify(prefs) !== JSON.stringify(saved);

  function set<K extends keyof NotificationPreferences>(key: K) {
    return (value: boolean) => setPrefs((prev) => ({ ...prev, [key]: value }));
  }

  function handleCancel() {
    setPrefs(saved);
    setOpen(false);
  }

  async function handleSave() {
    setSaveStatus("saving");
    await new Promise((r) => setTimeout(r, 800));
    setSaved(prefs);
    setSaveStatus("saved");
    setTimeout(() => setSaveStatus("idle"), 1500);
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
        {/* Header */}
        <SheetHeader>
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Choose how and when you want to be notified about activity.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6">
          {/* Divider */}
          <div className="h-px w-full bg-border" />

          {/* Email */}
          <SectionHeader icon={<Mail className="h-4 w-4" />} title="Email" />
          <div className="divide-y divide-border">
            <PreferenceRow
              id="email-marketing"
              label="Marketing emails"
              description="Receive tips, product news, and special offers."
              checked={prefs.emailMarketing}
              onCheckedChange={set("emailMarketing")}
            />
            <PreferenceRow
              id="email-product-updates"
              label="Product updates"
              description="Get notified about new features and improvements."
              checked={prefs.emailProductUpdates}
              onCheckedChange={set("emailProductUpdates")}
            />
            <PreferenceRow
              id="email-security-alerts"
              label="Security alerts"
              description="Important notifications about your account security."
              checked={prefs.emailSecurityAlerts}
              onCheckedChange={set("emailSecurityAlerts")}
            />
          </div>

          {/* Push */}
          <div className="mt-4 h-px w-full bg-border" />
          <SectionHeader icon={<Smartphone className="h-4 w-4" />} title="Push notifications" />
          <div className="divide-y divide-border">
            <PreferenceRow
              id="push-all"
              label="All activity"
              description="Push notifications for every new event."
              checked={prefs.pushAll}
              onCheckedChange={set("pushAll")}
            />
            <PreferenceRow
              id="push-mentions"
              label="Mentions"
              description="Notify me when someone mentions me."
              checked={prefs.pushMentions}
              onCheckedChange={set("pushMentions")}
            />
            <PreferenceRow
              id="push-direct-messages"
              label="Direct messages"
              description="Notify me about new direct messages."
              checked={prefs.pushDirectMessages}
              onCheckedChange={set("pushDirectMessages")}
            />
          </div>

          {/* SMS */}
          <div className="mt-4 h-px w-full bg-border" />
          <SectionHeader icon={<MessageSquare className="h-4 w-4" />} title="SMS" />
          <div className="divide-y divide-border">
            <PreferenceRow
              id="sms-account-activity"
              label="Account activity"
              description="Text messages for critical account events."
              checked={prefs.smsAccountActivity}
              onCheckedChange={set("smsAccountActivity")}
            />
          </div>

          {/* In-app */}
          <div className="mt-4 h-px w-full bg-border" />
          <SectionHeader icon={<AlertCircle className="h-4 w-4" />} title="In-app" />
          <div className="divide-y divide-border">
            <PreferenceRow
              id="inapp-sounds"
              label="Notification sounds"
              description="Play a sound when new notifications arrive."
              checked={prefs.inAppSounds}
              onCheckedChange={set("inAppSounds")}
            />
            <PreferenceRow
              id="inapp-badges"
              label="Badge counts"
              description="Show unread counts on app icons and tabs."
              checked={prefs.inAppBadges}
              onCheckedChange={set("inAppBadges")}
            />
          </div>

          {/* Bottom padding */}
          <div className="h-4" />
        </div>

        {/* Footer */}
        <div className="h-px w-full bg-border" />
        <SheetFooter className="px-6 py-4">
          {saveStatus === "saved" && (
            <p className="mr-auto self-center text-xs text-green-600 dark:text-green-400">
              ✓ Preferences saved
            </p>
          )}
          {isDirty && saveStatus === "idle" && (
            <p className="mr-auto self-center text-xs text-muted-foreground">
              You have unsaved changes.
            </p>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            disabled={saveStatus === "saving"}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || saveStatus === "saving"}
          >
            {saveStatus === "saving" ? "Saving…" : "Save preferences"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}