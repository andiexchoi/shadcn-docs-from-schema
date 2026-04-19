"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/* ─── Local Dialog wrappers (no components/ui/dialog.tsx installed) ─── */

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
        "rounded-lg border border-border bg-background p-6 shadow-lg",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "motion-reduce:transform-none motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogClose
          className={cn(
            "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity",
            "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            "disabled:pointer-events-none"
          )}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
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

/* ─── ConfirmDeleteDialog ─── */

export interface ConfirmDeleteDialogProps {
  /** The project name the user must type to confirm deletion. */
  projectName: string;
  /** Called when the user confirms deletion. */
  onConfirm: () => void | Promise<void>;
  /** Optional: control open state from outside. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Optional: custom trigger element. Defaults to a destructive button. */
  trigger?: React.ReactNode;
  /** Whether the delete action is in a loading/pending state. */
  isDeleting?: boolean;
}

export function ConfirmDeleteDialog({
  projectName,
  onConfirm,
  open,
  onOpenChange,
  trigger,
  isDeleting = false,
}: ConfirmDeleteDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (!next) setInputValue("");
      if (isControlled) {
        onOpenChange?.(next);
      } else {
        setInternalOpen(next);
        onOpenChange?.(next);
      }
    },
    [isControlled, onOpenChange]
  );

  const confirmed = inputValue === projectName;

  const handleConfirm = async () => {
    if (!confirmed) return;
    await onConfirm();
    handleOpenChange(false);
  };

  const inputId = React.useId();
  const descriptionId = React.useId();

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="destructive">Delete project</Button>
        )}
      </DialogTrigger>

      <DialogContent aria-describedby={descriptionId}>
        <DialogHeader>
          <DialogTitle>Delete &ldquo;{projectName}&rdquo;?</DialogTitle>
          <DialogDescription id={descriptionId}>
            This action is permanent and cannot be undone. All data associated
            with this project will be deleted forever.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 space-y-3">
          <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            To confirm, type{" "}
            <span className="font-semibold">{projectName}</span> in the field
            below.
          </div>

          <div className="space-y-1.5">
            <Label htmlFor={inputId}>Project name</Label>
            <Input
              id={inputId}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPaste={(e) => e.preventDefault()}
              placeholder={projectName}
              autoComplete="off"
              aria-required="true"
              aria-invalid={inputValue.length > 0 && !confirmed}
              className={cn(
                inputValue.length > 0 &&
                  !confirmed &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            {inputValue.length > 0 && !confirmed && (
              <p className="text-xs text-destructive" role="alert">
                The name you entered does not match.
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
            disabled={!confirmed || isDeleting}
            onClick={handleConfirm}
          >
            {isDeleting ? "Deleting…" : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}