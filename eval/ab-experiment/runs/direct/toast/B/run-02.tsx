"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShowProjectDeletionToastOptions {
  projectName: string;
  onUndo?: () => void;
}

export function showProjectDeletionSuccess({
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

export function showProjectDeletionError({
  projectName,
}: Pick<ShowProjectDeletionToastOptions, "projectName">) {
  const truncated =
    projectName.length > 30 ? projectName.slice(0, 30) + "…" : projectName;

  toast.error(`Failed to delete "${truncated}"`, {
    description: "Something went wrong. Please try again.",
    duration: 5000,
  });
}

interface ProjectDeletionDemoProps {
  projectName?: string;
}

export function ProjectDeletionToastDemo({
  projectName = "My Project",
}: ProjectDeletionDemoProps) {
  function handleDeleteSuccess() {
    showProjectDeletionSuccess({
      projectName,
      onUndo: () => {
        toast.info("Deletion undone", {
          description: `"${projectName}" has been restored.`,
        });
      },
    });
  }

  function handleDeleteError() {
    showProjectDeletionError({ projectName });
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
        <Button variant="outline" onClick={handleDeleteError}>
          Simulate failure
        </Button>
      </div>
    </div>
  );
}