"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProjectDeletionOptions {
  projectName?: string;
  onUndo?: () => void | Promise<void>;
}

export function showProjectDeletionSuccess(options: ProjectDeletionOptions = {}) {
  const { projectName, onUndo } = options;

  const message = projectName
    ? `"${projectName}" was deleted successfully.`
    : "Project deleted successfully.";

  toast.success(message, {
    description: onUndo ? "You can undo this action." : undefined,
    duration: onUndo ? 6000 : 4000,
    action: onUndo
      ? {
          label: "Undo",
          onClick: () => {
            void Promise.resolve(onUndo()).then(() => {
              toast.success("Deletion undone.", { duration: 3000 });
            }).catch(() => {
              toast.error("Failed to undo deletion.", { duration: 4000 });
            });
          },
        }
      : undefined,
  });
}

export function showProjectDeletionError(options: ProjectDeletionOptions & { reason?: string } = {}) {
  const { projectName, reason, onUndo: onRetry } = options;

  const message = projectName
    ? `Failed to delete "${projectName}".`
    : "Failed to delete project.";

  toast.error(message, {
    description: reason ?? "An unexpected error occurred. Please try again.",
    duration: 6000,
    action: onRetry
      ? {
          label: "Retry",
          onClick: () => {
            void Promise.resolve(onRetry()).catch(() => {
              toast.error("Retry failed. Please try again later.", { duration: 4000 });
            });
          },
        }
      : undefined,
  });
}

interface ProjectDeletionTriggerProps {
  projectName?: string;
  onDelete: () => void | Promise<void>;
  onUndo?: () => void | Promise<void>;
  className?: string;
  children?: React.ReactNode;
}

export function ProjectDeletionTrigger({
  projectName,
  onDelete,
  onUndo,
  className,
  children,
}: ProjectDeletionTriggerProps) {
  async function handleDelete() {
    try {
      await Promise.resolve(onDelete());
      showProjectDeletionSuccess({ projectName, onUndo });
    } catch (err) {
      const reason =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      showProjectDeletionError({ projectName, reason });
    }
  }

  return (
    <Button
      variant="destructive"
      className={cn("gap-2", className)}
      onClick={() => void handleDelete()}
    >
      {children ?? "Delete Project"}
    </Button>
  );
}

export default ProjectDeletionTrigger;