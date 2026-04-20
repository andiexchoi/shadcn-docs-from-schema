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
  onConfirm: () => void;
  isDeleting?: boolean;
  trigger?: React.ReactNode;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  projectName,
  onConfirm,
  isDeleting = false,
  trigger,
}: ConfirmDeleteDialogProps) {
  const [inputValue, setInputValue] = React.useState("");
  const titleId = React.useId();
  const descriptionId = React.useId();
  const inputId = React.useId();

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

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}

      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />

        <Dialog.Content
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-lg border border-border bg-background p-6 shadow-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "focus:outline-none"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <Trash2 className="h-5 w-5 text-destructive" aria-hidden="true" />
              </div>
              <div>
                <Dialog.Title
                  id={titleId}
                  className="text-base font-semibold leading-none tracking-tight text-foreground"
                >
                  Delete project
                </Dialog.Title>
                <Dialog.Description
                  id={descriptionId}
                  className="mt-1 text-sm text-muted-foreground"
                >
                  This action is permanent and cannot be undone.
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                className={cn(
                  "rounded-sm opacity-70 ring-offset-background transition-opacity",
                  "hover:opacity-100",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "disabled:pointer-events-none"
                )}
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="mt-5 space-y-4">
            <p className="text-sm text-foreground">
              You are about to permanently delete{" "}
              <span className="font-semibold">&ldquo;{projectName}&rdquo;</span> and all
              of its data, including members, settings, and history.
            </p>

            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
              <p className="text-sm text-destructive">
                All resources within this project will be deleted immediately.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={inputId} className="text-sm text-foreground">
                Type{" "}
                <span className="font-semibold select-all">{projectName}</span> to
                confirm deletion:
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
                className={cn(
                  "font-mono transition-colors",
                  inputValue.length > 0 && !isMatch &&
                    "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={inputValue.length > 0 && !isMatch}
              />
              {inputValue.length > 0 && !isMatch && (
                <p className="text-xs text-destructive" role="alert">
                  Project name does not match. Please check your input.
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
              onClick={handleConfirm}
              disabled={!isMatch || isDeleting}
              aria-disabled={!isMatch || isDeleting}
            >
              {isDeleting ? (
                <>
                  <span
                    className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    aria-hidden="true"
                  />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
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