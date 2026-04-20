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
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isMatch = inputValue === projectName;

  React.useEffect(() => {
    if (!open) {
      setInputValue("");
      setError(null);
    }
  }, [open]);

  async function handleConfirm() {
    if (!isMatch) {
      setError("Project name does not match. Please try again.");
      inputRef.current?.focus();
      return;
    }
    setError(null);
    await onConfirm();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && isMatch) {
      handleConfirm();
    }
  }

  const titleId = "confirm-delete-title";
  const descId = "confirm-delete-description";

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
          aria-labelledby={titleId}
          aria-describedby={descId}
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2",
            "rounded-lg border border-border bg-background p-6 shadow-xl",
            "focus:outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <Trash2 className="h-5 w-5 text-destructive" aria-hidden="true" />
              </div>
              <Dialog.Title
                id={titleId}
                className="text-lg font-semibold leading-tight text-foreground"
              >
                Delete project
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-md text-muted-foreground hover:text-foreground"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </Button>
            </Dialog.Close>
          </div>

          {/* Description */}
          <Dialog.Description id={descId} className="mt-4 text-sm text-muted-foreground">
            This action is permanent and cannot be undone. All data associated with{" "}
            <span className="font-medium text-foreground">{projectName}</span> will be
            permanently removed from our servers.
          </Dialog.Description>

          {/* Confirmation input */}
          <div className="mt-5 space-y-2">
            <Label htmlFor="confirm-project-name" className="text-sm text-foreground">
              Type{" "}
              <span className="rounded bg-muted px-1 py-0.5 font-mono text-xs font-medium text-foreground">
                {projectName}
              </span>{" "}
              to confirm deletion:
            </Label>
            <Input
              ref={inputRef}
              id="confirm-project-name"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder={projectName}
              autoComplete="off"
              spellCheck={false}
              aria-invalid={error ? "true" : undefined}
              aria-describedby={error ? "confirm-delete-error" : undefined}
              disabled={isDeleting}
              className={cn(
                "font-mono",
                error && "border-destructive focus-visible:ring-destructive"
              )}
            />
            {error && (
              <p
                id="confirm-delete-error"
                role="alert"
                className="text-xs text-destructive"
              >
                {error}
              </p>
            )}
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
              className="min-w-[140px]"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Deleting…
                </span>
              ) : (
                "Delete project"
              )}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}