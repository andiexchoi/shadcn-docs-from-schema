"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────
   Local Dialog wrappers (no components/ui/dialog.tsx)
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
        "rounded-xl border border-border bg-background p-6 shadow-xl",
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
          aria-label="Close"
          className={cn(
            "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity",
            "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:pointer-events-none"
          )}
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
  <div
    className={cn("mb-4 flex flex-col gap-1.5", className)}
    {...props}
  />
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
    className={cn("text-lg font-semibold leading-tight text-foreground", className)}
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

/* ─────────────────────────────────────────────
   ConfirmDeleteDialog
───────────────────────────────────────────── */

export interface ConfirmDeleteDialogProps {
  /** The exact project name the user must type to enable deletion. */
  projectName: string;
  /** Called when the user confirms deletion. The dialog will close after this. */
  onConfirm: () => void | Promise<void>;
  /** Called when the dialog is dismissed without confirming. */
  onCancel?: () => void;
  /** Control open state externally. */
  open?: boolean;
  /** Handle open state changes from outside. */
  onOpenChange?: (open: boolean) => void;
  /** Optional trigger element rendered by the dialog. */
  trigger?: React.ReactNode;
  /** Show a loading state on the delete button. */
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
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
      if (!next) {
        setInputValue("");
        if (!next) onCancel?.();
      }
    },
    [isControlled, onOpenChange, onCancel]
  );

  const handleConfirm = React.useCallback(async () => {
    if (inputValue !== projectName) return;
    await onConfirm();
    handleOpenChange(false);
  }, [inputValue, projectName, onConfirm, handleOpenChange]);

  const isMatch = inputValue === projectName;
  const inputId = React.useId();
  const descriptionId = React.useId();

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent
        aria-describedby={descriptionId}
        onInteractOutside={(e) => {
          if (isDeleting) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (isDeleting) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Delete project?</DialogTitle>
          <DialogDescription id={descriptionId}>
            This action is permanent and cannot be undone. All data associated
            with{" "}
            <span className="font-medium text-foreground">{projectName}</span>{" "}
            will be deleted forever.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-2">
          <Label htmlFor={inputId} className="text-sm font-medium">
            Type{" "}
            <span className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground">
              {projectName}
            </span>{" "}
            to confirm
          </Label>
          <Input
            id={inputId}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            placeholder={projectName}
            disabled={isDeleting}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={inputValue.length > 0 && !isMatch}
            className={cn(
              inputValue.length > 0 && !isMatch
                ? "border-destructive focus-visible:ring-destructive"
                : isMatch
                ? "border-green-500 focus-visible:ring-green-500"
                : ""
            )}
          />
          {inputValue.length > 0 && !isMatch && (
            <p className="text-xs text-destructive" role="alert">
              Project name does not match.
            </p>
          )}
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
            disabled={!isMatch || isDeleting}
            onClick={handleConfirm}
            aria-busy={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}