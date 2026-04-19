"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Trash2, AlertTriangle } from "lucide-react";
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
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isMatch = inputValue === projectName;

  React.useEffect(() => {
    if (open) {
      setInputValue("");
      setError("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!isMatch) {
      setError("Project name does not match. Please try again.");
      inputRef.current?.focus();
      return;
    }
    setError("");
    await onConfirm();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (isDeleting) return;
    onOpenChange(nextOpen);
  };

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
          onEscapeKeyDown={() => handleOpenChange(false)}
          onPointerDownOutside={() => handleOpenChange(false)}
        >
          {/* Close button */}
          <Dialog.Close
            asChild
            disabled={isDeleting}
          >
            <button
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              aria-label="Close"
              disabled={isDeleting}
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>

          {/* Header */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <Dialog.Title className="text-lg font-semibold leading-none tracking-tight text-foreground">
                  Delete Project
                </Dialog.Title>
                <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                  This action cannot be undone.
                </Dialog.Description>
              </div>
            </div>

            {/* Warning box */}
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-sm text-foreground">
                You are about to permanently delete{" "}
                <span className="font-semibold text-destructive">
                  {projectName}
                </span>
                . All associated data, files, and settings will be removed and
                cannot be recovered.
              </p>
            </div>

            {/* Confirmation input */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="project-name-confirm" className="text-sm font-medium">
                Type{" "}
                <span className="font-mono font-semibold text-foreground">
                  {projectName}
                </span>{" "}
                to confirm:
              </Label>
              <Input
                id="project-name-confirm"
                ref={inputRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (error) setError("");
                }}
                onKeyDown={handleKeyDown}
                placeholder={projectName}
                disabled={isDeleting}
                autoComplete="off"
                spellCheck={false}
                className={cn(
                  "font-mono transition-colors",
                  error && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {error && (
                <p className="text-xs font-medium text-destructive">{error}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirm}
                disabled={!isMatch || isDeleting}
                className="w-full sm:w-auto gap-2"
              >
                {isDeleting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Deleting…
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Project
                  </>
                )}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}