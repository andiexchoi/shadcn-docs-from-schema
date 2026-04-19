"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Minimal Sheet primitives built on top of @radix-ui/react-dialog
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
      "transition-opacity duration-200",
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
  const sideStyles: Record<NonNullable<SheetContentProps["side"]>, string> = {
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
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "duration-300 ease-in-out",
          sideStyles[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-opacity">
            <X className="h-5 w-5" />
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

// ---------------------------------------------------------------------------
// Toggle switch component (no extra dependency needed)
// ---------------------------------------------------------------------------

interface ToggleProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Toggle = ({ id, checked, onCheckedChange, disabled }: ToggleProps) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onCheckedChange(!checked)}
    className={cn(
      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
      "transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      checked ? "bg-indigo-600" : "bg-gray-200",
      disabled && "opacity-50 cursor-not-allowed"
    )}
  >
    <span
      className={cn(
        "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);

// ---------------------------------------------------------------------------
// Notification preference data
// ---------------------------------------------------------------------------

interface NotificationChannel {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
}

interface NotificationCategory {
  id: string;
  label: string;
  description: string;
  channels: Record<string, boolean>;
}

const CHANNELS: NotificationChannel[] = [
  { id: "email", label: "Email", description: "Sent to your inbox", icon: Mail },
  { id: "push", label: "Push", description: "Browser & app alerts", icon: Smartphone },
  { id: "sms", label: "SMS", description: "Text to your phone", icon: MessageSquare },
  { id: "inapp", label: "In-app", description: "Inside the dashboard", icon: AlertCircle },
];

const DEFAULT_CATEGORIES: NotificationCategory[] = [
  {
    id: "account",
    label: "Account activity",
    description: "Sign-ins, password changes, and billing updates",
    channels: { email: true, push: true, sms: false, inapp: true },
  },
  {
    id: "mentions",
    label: "Mentions & comments",
    description: "When someone mentions you or replies to your comment",
    channels: { email: true, push: true, sms: false, inapp: true },
  },
  {
    id: "updates",
    label: "Product updates",
    description: "New features, improvements, and announcements",
    channels: { email: true, push: false, sms: false, inapp: false },
  },
  {
    id: "reminders",
    label: "Reminders",
    description: "Scheduled reminders for tasks and events",
    channels: { email: false, push: true, sms: true, inapp: true },
  },
  {
    id: "security",
    label: "Security alerts",
    description: "Suspicious activity and failed login attempts",
    channels: { email: true, push: true, sms: true, inapp: true },
  },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<NotificationCategory[]>(
    DEFAULT_CATEGORIES
  );
  const [saved, setSaved] = React.useState(false);

  const handleToggle = (categoryId: string, channelId: string, value: boolean) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, channels: { ...cat.channels, [channelId]: value } }
          : cat
      )
    );
    setSaved(false);
  };

  const handleSave = () => {
    // In a real app, persist to backend here
    setSaved(true);
    setTimeout(() => setOpen(false), 800);
  };

  const handleCancel = () => {
    setCategories(DEFAULT_CATEGORIES);
    setSaved(false);
    setOpen(false);
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
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-600" />
            <SheetTitle>Notification preferences</SheetTitle>
          </div>
          <SheetDescription>
            Choose how and when you want to be notified for each activity type.
          </SheetDescription>
        </SheetHeader>

        {/* Channel legend */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Channels
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {CHANNELS.map(({ id, label, description, icon: Icon }) => (
              <div key={id} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-indigo-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-700 leading-none">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable form area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {categories.map((category) => (
            <fieldset key={category.id} className="group">
              <legend className="w-full">
                <span className="block text-sm font-semibold text-gray-800">
                  {category.label}
                </span>
                <span className="block text-xs text-gray-500 mt-0.5">
                  {category.description}
                </span>
              </legend>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {CHANNELS.map(({ id: channelId, label, icon: Icon }) => {
                  const toggleId = `${category.id}-${channelId}`;
                  const isOn = category.channels[channelId] ?? false;

                  return (
                    <div
                      key={channelId}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors",
                        isOn
                          ? "border-indigo-200 bg-indigo-50"
                          : "border-gray-100 bg-white"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          isOn ? "text-indigo-600" : "text-gray-400"
                        )}
                      />
                      <Label
                        htmlFor={toggleId}
                        className={cn(
                          "text-xs font-medium cursor-pointer",
                          isOn ? "text-indigo-700" : "text-gray-500"
                        )}
                      >
                        {label}
                      </Label>
                      <Toggle
                        id={toggleId}
                        checked={isOn}
                        onCheckedChange={(val) =>
                          handleToggle(category.id, channelId, val)
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </fieldset>
          ))}

          {/* Global quiet hours section */}
          <div className="rounded-xl border border-dashed border-gray-200 p-4 bg-gray-50">
            <p className="text-sm font-semibold text-gray-800 mb-1">Quiet hours</p>
            <p className="text-xs text-gray-500 mb-3">
              Pause all non-critical notifications during this time window.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="quiet-from" className="text-xs text-gray-500">
                  From
                </Label>
                <input
                  id="quiet-from"
                  type="time"
                  defaultValue="22:00"
                  className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="quiet-to" className="text-xs text-gray-500">
                  To
                </Label>
                <input
                  id="quiet-to"
                  type="time"
                  defaultValue="08:00"
                  className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <SheetFooter>
          {saved && (
            <span className="mr-auto text-sm text-green-600 font-medium animate-in fade-in">
              ✓ Preferences saved
            </span>
          )}
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Save preferences
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default NotificationSettingsSheet;