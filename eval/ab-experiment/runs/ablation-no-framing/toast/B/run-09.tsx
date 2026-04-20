"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import { useState } from "react";

function deleteProject(projectName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (projectName.trim().toLowerCase() === "fail") {
        reject(new Error("Server error: could not delete project."));
      } else {
        resolve();
      }
    }, 1200);
  });
}

export function ProjectDeletionToast() {
  const [projectName, setProjectName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!projectName.trim()) return;

    setIsDeleting(true);

    const toastId = toast.loading(`Deleting "${projectName}"…`);

    try {
      await deleteProject(projectName);
      toast.success(`"${projectName}" was deleted.`, {
        id: toastId,
        description: "The project and all its data have been permanently removed.",
        action: {
          label: "Undo",
          onClick: () => {
            toast.info(`Deletion of "${projectName}" was undone.`);
          },
        },
        duration: 6000,
      });
      setProjectName("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      toast.error(`Failed to delete "${projectName}".`, {
        id: toastId,
        description: message,
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Toaster position="bottom-right" />

      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-xl font-semibold text-gray-900">
            Delete project
          </h1>
          <p className="mb-6 text-sm text-gray-500">
            Enter a project name to delete it. Type{" "}
            <span className="rounded bg-gray-100 px-1 font-mono text-xs">
              fail
            </span>{" "}
            to simulate a failure.
          </p>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                placeholder="e.g. my-project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleDelete();
                }}
                disabled={isDeleting}
              />
            </div>

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
              disabled={isDeleting || !projectName.trim()}
            >
              {isDeleting ? "Deleting…" : "Delete project"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}