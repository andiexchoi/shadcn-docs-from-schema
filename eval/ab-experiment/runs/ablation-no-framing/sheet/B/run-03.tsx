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
  const sideStyles: Record<string, string> = {
    right:
      "inset-y-0 right-0 h-full w-full max-w-md border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
    left: "inset-y-0 left-0 h-full w-full max-w-md border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
    top: "inset-x-0 top-0 w-full border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
    bottom:
      "inset-x-0 bottom-0 w-full border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed z-50 bg-white shadow-xl flex flex-col",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:duration-200 data-[state=open]:duration-300",
          "motion-reduce:transition-none motion-reduce:animate-none",
          sideStyles[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none">
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
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-neutral-900", className)}
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
    className={cn("text-sm text-neutral-500", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

// ---------------------------------------------------------------------------
// Toggle switch
// ---------------------------------------------------------------------------

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
        "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-neutral-900" : "bg-neutral-200"
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

// ---------------------------------------------------------------------------
// Notification preference row
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

function PreferenceRow({
  id,
  icon,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: PreferenceRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            checked ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-500"
          )}
        >
          {icon}
        </div>
        <div className="flex flex-col gap-0.5">
          <Label
            htmlFor={id}
            className="text-sm font-medium text-neutral-900 cursor-pointer leading-snug"
          >
            {label}
          </Label>
          <p className="text-sm text-neutral-500 leading-snug">{description}</p>
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

// ---------------------------------------------------------------------------
// Frequency selector
// ---------------------------------------------------------------------------

type Frequency = "realtime" | "daily" | "weekly";

interface FrequencyOption {
  value: Frequency;
  label: string;
}

const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { value: "realtime", label: "Real-time" },
  { value: "daily", label: "Daily digest" },
  { value: "weekly", label: "Weekly summary" },
];

interface FrequencySelectorProps {
  value: Frequency;
  onChange: (value: Frequency) => void;
}

function FrequencySelector({ value, onChange }: FrequencySelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {FREQUENCY_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2",
            value === opt.value
              ? "bg-neutral-900 text-white border-neutral-900"
              : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  inApp: boolean;
  marketing: boolean;
  frequency: Frequency;
}

const DEFAULT_PREFS: NotificationPreferences = {
  email: true,
  push: true,
  sms: false,
  inApp: true,
  marketing: false,
  frequency: "realtime",
};

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(DEFAULT_PREFS);
  const [saved, setSaved] = React.useState<NotificationPreferences>(DEFAULT_PREFS);
  const [isSaving, setIsSaving] = React.useState(false);

  const set = <K extends keyof NotificationPreferences>(key: K, value: NotificationPreferences[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate async save
    await new Promise((r) => setTimeout(r, 800));
    setSaved(prefs);
    setIsSaving(false);
    setOpen(false);
  };

  const handleCancel = () => {
    setPrefs(saved);
    setOpen(false);
  };

  const isDirty = JSON.stringify(prefs) !== JSON.stringify(saved);

  return (
    <Sheet open={open} onOpenChange={(next) => { if (!next) handleCancel(); else setOpen(true); }}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notification settings
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Choose how and when you'd like to receive notifications from us.
          </SheetDescription>
        </SheetHeader>

        <form
          className="flex flex-col flex-1 overflow-y-auto"
          onSubmit={(e) => { e.preventDefault(); handleSave(); }}
        >
          {/* Channels */}
          <div className="px-6 pt-2 pb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 pt-4 pb-1">
              Channels
            </p>
            <div className="divide-y divide-neutral-100">
              <PreferenceRow
                id="pref-email"
                icon={<Mail className="h-4 w-4" />}
                label="Email notifications"
                description="Receive updates and alerts in your inbox."
                checked={prefs.email}
                onCheckedChange={(v) => set("email", v)}
              />
              <PreferenceRow
                id="pref-push"
                icon={<Bell className="h-4 w-4" />}
                label="Push notifications"
                description="Get browser or mobile push alerts instantly."
                checked={prefs.push}
                onCheckedChange={(v) => set("push", v)}
              />
              <PreferenceRow
                id="pref-sms"
                icon={<Smartphone className="h-4 w-4" />}
                label="SMS notifications"
                description="Receive text messages for critical events."
                checked={prefs.sms}
                onCheckedChange={(v) => set("sms", v)}
              />
              <PreferenceRow
                id="pref-inapp"
                icon={<MessageSquare className="h-4 w-4" />}
                label="In-app notifications"
                description="See alerts and updates inside the app."
                checked={prefs.inApp}
                onCheckedChange={(v) => set("inApp", v)}
              />
            </div>
          </div>

          {/* Marketing */}
          <div className="px-6 pb-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 pt-4 pb-1">
              Marketing
            </p>
            <div className="divide-y divide-neutral-100">
              <PreferenceRow
                id="pref-marketing"
                icon={<AlertCircle className="h-4 w-4" />}
                label="Product updates & tips"
                description="Occasional emails about new features and offers."
                checked={prefs.marketing}
                onCheckedChange={(v) => set("marketing", v)}
              />
            </div>
          </div>

          {/* Frequency */}
          <div className="px-6 pb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 pt-4 pb-3">
              Delivery frequency
            </p>
            <FrequencySelector
              value={prefs.frequency}
              onChange={(v) => set("frequency", v)}
            />
            <p className="mt-2 text-xs text-neutral-400">
              {prefs.frequency === "realtime" && "Notifications are sent as events happen."}
              {prefs.frequency === "daily" && "A single digest is sent once per day."}
              {prefs.frequency === "weekly" && "A summary is sent once a week."}
            </p>
          </div>
        </form>

        <SheetFooter>
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!isDirty || isSaving}
            className="min-w-[80px]"
          >
            {isSaving ? "Saving…" : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}