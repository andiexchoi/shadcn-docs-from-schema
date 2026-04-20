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
  const [isPending, setIsPending] = React.useState(false);

  const titleId = React.useId();
  const descriptionId = React.useId();
  const inputId = React.useId();

  const isConfirmed = inputValue === projectName;

  React.useEffect(() => {
    if (!open) {
      setInputValue("");
    }
  }, [open]);

  async function handleConfirm() {
    if (!isConfirmed || isPending || isDeleting) return;
    setIsPending(true);
    try {
      await onConfirm();
    } finally {
      setIsPending(false);
    }
  }

  const busy = isPending || isDeleting;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            "fixed inset-0 z-50 bg-black/60",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
            "motion-reduce:animate-none"
          )}
        />
        <Dialog.Content
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-lg border border-border bg-background p-6 shadow-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "motion-reduce:animate-none"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Dialog.Title
                id={titleId}
                className="text-lg font-semibold leading-tight text-foreground"
              >
                Delete &ldquo;{projectName}&rdquo;?
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
                disabled={busy}
              >
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          {/* Confirmation input */}
          <div className="mt-6 space-y-2">
            <Label htmlFor={inputId} className="text-sm text-foreground">
              Type{" "}
              <span className="font-semibold select-all">{projectName}</span>{" "}
              to confirm
            </Label>
            <Input
              id={inputId}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onPaste={(e) => e.preventDefault()}
              placeholder={projectName}
              autoComplete="off"
              autoFocus
              disabled={busy}
              className={cn(
                inputValue.length > 0 &&
                  !isConfirmed &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            {inputValue.length > 0 && !isConfirmed && (
              <p className="text-xs text-destructive" role="alert">
                Project name does not match.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={busy}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              variant="destructive"
              disabled={!isConfirmed || busy}
              onClick={handleConfirm}
            >
              {busy ? "Deleting…" : "Delete project"}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}