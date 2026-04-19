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
  /** Controls whether the dialog is visible. */
  open: boolean;
  /** Called when the dialog requests to open or close. Pair with `open`. */
  onOpenChange: (open: boolean) => void;
  /** The exact name of the project the user must type to confirm deletion. */
  projectName: string;
  /** Called when the user confirms deletion by typing the project name and clicking Delete. */
  onConfirm: () => void;
  /** Optional: show a loading state on the Delete button while the deletion is in progress. */
  isDeleting?: boolean;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  projectName,
  onConfirm,
  isDeleting = false,
}: ConfirmDeleteDialogProps) {
  const [typedName, setTypedName] = React.useState("");
  const inputId = React.useId();

  const isConfirmed = typedName === projectName;

  // Reset the input whenever the dialog opens.
  React.useEffect(() => {
    if (open) {
      setTypedName("");
    }
  }, [open]);

  function handleConfirm() {
    if (!isConfirmed) return;
    onConfirm();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete &ldquo;{projectName}&rdquo;?</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. All data associated
            with this project will be deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor={inputId}>
            Type <span className="font-semibold text-foreground">{projectName}</span> to
            confirm
          </Label>
          <Input
            id={inputId}
            value={typedName}
            onChange={(e) => setTypedName(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            placeholder={projectName}
            autoComplete="off"
            spellCheck={false}
            disabled={isDeleting}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmed || isDeleting}
            aria-disabled={!isConfirmed || isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
