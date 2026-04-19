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
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!isMatch) {
      setError("Project name does not match. Please try again.");
      inputRef.current?.focus();
      return;
    }
    await onConfirm();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (error) setError("");
  };

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
          aria-describedby="delete-dialog-description"
        >
          {/* Close button */}
          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              aria-label="Close"
              disabled={isDeleting}
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>

          {/* Icon + Title */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <Dialog.Title className="text-xl font-semibold tracking-tight text-foreground">
              Delete Project
            </Dialog.Title>
          </div>

          {/* Description */}
          <p
            id="delete-dialog-description"
            className="mt-4 text-center text-sm text-muted-foreground"
          >
            This action{" "}
            <span className="font-semibold text-foreground">cannot be undone</span>
            . This will permanently delete the project and all of its associated
            data, including files, settings, and history.
          </p>

          {/* Divider */}
          <div className="my-5 border-t border-border" />

          {/* Confirmation input */}
          <div className="space-y-2">
            <Label htmlFor="confirm-project-name" className="text-sm">
              To confirm, type{" "}
              <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">
                {projectName}
              </span>{" "}
              below:
            </Label>
            <Input
              id="confirm-project-name"
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={projectName}
              disabled={isDeleting}
              className={cn(
                "font-mono transition-colors",
                error && "border-destructive focus-visible:ring-destructive",
                isMatch && inputValue.length > 0 && "border-green-500 focus-visible:ring-green-500"
              )}
              autoComplete="off"
              spellCheck={false}
            />
            {error && (
              <p className="text-xs font-medium text-destructive">{error}</p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              variant="destructive"
              className="w-full gap-2 sm:w-auto"
              disabled={!isMatch || isDeleting}
              onClick={handleConfirm}
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
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}