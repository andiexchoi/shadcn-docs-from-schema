"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Local Dialog wrappers (no components/ui/dialog.tsx installed)             */
/* -------------------------------------------------------------------------- */

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

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
      "@media (prefers-reduced-motion: reduce) { animation: none }",
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
        "rounded-lg border bg-white p-6 shadow-xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "motion-reduce:transition-none motion-reduce:animate-none",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
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
    className={cn("text-sm text-neutral-500", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

/* -------------------------------------------------------------------------- */
/*  ConfirmDeleteDialog                                                        */
/* -------------------------------------------------------------------------- */

export interface ConfirmDeleteDialogProps {
  /** The name of the project the user must type to confirm deletion. */
  projectName: string;
  /** Called when the user confirms deletion. */
  onConfirm: () => void | Promise<void>;
  /** Called when the dialog is dismissed without confirming. */
  onCancel?: () => void;
  /** Control open state externally. */
  open?: boolean;
  /** Called when the dialog requests a state change. */
  onOpenChange?: (open: boolean) => void;
  /** Optional trigger element. When omitted, the dialog must be opened via `open` prop. */
  trigger?: React.ReactNode;
}

export function ConfirmDeleteDialog({
  projectName,
  onConfirm,
  onCancel,
  open,
  onOpenChange,
  trigger,
}: ConfirmDeleteDialogProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  const isConfirmed = inputValue === projectName;

  /* Reset input whenever the dialog opens */
  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) {
        setInputValue("");
        setIsDeleting(false);
        onCancel?.();
      }
      onOpenChange?.(nextOpen);
    },
    [onCancel, onOpenChange]
  );

  const handleConfirm = async () => {
    if (!isConfirmed || isDeleting) return;
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isConfirmed) {
      void handleConfirm();
    }
  };

  const inputId = React.useId();
  const descriptionId = React.useId();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent aria-describedby={descriptionId}>
        <DialogHeader>
          <DialogTitle>Delete &ldquo;{projectName}&rdquo;?</DialogTitle>
          <DialogDescription id={descriptionId}>
            This action is permanent and cannot be undone. All data associated
            with this project will be deleted forever.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 flex flex-col gap-3">
          <p className="text-sm text-neutral-700">
            To confirm, type{" "}
            <span className="font-semibold text-neutral-900">{projectName}</span>{" "}
            below:
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={inputId} className="sr-only">
              Project name confirmation
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
              aria-invalid={inputValue.length > 0 && !isConfirmed}
              className={cn(
                inputValue.length > 0 && !isConfirmed
                  ? "border-red-400 focus-visible:ring-red-400"
                  : isConfirmed
                  ? "border-green-500 focus-visible:ring-green-500"
                  : ""
              )}
            />
            {inputValue.length > 0 && !isConfirmed && (
              <p className="text-xs text-red-500" role="alert" aria-live="polite">
                Project name does not match.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            disabled={!isConfirmed || isDeleting}
            onClick={() => void handleConfirm()}
            aria-busy={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}