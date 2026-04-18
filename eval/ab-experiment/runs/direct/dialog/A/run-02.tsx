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
  const [isLoading, setIsLoading] = React.useState(false);

  const isConfirmed = inputValue === projectName;

  React.useEffect(() => {
    if (!open) {
      setInputValue("");
      setIsLoading(false);
    }
  }, [open]);

  async function handleConfirm() {
    if (!isConfirmed) return;
    setIsLoading(true);
    try {
      await onConfirm();
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && isConfirmed && !isLoading && !isDeleting) {
      handleConfirm();
    }
  }

  const busy = isLoading || isDeleting;

  return (
    <Dialog.Root open={open} onOpenChange={(v) => !busy && onOpenChange(v)}>
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
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "focus:outline-none"
          )}
        >
          {/* Close button */}
          <Dialog.Close asChild>
            <button
              disabled={busy}
              aria-label="Close"
              className={cn(
                "absolute right-4 top-4 rounded-sm p-1 text-muted-foreground",
                "transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </Dialog.Close>

          {/* Icon + header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <div>
              <Dialog.Title className="text-lg font-semibold text-foreground">
                Delete project
              </Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted-foreground">
                This action is{" "}
                <span className="font-medium text-foreground">permanent</span>{" "}
                and cannot be undone. All data associated with this project will
                be permanently removed.
              </Dialog.Description>
            </div>
          </div>

          {/* Project name callout */}
          <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3">
            <p className="text-center text-sm text-muted-foreground">
              You are about to delete{" "}
              <span className="font-semibold text-foreground break-all">
                &ldquo;{projectName}&rdquo;
              </span>
            </p>
          </div>

          {/* Confirmation input */}
          <div className="mt-5 space-y-2">
            <Label htmlFor="confirm-name" className="text-sm text-foreground">
              Type{" "}
              <span className="font-semibold text-destructive">
                {projectName}
              </span>{" "}
              to confirm
            </Label>
            <Input
              id="confirm-name"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={projectName}
              disabled={busy}
              autoComplete="off"
              spellCheck={false}
              className={cn(
                "transition-colors",
                inputValue.length > 0 &&
                  !isConfirmed &&
                  "border-destructive/60 focus-visible:ring-destructive/40",
                isConfirmed &&
                  "border-green-500/60 focus-visible:ring-green-500/40"
              )}
            />
            {inputValue.length > 0 && !isConfirmed && (
              <p className="text-xs text-destructive">
                Project name does not match.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={busy} className="w-full sm:w-auto">
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              variant="destructive"
              disabled={!isConfirmed || busy}
              onClick={handleConfirm}
              className="w-full gap-2 sm:w-auto"
            >
              {busy ? (
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
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
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