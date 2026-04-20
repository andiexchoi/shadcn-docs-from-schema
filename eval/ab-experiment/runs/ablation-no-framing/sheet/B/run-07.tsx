"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Sheet primitives built on top of @radix-ui/react-dialog
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
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
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
  const sideClasses: Record<string, string> = {
    right:
      "inset-y-0 right-0 h-full w-full max-w-md border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
    left: "inset-y-0 left-0 h-full w-full max-w-md border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
    top: "inset-x-0 top-0 h-auto border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
    bottom:
      "inset-x-0 bottom-0 h-auto border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 bg-white shadow-xl flex flex-col",
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
              "absolute top-4 right-4 rounded-sm opacity-70 ring-offset-white transition-opacity",
              "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2",
              "disabled:pointer-events-none"
            )}
            aria-label="Close settings panel"
          >
            <X className="h-4 w-4" />
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
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-6 py-4 border-t mt-auto", className)}
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
    className={cn("text-lg font-semibold text-zinc-900", className)}
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
    className={cn("text-sm text-zinc-500", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

// ---------------------------------------------------------------------------
// Toggle Switch — a lightweight accessible toggle
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
      role="switch"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "transition-colors duration-200 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-zinc-900" : "bg-zinc-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0",
          "transition-transform duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Notification preferences form types & data
// ---------------------------------------------------------------------------

interface NotificationPreferences {
  emailMarketing: boolean;
  emailProductUpdates: boolean;
  emailSecurityAlerts: boolean;
  pushNewMessages: boolean;
  pushMentions: boolean;
  smsTransactional: boolean;
  inAppAll: boolean;
}

const defaultPreferences: NotificationPreferences = {
  emailMarketing: false,
  emailProductUpdates: true,
  emailSecurityAlerts: true,
  pushNewMessages: true,
  pushMentions: true,
  smsTransactional: false,
  inAppAll: true,
};

interface ChannelSectionProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function ChannelSection({ icon, title, children }: ChannelSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-7 h-7 rounded-md bg-zinc-100 text-zinc-600">
          {icon}
        </span>
        <h3 className="text-sm font-semibold text-zinc-800">{title}</h3>
      </div>
      <div className="space-y-3 pl-9">{children}</div>
    </section>
  );
}

interface PreferenceRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function PreferenceRow({ id, label, description, checked, onCheckedChange }: PreferenceRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-0.5 flex-1">
        <Label
          htmlFor={id}
          className="text-sm font-medium text-zinc-900 cursor-pointer leading-snug"
        >
          {label}
        </Label>
        <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
      </div>
      <ToggleSwitch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [savedPrefs, setSavedPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [saved, setSaved] = React.useState(false);

  function toggle(key: keyof NotificationPreferences) {
    return (checked: boolean) => setPrefs((prev) => ({ ...prev, [key]: checked }));
  }

  function handleSave() {
    setSavedPrefs(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleDiscard() {
    setPrefs(savedPrefs);
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" aria-hidden="true" />
          Notification settings
        </Button>
      </SheetTrigger>

      <SheetContent side="right" aria-label="Notification settings panel">
        <SheetHeader>
          <SheetTitle>Notification settings</SheetTitle>
          <SheetDescription>
            Choose how and when you receive notifications across all channels.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Email */}
          <ChannelSection icon={<Mail className="h-4 w-4" />} title="Email">
            <PreferenceRow
              id="email-marketing"
              label="Marketing & promotions"
              description="Newsletters, special offers, and product announcements."
              checked={prefs.emailMarketing}
              onCheckedChange={toggle("emailMarketing")}
            />
            <PreferenceRow
              id="email-product-updates"
              label="Product updates"
              description="New features, improvements, and release notes."
              checked={prefs.emailProductUpdates}
              onCheckedChange={toggle("emailProductUpdates")}
            />
            <PreferenceRow
              id="email-security-alerts"
              label="Security alerts"
              description="Sign-in activity, password changes, and account events."
              checked={prefs.emailSecurityAlerts}
              onCheckedChange={toggle("emailSecurityAlerts")}
            />
          </ChannelSection>

          <div className="border-t border-zinc-100" />

          {/* Push */}
          <ChannelSection icon={<Smartphone className="h-4 w-4" />} title="Push notifications">
            <PreferenceRow
              id="push-new-messages"
              label="New messages"
              description="Get notified when someone sends you a direct message."
              checked={prefs.pushNewMessages}
              onCheckedChange={toggle("pushNewMessages")}
            />
            <PreferenceRow
              id="push-mentions"
              label="Mentions & replies"
              description="Get notified when someone mentions you or replies to you."
              checked={prefs.pushMentions}
              onCheckedChange={toggle("pushMentions")}
            />
          </ChannelSection>

          <div className="border-t border-zinc-100" />

          {/* SMS */}
          <ChannelSection icon={<MessageSquare className="h-4 w-4" />} title="SMS">
            <PreferenceRow
              id="sms-transactional"
              label="Transactional messages"
              description="Order confirmations, receipts, and shipping updates sent via text."
              checked={prefs.smsTransactional}
              onCheckedChange={toggle("smsTransactional")}
            />
          </ChannelSection>

          <div className="border-t border-zinc-100" />

          {/* In-app */}
          <ChannelSection icon={<AlertCircle className="h-4 w-4" />} title="In-app">
            <PreferenceRow
              id="inapp-all"
              label="All in-app notifications"
              description="Show the notification badge and feed inside the application."
              checked={prefs.inAppAll}
              onCheckedChange={toggle("inAppAll")}
            />
          </ChannelSection>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={handleDiscard}>
            Discard
          </Button>
          <Button
            onClick={handleSave}
            className={cn(
              "min-w-[100px] transition-colors",
              saved && "bg-green-600 hover:bg-green-600 text-white"
            )}
          >
            {saved ? "Saved!" : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}