"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NotificationChannel {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface NotificationCategory {
  id: string;
  label: string;
  description: string;
  channels: Record<string, boolean>;
}

const CHANNELS: NotificationChannel[] = [
  {
    id: "email",
    label: "Email",
    description: "Receive updates via email",
    icon: <Mail className="h-4 w-4" />,
  },
  {
    id: "push",
    label: "Push",
    description: "Browser push notifications",
    icon: <Bell className="h-4 w-4" />,
  },
  {
    id: "sms",
    label: "SMS",
    description: "Text message alerts",
    icon: <MessageSquare className="h-4 w-4" />,
  },
];

const DEFAULT_CATEGORIES: NotificationCategory[] = [
  {
    id: "security",
    label: "Security Alerts",
    description: "Login attempts, password changes, and suspicious activity",
    channels: { email: true, push: true, sms: true },
  },
  {
    id: "updates",
    label: "Product Updates",
    description: "New features, improvements, and release notes",
    channels: { email: true, push: false, sms: false },
  },
  {
    id: "billing",
    label: "Billing & Payments",
    description: "Invoices, receipts, and payment reminders",
    channels: { email: true, push: false, sms: false },
  },
  {
    id: "activity",
    label: "Account Activity",
    description: "Comments, mentions, and team activity",
    channels: { email: false, push: true, sms: false },
  },
  {
    id: "marketing",
    label: "Marketing & Promotions",
    description: "Tips, offers, and promotional content",
    channels: { email: false, push: false, sms: false },
  },
];

function Toggle({
  checked,
  onChange,
  id,
  label,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  id: string;
  label?: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      id={id}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        checked ? "bg-primary" : "bg-input"
      )}
      type="button"
    >
      <span
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  );
}

function CheckboxCell({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  id: string;
}) {
  return (
    <button
      role="checkbox"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      type="button"
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        checked
          ? "border-primary bg-primary text-primary-foreground"
          : "border-input bg-background"
      )}
    >
      {checked && <CheckCircle2 className="h-3.5 w-3.5" />}
    </button>
  );
}

interface SaveState {
  status: "idle" | "saving" | "saved" | "error";
}

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] =
    React.useState<NotificationCategory[]>(DEFAULT_CATEGORIES);
  const [globalEnabled, setGlobalEnabled] = React.useState(true);
  const [saveState, setSaveState] = React.useState<SaveState>({ status: "idle" });

  const toggleChannel = (categoryId: string, channelId: string, value: boolean) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, channels: { ...cat.channels, [channelId]: value } }
          : cat
      )
    );
  };

  const toggleAllForChannel = (channelId: string) => {
    const allEnabled = categories.every((cat) => cat.channels[channelId]);
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        channels: { ...cat.channels, [channelId]: !allEnabled },
      }))
    );
  };

  const handleSave = async () => {
    setSaveState({ status: "saving" });
    await new Promise((r) => setTimeout(r, 900));
    setSaveState({ status: "saved" });
    setTimeout(() => setSaveState({ status: "idle" }), 2000);
  };

  const handleReset = () => {
    setCategories(DEFAULT_CATEGORIES);
    setGlobalEnabled(true);
    setSaveState({ status: "idle" });
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notification Settings
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <Dialog.Content
          className={cn(
            "fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-background shadow-2xl outline-none",
            "sm:max-w-[480px]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "duration-300 ease-in-out"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-semibold leading-none">
                  Notification Preferences
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-xs text-muted-foreground">
                  Manage how and when you receive notifications.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </Dialog.Close>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* Global toggle */}
            <div className="mb-6 flex items-center justify-between rounded-xl border bg-muted/40 px-4 py-3">
              <div>
                <p className="text-sm font-medium">All Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Master switch for all notification channels
                </p>
              </div>
              <Toggle
                id="global-toggle"
                checked={globalEnabled}
                onChange={setGlobalEnabled}
                label="Toggle all notifications"
              />
            </div>

            <div
              className={cn(
                "space-y-6 transition-opacity duration-200",
                !globalEnabled && "pointer-events-none opacity-40"
              )}
            >
              {/* Channel headers */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Notification Channels
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {CHANNELS.map((channel) => {
                    const allEnabled = categories.every(
                      (cat) => cat.channels[channel.id]
                    );
                    return (
                      <button
                        key={channel.id}
                        onClick={() => toggleAllForChannel(channel.id)}
                        type="button"
                        className={cn(
                          "flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all hover:bg-accent",
                          allEnabled
                            ? "border-primary/40 bg-primary/5 text-primary"
                            : "border-border bg-background text-muted-foreground"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-lg",
                            allEnabled
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {channel.icon}
                        </div>
                        <span className="text-xs font-medium">{channel.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category matrix */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Notification Categories
                </h3>
                <div className="overflow-hidden rounded-xl border">
                  {/* Table header */}
                  <div className="grid grid-cols-[1fr_repeat(3,_40px)] items-center gap-3 border-b bg-muted/50 px-4 py-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      Category
                    </span>
                    {CHANNELS.map((ch) => (
                      <div
                        key={ch.id}
                        className="flex items-center justify-center text-muted-foreground"
                        title={ch.label}
                      >
                        {ch.icon}
                      </div>
                    ))}
                  </div>

                  {/* Rows */}
                  {categories.map((category, idx) => (
                    <div
                      key={category.id}
                      className={cn(
                        "grid grid-cols-[1fr_repeat(3,_40px)] items-center gap-3 px-4 py-3 transition-colors hover:bg-accent/30",
                        idx < categories.length - 1 && "border-b"
                      )}
                    >
                      <div className="min-w-0">
                        <Label
                          htmlFor={`${category.id}-email`}
                          className="cursor-pointer text-sm font-medium"
                        >
                          {category.label}
                        </Label>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {category.description}
                        </p>
                      </div>
                      {CHANNELS.map((channel) => (
                        <div key={channel.id} className="flex items-center justify-center">
                          <CheckboxCell
                            id={`${category.id}-${channel.id}`}
                            checked={category.channels[channel.id]}
                            onChange={(val) =>
                              toggleChannel(category.id, channel.id, val)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Frequency section */}
              <div>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Digest Frequency
                </h3>
                <div className="space-y-2">
                  {(
                    [
                      { value: "realtime", label: "Real-time", desc: "As events happen" },
                      { value: "daily", label: "Daily digest", desc: "Once per day summary" },
                      { value: "weekly", label: "Weekly digest", desc: "Once per week summary" },
                    ] as const
                  ).map((option) => {
                    const [selected, setSelected] = React.useState<string>("realtime");
                    return null; // placeholder — handled below
                  })}
                  <FrequencySelector />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4">
            {saveState.status === "saved" && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Settings saved successfully!
              </div>
            )}
            {saveState.status === "error" && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Failed to save. Please try again.
              </div>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleReset}
                type="button"
              >
                Reset to Defaults
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleSave}
                disabled={saveState.status === "saving"}
                type="button"
              >
                {saveState.status === "saving" ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function FrequencySelector() {
  const [selected, setSelected] = React.useState("realtime");

  const options = [
    { value: "realtime", label: "Real-time", desc: "As events happen" },
    { value: "daily", label: "Daily digest", desc: "Once per day summary" },
    { value: "weekly", label: "Weekly digest", desc: "Once per week summary" },
  ];

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all hover:bg-accent",
            selected === option.value
              ? "border-primary/40 bg-primary/5"
              : "border-border bg-background"
          )}
        >
          <div
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              selected === option.value
                ? "border-primary"
                : "border-muted-foreground/40"
            )}
          >
            {selected === option.value && (
              <div className="h-2 w-2 rounded-full bg-primary" />
            )}
          </div>
          <input
            type="radio"
            name="frequency"
            value={option.value}
            checked={selected === option.value}
            onChange={() => setSelected(option.value)}
            className="sr-only"
          />
          <div className="flex-1">
            <p className="text-sm font-medium">{option.label}</p>
            <p className="text-xs text-muted-foreground">{option.desc}</p>
          </div>
        </label>
      ))}
    </div>
  );
}