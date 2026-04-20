"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─── Local Sheet primitives ─── */

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
  const sideVariants: Record<string, string> = {
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
          "fixed z-50 flex flex-col gap-4 bg-white p-6 shadow-xl",
          "transition ease-in-out duration-300",
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-300",
          sideVariants[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
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
  <div className={cn("flex flex-col space-y-1.5", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
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
    className={cn("text-lg font-semibold text-gray-900", className)}
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
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

/* ─── Toggle Switch ─── */

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const ToggleSwitch = ({ id, checked, onCheckedChange, disabled }: ToggleSwitchProps) => (
  <button
    role="switch"
    aria-checked={checked}
    id={id}
    disabled={disabled}
    onClick={() => onCheckedChange(!checked)}
    className={cn(
      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      checked ? "bg-indigo-600" : "bg-gray-200"
    )}
  >
    <span
      className={cn(
        "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);

/* ─── Notification preference row ─── */

interface PreferenceRowProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const PreferenceRow = ({
  id,
  icon,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: PreferenceRowProps) => (
  <div className="flex items-start justify-between gap-4 py-3">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
        {icon}
      </div>
      <div className="space-y-0.5">
        <Label
          htmlFor={id}
          className={cn(
            "text-sm font-medium leading-none",
            disabled ? "cursor-not-allowed text-gray-400" : "cursor-pointer text-gray-900"
          )}
        >
          {label}
        </Label>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <ToggleSwitch
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
    />
  </div>
);

/* ─── Frequency select ─── */

interface FrequencySelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const FrequencySelect = ({ id, value, onChange, disabled }: FrequencySelectProps) => (
  <select
    id={id}
    value={value}
    disabled={disabled}
    onChange={(e) => onChange(e.target.value)}
    className={cn(
      "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm",
      "focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
      "disabled:cursor-not-allowed disabled:opacity-50"
    )}
  >
    <option value="immediately">Immediately</option>
    <option value="hourly">Hourly digest</option>
    <option value="daily">Daily digest</option>
    <option value="weekly">Weekly digest</option>
  </select>
);

/* ─── Form state ─── */

interface NotificationPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  inAppEnabled: boolean;
  marketingEnabled: boolean;
  securityAlertsEnabled: boolean;
  emailFrequency: string;
  pushFrequency: string;
}

const defaultPreferences: NotificationPreferences = {
  emailEnabled: true,
  pushEnabled: true,
  smsEnabled: false,
  inAppEnabled: true,
  marketingEnabled: false,
  securityAlertsEnabled: true,
  emailFrequency: "daily",
  pushFrequency: "immediately",
};

/* ─── Main component ─── */

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(defaultPreferences);
  const [saved, setSaved] = React.useState(false);
  const [dirty, setDirty] = React.useState(false);

  const update = <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setSaved(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Persist logic goes here
    setSaved(true);
    setDirty(false);
  };

  const handleReset = () => {
    setPrefs(defaultPreferences);
    setDirty(false);
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

      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Choose how and when you want to receive notifications.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSave} className="flex flex-col gap-6 pt-2">
          {/* Channels section */}
          <section aria-labelledby="channels-heading">
            <h3
              id="channels-heading"
              className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Channels
            </h3>
            <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-gray-50 px-4">
              <PreferenceRow
                id="pref-email"
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                description="Receive updates to your registered email address."
                checked={prefs.emailEnabled}
                onCheckedChange={(v) => update("emailEnabled", v)}
              />
              <PreferenceRow
                id="pref-push"
                icon={<Bell className="h-4 w-4" />}
                label="Push notifications"
                description="Browser and mobile push notifications."
                checked={prefs.pushEnabled}
                onCheckedChange={(v) => update("pushEnabled", v)}
              />
              <PreferenceRow
                id="pref-sms"
                icon={<Smartphone className="h-4 w-4" />}
                label="SMS"
                description="Text messages sent to your phone number."
                checked={prefs.smsEnabled}
                onCheckedChange={(v) => update("smsEnabled", v)}
              />
              <PreferenceRow
                id="pref-inapp"
                icon={<MessageSquare className="h-4 w-4" />}
                label="In-app"
                description="Notifications shown inside the application."
                checked={prefs.inAppEnabled}
                onCheckedChange={(v) => update("inAppEnabled", v)}
              />
            </div>
          </section>

          {/* Frequency section */}
          <section aria-labelledby="frequency-heading">
            <h3
              id="frequency-heading"
              className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Delivery frequency
            </h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="email-frequency"
                  className={cn(
                    "text-sm font-medium",
                    !prefs.emailEnabled && "text-gray-400"
                  )}
                >
                  Email frequency
                </Label>
                <FrequencySelect
                  id="email-frequency"
                  value={prefs.emailFrequency}
                  onChange={(v) => update("emailFrequency", v)}
                  disabled={!prefs.emailEnabled}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="push-frequency"
                  className={cn(
                    "text-sm font-medium",
                    !prefs.pushEnabled && "text-gray-400"
                  )}
                >
                  Push frequency
                </Label>
                <FrequencySelect
                  id="push-frequency"
                  value={prefs.pushFrequency}
                  onChange={(v) => update("pushFrequency", v)}
                  disabled={!prefs.pushEnabled}
                />
              </div>
            </div>
          </section>

          {/* Topics section */}
          <section aria-labelledby="topics-heading">
            <h3
              id="topics-heading"
              className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400"
            >
              Topics
            </h3>
            <div className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-gray-50 px-4">
              <PreferenceRow
                id="pref-security"
                icon={<AlertCircle className="h-4 w-4" />}
                label="Security alerts"
                description="Login attempts, password changes, and suspicious activity."
                checked={prefs.securityAlertsEnabled}
                onCheckedChange={(v) => update("securityAlertsEnabled", v)}
              />
              <PreferenceRow
                id="pref-marketing"
                icon={<Mail className="h-4 w-4" />}
                label="Marketing & promotions"
                description="Product updates, tips, offers, and newsletters."
                checked={prefs.marketingEnabled}
                onCheckedChange={(v) => update("marketingEnabled", v)}
              />
            </div>
          </section>

          {/* Saved feedback */}
          {saved && (
            <p
              role="status"
              aria-live="polite"
              className="rounded-md bg-green-50 px-3 py-2 text-sm text-green-700"
            >
              Your notification preferences have been saved.
            </p>
          )}

          <SheetFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
              disabled={!dirty}
              className="w-full sm:w-auto"
            >
              Reset to defaults
            </Button>
            <Button
              type="submit"
              disabled={!dirty}
              className="w-full bg-indigo-600 hover:bg-indigo-700 sm:w-auto"
            >
              Save preferences
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}