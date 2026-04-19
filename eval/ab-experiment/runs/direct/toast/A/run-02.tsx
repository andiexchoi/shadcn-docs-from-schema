"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ProjectDeletionResult =
  | { success: true; projectName: string }
  | { success: false; projectName: string; error?: string };

export function showProjectDeletionToast(result: ProjectDeletionResult): void {
  if (result.success) {
    toast.success("Project deleted", {
      description: (
        <span>
          <span className="font-medium">{result.projectName}</span> has been
          permanently deleted.
        </span>
      ),
      duration: 4000,
    });
  } else {
    toast.error("Failed to delete project", {
      description: (
        <span>
          Could not delete{" "}
          <span className="font-medium">{result.projectName}</span>.{" "}
          {result.error ? result.error : "Please try again."}
        </span>
      ),
      duration: 6000,
    });
  }
}

interface ProjectDeletionToastDemoProps {
  className?: string;
}

export function ProjectDeletionToastDemo({
  className,
}: ProjectDeletionToastDemoProps) {
  function handleSuccessToast() {
    showProjectDeletionToast({
      success: true,
      projectName: "My Awesome Project",
    });
  }

  function handleFailureToast() {
    showProjectDeletionToast({
      success: false,
      projectName: "My Awesome Project",
      error: "You do not have permission to delete this project.",
    });
  }

  function handleFailureNoMessageToast() {
    showProjectDeletionToast({
      success: false,
      projectName: "Another Project",
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-xl border border-border bg-card p-6 shadow-sm",
        className
      )}
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Project Deletion Toast Demo
        </h2>
        <p className="text-sm text-muted-foreground">
          Trigger success or failure toasts for project deletion events.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="default"
          onClick={handleSuccessToast}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Show Success Toast
        </Button>

        <Button variant="destructive" onClick={handleFailureToast}>
          Show Failure Toast
        </Button>

        <Button
          variant="outline"
          onClick={handleFailureNoMessageToast}
          className="border-destructive text-destructive hover:bg-destructive/10"
        >
          Show Failure (no message)
        </Button>
      </div>
    </div>
  );
}

export default ProjectDeletionToastDemo;