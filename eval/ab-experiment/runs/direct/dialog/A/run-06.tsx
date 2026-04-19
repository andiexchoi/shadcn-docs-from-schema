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
    if (e.key === "Enter" && isMatch && !isDeleting) {
      handleConfirm();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (error) setError("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={(val) => !isDeleting && onOpenChange(val)}>
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
            "rounded-xl border border-border bg-background p-6 shadow-2xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2",
            "data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]",
            "focus:outline-none"
          )}
        >
          {/* Close button */}
          <Dialog.Close asChild>
            <button
              disabled={isDeleting}
              className={cn(
                "absolute right-4 top-4 rounded-md p-1 text-muted-foreground",
                "transition-colors hover:bg-muted hover:text-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>

          {/* Header */}
          <div className="flex items-start gap-4 pr-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <Dialog.Title className="text-lg font-semibold text-foreground">
                Delete Project
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                This action is{" "}
                <span className="font-semibold text-foreground">permanent</span>{" "}
                and cannot be undone. All data associated with this project will
                be permanently removed.
              </Dialog.Description>
            </div>
          </div>

          {/* Project name display */}
          <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
            <p className="text-sm text-muted-foreground">Project to be deleted:</p>
            <p className="mt-0.5 break-all font-mono text-sm font-semibold text-foreground">
              {projectName}
            </p>
          </div>

          {/* Confirmation input */}
          <div className="mt-5 space-y-2">
            <Label htmlFor="confirm-project-name" className="text-sm font-medium">
              Type{" "}
              <span className="font-mono font-semibold text-foreground">
                {projectName}
              </span>{" "}
              to confirm:
            </Label>
            <Input
              ref={inputRef}
              id="confirm-project-name"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={projectName}
              disabled={isDeleting}
              autoComplete="off"
              spellCheck={false}
              className={cn(
                "font-mono transition-colors",
                error && "border-destructive focus-visible:ring-destructive",
                isMatch && inputValue.length > 0 && "border-green-500 focus-visible:ring-green-500"
              )}
            />
            {error && (
              <p className="text-xs font-medium text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
              disabled={!isMatch || isDeleting}
              onClick={handleConfirm}
              className="w-full gap-2 sm:w-auto"
            >
              {isDeleting ? (
                <>
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