"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Trash2, AlertTriangle } from "lucide-react";
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

  const isMatch = inputValue === projectName;

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setInputValue("");
      setError("");
    }
    onOpenChange(nextOpen);
  }

  async function handleConfirm() {
    if (!isMatch) {
      setError(`Project name does not match. Type "${projectName}" to confirm.`);
      return;
    }
    setError("");
    await onConfirm();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleConfirm();
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-background p-6 shadow-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "duration-200"
          )}
        >
          {/* Close button */}
          <Dialog.Close asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 h-6 w-6 rounded-sm text-muted-foreground hover:text-foreground"
              aria-label="Close dialog"
              disabled={isDeleting}
            >
              <X className="h-4 w-4" />
            </Button>
          </Dialog.Close>

          {/* Header */}
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <Dialog.Title
                id={titleId}
                className="text-base font-semibold leading-tight text-foreground"
              >
                Delete project
              </Dialog.Title>
              <Dialog.Description
                id={descriptionId}
                className="mt-1 text-sm text-muted-foreground"
              >
                This action is permanent and cannot be undone. All data
                associated with this project will be deleted.
              </Dialog.Description>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-4 border-t border-border" />

          {/* Body */}
          <div className="mb-6 space-y-3">
            <p className="text-sm text-muted-foreground">
              To confirm, type{" "}
              <span className="font-semibold text-foreground">
                &ldquo;{projectName}&rdquo;
              </span>{" "}
              in the field below.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-project-name" className="sr-only">
                Project name confirmation
              </Label>
              <Input
                id="confirm-project-name"
                type="text"
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
                className={cn(
                  error && "border-destructive focus-visible:ring-destructive"
                )}
                aria-describedby={error ? "confirm-error" : undefined}
              />
              {error && (
                <p
                  id="confirm-error"
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
              <Button
                variant="outline"
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={!isMatch || isDeleting}
              className="w-full sm:w-auto"
              aria-disabled={!isMatch || isDeleting}
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Deleting…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete project
                </span>
              )}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}