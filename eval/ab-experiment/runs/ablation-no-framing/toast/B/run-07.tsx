"use client";

import { toast, Toaster } from "sonner";
import { Button } from "@/components/ui/button";

export function ProjectDeletionToaster() {
  return <Toaster />;
}

export function showProjectDeletionSuccess(projectName: string, onUndo?: () => void) {
  toast.success(`"${projectName}" deleted`, {
    description: "The project and all its data have been permanently removed.",
    action: onUndo
      ? {
          label: "Undo",
          onClick: onUndo,
        }
      : undefined,
    duration: onUndo ? 8000 : 4000,
  });
}

export function showProjectDeletionError(projectName: string) {
  toast.error(`Failed to delete "${projectName}"`, {
    description: "Something went wrong. Please try again or contact support.",
    duration: 5000,
  });
}

export function ProjectDeletionDemo() {
  return (
    <div className="flex flex-col gap-4 p-8 max-w-sm">
      <h2 className="text-lg font-semibold">Project Deletion Toast Demo</h2>
      <Button
        variant="default"
        onClick={() =>
          showProjectDeletionSuccess("Marketing Campaign Q4", () => {
            toast.info("Deletion undone. Project restored.");
          })
        }
      >
        Simulate successful deletion
      </Button>
      <Button
        variant="destructive"
        onClick={() => showProjectDeletionError("Marketing Campaign Q4")}
      >
        Simulate failed deletion
      </Button>
      <ProjectDeletionToaster />
    </div>
  );
}