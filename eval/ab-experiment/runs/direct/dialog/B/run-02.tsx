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
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "motion-reduce:transition-none",
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
        "rounded-lg border border-border bg-background p-6 shadow-xl",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
        "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
        "motion-reduce:transition-none",
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
  <div className={cn("mb-4 flex flex-col gap-1.5", className)} {...props} />
);

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
    className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
    {...props}
  />
);

/* ─── ConfirmDeleteDialog ─── */

export interface ConfirmDeleteDialogProps {
  /** The project name the user must type to confirm deletion. */
  projectName: string;
  /** Called when the user confirms deletion. */
  onConfirm: () => void;
  /** Called when the dialog is cancelled or closed. */
  onCancel?: () => void;
  /** Whether the delete action is currently in progress. */
  isDeleting?: boolean;
  /** Controlled open state. If omitted the dialog manages its own state. */
  open?: boolean;
  /** Called when the open state should change (controlled mode). */
  onOpenChange?: (open: boolean) => void;
  /** Trigger element. If omitted a default "Delete project" button is rendered. */
  trigger?: React.ReactNode;
}

export function ConfirmDeleteDialog({
  projectName,
  onConfirm,
  onCancel,
  isDeleting = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: ConfirmDeleteDialogProps) {
  const isControlled = controlledOpen !== undefined;

  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = isControlled ? controlledOpen : internalOpen;

  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isConfirmed = inputValue === projectName;

  const handleOpenChange = React.useCallback(
    (next: boolean) => {
      if (isControlled) {
        controlledOnOpenChange?.(next);
      } else {
        setInternalOpen(next);
      }
      if (!next) {
        // Reset on close
        setInputValue("");
        onCancel?.();
      }
    },
    [isControlled, controlledOnOpenChange, onCancel]
  );

  // Focus input when dialog opens
  React.useEffect(() => {
    if (open) {
      setInputValue("");
      // Small timeout lets the animation settle before focusing
      const id = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(id);
    }
  }, [open]);

  const handleConfirm = () => {
    if (!isConfirmed || isDeleting) return;
    onConfirm();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isConfirmed && !isDeleting) {
      handleConfirm();
    }
  };

  const titleId = React.useId();
  const descriptionId = React.useId();
  const inputId = React.useId();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="destructive" size="sm">
            Delete project
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <DialogHeader>
          <DialogTitle id={titleId}>Delete &ldquo;{projectName}&rdquo;?</DialogTitle>
          <DialogDescription id={descriptionId}>
            This action is permanent and cannot be undone. All data associated
            with this project will be deleted forever.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          You are about to delete{" "}
          <span className="font-semibold">{projectName}</span>. This will
          remove all resources, settings, and history.
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Label htmlFor={inputId} className="text-sm font-medium">
            To confirm, type{" "}
            <span className="select-all font-semibold text-foreground">
              {projectName}
            </span>{" "}
            below:
          </Label>
          <Input
            ref={inputRef}
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
            disabled={isDeleting}
            aria-invalid={inputValue.length > 0 && !isConfirmed}
            className={cn(
              inputValue.length > 0 && !isConfirmed
                ? "border-destructive focus-visible:ring-destructive"
                : isConfirmed
                ? "border-green-500 focus-visible:ring-green-500"
                : ""
            )}
          />
          {inputValue.length > 0 && !isConfirmed && (
            <p className="text-xs text-destructive" role="alert">
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
            onClick={handleConfirm}
            disabled={!isConfirmed || isDeleting}
            aria-busy={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}