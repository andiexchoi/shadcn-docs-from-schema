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
    projectName.length > 30 ? projectName.slice(0, 30) + "…" : projectName;

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
    projectName.length > 30 ? projectName.slice(0, 30) + "…" : projectName;

  toast.error(`Failed to delete "${truncated}"`, {
    description: "Something went wrong. Please try again.",
    duration: 5000,
  });
}

interface ProjectDeletionButtonProps {
  projectName: string;
  onDelete: () => Promise<void>;
  onUndo?: () => void;
}

export function ProjectDeletionButton({
  projectName,
  onDelete,
  onUndo,
}: ProjectDeletionButtonProps) {
  async function handleDelete() {
    try {
      await onDelete();
      showProjectDeletionSuccessToast({ projectName, onUndo });
    } catch {
      showProjectDeletionErrorToast({ projectName });
    }
  }

  return (
    <Button variant="destructive" onClick={handleDelete}>
      Delete project
    </Button>
  );
}