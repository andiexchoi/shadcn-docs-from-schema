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
    projectName.length > 40 ? `${projectName.slice(0, 40)}…` : projectName;

  toast.success(`"${truncated}" deleted`, {
    description: "The project and all its data have been permanently removed.",
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
    projectName.length > 40 ? `${projectName.slice(0, 40)}…` : projectName;

  toast.error(`Failed to delete "${truncated}"`, {
    description: "Something went wrong. Please try again.",
    duration: 5000,
  });
}

// ---------------------------------------------------------------------------
// Demo component — shows both helpers in a small interactive UI
// ---------------------------------------------------------------------------

export default function ProjectDeletionToastDemo() {
  const projectName = "Marketing Campaign Q4 2024";

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

  function handleDeleteSuccessNoUndo() {
    showProjectDeletionSuccess({ projectName });
  }

  function handleDeleteError() {
    showProjectDeletionError({ projectName });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            Project deletion toasts
          </h1>
          <p className="text-sm text-muted-foreground">
            Trigger success or error notifications for project deletion.
          </p>
        </div>

        <div className="rounded-lg border bg-card p-4 text-sm text-card-foreground">
          <span className="font-medium">Project:</span>{" "}
          <span className="text-muted-foreground">{projectName}</span>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="default"
            className="w-full"
            onClick={handleDeleteSuccess}
          >
            Delete project (with Undo)
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            onClick={handleDeleteSuccessNoUndo}
          >
            Delete project (no Undo)
          </Button>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDeleteError}
          >
            Simulate deletion failure
          </Button>
        </div>
      </div>
    </div>
  );
}