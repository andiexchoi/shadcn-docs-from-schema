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
    projectName.length > 40 ? projectName.slice(0, 40) + "…" : projectName;

  toast.success(`"${truncated}" deleted`, {
    description: "The project has been permanently removed",
    ...(onUndo && {
      duration: 6000,
      action: {
        label: "Undo",
        onClick: onUndo,
      },
    }),
  });
}

export function showProjectDeletionError({
  projectName,
}: Pick<ShowProjectDeletionToastOptions, "projectName">) {
  const truncated =
    projectName.length > 40 ? projectName.slice(0, 40) + "…" : projectName;

  toast.error(`Failed to delete "${truncated}"`, {
    description: "Something went wrong. Please try again",
  });
}

// ---------------------------------------------------------------------------
// Demo component — renders two trigger buttons so you can test both toasts
// ---------------------------------------------------------------------------

export function ProjectDeletionToastDemo() {
  const exampleProject = "Marketing Campaign Q3 2025";

  function handleDeleteSuccess() {
    showProjectDeletionSuccess({
      projectName: exampleProject,
      onUndo: () => {
        toast.info("Deletion undone", {
          description: `"${exampleProject}" has been restored`,
        });
      },
    });
  }

  function handleDeleteError() {
    showProjectDeletionError({ projectName: exampleProject });
  }

  return (
    <div className="flex flex-col items-start gap-3 p-6">
      <p className="text-sm text-muted-foreground mb-1">
        Project:{" "}
        <span className="font-medium text-foreground">{exampleProject}</span>
      </p>

      <div className="flex gap-3">
        <Button
          variant="destructive"
          onClick={handleDeleteSuccess}
        >
          Simulate successful deletion
        </Button>

        <Button
          variant="outline"
          onClick={handleDeleteError}
        >
          Simulate failed deletion
        </Button>
      </div>
    </div>
  );
}