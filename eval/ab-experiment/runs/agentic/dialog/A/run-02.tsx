"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDeleteDialogProps {
  /** Controls whether the dialog is open. */
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The exact project name the user must type to unlock deletion. */
  projectName: string;
  /** Called only after the user has confirmed with the correct name. */
  onConfirm: () => void;
  /** Whether the delete action is in-flight (shows loading state). */
  isDeleting?: boolean;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  projectName,
  onConfirm,
  isDeleting = false,
}: ConfirmDeleteDialogProps) {
  const [value, setValue] = React.useState("");

  const isMatch = value === projectName;

  // Reset the input whenever the dialog opens or the project name changes.
  React.useEffect(() => {
    if (open) setValue("");
  }, [open, projectName]);

  function handleConfirm() {
    if (!isMatch) return;
    onConfirm();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            This action is <span className="font-semibold text-foreground">permanent</span> and
            cannot be undone. All data associated with{" "}
            <span className="font-semibold text-foreground">{projectName}</span> will be deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-2">
          <Label htmlFor="confirm-name">
            Type <span className="font-semibold text-foreground">{projectName}</span> to confirm
          </Label>
          <Input
            id="confirm-name"
            placeholder={projectName}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            autoComplete="off"
            autoFocus
          />
        </div>

        <DialogFooter className="mt-4">
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
            disabled={!isMatch || isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
