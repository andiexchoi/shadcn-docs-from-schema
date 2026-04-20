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
    setError("");
    await onConfirm();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleConfirm();
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isDeleting) return;
    onOpenChange(nextOpen);
  }

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
            "rounded-xl border border-zinc-200 bg-white p-6 shadow-xl",
            "dark:border-zinc-800 dark:bg-zinc-950",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "duration-200"
          )}
          aria-describedby="confirm-delete-description"
        >
          {/* Close button */}
          <Dialog.Close asChild>
            <button
              disabled={isDeleting}
              className={cn(
                "absolute right-4 top-4 rounded-md p-1 text-zinc-400 transition-colors",
                "hover:bg-zinc-100 hover:text-zinc-700",
                "dark:hover:bg-zinc-800 dark:hover:text-zinc-300",
                "disabled:pointer-events-none disabled:opacity-50",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
              )}
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>

          {/* Header */}
          <div className="mb-5 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-500" />
            </div>
            <div>
              <Dialog.Title className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                Delete project
              </Dialog.Title>
              <Dialog.Description
                id="confirm-delete-description"
                className="mt-1 text-sm text-zinc-500 dark:text-zinc-400"
              >
                This action is{" "}
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  permanent
                </span>{" "}
                and cannot be undone. All data associated with this project will
                be permanently removed.
              </Dialog.Description>
            </div>
          </div>

          {/* Warning banner */}
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-900/20">
            <p className="text-sm text-red-700 dark:text-red-400">
              You are about to delete{" "}
              <span className="font-semibold break-all">"{projectName}"</span>.
            </p>
          </div>

          {/* Input field */}
          <div className="mb-5 space-y-2">
            <Label
              htmlFor="confirm-project-name"
              className="text-sm text-zinc-700 dark:text-zinc-300"
            >
              To confirm, type{" "}
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 break-all">
                {projectName}
              </span>{" "}
              below:
            </Label>
            <Input
              id="confirm-project-name"
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
                "transition-colors",
                error
                  ? "border-red-500 focus-visible:ring-red-500 dark:border-red-500"
                  : ""
              )}
            />
            {error && (
              <p className="text-xs text-red-600 dark:text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
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
              className={cn(
                "w-full sm:w-auto gap-2",
                "bg-red-600 hover:bg-red-700 focus-visible:ring-red-600",
                "dark:bg-red-700 dark:hover:bg-red-600",
                "disabled:opacity-50"
              )}
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