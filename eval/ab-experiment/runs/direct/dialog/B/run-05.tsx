"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*  Local Dialog wrappers (no components/ui/dialog.tsx installed)              */
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
      "@media (prefers-reduced-motion: reduce) { animation: none !important; }",
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
        "rounded-lg border bg-background p-6 shadow-lg",
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
      {showCloseButton && (
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
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
  <div
    className={cn("flex flex-col space-y-1.5 text-left", className)}
    {...props}
  />
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
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = "DialogDescription";

/* -------------------------------------------------------------------------- */
/*  ConfirmDeleteDialog                                                         */
/* -------------------------------------------------------------------------- */

export interface ConfirmDeleteDialogProps {
  /** The name the user must type to confirm deletion */
  projectName: string;
  /** Called only when the user has confirmed and clicked Delete */
  onConfirm: () => void;
  /** Optional: controlled open state */
  open?: boolean;
  /** Optional: callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Optional: whether the delete action is in a loading/pending state */
  isDeleting?: boolean;
  /** Optional: custom trigger element. Defaults to a destructive "Delete project" button */
  trigger?: React.ReactNode;
}

export function ConfirmDeleteDialog({
  projectName,
  onConfirm,
  open,
  onOpenChange,
  isDeleting = false,
  trigger,
}: ConfirmDeleteDialogProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputId = React.useId();

  const isConfirmed = inputValue === projectName;

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setInputValue("");
    }
    onOpenChange?.(nextOpen);
  }

  function handleConfirm() {
    if (!isConfirmed) return;
    onConfirm();
  }

  const controlledProps =
    open !== undefined ? { open, onOpenChange: handleOpenChange } : { onOpenChange: handleOpenChange };

  return (
    <Dialog {...controlledProps}>
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
            with{" "}
            <span className="font-medium text-foreground">{projectName}</span>{" "}
            will be deleted immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-2">
          <Label htmlFor={inputId}>
            Type{" "}
            <span className="font-semibold text-foreground">{projectName}</span>{" "}
            to confirm
          </Label>
          <Input
            id={inputId}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            placeholder={projectName}
            autoComplete="off"
            spellCheck={false}
            aria-describedby={`${inputId}-hint`}
          />
          {inputValue.length > 0 && !isConfirmed && (
            <p
              id={`${inputId}-hint`}
              className="text-xs text-destructive"
              role="alert"
              aria-live="polite"
            >
              Project name does not match.
            </p>
          )}
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
            onClick={handleConfirm}
          >
            {isDeleting ? "Deleting…" : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}