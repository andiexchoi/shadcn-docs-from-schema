"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Bell, X, Mail, MessageSquare, AlertCircle, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Local Sheet primitives (no components/ui/sheet installed)
───────────────────────────────────────────── */

const Sheet = Dialog.Root;
const SheetTrigger = Dialog.Trigger;
const SheetClose = Dialog.Close;
const SheetPortal = Dialog.Portal;

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
      "transition-all duration-300",
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
  const sideStyles: Record<string, string> = {
    right:
      "right-0 top-0 h-full w-full max-w-md border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
    left: "left-0 top-0 h-full w-full max-w-md border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
    top: "top-0 left-0 w-full border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
    bottom:
      "bottom-0 left-0 w-full border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
  };

  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        ref={ref}
        className={cn(
          "fixed z-50 bg-white shadow-xl",
          "flex flex-col",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "duration-300 ease-in-out",
          "focus:outline-none",
          sideStyles[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose
            aria-label="Close settings panel"
            className={cn(
              "absolute right-4 top-4 rounded-sm p-1 text-gray-500",
              "hover:text-gray-900 hover:bg-gray-100",
              "focus:outline-none focus:ring-2 focus:ring-gray-400",
              "transition-colors"
            )}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </SheetClose>
        )}
      </Dialog.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 px-6 pt-6 pb-4 border-b", className)} {...props} />
);

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-end gap-3 px-6 py-4 border-t mt-auto", className)}
    {...props}
  />
);

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title
    ref={ref}
    className={cn("text-lg font-semibold text-gray-900", className)}
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
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

/* ─────────────────────────────────────────────
   Toggle Switch primitive
───────────────────────────────────────────── */

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  "aria-label"?: string;
}

function ToggleSwitch({ id, checked, onCheckedChange, "aria-label": ariaLabel }: ToggleSwitchProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      type="button"
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
        "transition-colors duration-200 ease-in-out",
        "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        checked ? "bg-indigo-600" : "bg-gray-200"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow",
          "transition duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

/* ─────────────────────────────────────────────
   Notification Preferences Form
───────────────────────────────────────────── */

interface NotificationPrefs {
  emailMarketing: boolean;
  emailSecurity: boolean;
  emailUpdates: boolean;
  pushMessages: boolean;
  pushMentions: boolean;
  pushAlerts: boolean;
  digestFrequency: "never" | "daily" | "weekly";
  emailAddress: string;
}

const defaultPrefs: NotificationPrefs = {
  emailMarketing: false,
  emailSecurity: true,
  emailUpdates: true,
  pushMessages: true,
  pushMentions: true,
  pushAlerts: false,
  digestFrequency: "daily",
  emailAddress: "",
};

function NotificationSettingsForm({
  prefs,
  setPrefs,
}: {
  prefs: NotificationPrefs;
  setPrefs: React.Dispatch<React.SetStateAction<NotificationPrefs>>;
}) {
  function toggle(key: keyof NotificationPrefs) {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  }

  const toggleRows: {
    key: keyof NotificationPrefs;
    label: string;
    description: string;
    icon: React.ReactNode;
    section: "email" | "push";
  }[] = [
    {
      key: "emailSecurity",
      label: "Security alerts",
      description: "Sign-ins, password changes, and suspicious activity.",
      icon: <AlertCircle className="h-4 w-4 text-red-500" aria-hidden="true" />,
      section: "email",
    },
    {
      key: "emailUpdates",
      label: "Product updates",
      description: "New features, improvements, and release notes.",
      icon: <Tag className="h-4 w-4 text-indigo-500" aria-hidden="true" />,
      section: "email",
    },
    {
      key: "emailMarketing",
      label: "Marketing & offers",
      description: "Promotions, tips, and special announcements.",
      icon: <Mail className="h-4 w-4 text-pink-500" aria-hidden="true" />,
      section: "email",
    },
    {
      key: "pushMessages",
      label: "Direct messages",
      description: "Notifications when someone sends you a message.",
      icon: <MessageSquare className="h-4 w-4 text-green-500" aria-hidden="true" />,
      section: "push",
    },
    {
      key: "pushMentions",
      label: "Mentions",
      description: "When someone @mentions you in a comment or post.",
      icon: <Tag className="h-4 w-4 text-yellow-500" aria-hidden="true" />,
      section: "push",
    },
    {
      key: "pushAlerts",
      label: "System alerts",
      description: "Downtime, maintenance windows, and critical errors.",
      icon: <AlertCircle className="h-4 w-4 text-orange-500" aria-hidden="true" />,
      section: "push",
    },
  ];

  const emailRows = toggleRows.filter((r) => r.section === "email");
  const pushRows = toggleRows.filter((r) => r.section === "push");

  return (
    <div className="flex flex-col gap-8 px-6 py-6 overflow-y-auto">
      {/* Notification email */}
      <section aria-labelledby="notif-email-address-heading">
        <h3
          id="notif-email-address-heading"
          className="text-sm font-semibold text-gray-700 mb-3"
        >
          Notification email
        </h3>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email-address" className="text-sm text-gray-600">
            Email address
          </Label>
          <Input
            id="email-address"
            type="email"
            placeholder="you@example.com"
            value={prefs.emailAddress}
            onChange={(e) =>
              setPrefs((p) => ({ ...p, emailAddress: e.target.value }))
            }
            className="w-full"
          />
          <p className="text-xs text-gray-400">
            All email notifications will be sent to this address.
          </p>
        </div>
      </section>

      {/* Email notifications */}
      <section aria-labelledby="email-notif-heading">
        <h3
          id="email-notif-heading"
          className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"
        >
          <Mail className="h-4 w-4 text-gray-400" aria-hidden="true" />
          Email notifications
        </h3>
        <ul role="list" className="flex flex-col divide-y divide-gray-100">
          {emailRows.map(({ key, label, description, icon }) => (
            <li key={key} className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-start gap-3 min-w-0">
                <span className="mt-0.5 shrink-0">{icon}</span>
                <div className="min-w-0">
                  <Label
                    htmlFor={`toggle-${key}`}
                    className="text-sm font-medium text-gray-800 cursor-pointer"
                  >
                    {label}
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
              <ToggleSwitch
                id={`toggle-${key}`}
                checked={prefs[key] as boolean}
                onCheckedChange={() => toggle(key)}
                aria-label={label}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Push notifications */}
      <section aria-labelledby="push-notif-heading">
        <h3
          id="push-notif-heading"
          className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"
        >
          <Bell className="h-4 w-4 text-gray-400" aria-hidden="true" />
          Push notifications
        </h3>
        <ul role="list" className="flex flex-col divide-y divide-gray-100">
          {pushRows.map(({ key, label, description, icon }) => (
            <li key={key} className="flex items-center justify-between gap-4 py-3">
              <div className="flex items-start gap-3 min-w-0">
                <span className="mt-0.5 shrink-0">{icon}</span>
                <div className="min-w-0">
                  <Label
                    htmlFor={`toggle-${key}`}
                    className="text-sm font-medium text-gray-800 cursor-pointer"
                  >
                    {label}
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>
              <ToggleSwitch
                id={`toggle-${key}`}
                checked={prefs[key] as boolean}
                onCheckedChange={() => toggle(key)}
                aria-label={label}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Digest frequency */}
      <section aria-labelledby="digest-heading">
        <h3 id="digest-heading" className="text-sm font-semibold text-gray-700 mb-3">
          Digest frequency
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          How often should we send you a summary of activity?
        </p>
        <div
          role="radiogroup"
          aria-labelledby="digest-heading"
          className="flex flex-col gap-2"
        >
          {(["never", "daily", "weekly"] as const).map((freq) => (
            <label
              key={freq}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors",
                prefs.digestFrequency === freq
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:bg-gray-50"
              )}
            >
              <input
                type="radio"
                name="digestFrequency"
                value={freq}
                checked={prefs.digestFrequency === freq}
                onChange={() =>
                  setPrefs((p) => ({ ...p, digestFrequency: freq }))
                }
                className="accent-indigo-600 h-4 w-4 shrink-0"
              />
              <span className="text-sm font-medium text-gray-800 capitalize">
                {freq === "never" ? "Never" : freq === "daily" ? "Daily" : "Weekly"}
              </span>
            </label>
          ))}
        </div>
      </section>
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

  function handleSave() {
    // Simulate save — replace with actual API call
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 900);
  }

  function handleReset() {
    setPrefs(defaultPrefs);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" aria-hidden="true" />
          Notification settings
        </Button>
      </SheetTrigger>

      <SheetContent side="right" aria-labelledby="sheet-title" aria-describedby="sheet-desc">
        <SheetHeader>
          <SheetTitle id="sheet-title">Notification preferences</SheetTitle>
          <SheetDescription id="sheet-desc">
            Manage how and when we send you notifications across email and push channels.
          </SheetDescription>
        </SheetHeader>

        <NotificationSettingsForm prefs={prefs} setPrefs={setPrefs} />

        <SheetFooter>
          <Button
            variant="ghost"
            type="button"
            onClick={handleReset}
            className="text-gray-600 hover:text-gray-900"
          >
            Reset to defaults
          </Button>
          <SheetClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="button"
            onClick={handleSave}
            disabled={saved}
            className={cn(
              "bg-indigo-600 hover:bg-indigo-700 text-white transition-colors",
              saved && "bg-green-600 hover:bg-green-600"
            )}
          >
            {saved ? "Saved!" : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}