"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfirmDeleteDialogProps {
  /** The exact project name the user must type to unlock deletion. */
  projectName: string;
  /** Called after the user types the matching name and clicks "Delete project". */
  onDelete: () => void;
  /** Controls dialog visibility. Pass together with onOpenChange for controlled usage. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /**
   * Optional trigger element. When provided it is rendered inside a
   * DialogTrigger with asChild, so the element must forward refs and
   * accept prop spreading.
   */
  trigger?: React.ReactNode;
}

export function ConfirmDeleteDialog({
  projectName,
  onDelete,
  open,
  onOpenChange,
  trigger,
}: ConfirmDeleteDialogProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const isConfirmed = inputValue === projectName;

  // Reset the input whenever the dialog opens.
  React.useEffect(() => {
    if (open) {
      setInputValue("");
      // Defer focus so Radix's own focus management doesn't compete.
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  function handleDelete() {
    if (!isConfirmed) return;
    onDelete();
    onOpenChange(false);
  }

  function handleCancel() {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete &ldquo;{projectName}&rdquo;?</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. All data associated
            with this project will be deleted immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          <Label htmlFor="confirm-project-name">
            Type{" "}
            <span className="font-semibold text-foreground">{projectName}</span>{" "}
            to confirm
          </Label>
          <Input
            ref={inputRef}
            id="confirm-project-name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPaste={(e) => {
              // Allow paste — do not block it. Some users copy the name.
              // The match check handles correctness.
              void e;
            }}
            placeholder={projectName}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!isConfirmed}
            onClick={handleDelete}
          >
            Delete project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
