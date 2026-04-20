"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/* ─────────────────────────────────────────────
   Minimal Sheet built on top of Radix Dialog
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

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    side?: "top" | "right" | "bottom" | "left";
    showCloseButton?: boolean;
  }
>(({ side = "right", showCloseButton = true, className, children, ...props }, ref) => {
  const sideVariants: Record<string, string> = {
    top: "inset-x-0 top-0 border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
    bottom: "inset-x-0 bottom-0 border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
    left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
    right: "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
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
          "data-[state=closed]:duration-300 data-[state=open]:duration-300",
          sideVariants[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose
            className={cn(
              "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity",
              "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:pointer-events-none data-[state=open]:bg-secondary"
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
  <div className={cn("flex flex-col gap-1.5 p-6 pb-4", className)} {...props} />
);

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse gap-2 p-6 pt-4 sm:flex-row sm:justify-end", className)} {...props} />
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

/* ─────────────────────────────────────────────
   Toggle Switch
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
      role="switch"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

/* ─────────────────────────────────────────────
   Notification preference types
───────────────────────────────────────────── */

interface NotificationPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  channels: {
    marketing: boolean;
    security: boolean;
    updates: boolean;
    reminders: boolean;
  };
  frequency: "realtime" | "daily" | "weekly";
}

const defaultPreferences: NotificationPreferences = {
  emailEnabled: true,
  pushEnabled: true,
  smsEnabled: false,
  inAppEnabled: true,
  channels: {
    marketing: false,
    security: true,
    updates: true,
    reminders: true,
  },
  frequency: "realtime",
};

/* ─────────────────────────────────────────────
   Preference Row
───────────────────────────────────────────── */

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
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
          {icon}
        </div>
        <div className="flex flex-col gap-0.5">
          <Label htmlFor={id} className="cursor-pointer text-sm font-medium leading-none">
            {label}
          </Label>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <ToggleSwitch id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Section Header
───────────────────────────────────────────── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-1 mt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h3>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [saved, setSaved] = React.useState(false);

  function setChannel(key: keyof NotificationPreferences["channels"], value: boolean) {
    setPrefs((prev) => ({ ...prev, channels: { ...prev.channels, [key]: value } }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 1200);
  }

  function handleReset() {
    setPrefs(defaultPreferences);
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
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Choose how and when you want to receive notifications.
          </SheetDescription>
        </SheetHeader>

        <form
          id="notification-form"
          onSubmit={handleSave}
          className="flex flex-1 flex-col overflow-y-auto"
        >
          <div className="flex-1 overflow-y-auto px-6">
            {/* Delivery channels */}
            <SectionHeading>Delivery channels</SectionHeading>
            <div className="divide-y divide-border rounded-lg border">
              <div className="px-3">
                <PreferenceRow
                  id="email-toggle"
                  icon={<Mail className="h-4 w-4" />}
                  label="Email"
                  description="Receive notifications via email"
                  checked={prefs.emailEnabled}
                  onCheckedChange={(v) => setPrefs((p) => ({ ...p, emailEnabled: v }))}
                />
              </div>
              <div className="px-3">
                <PreferenceRow
                  id="push-toggle"
                  icon={<Bell className="h-4 w-4" />}
                  label="Push notifications"
                  description="Browser and desktop push alerts"
                  checked={prefs.pushEnabled}
                  onCheckedChange={(v) => setPrefs((p) => ({ ...p, pushEnabled: v }))}
                />
              </div>
              <div className="px-3">
                <PreferenceRow
                  id="sms-toggle"
                  icon={<Smartphone className="h-4 w-4" />}
                  label="SMS"
                  description="Text messages to your phone number"
                  checked={prefs.smsEnabled}
                  onCheckedChange={(v) => setPrefs((p) => ({ ...p, smsEnabled: v }))}
                />
              </div>
              <div className="px-3">
                <PreferenceRow
                  id="inapp-toggle"
                  icon={<MessageSquare className="h-4 w-4" />}
                  label="In-app"
                  description="Notifications inside the application"
                  checked={prefs.inAppEnabled}
                  onCheckedChange={(v) => setPrefs((p) => ({ ...p, inAppEnabled: v }))}
                />
              </div>
            </div>

            {/* Notification types */}
            <SectionHeading className="mt-4">Notification types</SectionHeading>
            <div className="divide-y divide-border rounded-lg border">
              <div className="px-3">
                <PreferenceRow
                  id="security-toggle"
                  icon={<AlertCircle className="h-4 w-4" />}
                  label="Security alerts"
                  description="Sign-ins, password changes, and suspicious activity"
                  checked={prefs.channels.security}
                  onCheckedChange={(v) => setChannel("security", v)}
                />
              </div>
              <div className="px-3">
                <PreferenceRow
                  id="updates-toggle"
                  icon={<Bell className="h-4 w-4" />}
                  label="Product updates"
                  description="New features and improvements"
                  checked={prefs.channels.updates}
                  onCheckedChange={(v) => setChannel("updates", v)}
                />
              </div>
              <div className="px-3">
                <PreferenceRow
                  id="reminders-toggle"
                  icon={<MessageSquare className="h-4 w-4" />}
                  label="Reminders"
                  description="Task due dates and scheduled events"
                  checked={prefs.channels.reminders}
                  onCheckedChange={(v) => setChannel("reminders", v)}
                />
              </div>
              <div className="px-3">
                <PreferenceRow
                  id="marketing-toggle"
                  icon={<Mail className="h-4 w-4" />}
                  label="Marketing"
                  description="Tips, offers, and promotional content"
                  checked={prefs.channels.marketing}
                  onCheckedChange={(v) => setChannel("marketing", v)}
                />
              </div>
            </div>

            {/* Frequency */}
            <SectionHeading className="mt-4">Digest frequency</SectionHeading>
            <div className="rounded-lg border p-3">
              <fieldset className="space-y-2">
                <legend className="sr-only">Notification frequency</legend>
                {(
                  [
                    { value: "realtime", label: "Real-time", description: "Send each notification as it happens" },
                    { value: "daily", label: "Daily digest", description: "Batch notifications into one daily email" },
                    { value: "weekly", label: "Weekly digest", description: "Summarise activity in a weekly email" },
                  ] as const
                ).map(({ value, label, description }) => {
                  const id = `freq-${value}`;
                  return (
                    <label
                      key={value}
                      htmlFor={id}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-md px-3 py-2.5 transition-colors",
                        prefs.frequency === value
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      )}
                    >
                      <input
                        type="radio"
                        id={id}
                        name="frequency"
                        value={value}
                        checked={prefs.frequency === value}
                        onChange={() => setPrefs((p) => ({ ...p, frequency: value }))}
                        className="mt-0.5 accent-primary"
                      />
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium leading-none">{label}</span>
                        <span className="text-xs text-muted-foreground">{description}</span>
                      </div>
                    </label>
                  );
                })}
              </fieldset>
            </div>

            {/* Bottom spacing so last item isn't hidden under footer */}
            <div className="h-4" />
          </div>
        </form>

        <SheetFooter className="border-t bg-background">
          <Button type="button" variant="ghost" onClick={handleReset} className="text-muted-foreground">
            Reset to defaults
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="submit"
            form="notification-form"
            disabled={saved}
            className={cn(saved && "bg-green-600 hover:bg-green-600")}
          >
            {saved ? "Saved!" : "Save preferences"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}