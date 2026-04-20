"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ProjectDeletionResult =
  | { success: true; projectName: string }
  | { success: false; projectName: string; errorMessage?: string };

export function showProjectDeletionToast(result: ProjectDeletionResult): void {
  if (result.success) {
    toast.success("Project deleted", {
      description: `"${result.projectName}" has been permanently deleted.`,
      duration: 4000,
    });
  } else {
    toast.error("Failed to delete project", {
      description:
        result.errorMessage ??
        `An unexpected error occurred while deleting "${result.projectName}". Please try again.`,
      duration: 6000,
    });
  }
}

interface DeleteProjectButtonProps {
  projectId: string;
  projectName: string;
  onDelete: (projectId: string) => Promise<void>;
  className?: string;
  disabled?: boolean;
}

export function DeleteProjectButton({
  projectId,
  projectName,
  onDelete,
  className,
  disabled = false,
}: DeleteProjectButtonProps) {
  async function handleClick() {
    try {
      await onDelete(projectId);
      showProjectDeletionToast({ success: true, projectName });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      showProjectDeletionToast({ success: false, projectName, errorMessage });
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={handleClick}
      disabled={disabled}
      className={cn("gap-2", className)}
    >
      Delete Project
    </Button>
  );
}

interface ProjectDeletionToastDemoProps {
  className?: string;
}

export function ProjectDeletionToastDemo({
  className,
}: ProjectDeletionToastDemoProps) {
  function simulateSuccess() {
    showProjectDeletionToast({
      success: true,
      projectName: "My Awesome Project",
    });
  }

  function simulateFailure() {
    showProjectDeletionToast({
      success: false,
      projectName: "My Awesome Project",
      errorMessage: "You do not have permission to delete this project.",
    });
  }

  function simulateFailureNoMessage() {
    showProjectDeletionToast({
      success: false,
      projectName: "Another Project",
    });
  }

  return (
    <div className={cn("flex flex-col gap-4 p-6 max-w-sm", className)}>
      <h2 className="text-lg font-semibold tracking-tight">
        Project Deletion Toast Demo
      </h2>
      <p className="text-sm text-muted-foreground">
        Click the buttons below to preview the deletion toasts.
      </p>
      <div className="flex flex-col gap-3">
        <Button variant="default" onClick={simulateSuccess}>
          Simulate Success
        </Button>
        <Button variant="destructive" onClick={simulateFailure}>
          Simulate Failure (with message)
        </Button>
        <Button variant="outline" onClick={simulateFailureNoMessage}>
          Simulate Failure (no message)
        </Button>
      </div>
    </div>
  );
}