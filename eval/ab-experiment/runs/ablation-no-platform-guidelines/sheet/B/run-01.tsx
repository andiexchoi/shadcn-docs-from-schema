"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
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
        "fixed z-50 flex flex-col bg-background shadow-2xl",
        "transition ease-in-out",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "duration-300",
        side === "right" && [
          "inset-y-0 right-0 h-full w-full sm:w-[420px]",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        ],
        side === "left" && [
          "inset-y-0 left-0 h-full w-full sm:w-[420px]",
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
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>
      )}
    </DialogPrimitive.Content>
  </SheetPortal>
));
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

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-6 py-4 border-t",
      className
    )}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

/* ─────────────────────────────────────────────
   Toggle Switch (no external dep)
───────────────────────────────────────────── */

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ id, checked, onCheckedChange, disabled }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "transition-colors duration-200 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
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

/* ─────────────────────────────────────────────
   Notification Preference Types & Data
───────────────────────────────────────────── */

interface NotificationPrefs {
  emailMarketing: boolean;
  emailProductUpdates: boolean;
  emailSecurityAlerts: boolean;
  pushAll: boolean;
  pushMentions: boolean;
  pushComments: boolean;
  smsOrderUpdates: boolean;
  smsSecurityAlerts: boolean;
  inAppSounds: boolean;
  inAppBadges: boolean;
}

const defaultPrefs: NotificationPrefs = {
  emailMarketing: false,
  emailProductUpdates: true,
  emailSecurityAlerts: true,
  pushAll: false,
  pushMentions: true,
  pushComments: true,
  smsOrderUpdates: false,
  smsSecurityAlerts: true,
  inAppSounds: true,
  inAppBadges: true,
};

type PrefKey = keyof NotificationPrefs;

interface PreferenceRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function PreferenceRow({ id, label, description, checked, onCheckedChange }: PreferenceRowProps) {
  const switchId = `switch-${id}`;
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex flex-col gap-0.5 min-w-0">
        <Label
          htmlFor={switchId}
          className="text-sm font-medium leading-none cursor-pointer"
        >
          {label}
        </Label>
        <p className="text-xs text-muted-foreground leading-snug">{description}</p>
      </div>
      <ToggleSwitch id={switchId} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function Section({ icon, title, children }: SectionProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-muted-foreground">{icon}</span>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      <div className="divide-y divide-border rounded-lg border bg-muted/30 px-4">
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main exported component
───────────────────────────────────────────── */

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPrefs>(defaultPrefs);
  const [saved, setSaved] = React.useState(false);
  const [isDirty, setIsDirty] = React.useState(false);

  function toggle(key: PrefKey) {
    return (checked: boolean) => {
      setPrefs((prev) => ({ ...prev, [key]: checked }));
      setIsDirty(true);
      setSaved(false);
    };
  }

  function handleSave() {
    // Simulate async save
    setSaved(true);
    setIsDirty(false);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleReset() {
    setPrefs(defaultPrefs);
    setIsDirty(false);
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
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <SheetTitle>Notification preferences</SheetTitle>
          </div>
          <SheetDescription>
            Choose how and when you want to be notified. Changes apply immediately after saving.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <Section icon={<Mail className="h-4 w-4" />} title="Email notifications">
            <PreferenceRow
              id="emailMarketing"
              label="Marketing & promotions"
              description="Deals, offers, and product announcements."
              checked={prefs.emailMarketing}
              onCheckedChange={toggle("emailMarketing")}
            />
            <PreferenceRow
              id="emailProductUpdates"
              label="Product updates"
              description="New features, improvements, and changelogs."
              checked={prefs.emailProductUpdates}
              onCheckedChange={toggle("emailProductUpdates")}
            />
            <PreferenceRow
              id="emailSecurityAlerts"
              label="Security alerts"
              description="Sign-in activity, password changes, and access events."
              checked={prefs.emailSecurityAlerts}
              onCheckedChange={toggle("emailSecurityAlerts")}
            />
          </Section>

          <Section icon={<Smartphone className="h-4 w-4" />} title="Push notifications">
            <PreferenceRow
              id="pushAll"
              label="All activity"
              description="Every update and interaction in your workspace."
              checked={prefs.pushAll}
              onCheckedChange={toggle("pushAll")}
            />
            <PreferenceRow
              id="pushMentions"
              label="Mentions"
              description="When someone @mentions you in a comment or message."
              checked={prefs.pushMentions}
              onCheckedChange={toggle("pushMentions")}
            />
            <PreferenceRow
              id="pushComments"
              label="Comments & replies"
              description="New comments on content you authored or follow."
              checked={prefs.pushComments}
              onCheckedChange={toggle("pushComments")}
            />
          </Section>

          <Section icon={<MessageSquare className="h-4 w-4" />} title="SMS notifications">
            <PreferenceRow
              id="smsOrderUpdates"
              label="Order & delivery updates"
              description="Shipping confirmations and delivery status."
              checked={prefs.smsOrderUpdates}
              onCheckedChange={toggle("smsOrderUpdates")}
            />
            <PreferenceRow
              id="smsSecurityAlerts"
              label="Security alerts"
              description="One-time codes and critical account activity."
              checked={prefs.smsSecurityAlerts}
              onCheckedChange={toggle("smsSecurityAlerts")}
            />
          </Section>

          <Section icon={<AlertCircle className="h-4 w-4" />} title="In-app notifications">
            <PreferenceRow
              id="inAppSounds"
              label="Sound effects"
              description="Audio cues for incoming notifications and alerts."
              checked={prefs.inAppSounds}
              onCheckedChange={toggle("inAppSounds")}
            />
            <PreferenceRow
              id="inAppBadges"
              label="Badge counts"
              description="Unread count badge on the notification icon."
              checked={prefs.inAppBadges}
              onCheckedChange={toggle("inAppBadges")}
            />
          </Section>
        </div>

        <SheetFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            disabled={!isDirty}
            className="w-full sm:w-auto"
          >
            Reset to defaults
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!isDirty}
            className="w-full sm:w-auto gap-2"
          >
            {saved ? (
              <>
                <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
                Saved
              </>
            ) : (
              "Save preferences"
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}