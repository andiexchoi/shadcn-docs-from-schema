"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import { useState } from "react";

async function simulateDeleteProject(
  projectName: string
): Promise<{ success: boolean; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  if (projectName.toLowerCase() === "error") {
    return { success: false, error: "Server error: could not delete project." };
  }
  return { success: true };
}

export function ProjectDeletionToast() {
  const [projectName, setProjectName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!projectName.trim()) {
      toast.warning("Enter a project name to delete.");
      return;
    }

    setIsDeleting(true);

    const toastId = toast.loading(`Deleting "${projectName}"…`);

    try {
      const result = await simulateDeleteProject(projectName.trim());

      if (result.success) {
        toast.success(`"${projectName}" deleted successfully.`, {
          id: toastId,
          description: "The project and all its data have been removed.",
          action: {
            label: "Undo",
            onClick: () => {
              toast.info(`Undo requested for "${projectName}".`, {
                description: "Restoration has been queued.",
              });
            },
          },
          duration: 6000,
        });
        setProjectName("");
      } else {
        toast.error(`Failed to delete "${projectName}".`, {
          id: toastId,
          description:
            result.error ?? "An unexpected error occurred. Please try again.",
          duration: 5000,
        });
      }
    } catch {
      toast.error(`Failed to delete "${projectName}".`, {
        id: toastId,
        description: "An unexpected error occurred. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />

      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-lg font-semibold text-gray-900">
            Delete project
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            Enter a project name and click delete. Use{" "}
            <span className="font-medium text-gray-700">"error"</span> to
            simulate a failure.
          </p>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                placeholder="my-project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isDeleting) {
                    handleDelete();
                  }
                }}
                disabled={isDeleting}
              />
            </div>

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting…" : "Delete project"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectDeletionToast;