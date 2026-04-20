"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShowProjectDeletionToastOptions {
  projectName: string;
  onUndo?: () => void;
}

export function showProjectDeletionSuccessToast({
  projectName,
  onUndo,
}: ShowProjectDeletionToastOptions) {
  toast.success(`"${projectName}" deleted`, {
    description: "The project and all its data have been removed.",
    ...(onUndo && {
      duration: 6000,
      action: {
        label: "Undo",
        onClick: onUndo,
      },
    }),
  });
}

export function showProjectDeletionErrorToast({
  projectName,
}: Pick<ShowProjectDeletionToastOptions, "projectName">) {
  toast.error(`Failed to delete "${projectName}"`, {
    description: "Something went wrong. Please try again.",
  });
}

export function ProjectDeletionToastDemo() {
  const projectName = "Marketing Campaign Q4";

  return (
    <div className="flex flex-col items-start gap-4 p-6">
      <p className="text-sm font-medium text-muted-foreground">
        Project deletion toast demo
      </p>

      <div className="flex flex-wrap gap-3">
        <Button
          variant="default"
          onClick={() =>
            showProjectDeletionSuccessToast({
              projectName,
              onUndo: () => {
                toast.info(`Deletion of "${projectName}" undone`);
              },
            })
          }
        >
          Simulate success
        </Button>

        <Button
          variant="destructive"
          onClick={() =>
            showProjectDeletionErrorToast({ projectName })
          }
        >
          Simulate failure
        </Button>
      </div>
    </div>
  );
}