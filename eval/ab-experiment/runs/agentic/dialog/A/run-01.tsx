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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectName: string;
  onConfirm: () => void;
  /** Optional: show a loading state on the delete button while the action runs. */
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

  // Reset the input whenever the dialog opens.
  React.useEffect(() => {
    if (open) setValue("");
  }, [open]);

  const isMatch = value === projectName;

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
            This action is permanent and cannot be undone. All data associated
            with <span className="font-medium text-foreground">{projectName}</span> will
            be deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="confirm-name">
            Type <span className="font-semibold text-foreground">{projectName}</span> to
            confirm
          </Label>
          <Input
            id="confirm-name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            placeholder={projectName}
            autoComplete="off"
            spellCheck={false}
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
            disabled={!isMatch || isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
