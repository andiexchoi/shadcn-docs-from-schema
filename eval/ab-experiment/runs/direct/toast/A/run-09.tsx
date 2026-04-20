"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ProjectDeletionStatus = "success" | "error";

export interface ShowProjectDeletionToastOptions {
  projectName?: string;
  errorMessage?: string;
  onUndo?: () => void | Promise<void>;
}

export function showProjectDeletionSuccessToast(
  options: ShowProjectDeletionToastOptions = {}
) {
  const { projectName, onUndo } = options;

  toast.success(
    projectName ? `"${projectName}" deleted` : "Project deleted",
    {
      description: "The project has been permanently removed.",
      duration: onUndo ? 6000 : 4000,
      action: onUndo
        ? {
            label: "Undo",
            onClick: () => {
              void onUndo();
            },
          }
        : undefined,
      classNames: {
        toast: cn(
          "group border border-border bg-background text-foreground shadow-md rounded-lg"
        ),
        title: "font-semibold text-sm",
        description: "text-muted-foreground text-xs",
        actionButton:
          "bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium px-3 py-1 rounded-md",
      },
    }
  );
}

export function showProjectDeletionErrorToast(
  options: ShowProjectDeletionToastOptions = {}
) {
  const { projectName, errorMessage, onUndo } = options;

  toast.error(
    projectName
      ? `Failed to delete "${projectName}"`
      : "Failed to delete project",
    {
      description:
        errorMessage ??
        "Something went wrong while deleting the project. Please try again.",
      duration: 6000,
      action: onUndo
        ? {
            label: "Retry",
            onClick: () => {
              void onUndo();
            },
          }
        : undefined,
      classNames: {
        toast: cn(
          "group border border-destructive/40 bg-background text-foreground shadow-md rounded-lg"
        ),
        title: "font-semibold text-sm text-destructive",
        description: "text-muted-foreground text-xs",
        actionButton:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-medium px-3 py-1 rounded-md",
      },
    }
  );
}

export function showProjectDeletionToast(
  status: ProjectDeletionStatus,
  options: ShowProjectDeletionToastOptions = {}
) {
  if (status === "success") {
    showProjectDeletionSuccessToast(options);
  } else {
    showProjectDeletionErrorToast(options);
  }
}

interface ProjectDeletionToastDemoProps {
  className?: string;
}

export default function ProjectDeletionToastDemo({
  className,
}: ProjectDeletionToastDemoProps) {
  const handleDeleteSuccess = () => {
    showProjectDeletionSuccessToast({
      projectName: "My Awesome Project",
      onUndo: () => {
        toast.info("Deletion undone", {
          description: "Your project has been restored.",
        });
      },
    });
  };

  const handleDeleteError = () => {
    showProjectDeletionErrorToast({
      projectName: "My Awesome Project",
      errorMessage: "Network error: Could not reach the server.",
    });
  };

  const handleDeleteSuccessNoName = () => {
    showProjectDeletionSuccessToast();
  };

  const handleDeleteErrorNoName = () => {
    showProjectDeletionErrorToast();
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 p-8 max-w-md mx-auto",
        className
      )}
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          Project Deletion Toast Demo
        </h2>
        <p className="text-sm text-muted-foreground">
          Trigger success or error toasts for project deletion events.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Button
          variant="default"
          onClick={handleDeleteSuccess}
          className="w-full"
        >
          Show Success Toast (with undo)
        </Button>

        <Button
          variant="destructive"
          onClick={handleDeleteError}
          className="w-full"
        >
          Show Error Toast (with message)
        </Button>

        <Button
          variant="outline"
          onClick={handleDeleteSuccessNoName}
          className="w-full"
        >
          Show Success Toast (no project name)
        </Button>

        <Button
          variant="outline"
          onClick={handleDeleteErrorNoName}
          className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
        >
          Show Error Toast (no project name)
        </Button>
      </div>
    </div>
  );
}