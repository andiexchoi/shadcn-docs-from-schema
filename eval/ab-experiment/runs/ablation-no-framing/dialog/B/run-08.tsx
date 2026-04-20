"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Local Dialog wrappers (no components/ui/dialog.tsx installed)
───────────────────────────────────────────── */

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
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
DialogOverlay.displayName = "DialogOverlay";

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
  }
>(({ className, children, showCloseButton = true, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
        "rounded-xl border border-zinc-200 bg-white p-6 shadow-xl",
        "dark:border-zinc-800 dark:bg-zinc-950",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "duration-200",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close
          className={cn(
            "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity",
            "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2",
            "disabled:pointer-events-none",
            "dark:ring-offset-zinc-950 dark:focus:ring-zinc-300"
          )}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-4 flex flex-col gap-1.5", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight text-zinc-900 dark:text-zinc-50",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-6 flex justify-end gap-3", className)}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

/* ─────────────────────────────────────────────
   ConfirmDeleteDialog
───────────────────────────────────────────── */

export interface ConfirmDeleteDialogProps {
  /** The project name the user must type to confirm deletion. */
  projectName: string;
  /** Called when the user confirms deletion. The dialog closes automatically. */
  onConfirm: () => void | Promise<void>;
  /** Called when the dialog is cancelled / closed without confirming. */
  onCancel?: () => void;
  /** Controlled open state. If omitted, the dialog manages its own state. */
  open?: boolean;
  /** Required when using controlled `open`. */
  onOpenChange?: (open: boolean) => void;
  /** Optional custom trigger element. Defaults to a destructive "Delete project" button. */
  trigger?: React.ReactNode;
  /** Show a loading spinner on the confirm button while an async onConfirm resolves. */
  loading?: boolean;
}

export function ConfirmDeleteDialog({
  projectName,
  onConfirm,
  onCancel,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
  loading = false,
}: ConfirmDeleteDialogProps) {
  const isControlled = controlledOpen !== undefined;

  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = isControlled ? controlledOpen : internalOpen;

  const [typedName, setTypedName] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  const isConfirmEnabled = typedName === projectName;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next) {
        setTypedName("");
        onCancel?.();
      }
      if (isControlled) {
        controlledOnOpenChange?.(next);
      } else {
        setInternalOpen(next);
      }
    },
    [isControlled, controlledOnOpenChange, onCancel]
  );

  const handleConfirm = async () => {
    if (!isConfirmEnabled) return;
    setIsDeleting(true);
    try {
      await onConfirm();
      handleOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const busy = loading || isDeleting;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="destructive">Delete project</Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this project?</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. All data associated
            with{" "}
            <span className="font-medium text-zinc-900 dark:text-zinc-100">
              {projectName}
            </span>{" "}
            will be deleted immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm-project-name">
            Type{" "}
            <span className="font-semibold text-zinc-900 dark:text-zinc-100 select-all">
              {projectName}
            </span>{" "}
            to confirm
          </Label>
          <Input
            id="confirm-project-name"
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            placeholder={projectName}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            disabled={busy}
            aria-describedby="confirm-project-name-hint"
          />
          {typedName.length > 0 && !isConfirmEnabled && (
            <p
              id="confirm-project-name-hint"
              className="text-xs text-red-500"
              role="alert"
            >
              Project name does not match.
            </p>
          )}
        </div>

        <DialogFooter>
          <DialogPrimitive.Close asChild>
            <Button variant="outline" disabled={busy}>
              Cancel
            </Button>
          </DialogPrimitive.Close>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmEnabled || busy}
            aria-disabled={!isConfirmEnabled || busy}
          >
            {busy ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Deleting…
              </span>
            ) : (
              "Delete project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}