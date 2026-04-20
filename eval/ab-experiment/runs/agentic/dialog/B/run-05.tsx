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
  /** The exact project name the user must type to unlock the delete button. */
  projectName: string;
  /** Called when the user confirms deletion. The dialog closes after this fires. */
  onConfirm: () => void;
  /** The element that opens the dialog. Must accept a ref and onClick. */
  trigger: React.ReactNode;
}

export function ConfirmDeleteDialog({
  projectName,
  onConfirm,
  trigger,
}: ConfirmDeleteDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [typed, setTyped] = React.useState("");

  const isConfirmed = typed === projectName;

  function handleOpenChange(next: boolean) {
    setOpen(next);
    // Reset the confirmation field whenever the dialog closes.
    if (!next) setTyped("");
  }

  function handleConfirm() {
    onConfirm();
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete &ldquo;{projectName}&rdquo;?</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. All data associated
            with this project will be deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-2">
          <Label htmlFor="confirm-project-name">
            Type <span className="font-semibold">{projectName}</span> to confirm
          </Label>
          <Input
            id="confirm-project-name"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={projectName}
            autoComplete="off"
            // Prevent paste so the user has to actively type the name.
            onPaste={(e) => e.preventDefault()}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!isConfirmed}
            onClick={handleConfirm}
          >
            Delete project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
