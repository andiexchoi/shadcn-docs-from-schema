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
  onConfirm: () => void;
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

  const isMatch = inputValue === projectName;

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setInputValue("");
    }
    onOpenChange(nextOpen);
  }

  function handleConfirm() {
    if (!isMatch || isDeleting) return;
    onConfirm();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && isMatch && !isDeleting) {
      handleConfirm();
    }
  }

  const titleId = React.useId();
  const descriptionId = React.useId();

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
          )}
        />
        <Dialog.Content
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-xl border border-border bg-background p-6 shadow-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "focus:outline-none"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Dialog.Title
                id={titleId}
                className="text-lg font-semibold leading-none tracking-tight text-foreground"
              >
                Delete project
              </Dialog.Title>
              <Dialog.Description
                id={descriptionId}
                className="text-sm text-muted-foreground"
              >
                This action is permanent and cannot be undone. All data
                associated with this project will be deleted.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="mt-6 space-y-4">
            <div
              className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3"
              role="alert"
            >
              <p className="text-sm text-destructive">
                You are about to delete{" "}
                <span className="font-semibold">{projectName}</span>.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-project-name" className="text-sm">
                Type{" "}
                <span className="font-semibold text-foreground">
                  {projectName}
                </span>{" "}
                to confirm deletion.
              </Label>
              <Input
                id="confirm-project-name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={projectName}
                autoComplete="off"
                autoFocus
                className={cn(
                  "transition-colors",
                  inputValue.length > 0 &&
                    !isMatch &&
                    "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={inputValue.length > 0 && !isMatch}
                aria-describedby={
                  inputValue.length > 0 && !isMatch
                    ? "confirm-name-error"
                    : undefined
                }
              />
              {inputValue.length > 0 && !isMatch && (
                <p
                  id="confirm-name-error"
                  className="text-xs text-destructive"
                  role="alert"
                  aria-live="polite"
                >
                  Project name does not match.
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
              disabled={!isMatch || isDeleting}
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