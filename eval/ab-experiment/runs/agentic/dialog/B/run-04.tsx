"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ConfirmDeleteDialogProps {
  /** The exact project name the user must type to unlock the delete button. */
  projectName: string;
  /** Controls whether the dialog is visible. */
  open: boolean;
  /** Called when the dialog requests an open/close state change. */
  onOpenChange: (open: boolean) => void;
  /** Called when the user confirms deletion. The dialog does not close itself — the caller is responsible for setting open={false} after async work completes. */
  onConfirm: () => void;
  /** Set to true while the delete operation is in progress to disable the confirm button and show a loading state. */
  isPending?: boolean;
}

export function ConfirmDeleteDialog({
  projectName,
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: ConfirmDeleteDialogProps) {
  const [inputValue, setInputValue] = React.useState("");
  const isConfirmed = inputValue === projectName;

  // Clear the input whenever the dialog opens so a previous session's value
  // doesn't pre-fill the next time it opens.
  React.useEffect(() => {
    if (open) {
      setInputValue("");
    }
  }, [open]);

  function handleConfirm() {
    if (!isConfirmed || isPending) return;
    onConfirm();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>Delete &ldquo;{projectName}&rdquo;?</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. All data associated
            with this project will be deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirm-project-name">
            Type{" "}
            <span className="font-semibold text-foreground">{projectName}</span>{" "}
            to confirm
          </Label>
          <Input
            id="confirm-project-name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            placeholder={projectName}
            autoComplete="off"
            disabled={isPending}
            aria-describedby="confirm-project-name-hint"
          />
          <p id="confirm-project-name-hint" className="text-xs text-muted-foreground">
            Pasting is disabled. You must type the name manually.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmed || isPending}
            aria-disabled={!isConfirmed || isPending}
          >
            {isPending ? "Deleting…" : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
