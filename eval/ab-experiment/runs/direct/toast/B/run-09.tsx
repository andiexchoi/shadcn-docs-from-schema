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
      : { duration: 4000 }),
  });
}

export function showProjectDeletionErrorToast({
  projectName,
}: Pick<ShowProjectDeletionToastOptions, "projectName">) {
  toast.error(`Failed to delete "${projectName}"`, {
    description: "Something went wrong. Please try again.",
    duration: 4000,
  });
}

interface ProjectDeletionDemoProps {
  projectName?: string;
}

export function ProjectDeletionToastDemo({
  projectName = "My Project",
}: ProjectDeletionDemoProps) {
  function handleDeleteSuccess() {
    showProjectDeletionSuccessToast({
      projectName,
      onUndo: () => {
        toast.info(`Deletion of "${projectName}" undone`);
      },
    });
  }

  function handleDeleteFailure() {
    showProjectDeletionErrorToast({ projectName });
  }

  return (
    <div className="flex flex-col items-start gap-3 p-6">
      <p className="text-sm text-muted-foreground">
        Project:{" "}
        <span className="font-medium text-foreground">{projectName}</span>
      </p>
      <div className="flex gap-3">
        <Button variant="destructive" onClick={handleDeleteSuccess}>
          Simulate success
        </Button>
        <Button variant="outline" onClick={handleDeleteFailure}>
          Simulate failure
        </Button>
      </div>
    </div>
  );
}