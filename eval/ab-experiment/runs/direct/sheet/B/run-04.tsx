"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Bell, Mail, Smartphone, MessageSquare } from "lucide-react";
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
      "transition-opacity duration-200",
      className
    )}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  side?: "right" | "left" | "top" | "bottom";
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => {
  const sideClasses: Record<NonNullable<SheetContentProps["side"]>, string> = {
    right:
      "inset-y-0 right-0 h-full w-full max-w-sm border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
    left: "inset-y-0 left-0 h-full w-full max-w-sm border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left",
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
          "fixed z-50 flex flex-col bg-background shadow-xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "duration-300 ease-in-out",
          sideClasses[side],
          className
        )}
        {...props}
      >
        {children}
        <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </DialogPrimitive.Content>
    </SheetPortal>
  );
});
SheetContent.displayName = "SheetContent";

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-1.5 px-6 pt-6 pb-4 border-b", className)}
    {...props}
  />
);

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 px-6 py-4 border-t sm:flex-row sm:justify-end",
      className
    )}
    {...props}
  />
);

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
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
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SheetDescription.displayName = "SheetDescription";

// ---------------------------------------------------------------------------
// Toggle switch (no Switch component installed)
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
      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent",
      "transition-colors duration-200 ease-in-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:cursor-not-allowed disabled:opacity-50",
      checked ? "bg-primary" : "bg-input"
    )}
  >
    <span
      className={cn(
        "pointer-events-none inline-block h-5 w-5 rounded-full bg-background shadow-lg ring-0",
        "transition-transform duration-200 ease-in-out",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);

// ---------------------------------------------------------------------------
// Notification preferences types & data
// ---------------------------------------------------------------------------

interface NotificationCategory {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  channels: {
    email: boolean;
    push: boolean;
    sms: boolean;
    inApp: boolean;
  };
}

type Channel = keyof NotificationCategory["channels"];

const INITIAL_CATEGORIES: NotificationCategory[] = [
  {
    id: "account",
    label: "Account activity",
    description: "Sign-ins, password changes, and security alerts",
    icon: <Bell className="h-4 w-4" />,
    channels: { email: true, push: true, sms: false, inApp: true },
  },
  {
    id: "updates",
    label: "Product updates",
    description: "New features, improvements, and release notes",
    icon: <Mail className="h-4 w-4" />,
    channels: { email: true, push: false, sms: false, inApp: false },
  },
  {
    id: "messages",
    label: "Messages",
    description: "Direct messages and replies from your team",
    icon: <MessageSquare className="h-4 w-4" />,
    channels: { email: true, push: true, sms: true, inApp: true },
  },
  {
    id: "reminders",
    label: "Reminders",
    description: "Upcoming deadlines, scheduled tasks, and events",
    icon: <Smartphone className="h-4 w-4" />,
    channels: { email: false, push: true, sms: false, inApp: true },
  },
];

const CHANNEL_LABELS: Record<Channel, string> = {
  email: "Email",
  push: "Push",
  sms: "SMS",
  inApp: "In-app",
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function NotificationSettingsSheet() {
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] =
    React.useState<NotificationCategory[]>(INITIAL_CATEGORIES);
  const [saved, setSaved] = React.useState(false);

  // Reset to last-saved state on open so unsaved changes are discarded
  const [savedCategories, setSavedCategories] =
    React.useState<NotificationCategory[]>(INITIAL_CATEGORIES);

  const handleOpenChange = (next: boolean) => {
    if (next) {
      // Reset form to last saved snapshot
      setCategories(savedCategories);
      setSaved(false);
    }
    setOpen(next);
  };

  const handleToggle = (categoryId: string, channel: Channel) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              channels: {
                ...cat.channels,
                [channel]: !cat.channels[channel],
              },
            }
          : cat
      )
    );
    setSaved(false);
  };

  const handleSave = () => {
    setSavedCategories(categories);
    setSaved(true);
    setTimeout(() => {
      setOpen(false);
    }, 600);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Bell className="h-4 w-4" />
          Notification settings
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full max-w-md sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Notification preferences</SheetTitle>
          <SheetDescription>
            Choose how and where you receive notifications for each category.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Channel header row */}
          <div className="flex items-center gap-2">
            <div className="flex-1" />
            {(Object.keys(CHANNEL_LABELS) as Channel[]).map((ch) => (
              <span
                key={ch}
                className="w-12 text-center text-xs font-medium text-muted-foreground"
              >
                {CHANNEL_LABELS[ch]}
              </span>
            ))}
          </div>

          {/* Category rows */}
          <fieldset className="space-y-5 border-0 p-0 m-0">
            <legend className="sr-only">Notification categories</legend>
            {categories.map((cat) => (
              <div key={cat.id} className="space-y-3">
                {/* Category info */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-muted-foreground">
                    {cat.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none">
                      {cat.label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {cat.description}
                    </p>
                  </div>
                </div>

                {/* Channel toggles */}
                <div className="flex items-center gap-2 pl-7">
                  <div className="flex-1" />
                  {(Object.keys(CHANNEL_LABELS) as Channel[]).map((ch) => {
                    const toggleId = `${cat.id}-${ch}`;
                    return (
                      <div
                        key={ch}
                        className="w-12 flex flex-col items-center gap-1"
                      >
                        <Label htmlFor={toggleId} className="sr-only">
                          {cat.label} — {CHANNEL_LABELS[ch]}
                        </Label>
                        <Toggle
                          id={toggleId}
                          checked={cat.channels[ch]}
                          onCheckedChange={() => handleToggle(cat.id, ch)}
                        />
                      </div>
                    );
                  })}
                </div>

                <hr className="border-border" />
              </div>
            ))}
          </fieldset>

          {/* Global mute */}
          <div className="rounded-lg border bg-muted/40 p-4 space-y-1">
            <p className="text-sm font-medium">Quiet hours</p>
            <p className="text-xs text-muted-foreground">
              Push and SMS notifications are automatically paused between
              10 PM and 8 AM in your local time zone.
            </p>
          </div>
        </div>

        <SheetFooter>
          <Button variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saved} className="gap-2">
            {saved ? "Saved!" : "Save preferences"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}