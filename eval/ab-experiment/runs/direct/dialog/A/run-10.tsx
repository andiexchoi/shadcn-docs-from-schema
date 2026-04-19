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
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isMatch = inputValue === projectName;

  React.useEffect(() => {
    if (open) {
      setInputValue("");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  async function handleConfirm() {
    if (!isMatch) {
      setError("Project name does not match. Please try again.");
      inputRef.current?.focus();
      return;
    }
    try {
      await onConfirm();
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && isMatch && !isDeleting) {
      handleConfirm();
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    if (error) setError("");
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
            "duration-200"
          )}
        >
          {/* Close button */}
          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              aria-label="Close"
              disabled={isDeleting}
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>

          {/* Header */}
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <Dialog.Title className="text-lg font-semibold leading-tight text-foreground">
                Delete project
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                This action{" "}
                <span className="font-medium text-foreground">cannot</span> be
                undone. All data associated with{" "}
                <span className="font-medium text-foreground">
                  {projectName}
                </span>{" "}
                will be permanently removed.
              </Dialog.Description>
            </div>
          </div>

          {/* Separator */}
          <div className="mb-5 h-px bg-border" />

          {/* Confirmation input */}
          <div className="space-y-2">
            <Label htmlFor="project-name-confirm" className="text-sm">
              To confirm, type{" "}
              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground">
                {projectName}
              </span>{" "}
              below:
            </Label>
            <Input
              ref={inputRef}
              id="project-name-confirm"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={projectName}
              disabled={isDeleting}
              autoComplete="off"
              spellCheck={false}
              className={cn(
                "font-mono text-sm",
                error && "border-destructive focus-visible:ring-destructive"
              )}
              aria-describedby={error ? "delete-error" : undefined}
            />
            {error && (
              <p
                id="delete-error"
                className="text-xs font-medium text-destructive"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={isDeleting} className="w-full sm:w-auto">
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              variant="destructive"
              disabled={!isMatch || isDeleting}
              onClick={handleConfirm}
              className="w-full gap-2 sm:w-auto"
            >
              {isDeleting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
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