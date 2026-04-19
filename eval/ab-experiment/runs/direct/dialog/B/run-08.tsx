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
  /** The exact project name the user must type to confirm deletion. */
  projectName: string;
  /** Called only after the user has typed the name correctly and pressed Delete. */
  onConfirm: () => void | Promise<void>;
  /** Optional: controlled open state. */
  open?: boolean;
  /** Optional: called when the dialog requests open-state change. */
  onOpenChange?: (open: boolean) => void;
  /** Optional: custom trigger element. Defaults to a destructive "Delete project" button. */
  trigger?: React.ReactNode;
  /** Whether the confirm action is currently loading. */
  isLoading?: boolean;
}

export function ConfirmDeleteDialog({
  projectName,
  onConfirm,
  open,
  onOpenChange,
  trigger,
  isLoading = false,
}: ConfirmDeleteDialogProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [internalOpen, setInternalOpen] = React.useState(false);

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

  const isConfirmEnabled = inputValue === projectName;

  const handleConfirm = async () => {
    if (!isConfirmEnabled) return;
    await onConfirm();
    handleOpenChange(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isConfirmEnabled && !isLoading) {
      handleConfirm();
    }
  };

  const titleId = React.useId();
  const descriptionId = React.useId();
  const inputId = React.useId();

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="destructive">Delete project</Button>
        )}
      </DialogTrigger>

      <DialogContent
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <DialogHeader>
          <DialogTitle id={titleId}>Delete &ldquo;{projectName}&rdquo;?</DialogTitle>
          <DialogDescription id={descriptionId} className="pt-1">
            This action is permanent and cannot be undone. All data associated
            with this project will be deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <strong>Warning:</strong> Deleting this project will remove all
          members, files, and settings permanently.
        </div>

        <div className="space-y-2">
          <Label htmlFor={inputId} className="text-sm font-medium">
            Type{" "}
            <span className="select-all rounded bg-muted px-1 py-0.5 font-mono text-xs font-semibold text-foreground">
              {projectName}
            </span>{" "}
            to confirm
          </Label>
          <Input
            id={inputId}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={projectName}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            disabled={isLoading}
            className={cn(
              inputValue.length > 0 &&
                (isConfirmEnabled
                  ? "border-green-500 focus-visible:ring-green-500"
                  : "border-destructive focus-visible:ring-destructive")
            )}
          />
          {inputValue.length > 0 && !isConfirmEnabled && (
            <p className="text-xs text-destructive" role="alert" aria-live="polite">
              Project name does not match.
            </p>
          )}
        </div>

        <DialogFooter className="mt-6">
          <DialogPrimitive.Close asChild>
            <Button variant="outline" disabled={isLoading}>
              Cancel
            </Button>
          </DialogPrimitive.Close>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmEnabled || isLoading}
            aria-disabled={!isConfirmEnabled || isLoading}
          >
            {isLoading ? "Deleting…" : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}