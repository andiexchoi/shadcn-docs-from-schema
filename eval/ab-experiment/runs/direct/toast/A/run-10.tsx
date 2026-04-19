"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProjectDeletionToastOptions {
  projectName?: string;
  onUndo?: () => void | Promise<void>;
}

export function showProjectDeletionSuccess(
  options: ProjectDeletionToastOptions = {}
) {
  const { projectName, onUndo } = options;

  toast.success(
    projectName
      ? `"${projectName}" was deleted successfully.`
      : "Project deleted successfully.",
    {
      description: onUndo
        ? "This action can be undone within the next few seconds."
        : "The project has been permanently removed.",
      duration: onUndo ? 6000 : 4000,
      action: onUndo
        ? {
            label: "Undo",
            onClick: () => {
              void (async () => {
                try {
                  await onUndo();
                  toast.success("Deletion undone.", {
                    description: projectName
                      ? `"${projectName}" has been restored.`
                      : "The project has been restored.",
                  });
                } catch {
                  toast.error("Failed to undo deletion.", {
                    description:
                      "The project could not be restored. Please try again.",
                  });
                }
              })();
            },
          }
        : undefined,
    }
  );
}

export interface ProjectDeletionErrorOptions {
  projectName?: string;
  error?: unknown;
  onRetry?: () => void | Promise<void>;
}

export function showProjectDeletionError(
  options: ProjectDeletionErrorOptions = {}
) {
  const { projectName, error, onRetry } = options;

  const errorMessage =
    error instanceof Error ? error.message : "An unexpected error occurred.";

  toast.error(
    projectName
      ? `Failed to delete "${projectName}".`
      : "Failed to delete project.",
    {
      description: errorMessage,
      duration: onRetry ? 8000 : 5000,
      action: onRetry
        ? {
            label: "Retry",
            onClick: () => {
              void (async () => {
                try {
                  await onRetry();
                  toast.success(
                    projectName
                      ? `"${projectName}" was deleted successfully.`
                      : "Project deleted successfully.",
                    {
                      description:
                        "The project has been permanently removed.",
                    }
                  );
                } catch (retryError) {
                  const retryMessage =
                    retryError instanceof Error
                      ? retryError.message
                      : "An unexpected error occurred.";
                  toast.error("Deletion failed again.", {
                    description: retryMessage,
                  });
                }
              })();
            },
          }
        : undefined,
    }
  );
}

export type DeletionResult =
  | { success: true; projectName?: string; onUndo?: () => void | Promise<void> }
  | {
      success: false;
      projectName?: string;
      error?: unknown;
      onRetry?: () => void | Promise<void>;
    };

export function showProjectDeletionToast(result: DeletionResult) {
  if (result.success) {
    showProjectDeletionSuccess({
      projectName: result.projectName,
      onUndo: result.onUndo,
    });
  } else {
    showProjectDeletionError({
      projectName: result.projectName,
      error: result.error,
      onRetry: result.onRetry,
    });
  }
}

interface ProjectDeletionDemoProps {
  className?: string;
}

export function ProjectDeletionToastDemo({
  className,
}: ProjectDeletionDemoProps) {
  const handleSuccessDemo = () => {
    showProjectDeletionSuccess({
      projectName: "My Awesome Project",
      onUndo: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      },
    });
  };

  const handleSuccessNoUndoDemo = () => {
    showProjectDeletionSuccess({
      projectName: "Another Project",
    });
  };

  const handleErrorDemo = () => {
    showProjectDeletionError({
      projectName: "My Awesome Project",
      error: new Error("Permission denied: insufficient privileges."),
      onRetry: async () => {
        await new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Still failing.")), 500)
        );
      },
    });
  };

  const handleErrorNoRetryDemo = () => {
    showProjectDeletionError({
      projectName: "Another Project",
      error: new Error("Network timeout."),
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 p-6 rounded-lg border bg-card text-card-foreground shadow-sm max-w-sm",
        className
      )}
    >
      <h2 className="text-lg font-semibold">Project Deletion Toasts</h2>
      <p className="text-sm text-muted-foreground">
        Trigger example toast notifications for project deletion outcomes.
      </p>
      <div className="flex flex-col gap-2 pt-2">
        <Button variant="default" size="sm" onClick={handleSuccessDemo}>
          Show Success (with Undo)
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSuccessNoUndoDemo}
        >
          Show Success (no Undo)
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleErrorDemo}
        >
          Show Error (with Retry)
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleErrorNoRetryDemo}
          className="border-destructive text-destructive hover:bg-destructive/10"
        >
          Show Error (no Retry)
        </Button>
      </div>
    </div>
  );
}

export default ProjectDeletionToastDemo;