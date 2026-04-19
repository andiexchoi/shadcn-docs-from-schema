"use client";

import * as React from "react";
import { TriangleAlert } from "lucide-react";
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The exact project name the user must type to unlock deletion. */
  projectName: string;
  /** Called only when the user has confirmed and clicks Delete. */
  onConfirm: () => void;
  /** Shows a loading spinner and disables controls while deletion is in flight. */
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

  const isConfirmed = inputValue === projectName;

  // Reset the input whenever the dialog opens.
  React.useEffect(() => {
    if (open) setInputValue("");
  }, [open]);

  function handleConfirm() {
    if (!isConfirmed || isDeleting) return;
    onConfirm();
  }

  return (
    <Dialog open={open} onOpenChange={isDeleting ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <TriangleAlert className="h-5 w-5 text-destructive shrink-0" />
            <DialogTitle>Delete project</DialogTitle>
          </div>
          <DialogDescription className="pt-1">
            This action is <span className="font-medium text-foreground">permanent</span> and cannot
            be undone. All data associated with{" "}
            <span className="font-medium text-foreground">{projectName}</span> will be deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="confirm-name">
            Type <span className="font-semibold text-foreground">{projectName}</span> to confirm
          </Label>
          <Input
            id="confirm-name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            placeholder={projectName}
            disabled={isDeleting}
            autoComplete="off"
            autoFocus
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
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
          >
            {isDeleting ? "Deleting…" : "Delete project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
