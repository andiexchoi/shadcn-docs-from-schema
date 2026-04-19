"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, MessageSquare, AlertCircle, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Local Sheet primitives (no components/ui/sheet.tsx installed)
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
  side?: "top" | "right" | "bottom" | "left";
  showCloseButton?: boolean;
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", showCloseButton = true, className, children, ...props }, ref) => {
  const sideClasses: Record<string, string> = {
    top: "inset-x-0 top-0 border-b data-[state=open]:slide-in-from-top data-[state=closed]:slide-out-to-top",
    right:
      "inset-y-0 right-0 h-full w-3/4 max-w-sm border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
    bottom:
      "inset-x-0 bottom-0 border-t data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
    left: "inset-y-0 left-0 h-full w-3/4 max-w-sm border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
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
          "motion-reduce:transition-none motion-reduce:!duration-0",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none">
            <X className="h-4 w-4" aria-hidden="true" />
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
// Toggle Switch (lightweight, no extra dep)
// ---------------------------------------------------------------------------

interface ToggleProps {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Toggle = ({ id, checked, onCheckedChange, disabled }: ToggleProps) => (
  <button
    role="switch"
    id={id}
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onCheckedChange(!checked)}
    className={cn(
      "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
      "transition-colors duration-200 ease-in-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "motion-reduce:transition-none",
      checked ? "bg-gray-900" : "bg-gray-200"
    )}
    type="button"
  >
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out motion-reduce:transition-none",
        checked ? "translate-x-4" : "translate-x-0"
      )}
    />
  </button>
);

// ---------------------------------------------------------------------------
// Notification preferences data
// ---------------------------------------------------------------------------

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
  icon: React.ReactNode;
  channels: Record<string, boolean>;
}

const CHANNELS: NotificationChannel[] = [
  { id: "email", label: "Email", description: "Receive via email", icon: <Mail className="h-4 w-4" /> },
  { id: "push", label: "Push", description: "Browser push", icon: <Smartphone className="h-4 w-4" /> },
  { id: "sms", label: "SMS", description: "Text message", icon: <MessageSquare className="h-4 w-4" /> },
];

const DEFAULT_CATEGORIES: NotificationCategory[] = [
  {
    id: "account",
    label: "Account activity",
    description: "Sign-ins, password changes, and security alerts.",
    icon: <AlertCircle className="h-4 w-4 text-red-500" />,
    channels: { email: true, push: true, sms: false },
  },
  {
    id: "updates",
    label: "Product updates",
    description: "New features, improvements, and release notes.",
    icon: <Bell className="h-4 w-4 text-blue-500" />,
    channels: { email: true, push: false, sms: false },
  },
  {
    id: "messages",
    label: "Direct messages",
    description: "Messages sent directly to you.",
    icon: <MessageSquare className="h-4 w-4 text-green-500" />,
    channels: { email: false, push: true, sms: false },
  },
  {
    id: "reminders",
    label: "Reminders",
    description: "Upcoming due dates and scheduled events.",
    icon: <Bell className="h-4 w-4 text-amber-500" />,
    channels: { email: true, push: true, sms: true },
  },
];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = React.useState<NotificationCategory[]>(
    DEFAULT_CATEGORIES.map((c) => ({ ...c, channels: { ...c.channels } }))
  );
  // Track saved state to allow cancel
  const [saved, setSaved] = React.useState<NotificationCategory[]>(
    DEFAULT_CATEGORIES.map((c) => ({ ...c, channels: { ...c.channels } }))
  );

  const handleToggle = (categoryId: string, channelId: string, value: boolean) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, channels: { ...cat.channels, [channelId]: value } }
          : cat
      )
    );
  };

  const handleSave = () => {
    setSaved(categories.map((c) => ({ ...c, channels: { ...c.channels } })));
    setOpen(false);
  };

  const handleCancel = () => {
    setCategories(saved.map((c) => ({ ...c, channels: { ...c.channels } })));
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" aria-hidden="true" />
          Notification settings
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col w-full max-w-sm sm:max-w-md overflow-hidden">
        <SheetHeader>
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Choose how and where you receive notifications for each category.
          </SheetDescription>
        </SheetHeader>

        {/* Channel legend */}
        <div className="px-6 pt-4 pb-2">
          <div className="flex items-center justify-end gap-4 text-xs font-medium text-gray-500 uppercase tracking-wide pr-1">
            {CHANNELS.map((ch) => (
              <span key={ch.id} className="w-10 text-center leading-tight">
                {ch.label}
              </span>
            ))}
          </div>
        </div>

        {/* Category rows */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-start justify-between gap-4 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="mt-0.5 shrink-0">{cat.icon}</span>
                <div className="min-w-0">
                  <Label
                    htmlFor={`${cat.id}-email`}
                    className="text-sm font-medium text-gray-900 cursor-default"
                  >
                    {cat.label}
                  </Label>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">{cat.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 mt-0.5">
                {CHANNELS.map((ch) => (
                  <div key={ch.id} className="w-10 flex justify-center">
                    <Toggle
                      id={`${cat.id}-${ch.id}`}
                      checked={cat.channels[ch.id] ?? false}
                      onCheckedChange={(val) => handleToggle(cat.id, ch.id, val)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Global mute notice */}
        <div className="px-6 pb-2">
          <div className="flex items-start gap-2 rounded-md bg-amber-50 border border-amber-200 px-3 py-2.5 text-xs text-amber-800">
            <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-500" aria-hidden="true" />
            <p>
              Account activity notifications cannot be fully disabled for security reasons.
            </p>
          </div>
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={handleCancel} type="button">
            Cancel
          </Button>
          <Button onClick={handleSave} type="button">
            Save preferences
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}