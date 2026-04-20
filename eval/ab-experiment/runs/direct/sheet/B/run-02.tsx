"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Minimal Sheet built from Radix Dialog primitives
// ---------------------------------------------------------------------------

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

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  showCloseButton?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ className, children, showCloseButton = true, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col",
        "bg-white shadow-2xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        "duration-300 ease-in-out",
        "focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <SheetClose
          className={cn(
            "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white",
            "transition-opacity hover:opacity-100",
            "focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2",
            "disabled:pointer-events-none"
          )}
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </SheetClose>
      )}
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = "SheetContent";

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-1.5 border-b px-6 py-5", className)}
    {...props}
  />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-center justify-end gap-3 border-t bg-slate-50 px-6 py-4",
      className
    )}
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
    className={cn("text-lg font-semibold text-slate-900", className)}
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
    className={cn("text-sm text-slate-500", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

// ---------------------------------------------------------------------------
// Toggle Switch
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
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full",
        "border-2 border-transparent transition-colors duration-200 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-slate-900" : "bg-slate-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg",
          "ring-0 transition-transform duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Notification preference types & data
// ---------------------------------------------------------------------------

type Channel = "email" | "push" | "sms" | "inApp";

interface NotificationCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  channels: Record<Channel, boolean>;
}

const INITIAL_CATEGORIES: NotificationCategory[] = [
  {
    id: "security",
    label: "Security alerts",
    description: "Sign-ins, password changes, and suspicious activity.",
    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
    channels: { email: true, push: true, sms: true, inApp: true },
  },
  {
    id: "updates",
    label: "Product updates",
    description: "New features, improvements, and release notes.",
    icon: <Bell className="h-5 w-5 text-violet-500" />,
    channels: { email: true, push: false, sms: false, inApp: true },
  },
  {
    id: "messages",
    label: "Messages",
    description: "Direct messages and mentions from teammates.",
    icon: <MessageSquare className="h-5 w-5 text-blue-500" />,
    channels: { email: false, push: true, sms: false, inApp: true },
  },
  {
    id: "marketing",
    label: "Marketing & promotions",
    description: "Tips, offers, and surveys from our team.",
    icon: <Mail className="h-5 w-5 text-emerald-500" />,
    channels: { email: true, push: false, sms: false, inApp: false },
  },
  {
    id: "mobile",
    label: "Mobile activity",
    description: "App usage summaries and device-specific alerts.",
    icon: <Smartphone className="h-5 w-5 text-amber-500" />,
    channels: { email: false, push: true, sms: false, inApp: true },
  },
];

const CHANNEL_LABELS: Record<Channel, string> = {
  email: "Email",
  push: "Push",
  sms: "SMS",
  inApp: "In-app",
};

const CHANNELS: Channel[] = ["email", "push", "sms", "inApp"];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<NotificationCategory[]>(
    INITIAL_CATEGORIES
  );
  const [saved, setSaved] = React.useState(false);

  // Reset saved indicator when sheet opens
  React.useEffect(() => {
    if (open) setSaved(false);
  }, [open]);

  function handleToggle(categoryId: string, channel: Channel, value: boolean) {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, channels: { ...cat.channels, [channel]: value } }
          : cat
      )
    );
    setSaved(false);
  }

  function handleSave() {
    // In a real app, persist to API here.
    setSaved(true);
  }

  function handleReset() {
    setCategories(INITIAL_CATEGORIES);
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

      <SheetContent>
        {/* Header */}
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-slate-700" />
            <SheetTitle>Notification preferences</SheetTitle>
          </div>
          <SheetDescription>
            Choose how and when you want to be notified for each category.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Channel legend */}
          <div className="mb-5 flex items-center justify-end gap-4">
            {CHANNELS.map((ch) => (
              <span
                key={ch}
                className="w-10 text-center text-xs font-medium text-slate-500"
              >
                {CHANNEL_LABELS[ch]}
              </span>
            ))}
          </div>

          {/* Category rows */}
          <ul className="space-y-6" role="list">
            {categories.map((cat) => (
              <li key={cat.id} className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-4">
                  {/* Icon + label + description */}
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0">{cat.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {cat.label}
                      </p>
                      <p className="text-xs text-slate-500">{cat.description}</p>
                    </div>
                  </div>

                  {/* Channel toggles */}
                  <div className="flex shrink-0 items-center gap-4">
                    {CHANNELS.map((ch) => {
                      const switchId = `${cat.id}-${ch}`;
                      return (
                        <div
                          key={ch}
                          className="flex w-10 flex-col items-center gap-1"
                        >
                          <Label htmlFor={switchId} className="sr-only">
                            {`${cat.label} — ${CHANNEL_LABELS[ch]}`}
                          </Label>
                          <ToggleSwitch
                            id={switchId}
                            checked={cat.channels[ch]}
                            onCheckedChange={(val) =>
                              handleToggle(cat.id, ch, val)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100" role="separator" />
              </li>
            ))}
          </ul>

          {/* Global mute notice */}
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Do Not Disturb: </span>
              You can silence all notifications temporarily from your account
              profile page. Individual preferences saved here still apply when
              Do Not Disturb is off.
            </p>
          </div>
        </div>

        {/* Footer */}
        <SheetFooter>
          {saved && (
            <span className="mr-auto text-sm font-medium text-emerald-600">
              Preferences saved ✓
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-slate-600"
          >
            Reset to defaults
          </Button>
          <SheetClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </SheetClose>
          <Button size="sm" onClick={handleSave}>
            Save preferences
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}