"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useState } from "react";

async function simulateDeleteProject(projectName: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (projectName.toLowerCase() === "fail") {
    throw new Error("Server returned 500: Internal Server Error");
  }
}

export function notifyProjectDeletionSuccess(projectName: string) {
  toast.success(`Project "${projectName}" deleted.`, {
    description: "All associated data has been permanently removed.",
  });
}

export function notifyProjectDeletionError(
  projectName: string,
  error?: unknown
) {
  const detail =
    error instanceof Error ? error.message : "An unexpected error occurred.";
  toast.error(`Failed to delete "${projectName}".`, {
    description: detail,
  });
}

export async function deleteProjectWithToast(
  projectName: string,
  deleteFn: (name: string) => Promise<void> = simulateDeleteProject
): Promise<boolean> {
  try {
    await deleteFn(projectName);
    notifyProjectDeletionSuccess(projectName);
    return true;
  } catch (error) {
    notifyProjectDeletionError(projectName, error);
    return false;
  }
}

export function ProjectDeletionDemo() {
  const [projectName, setProjectName] = useState("My Project");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!projectName.trim()) {
      toast.warning("Please enter a project name.");
      return;
    }
    setIsDeleting(true);
    await deleteProjectWithToast(projectName.trim());
    setIsDeleting(false);
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="flex flex-col gap-6 p-8 max-w-sm mx-auto">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Delete Project</h1>
          <p className="text-sm text-muted-foreground">
            Enter a project name and click Delete. Type{" "}
            <span className="font-mono bg-muted px-1 rounded text-xs">
              fail
            </span>{" "}
            to simulate an error.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="project-name">Project name</Label>
          <Input
            id="project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name"
            disabled={isDeleting}
          />
        </div>

        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting || !projectName.trim()}
        >
          {isDeleting ? "Deleting…" : "Delete project"}
        </Button>
      </div>
    </>
  );
}