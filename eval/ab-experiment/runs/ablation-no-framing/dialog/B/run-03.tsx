"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Local Dialog primitives (no components/ui/dialog.tsx installed)           */
/* -------------------------------------------------------------------------- */

const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogTrigger = DialogPrimitive.Trigger;

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
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
        "rounded-xl border border-border bg-background p-6 shadow-xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        className
      )}
      {...props}
    >
      {children}
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
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("mb-4 flex flex-col gap-1", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
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
    className={cn("text-sm text-muted-foreground", className)}
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

/* -------------------------------------------------------------------------- */
/*  ConfirmDeleteDialog                                                        */
/* -------------------------------------------------------------------------- */

export interface ConfirmDeleteDialogProps {
  /** The exact project name the user must type to confirm deletion. */
  projectName: string;
  /** Called when the user confirms deletion. The dialog closes automatically. */
  onConfirm: () => void | Promise<void>;
  /** Called when the user cancels or dismisses the dialog. */
  onCancel?: () => void;
  /**
   * Control the open state externally. When provided, you must also supply
   * `onOpenChange` to keep the state in sync.
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Optional custom trigger element. If omitted a default "Delete project"
   * button is rendered.
   */
  trigger?: React.ReactNode;
  /** Shows a loading spinner on the confirm button while the async callback resolves. */
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
  const [pending, setPending] = React.useState(false);

  const isControlled = open !== undefined;
  const isMatching = inputValue.trim() === projectName;

  /* Reset typed value whenever the dialog opens */
  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next) {
        setInputValue("");
        onCancel?.();
      }
      onOpenChange?.(next);
    },
    [onCancel, onOpenChange]
  );

  const handleConfirm = async () => {
    if (!isMatching) return;
    setPending(true);
    try {
      await onConfirm();
    } finally {
      setPending(false);
      setInputValue("");
      if (isControlled) {
        onOpenChange?.(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  const loading = isDeleting || pending;

  const dialogProps = isControlled
    ? { open, onOpenChange: handleOpenChange }
    : { onOpenChange: handleOpenChange };

  return (
    <Dialog {...dialogProps}>
      {trigger !== undefined ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="destructive">Delete project</Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project?</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. All data associated
            with <strong className="text-foreground">{projectName}</strong> will
            be removed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm-project-name">
            Type{" "}
            <span className="font-semibold text-foreground">{projectName}</span>{" "}
            to confirm
          </Label>
          <Input
            id="confirm-project-name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={projectName}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            disabled={loading}
            className={cn(
              inputValue.length > 0 &&
                (isMatching
                  ? "border-green-500 focus-visible:ring-green-500"
                  : "border-destructive focus-visible:ring-destructive")
            )}
          />
          {inputValue.length > 0 && !isMatching && (
            <p className="text-xs text-destructive" role="alert">
              Project name does not match.
            </p>
          )}
        </div>

        <DialogFooter>
          <DialogPrimitive.Close asChild>
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogPrimitive.Close>
          <Button
            variant="destructive"
            disabled={!isMatching || loading}
            onClick={handleConfirm}
            aria-disabled={!isMatching || loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
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
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
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