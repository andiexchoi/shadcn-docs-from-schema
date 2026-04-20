"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

/* ─── Minimal Sheet built on Radix Dialog primitives ─── */

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
      "motion-reduce:transition-none",
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
      aria-modal="true"
      className={cn(
        "fixed z-50 flex flex-col bg-white shadow-xl transition ease-in-out",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "motion-reduce:transition-none motion-reduce:duration-0",
        side === "right" && [
          "inset-y-0 right-0 h-full w-full max-w-md",
          "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        ],
        side === "left" && [
          "inset-y-0 left-0 h-full w-full max-w-md",
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
        <SheetClose asChild>
          <button
            className={cn(
              "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white",
              "transition-opacity hover:opacity-100",
              "focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2",
              "disabled:pointer-events-none"
            )}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </SheetClose>
      )}
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 border-b px-6 py-5", className)} {...props} />
);

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-end gap-3 border-t px-6 py-4", className)}
    {...props}
  />
);

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

/* ─── Toggle Switch ─── */

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleSwitch({ id, checked, onChange, disabled }: ToggleSwitchProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full",
        "border-2 border-transparent transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-neutral-900" : "bg-neutral-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0",
          "transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

/* ─── Notification preference types ─── */

interface NotificationChannel {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface NotificationCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface NotificationFormState {
  email: string;
  channels: NotificationChannel[];
  categories: NotificationCategory[];
  digestFrequency: "realtime" | "daily" | "weekly";
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

const defaultFormState: NotificationFormState = {
  email: "you@example.com",
  channels: [
    {
      id: "email",
      label: "Email",
      description: "Receive notifications in your inbox",
      icon: <Mail className="h-4 w-4" />,
      enabled: true,
    },
    {
      id: "push",
      label: "Push notifications",
      description: "Browser or desktop push alerts",
      icon: <Bell className="h-4 w-4" />,
      enabled: false,
    },
    {
      id: "sms",
      label: "SMS",
      description: "Text messages to your phone",
      icon: <Smartphone className="h-4 w-4" />,
      enabled: false,
    },
    {
      id: "inapp",
      label: "In-app",
      description: "Notifications inside the platform",
      icon: <MessageSquare className="h-4 w-4" />,
      enabled: true,
    },
  ],
  categories: [
    {
      id: "security",
      label: "Security alerts",
      description: "Sign-ins, password changes, and suspicious activity",
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      enabled: true,
    },
    {
      id: "updates",
      label: "Product updates",
      description: "New features, improvements, and release notes",
      icon: <Bell className="h-4 w-4 text-blue-500" />,
      enabled: true,
    },
    {
      id: "messages",
      label: "Messages",
      description: "Direct messages and mentions from teammates",
      icon: <MessageSquare className="h-4 w-4 text-green-500" />,
      enabled: false,
    },
    {
      id: "marketing",
      label: "Tips and promotions",
      description: "Guides, tutorials, and offers",
      icon: <Mail className="h-4 w-4 text-purple-500" />,
      enabled: false,
    },
  ],
  digestFrequency: "daily",
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
};

/* ─── Section heading ─── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
      {children}
    </h3>
  );
}

/* ─── Row for a single toggle preference ─── */

interface PreferenceRowProps {
  id: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function PreferenceRow({
  id,
  label,
  description,
  icon,
  checked,
  onChange,
  disabled,
}: PreferenceRowProps) {
  const switchId = `${id}-switch`;
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-start gap-3">
        {icon && (
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-600">
            {icon}
          </span>
        )}
        <div className="flex flex-col">
          <Label
            htmlFor={switchId}
            className="cursor-pointer text-sm font-medium text-neutral-800"
          >
            {label}
          </Label>
          <p className="text-xs text-neutral-500">{description}</p>
        </div>
      </div>
      <ToggleSwitch id={switchId} checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}

/* ─── Main component ─── */

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState<NotificationFormState>(defaultFormState);
  const [saved, setSaved] = React.useState(false);

  function setChannelEnabled(id: string, enabled: boolean) {
    setForm((prev) => ({
      ...prev,
      channels: prev.channels.map((c) => (c.id === id ? { ...c, enabled } : c)),
    }));
  }

  function setCategoryEnabled(id: string, enabled: boolean) {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, enabled } : c)),
    }));
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
    setForm(defaultFormState);
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
            Choose how and when you want to be notified about activity in your account.
          </SheetDescription>
        </SheetHeader>

        <form
          id="notification-settings-form"
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto px-6 py-5"
        >
          {/* Delivery email */}
          <section className="mb-6">
            <SectionHeading>Delivery email</SectionHeading>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notif-email" className="text-sm font-medium text-neutral-700">
                Email address
              </Label>
              <Input
                id="notif-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="you@example.com"
                required
                className="max-w-sm"
              />
              <p className="text-xs text-neutral-500">
                Email notifications will be sent to this address.
              </p>
            </div>
          </section>

          {/* Channels */}
          <section className="mb-6">
            <SectionHeading>Channels</SectionHeading>
            <div className="divide-y divide-neutral-100">
              {form.channels.map((channel) => (
                <PreferenceRow
                  key={channel.id}
                  id={channel.id}
                  label={channel.label}
                  description={channel.description}
                  icon={channel.icon}
                  checked={channel.enabled}
                  onChange={(val) => setChannelEnabled(channel.id, val)}
                />
              ))}
            </div>
          </section>

          {/* Categories */}
          <section className="mb-6">
            <SectionHeading>Notification types</SectionHeading>
            <div className="divide-y divide-neutral-100">
              {form.categories.map((category) => (
                <PreferenceRow
                  key={category.id}
                  id={category.id}
                  label={category.label}
                  description={category.description}
                  icon={category.icon}
                  checked={category.enabled}
                  onChange={(val) => setCategoryEnabled(category.id, val)}
                />
              ))}
            </div>
          </section>

          {/* Digest frequency */}
          <section className="mb-6">
            <SectionHeading>Digest frequency</SectionHeading>
            <div className="flex flex-col gap-2">
              {(
                [
                  { value: "realtime", label: "Real-time", desc: "As events happen" },
                  { value: "daily", label: "Daily digest", desc: "One summary per day" },
                  { value: "weekly", label: "Weekly digest", desc: "One summary per week" },
                ] as const
              ).map((opt) => {
                const radioId = `digest-${opt.value}`;
                return (
                  <label
                    key={opt.value}
                    htmlFor={radioId}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors",
                      form.digestFrequency === opt.value
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-300"
                    )}
                  >
                    <input
                      id={radioId}
                      type="radio"
                      name="digestFrequency"
                      value={opt.value}
                      checked={form.digestFrequency === opt.value}
                      onChange={() =>
                        setForm((prev) => ({ ...prev, digestFrequency: opt.value }))
                      }
                      className="h-4 w-4 accent-neutral-900"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-neutral-800">{opt.label}</span>
                      <span className="text-xs text-neutral-500">{opt.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Quiet hours */}
          <section className="mb-2">
            <SectionHeading>Quiet hours</SectionHeading>
            <div className="rounded-lg border border-neutral-200 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-800">Enable quiet hours</p>
                  <p className="text-xs text-neutral-500">
                    Pause non-critical notifications during these hours.
                  </p>
                </div>
                <ToggleSwitch
                  id="quiet-hours-toggle"
                  checked={form.quietHoursEnabled}
                  onChange={(val) => setForm((prev) => ({ ...prev, quietHoursEnabled: val }))}
                />
              </div>

              <div
                className={cn(
                  "grid grid-cols-2 gap-4 transition-opacity duration-200",
                  !form.quietHoursEnabled && "pointer-events-none opacity-40"
                )}
              >
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="quiet-start"
                    className="text-xs font-medium text-neutral-600"
                  >
                    Start time
                  </Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={form.quietHoursStart}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, quietHoursStart: e.target.value }))
                    }
                    disabled={!form.quietHoursEnabled}
                    className="text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="quiet-end"
                    className="text-xs font-medium text-neutral-600"
                  >
                    End time
                  </Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={form.quietHoursEnd}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, quietHoursEnd: e.target.value }))
                    }
                    disabled={!form.quietHoursEnabled}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </section>
        </form>

        <SheetFooter>
          <Button type="button" variant="ghost" onClick={handleReset} className="mr-auto">
            Reset defaults
          </Button>
          <SheetClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </SheetClose>
          <Button
            type="submit"
            form="notification-settings-form"
            disabled={saved}
            className="min-w-[90px]"
          >
            {saved ? "Saved ✓" : "Save changes"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}