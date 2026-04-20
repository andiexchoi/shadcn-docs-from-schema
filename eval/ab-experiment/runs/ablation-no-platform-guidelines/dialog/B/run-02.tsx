"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  onConfirm: () => void | Promise<void>;
  isDeleting?: boolean;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  projectName,
  onConfirm,
  isDeleting = false,
}: ConfirmDeleteDialogProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [error, setError] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isConfirmed = inputValue === projectName;

  React.useEffect(() => {
    if (!open) {
      setInputValue("");
      setError("");
    }
  }, [open]);

  async function handleConfirm() {
    if (!isConfirmed) {
      setError("Project name does not match. Please try again.");
      inputRef.current?.focus();
      return;
    }
    setError("");
    await onConfirm();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && isConfirmed && !isDeleting) {
      handleConfirm();
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-xl border border-border bg-background p-6 shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "focus:outline-none"
          )}
          aria-describedby="delete-dialog-description"
        >
          {/* Close button */}
          <Dialog.Close
            className={cn(
              "absolute right-4 top-4 rounded-sm opacity-70 transition-opacity",
              "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:pointer-events-none"
            )}
            disabled={isDeleting}
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </Dialog.Close>

          {/* Header */}
          <div className="mb-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-5 w-5 text-destructive" aria-hidden="true" />
            </div>
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight text-foreground">
              Delete project
            </Dialog.Title>
            <Dialog.Description
              id="delete-dialog-description"
              className="mt-2 text-sm text-muted-foreground"
            >
              This action is permanent and cannot be undone. All data associated
              with this project will be deleted forever.
            </Dialog.Description>
          </div>

          {/* Body */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="confirm-project-name" className="text-sm font-medium">
                Type{" "}
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                  {projectName}
                </span>{" "}
                to confirm
              </Label>
              <Input
                ref={inputRef}
                id="confirm-project-name"
                className={cn(
                  "mt-2",
                  error && "border-destructive focus-visible:ring-destructive"
                )}
                placeholder={projectName}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={handleKeyDown}
                disabled={isDeleting}
                autoComplete="off"
                spellCheck={false}
              />
              {error && (
                <p role="alert" className="mt-1.5 text-xs text-destructive">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              variant="destructive"
              disabled={!isConfirmed || isDeleting}
              onClick={handleConfirm}
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    aria-hidden="true"
                  />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete project
                </>
              )}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}