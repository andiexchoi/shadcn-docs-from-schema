"use client";

import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";

export function showProjectDeletionSuccess(projectName: string, onUndo?: () => void) {
  toast.success(`"${projectName}" deleted`, {
    description: "The project has been permanently removed.",
    action: onUndo
      ? {
          label: "Undo",
          onClick: onUndo,
        }
      : undefined,
    duration: onUndo ? 6000 : 4000,
  });
}

export function showProjectDeletionError(projectName: string) {
  toast.error(`Failed to delete "${projectName}"`, {
    description: "Something went wrong. Please try again.",
    duration: 5000,
  });
}

interface ProjectDeletionDemoProps {
  projectName?: string;
}

export function ProjectDeletionToastDemo({
  projectName = "My Project",
}: ProjectDeletionDemoProps) {
  return (
    <div className="flex flex-col items-start gap-3 p-6">
      <p className="text-sm text-muted-foreground mb-2">
        Project deletion toast helper demo
      </p>
      <Button
        variant="destructive"
        onClick={() =>
          showProjectDeletionSuccess(projectName, () => {
            toast.info(`Deletion of "${projectName}" undone.`);
          })
        }
      >
        Simulate successful deletion
      </Button>
      <Button
        variant="outline"
        onClick={() => showProjectDeletionError(projectName)}
      >
        Simulate failed deletion
      </Button>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default ProjectDeletionToastDemo;