"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShowProjectDeletionToastOptions {
  projectName: string;
  onUndo?: () => void;
}

export function showProjectDeletionSuccessToast({
  projectName,
  onUndo,
}: ShowProjectDeletionToastOptions) {
  const truncated =
    projectName.length > 40 ? projectName.slice(0, 40) + "…" : projectName;

  toast.success(`"${truncated}" deleted`, {
    description: "The project and all its data have been removed.",
    duration: onUndo ? 6000 : 4000,
    action: onUndo
      ? {
          label: "Undo",
          onClick: onUndo,
        }
      : undefined,
  });
}

export function showProjectDeletionErrorToast({
  projectName,
}: Pick<ShowProjectDeletionToastOptions, "projectName">) {
  const truncated =
    projectName.length > 40 ? projectName.slice(0, 40) + "…" : projectName;

  toast.error(`Failed to delete "${truncated}"`, {
    description: "Something went wrong. Please try again.",
    duration: 5000,
  });
}

interface ProjectDeletionActionsProps {
  projectName: string;
  onDelete: () => Promise<void>;
  onUndo?: () => void;
  className?: string;
}

export function ProjectDeletionButton({
  projectName,
  onDelete,
  onUndo,
  className,
}: ProjectDeletionActionsProps) {
  async function handleDelete() {
    try {
      await onDelete();
      showProjectDeletionSuccessToast({ projectName, onUndo });
    } catch {
      showProjectDeletionErrorToast({ projectName });
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleDelete}
      className={className}
    >
      Delete project
    </Button>
  );
}