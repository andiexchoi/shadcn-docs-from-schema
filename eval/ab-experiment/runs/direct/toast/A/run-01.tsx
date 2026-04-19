"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export type ProjectDeletionResult =
  | { success: true; projectName: string }
  | { success: false; projectName: string; error?: string };

export function showProjectDeletionToast(result: ProjectDeletionResult): void {
  if (result.success) {
    toast.success("Project deleted", {
      description: `"${result.projectName}" has been permanently deleted.`,
      duration: 4000,
    });
  } else {
    toast.error("Failed to delete project", {
      description:
        result.error ??
        `Something went wrong while deleting "${result.projectName}". Please try again.`,
      duration: 6000,
    });
  }
}

interface ProjectDeletionToastDemoProps {
  projectName?: string;
}

export function ProjectDeletionToastDemo({
  projectName = "My Awesome Project",
}: ProjectDeletionToastDemoProps) {
  function handleSimulateSuccess() {
    showProjectDeletionToast({ success: true, projectName });
  }

  function handleSimulateFailure() {
    showProjectDeletionToast({
      success: false,
      projectName,
      error: "You do not have permission to delete this project.",
    });
  }

  function handleSimulateFailureNoMessage() {
    showProjectDeletionToast({ success: false, projectName });
  }

  return (
    <div className="flex flex-col gap-4 p-6 max-w-sm">
      <p className="text-sm text-muted-foreground">
        Simulate project deletion outcomes for{" "}
        <span className="font-medium text-foreground">"{projectName}"</span>:
      </p>

      <Button variant="default" onClick={handleSimulateSuccess}>
        Simulate Success
      </Button>

      <Button variant="destructive" onClick={handleSimulateFailure}>
        Simulate Failure (with reason)
      </Button>

      <Button variant="outline" onClick={handleSimulateFailureNoMessage}>
        Simulate Failure (no reason)
      </Button>
    </div>
  );
}

export default ProjectDeletionToastDemo;