"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Bell, BellOff, Mail, MessageSquare, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* ─── Local Sheet primitives ─────────────────────────────────────────────── */

const Sheet = Dialog.Root;
const SheetTrigger = Dialog.Trigger;
const SheetPortal = Dialog.Portal;
const SheetClose = Dialog.Close;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
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
  extends React.ComponentPropsWithoutRef<typeof Dialog.Content> {
  showCloseButton?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  SheetContentProps
>(({ className, children, showCloseButton = true, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <Dialog.Content
      ref={ref}
      className={cn(
        "fixed right-0 top-0 z-50 h-full w-full max-w-md",
        "bg-white shadow-2xl outline-none",
        "flex flex-col",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        "duration-300 ease-in-out",
        "motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>
      )}
    </Dialog.Content>
  </SheetPortal>
));
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 px-6 py-5 border-b border-slate-200", className)} {...props} />
);

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 mt-auto", className)} {...props} />
);

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(({ className, ...props }, ref) => (
  <Dialog.Title ref={ref} className={cn("text-lg font-semibold text-slate-900", className)} {...props} />
));
SheetTitle.displayName = "SheetTitle";

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(({ className, ...props }, ref) => (
  <Dialog.Description ref={ref} className={cn("text-sm text-slate-500", className)} {...props} />
));
SheetDescription.displayName = "SheetDescription";

/* ─── Toggle Switch ──────────────────────────────────────────────────────── */

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function Toggle({ id, checked, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      role="switch"
      id={id}
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
        "transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-slate-900" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0",
          "transition-transform duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

/* ─── Notification Setting Row ───────────────────────────────────────────── */

interface SettingRowProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function SettingRow({ id, icon, label, description, checked, onChange, disabled }: SettingRowProps) {
  const toggleId = `toggle-${id}`;
  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <div className="flex items-start gap-3">
        <div className={cn(
          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
          checked ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
        )}>
          {icon}
        </div>
        <div className="flex flex-col gap-0.5">
          <Label htmlFor={toggleId} className="cursor-pointer text-sm font-medium text-slate-800">
            {label}
          </Label>
          <p className="text-xs text-slate-500 leading-snug">{description}</p>
        </div>
      </div>
      <Toggle id={toggleId} checked={checked} onChange={onChange} disabled={disabled} />
    </div>
  );
}

/* ─── Section Heading ────────────────────────────────────────────────────── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
      {children}
    </p>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

interface NotificationPrefs {
  allNotifications: boolean;
  emailMarketing: boolean;
  emailProductUpdates: boolean;
  emailDigest: boolean;
  pushMentions: boolean;
  pushComments: boolean;
  pushReminders: boolean;
  smsAlerts: boolean;
  emailAddress: string;
  phoneNumber: string;
}

const defaultPrefs: NotificationPrefs = {
  allNotifications: true,
  emailMarketing: false,
  emailProductUpdates: true,
  emailDigest: true,
  pushMentions: true,
  pushComments: false,
  pushReminders: true,
  smsAlerts: false,
  emailAddress: "",
  phoneNumber: "",
};

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [prefs, setPrefs] = React.useState<NotificationPrefs>(defaultPrefs);
  const [saved, setSaved] = React.useState(false);

  function set<K extends keyof NotificationPrefs>(key: K, value: NotificationPrefs[K]) {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function handleToggleAll(checked: boolean) {
    setPrefs((prev) => ({
      ...prev,
      allNotifications: checked,
      emailMarketing: checked ? prev.emailMarketing : false,
      emailProductUpdates: checked ? prev.emailProductUpdates : false,
      emailDigest: checked ? prev.emailDigest : false,
      pushMentions: checked ? prev.pushMentions : false,
      pushComments: checked ? prev.pushComments : false,
      pushReminders: checked ? prev.pushReminders : false,
      smsAlerts: checked ? prev.smsAlerts : false,
    }));
    setSaved(false);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // In a real app, persist to API here.
    setSaved(true);
  }

  function handleDiscard() {
    setPrefs(defaultPrefs);
    setSaved(false);
    setOpen(false);
  }

  const disabled = !prefs.allNotifications;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notification settings
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Choose how and when you receive notifications. Changes take effect immediately after saving.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-2">

            {/* Master toggle */}
            <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex items-center gap-3">
                {prefs.allNotifications
                  ? <Bell className="h-5 w-5 text-slate-700" />
                  : <BellOff className="h-5 w-5 text-slate-400" />}
                <div>
                  <p className="text-sm font-semibold text-slate-800">All notifications</p>
                  <p className="text-xs text-slate-500">Enable or disable all at once</p>
                </div>
              </div>
              <Toggle
                id="all-notifications"
                checked={prefs.allNotifications}
                onChange={handleToggleAll}
              />
            </div>

            {/* Email */}
            <SectionHeading>Email</SectionHeading>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white px-4">
              <SettingRow
                id="email-marketing"
                icon={<Mail className="h-4 w-4" />}
                label="Marketing emails"
                description="Promotions, offers, and news about new features."
                checked={prefs.emailMarketing}
                onChange={(v) => set("emailMarketing", v)}
                disabled={disabled}
              />
              <SettingRow
                id="email-updates"
                icon={<Mail className="h-4 w-4" />}
                label="Product updates"
                description="Release notes and changelog notifications."
                checked={prefs.emailProductUpdates}
                onChange={(v) => set("emailProductUpdates", v)}
                disabled={disabled}
              />
              <SettingRow
                id="email-digest"
                icon={<Mail className="h-4 w-4" />}
                label="Weekly digest"
                description="A summary of your activity sent every Monday."
                checked={prefs.emailDigest}
                onChange={(v) => set("emailDigest", v)}
                disabled={disabled}
              />
            </div>

            <div className="mt-3">
              <Label htmlFor="email-address" className="text-xs font-medium text-slate-600">
                Email address for notifications
              </Label>
              <Input
                id="email-address"
                type="email"
                placeholder="you@example.com"
                value={prefs.emailAddress}
                onChange={(e) => set("emailAddress", e.target.value)}
                disabled={disabled}
                className="mt-1.5"
              />
            </div>

            {/* Push */}
            <SectionHeading>Push notifications</SectionHeading>
            <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white px-4">
              <SettingRow
                id="push-mentions"
                icon={<MessageSquare className="h-4 w-4" />}
                label="Mentions"
                description="When someone @mentions you in a comment or post."
                checked={prefs.pushMentions}
                onChange={(v) => set("pushMentions", v)}
                disabled={disabled}
              />
              <SettingRow
                id="push-comments"
                icon={<MessageSquare className="h-4 w-4" />}
                label="Comments"
                description="Replies and new comments on your content."
                checked={prefs.pushComments}
                onChange={(v) => set("pushComments", v)}
                disabled={disabled}
              />
              <SettingRow
                id="push-reminders"
                icon={<MessageSquare className="h-4 w-4" />}
                label="Reminders"
                description="Due-date and scheduled event reminders."
                checked={prefs.pushReminders}
                onChange={(v) => set("pushReminders", v)}
                disabled={disabled}
              />
            </div>

            {/* SMS */}
            <SectionHeading>SMS</SectionHeading>
            <div className="rounded-xl border border-slate-200 bg-white px-4">
              <SettingRow
                id="sms-alerts"
                icon={<Smartphone className="h-4 w-4" />}
                label="Critical alerts via SMS"
                description="Security events and urgent account activity."
                checked={prefs.smsAlerts}
                onChange={(v) => set("smsAlerts", v)}
                disabled={disabled}
              />
            </div>

            {prefs.smsAlerts && (
              <div className="mt-3">
                <Label htmlFor="phone-number" className="text-xs font-medium text-slate-600">
                  Phone number
                </Label>
                <Input
                  id="phone-number"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={prefs.phoneNumber}
                  onChange={(e) => set("phoneNumber", e.target.value)}
                  className="mt-1.5"
                />
              </div>
            )}

            <div className="h-4" />
          </div>

          <SheetFooter>
            {saved && (
              <span className="mr-auto text-sm font-medium text-emerald-600">
                Settings saved ✓
              </span>
            )}
            <Button type="button" variant="ghost" onClick={handleDiscard}>
              Discard
            </Button>
            <Button type="submit">
              Save preferences
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}