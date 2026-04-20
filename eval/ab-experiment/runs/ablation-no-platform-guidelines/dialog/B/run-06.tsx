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
  const [isPending, setIsPending] = React.useState(false);

  const titleId = React.useId();
  const descriptionId = React.useId();
  const inputId = React.useId();

  const isConfirmEnabled = inputValue === projectName;

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setInputValue("");
    }
    onOpenChange(nextOpen);
  }

  async function handleConfirm() {
    if (!isConfirmEnabled) return;
    setIsPending(true);
    try {
      await onConfirm();
      setInputValue("");
    } finally {
      setIsPending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && isConfirmEnabled && !isPending && !isDeleting) {
      handleConfirm();
    }
  }

  const busy = isPending || isDeleting;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0"
          )}
        />
        <Dialog.Content
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-lg border border-border bg-background p-6 shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "focus:outline-none"
          )}
        >
          {/* Header */}
          <div className="mb-2 flex items-start justify-between gap-4">
            <Dialog.Title
              id={titleId}
              className="text-lg font-semibold leading-tight text-foreground"
            >
              Delete project
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close dialog"
                className={cn(
                  "rounded-sm opacity-70 ring-offset-background transition-opacity",
                  "hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "disabled:pointer-events-none"
                )}
                disabled={busy}
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Description */}
          <Dialog.Description
            id={descriptionId}
            className="mb-5 text-sm text-muted-foreground"
          >
            This action is permanent and cannot be undone. All data associated
            with{" "}
            <span className="font-medium text-foreground">{projectName}</span>{" "}
            will be deleted.
          </Dialog.Description>

          {/* Confirmation input */}
          <div className="mb-6 space-y-2">
            <Label htmlFor={inputId} className="text-sm font-medium">
              Type{" "}
              <span className="font-mono font-semibold text-foreground">
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
              disabled={busy}
              className={cn(
                "font-mono",
                inputValue.length > 0 &&
                  !isConfirmEnabled &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            {inputValue.length > 0 && !isConfirmEnabled && (
              <p className="text-xs text-destructive" role="alert">
                Project name does not match.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={busy}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              variant="destructive"
              disabled={!isConfirmEnabled || busy}
              onClick={handleConfirm}
              aria-disabled={!isConfirmEnabled || busy}
            >
              {busy ? "Deleting…" : "Delete project"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}