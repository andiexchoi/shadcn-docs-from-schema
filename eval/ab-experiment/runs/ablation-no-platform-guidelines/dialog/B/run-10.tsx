"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
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
  const titleId = React.useId();
  const descriptionId = React.useId();
  const inputId = React.useId();

  const isConfirmEnabled = inputValue === projectName;

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setInputValue("");
      setError("");
    }
    onOpenChange(nextOpen);
  }

  async function handleConfirm() {
    if (!isConfirmEnabled) {
      setError(`Type "${projectName}" exactly to confirm.`);
      return;
    }
    setError("");
    await onConfirm();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    if (error) setError("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && isConfirmEnabled) {
      handleConfirm();
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <Dialog.Content
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-xl border border-border bg-background shadow-xl",
            "p-6 focus:outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          )}
        >
          {/* Header */}
          <div className="mb-4 pr-8">
            <Dialog.Title
              id={titleId}
              className="text-lg font-semibold leading-tight text-foreground"
            >
              Delete project
            </Dialog.Title>
            <Dialog.Description
              id={descriptionId}
              className="mt-1.5 text-sm text-muted-foreground"
            >
              This action is permanent and cannot be undone. All data associated
              with{" "}
              <span className="font-medium text-foreground">{projectName}</span>{" "}
              will be deleted.
            </Dialog.Description>
          </div>

          {/* Close button */}
          <Dialog.Close
            className={cn(
              "absolute right-4 top-4 rounded-sm p-1",
              "text-muted-foreground transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "disabled:pointer-events-none"
            )}
            disabled={isDeleting}
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </Dialog.Close>

          {/* Body */}
          <div className="mb-6 space-y-4">
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-sm font-medium text-destructive">
                ⚠ You are about to permanently delete this project.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={inputId} className="text-sm font-medium">
                Type{" "}
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                  {projectName}
                </span>{" "}
                to confirm
              </Label>
              <Input
                id={inputId}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={projectName}
                disabled={isDeleting}
                aria-invalid={!!error}
                aria-describedby={error ? `${inputId}-error` : undefined}
                className={cn(
                  error &&
                    "border-destructive focus-visible:ring-destructive"
                )}
                autoComplete="off"
                spellCheck={false}
              />
              {error && (
                <p
                  id={`${inputId}-error`}
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              variant="destructive"
              disabled={!isConfirmEnabled || isDeleting}
              onClick={handleConfirm}
            >
              {isDeleting ? "Deleting…" : "Delete project"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}