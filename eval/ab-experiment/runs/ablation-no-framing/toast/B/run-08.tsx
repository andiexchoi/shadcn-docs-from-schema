"use client";

import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";

export function ProjectDeletionToaster() {
  return <Toaster position="bottom-right" />;
}

interface ShowProjectDeletionToastOptions {
  projectName: string;
  onUndo?: () => void;
}

export function showProjectDeletionSuccess({
  projectName,
  onUndo,
}: ShowProjectDeletionToastOptions) {
  toast.success(`"${projectName}" deleted`, {
    description: "The project has been permanently removed.",
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
  toast.error(`Failed to delete "${projectName}"`, {
    description: "Something went wrong. Please try again.",
    duration: 5000,
  });
}

interface ProjectDeletionDemoProps {
  projectName?: string;
}

export function ProjectDeletionDemo({
  projectName = "My Project",
}: ProjectDeletionDemoProps) {
  const handleSuccessWithUndo = () => {
    showProjectDeletionSuccess({
      projectName,
      onUndo: () => {
        toast.info(`Deletion of "${projectName}" undone.`);
      },
    });
  };

  const handleSuccess = () => {
    showProjectDeletionSuccess({ projectName });
  };

  const handleError = () => {
    showProjectDeletionError({ projectName });
  };

  return (
    <div className="flex flex-col items-start gap-3 p-6">
      <p className="text-sm text-muted-foreground mb-2">
        Project:{" "}
        <span className="font-medium text-foreground">{projectName}</span>
      </p>
      <div className="flex flex-wrap gap-3">
        <Button variant="default" onClick={handleSuccessWithUndo}>
          Delete (with Undo)
        </Button>
        <Button variant="secondary" onClick={handleSuccess}>
          Delete (no Undo)
        </Button>
        <Button variant="destructive" onClick={handleError}>
          Simulate failure
        </Button>
      </div>
    </div>
  );
}