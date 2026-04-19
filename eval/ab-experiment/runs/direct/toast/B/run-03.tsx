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
  toast.success(`"${projectName}" deleted`, {
    description: "The project and all its data have been removed.",
    ...(onUndo
      ? {
          duration: 6000,
          action: {
            label: "Undo",
            onClick: onUndo,
          },
        }
      : {}),
  });
}

export function showProjectDeletionErrorToast({
  projectName,
}: Pick<ShowProjectDeletionToastOptions, "projectName">) {
  toast.error(`Failed to delete "${projectName}"`, {
    description: "An error occurred. Please try again.",
  });
}

interface ProjectDeletionToastDemoProps {
  projectName?: string;
}

export function ProjectDeletionToastDemo({
  projectName = "My Project",
}: ProjectDeletionToastDemoProps) {
  function handleSuccessWithUndo() {
    showProjectDeletionSuccessToast({
      projectName,
      onUndo: () => {
        toast.info(`Deletion of "${projectName}" undone`);
      },
    });
  }

  function handleSuccess() {
    showProjectDeletionSuccessToast({ projectName });
  }

  function handleError() {
    showProjectDeletionErrorToast({ projectName });
  }

  return (
    <div className="flex flex-col gap-3 p-6">
      <p className="text-sm text-muted-foreground mb-2">
        Project deletion toast demo — project:{" "}
        <span className="font-medium text-foreground">"{projectName}"</span>
      </p>
      <div className="flex flex-wrap gap-3">
        <Button variant="default" onClick={handleSuccessWithUndo}>
          Delete (with Undo)
        </Button>
        <Button variant="secondary" onClick={handleSuccess}>
          Delete (no Undo)
        </Button>
        <Button variant="destructive" onClick={handleError}>
          Simulate Failure
        </Button>
      </div>
    </div>
  );
}