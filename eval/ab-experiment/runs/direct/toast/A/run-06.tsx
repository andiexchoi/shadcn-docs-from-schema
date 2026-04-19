"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ProjectDeletionResult {
  success: boolean;
  projectName?: string;
  errorMessage?: string;
}

export function showProjectDeletionToast(result: ProjectDeletionResult): void {
  if (result.success) {
    toast.success("Project deleted", {
      description: result.projectName
        ? `"${result.projectName}" has been permanently deleted.`
        : "The project has been permanently deleted.",
      duration: 5000,
      classNames: {
        toast: cn(
          "group flex items-start gap-3 rounded-lg border p-4 shadow-md",
          "bg-background text-foreground"
        ),
        title: "font-semibold text-sm",
        description: "text-sm text-muted-foreground",
      },
    });
  } else {
    toast.error("Failed to delete project", {
      description:
        result.errorMessage ||
        (result.projectName
          ? `Could not delete "${result.projectName}". Please try again.`
          : "Something went wrong while deleting the project. Please try again."),
      duration: 8000,
      action: {
        label: "Retry",
        onClick: () => {
          toast.dismiss();
        },
      },
      classNames: {
        toast: cn(
          "group flex items-start gap-3 rounded-lg border p-4 shadow-md",
          "bg-background text-foreground"
        ),
        title: "font-semibold text-sm",
        description: "text-sm text-muted-foreground",
        actionButton: cn(
          "ml-auto shrink-0 rounded-md px-3 py-1.5 text-xs font-medium",
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
        ),
      },
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

  function handleErrorToast() {
    showProjectDeletionToast({
      success: false,
      projectName: "My Awesome Project",
      errorMessage: "Permission denied. You do not have access to delete this project.",
    });
  }

  function handleSuccessNoName() {
    showProjectDeletionToast({ success: true });
  }

  function handleErrorNoMessage() {
    showProjectDeletionToast({ success: false });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm",
        className
      )}
    >
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-card-foreground">
          Project Deletion Toast
        </h2>
        <p className="text-sm text-muted-foreground">
          Trigger toast notifications for project deletion outcomes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          variant="default"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          onClick={handleSuccessToast}
        >
          ✓ Success (with name)
        </Button>

        <Button
          variant="destructive"
          className="w-full"
          onClick={handleErrorToast}
        >
          ✕ Error (with message)
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={handleSuccessNoName}
        >
          ✓ Success (no name)
        </Button>

        <Button
          variant="outline"
          className="w-full border-destructive text-destructive hover:bg-destructive/10"
          onClick={handleErrorNoMessage}
        >
          ✕ Error (no message)
        </Button>
      </div>
    </div>
  );
}

export default ProjectDeletionToastDemo;