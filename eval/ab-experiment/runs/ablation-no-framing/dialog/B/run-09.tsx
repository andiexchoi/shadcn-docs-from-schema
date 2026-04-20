"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface ConfirmDeleteDialogProps {
  projectName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  isDeleting?: boolean;
}

export function ConfirmDeleteDialog({
  projectName,
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: ConfirmDeleteDialogProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [error, setError] = React.useState("");
  const titleId = React.useId();
  const descriptionId = React.useId();

  const isMatch = inputValue === projectName;

  function handleOpenChange(next: boolean) {
    if (!next) {
      setInputValue("");
      setError("");
    }
    onOpenChange(next);
  }

  async function handleDelete() {
    if (!isMatch) {
      setError("Project name does not match. Please try again.");
      return;
    }
    setError("");
    await onConfirm();
    setInputValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleDelete();
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/50",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "@media (prefers-reduced-motion: reduce) { animation: none }"
          )}
        />
        <Dialog.Content
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-lg border border-border bg-background p-6 shadow-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "focus:outline-none"
          )}
        >
          {/* Header */}
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
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
                className="shrink-0"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          {/* Body */}
          <div className="mb-6 space-y-4">
            <div className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3">
              <p className="text-sm text-destructive">
                You are about to delete{" "}
                <span className="font-semibold">{projectName}</span>.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-name" className="text-sm text-foreground">
                Type{" "}
                <span className="rounded bg-muted px-1 py-0.5 font-mono text-xs font-medium">
                  {projectName}
                </span>{" "}
                to confirm deletion
              </Label>
              <Input
                id="confirm-name"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder={projectName}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                disabled={isDeleting}
                className={cn(
                  error && "border-destructive focus-visible:ring-destructive"
                )}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? "confirm-name-error" : undefined}
              />
              {error && (
                <p
                  id="confirm-name-error"
                  role="alert"
                  className="text-xs text-destructive"
                >
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              variant="destructive"
              disabled={!isMatch || isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? "Deleting…" : "Delete project"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}