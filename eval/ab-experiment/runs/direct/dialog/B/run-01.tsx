"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Local Dialog primitives (no shadcn wrapper)
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
      "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "motion-reduce:animate-none",
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
        "rounded-lg border bg-white p-6 shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "motion-reduce:animate-none",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close
          className={cn(
            "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity",
            "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:pointer-events-none"
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

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-gray-900", className)}
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
    className={cn("text-sm text-gray-500", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

/* ─────────────────────────────────────────────
   ConfirmDeleteDialog component
───────────────────────────────────────────── */

export interface ConfirmDeleteDialogProps {
  /** The name of the project the user must type to confirm deletion. */
  projectName: string;
  /** Called when the user confirms deletion. */
  onConfirm: () => void | Promise<void>;
  /** Called when the dialog is dismissed without confirming. */
  onCancel?: () => void;
  /** Controls whether the dialog is open (controlled usage). */
  open?: boolean;
  /** Called when the open state should change (controlled usage). */
  onOpenChange?: (open: boolean) => void;
  /** The trigger element that opens the dialog. */
  trigger?: React.ReactNode;
  /** Shows a loading state on the delete button. */
  isDeleting?: boolean;
}

export function ConfirmDeleteDialog({
  projectName,
  onConfirm,
  onCancel,
  open,
  onOpenChange,
  trigger,
  isDeleting = false,
}: ConfirmDeleteDialogProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next) {
        // Reset input whenever the dialog closes
        setInputValue("");
        onCancel?.();
      }
      if (isControlled) {
        onOpenChange?.(next);
      } else {
        setInternalOpen(next);
      }
    },
    [isControlled, onCancel, onOpenChange]
  );

  const isConfirmEnabled =
    inputValue.trim() === projectName.trim() && !isDeleting;

  const handleConfirm = async () => {
    if (!isConfirmEnabled) return;
    await onConfirm();
    // Let the parent decide whether to close (via onOpenChange), but also
    // reset input in case the dialog stays open after an async error.
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isConfirmEnabled) {
      void handleConfirm();
    }
  };

  const titleId = React.useId();
  const descriptionId = React.useId();
  const inputId = React.useId();

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <DialogHeader>
          <DialogTitle id={titleId}>Delete &ldquo;{projectName}&rdquo;?</DialogTitle>
          <DialogDescription id={descriptionId}>
            This action is permanent and cannot be undone. All data associated
            with this project will be deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-3">
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            You are about to permanently delete{" "}
            <span className="font-semibold">{projectName}</span>.
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={inputId} className="text-sm font-medium text-gray-700">
              To confirm, type{" "}
              <span className="font-semibold text-gray-900">{projectName}</span>{" "}
              below:
            </Label>
            <Input
              id={inputId}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={projectName}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              disabled={isDeleting}
              className={cn(
                "transition-colors",
                inputValue.length > 0 && inputValue !== projectName
                  ? "border-red-400 focus-visible:ring-red-400"
                  : inputValue === projectName
                  ? "border-green-500 focus-visible:ring-green-500"
                  : ""
              )}
            />
            {inputValue.length > 0 && inputValue !== projectName && (
              <p className="text-xs text-red-600" role="alert">
                Project name doesn&apos;t match. Please try again.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogPrimitive.Close asChild>
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() => {
                setInputValue("");
                onCancel?.();
              }}
            >
              Cancel
            </Button>
          </DialogPrimitive.Close>

          <Button
            variant="destructive"
            disabled={!isConfirmEnabled}
            onClick={() => void handleConfirm()}
            aria-disabled={!isConfirmEnabled}
          >
            {isDeleting ? (
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