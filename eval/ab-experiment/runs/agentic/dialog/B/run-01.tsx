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
  /** The project name the user must type to unlock the delete button. */
  projectName: string;
  /** Controlled open state. Pass alongside onOpenChange. */
  open: boolean;
  /** Called when Radix wants to change the open state (close button, Escape, overlay click). */
  onOpenChange: (open: boolean) => void;
  /** Called when the user confirms deletion. Close the dialog from here or inside onOpenChange. */
  onConfirm: () => void;
  /** Whether the delete operation is in progress. Disables both buttons and shows loading state. */
  isPending?: boolean;
  /**
   * Optional trigger element. Rendered inside a DialogTrigger with asChild.
   * Omit when you control the dialog open state externally without a trigger button.
   */
  trigger?: React.ReactNode;
}

export function ConfirmDeleteDialog({
  projectName,
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
  trigger,
}: ConfirmDeleteDialogProps) {
  const [confirmation, setConfirmation] = React.useState("");
  const inputId = React.useId();

  const isConfirmed = confirmation === projectName;

  // Reset the input whenever the dialog opens or closes.
  React.useEffect(() => {
    if (!open) {
      // Delay the clear until after the close animation finishes so the text
      // doesn't flicker away while the dialog is still visible.
      const id = setTimeout(() => setConfirmation(""), 200);
      return () => clearTimeout(id);
    }
  }, [open]);

  function handleConfirm() {
    if (!isConfirmed || isPending) return;
    onConfirm();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete &ldquo;{projectName}&rdquo;?</DialogTitle>
          <DialogDescription>
            This action is permanent and cannot be undone. All data associated
            with this project will be deleted immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          <Label htmlFor={inputId}>
            Type{" "}
            <span className="font-semibold text-foreground">{projectName}</span>{" "}
            to confirm
          </Label>
          <Input
            id={inputId}
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirm();
            }}
            placeholder={projectName}
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            disabled={isPending}
            aria-describedby={undefined}
          />
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
