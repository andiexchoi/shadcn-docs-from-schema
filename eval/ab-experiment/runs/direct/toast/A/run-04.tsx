"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ProjectDeletionResult =
  | { success: true; projectName: string }
  | { success: false; projectName: string; error?: string };

export function showProjectDeletionToast(result: ProjectDeletionResult): void {
  if (result.success) {
    toast.success(`"${result.projectName}" deleted`, {
      description: "The project has been permanently removed.",
      duration: 4000,
      classNames: {
        toast: cn(
          "border border-green-200 bg-green-50 text-green-900 shadow-md"
        ),
        title: "font-semibold",
        description: "text-green-700",
      },
    });
  } else {
    toast.error(`Failed to delete "${result.projectName}"`, {
      description:
        result.error ??
        "An unexpected error occurred. Please try again.",
      duration: 6000,
      classNames: {
        toast: cn("border border-red-200 bg-red-50 text-red-900 shadow-md"),
        title: "font-semibold",
        description: "text-red-700",
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
  const handleSuccessToast = () => {
    showProjectDeletionToast({
      success: true,
      projectName: "My Awesome Project",
    });
  };

  const handleFailureToast = () => {
    showProjectDeletionToast({
      success: false,
      projectName: "My Awesome Project",
      error: "You do not have permission to delete this project.",
    });
  };

  const handleGenericFailureToast = () => {
    showProjectDeletionToast({
      success: false,
      projectName: "Another Project",
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-xl border border-border bg-background p-6 shadow-sm",
        className
      )}
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Project Deletion Toast Demo
        </h2>
        <p className="text-sm text-muted-foreground">
          Trigger success or failure toasts for project deletion actions.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="default"
          className="bg-green-600 text-white hover:bg-green-700"
          onClick={handleSuccessToast}
        >
          Show Success Toast
        </Button>

        <Button
          variant="destructive"
          onClick={handleFailureToast}
        >
          Show Failure Toast
        </Button>

        <Button
          variant="outline"
          onClick={handleGenericFailureToast}
        >
          Show Generic Failure
        </Button>
      </div>
    </div>
  );
}

export default ProjectDeletionToastDemo;