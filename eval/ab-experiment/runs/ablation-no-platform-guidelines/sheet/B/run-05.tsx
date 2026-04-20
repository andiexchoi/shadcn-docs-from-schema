"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
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

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", showCloseButton = true, className, children, ...props }, ref) => {
  const sideClasses: Record<string, string> = {
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
          "fixed z-50 bg-background shadow-xl transition ease-in-out",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:duration-300 data-[state=open]:duration-500",
          sideClasses[side],
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
              "disabled:pointer-events-none"
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

// ---------------------------------------------------------------------------
// Toggle switch (no Radix Switch installed – plain checkbox approach)
// ---------------------------------------------------------------------------

interface ToggleProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Toggle = ({ id, checked, onCheckedChange, disabled }: ToggleProps) => (
  <button
    type="button"
    id={id}
    role="switch"
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
        "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);

// ---------------------------------------------------------------------------
// Notification Preferences Form Data
// ---------------------------------------------------------------------------

interface NotificationPreferences {
  emailEnabled: boolean;
  emailAddress: string;
  pushEnabled: boolean;
  smsEnabled: boolean;
  smsPhone: string;
  inAppEnabled: boolean;
  digestFrequency: "realtime" | "daily" | "weekly";
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
  smsPhone: "",
  inAppEnabled: true,
  digestFrequency: "daily",
  categories: {
    security: true,
    updates: true,
    marketing: false,
    reminders: true,
  },
};

// ---------------------------------------------------------------------------
// Section helper
// ---------------------------------------------------------------------------

interface SectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const Section = ({ icon, title, children }: SectionProps) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{icon}</span>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
    </div>
    <div className="space-y-3 pl-6">{children}</div>
  </div>
);

// ---------------------------------------------------------------------------
// Toggle Row helper
// ---------------------------------------------------------------------------

interface ToggleRowProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  disabled?: boolean;
}

const ToggleRow = ({ id, label, description, checked, onCheckedChange, disabled }: ToggleRowProps) => (
  <div className="flex items-start justify-between gap-4">
    <div className="space-y-0.5">
      <Label
        htmlFor={id}
        className={cn("text-sm font-medium leading-none", disabled && "opacity-50")}
      >
        {label}
      </Label>
      {description && (
        <p className={cn("text-xs text-muted-foreground", disabled && "opacity-50")}>
          {description}
        </p>
      )}
    </div>
    <Toggle id={id} checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
  </div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [saved, setSaved] = React.useState(false);

  const update = <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const updateCategory = (key: keyof NotificationPreferences["categories"], value: boolean) => {
    setPrefs((prev) => ({
      ...prev,
      categories: { ...prev.categories, [key]: value },
    }));
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, persist `prefs` via API here.
    setSaved(true);
  };

  const handleReset = () => {
    setPrefs(defaultPreferences);
    setSaved(false);
  };

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
            Choose how and when you want to receive notifications.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable body */}
        <form
          id="notification-form"
          onSubmit={handleSave}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-2">
            <div className="space-y-8">

              {/* Email */}
              <Section icon={<Mail className="h-4 w-4" />} title="Email notifications">
                <ToggleRow
                  id="email-enabled"
                  label="Enable email notifications"
                  description="Receive important updates to your inbox."
                  checked={prefs.emailEnabled}
                  onCheckedChange={(v) => update("emailEnabled", v)}
                />
                <div className="space-y-1.5">
                  <Label
                    htmlFor="email-address"
                    className={cn("text-sm", !prefs.emailEnabled && "opacity-50")}
                  >
                    Email address
                  </Label>
                  <Input
                    id="email-address"
                    type="email"
                    placeholder="you@example.com"
                    value={prefs.emailAddress}
                    onChange={(e) => update("emailAddress", e.target.value)}
                    disabled={!prefs.emailEnabled}
                    className="h-9"
                  />
                </div>
              </Section>

              <Divider />

              {/* Push */}
              <Section icon={<Smartphone className="h-4 w-4" />} title="Push notifications">
                <ToggleRow
                  id="push-enabled"
                  label="Enable push notifications"
                  description="Get real-time alerts on your device."
                  checked={prefs.pushEnabled}
                  onCheckedChange={(v) => update("pushEnabled", v)}
                />
              </Section>

              <Divider />

              {/* SMS */}
              <Section icon={<MessageSquare className="h-4 w-4" />} title="SMS notifications">
                <ToggleRow
                  id="sms-enabled"
                  label="Enable SMS notifications"
                  description="Receive text messages for critical alerts."
                  checked={prefs.smsEnabled}
                  onCheckedChange={(v) => update("smsEnabled", v)}
                />
                <div className="space-y-1.5">
                  <Label
                    htmlFor="sms-phone"
                    className={cn("text-sm", !prefs.smsEnabled && "opacity-50")}
                  >
                    Phone number
                  </Label>
                  <Input
                    id="sms-phone"
                    type="tel"
                    placeholder="+1 555 000 0000"
                    value={prefs.smsPhone}
                    onChange={(e) => update("smsPhone", e.target.value)}
                    disabled={!prefs.smsEnabled}
                    className="h-9"
                  />
                </div>
              </Section>

              <Divider />

              {/* In-app */}
              <Section icon={<Bell className="h-4 w-4" />} title="In-app notifications">
                <ToggleRow
                  id="inapp-enabled"
                  label="Enable in-app notifications"
                  description="Show a badge and notification bell in the app."
                  checked={prefs.inAppEnabled}
                  onCheckedChange={(v) => update("inAppEnabled", v)}
                />

                {/* Digest frequency */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="digest-frequency"
                    className={cn("text-sm", !prefs.inAppEnabled && "opacity-50")}
                  >
                    Digest frequency
                  </Label>
                  <select
                    id="digest-frequency"
                    disabled={!prefs.inAppEnabled}
                    value={prefs.digestFrequency}
                    onChange={(e) =>
                      update("digestFrequency", e.target.value as NotificationPreferences["digestFrequency"])
                    }
                    className={cn(
                      "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
                      "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                      "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                  >
                    <option value="realtime">Real-time</option>
                    <option value="daily">Daily digest</option>
                    <option value="weekly">Weekly digest</option>
                  </select>
                </div>
              </Section>

              <Divider />

              {/* Categories */}
              <Section icon={<AlertCircle className="h-4 w-4" />} title="Notification categories">
                <ToggleRow
                  id="cat-security"
                  label="Security alerts"
                  description="Sign-ins, password changes, and suspicious activity."
                  checked={prefs.categories.security}
                  onCheckedChange={(v) => updateCategory("security", v)}
                />
                <ToggleRow
                  id="cat-updates"
                  label="Product updates"
                  description="New features and improvements."
                  checked={prefs.categories.updates}
                  onCheckedChange={(v) => updateCategory("updates", v)}
                />
                <ToggleRow
                  id="cat-marketing"
                  label="Promotions & marketing"
                  description="Offers, tips, and newsletters."
                  checked={prefs.categories.marketing}
                  onCheckedChange={(v) => updateCategory("marketing", v)}
                />
                <ToggleRow
                  id="cat-reminders"
                  label="Reminders"
                  description="Scheduled tasks and follow-up prompts."
                  checked={prefs.categories.reminders}
                  onCheckedChange={(v) => updateCategory("reminders", v)}
                />
              </Section>
            </div>
          </div>

          {/* Footer */}
          <SheetFooter className="border-t">
            {saved && (
              <p className="mr-auto flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                Preferences saved
              </p>
            )}
            <Button type="button" variant="ghost" onClick={handleReset}>
              Reset to defaults
            </Button>
            <Button type="submit" form="notification-form">
              Save preferences
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function Divider() {
  return <hr className="border-border" />;
}