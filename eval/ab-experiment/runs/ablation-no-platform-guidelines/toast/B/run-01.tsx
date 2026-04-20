"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useState } from "react";

async function mockDeleteProject(projectName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (projectName.trim().toLowerCase() === "fail") {
        reject(new Error("Server error: unable to delete project."));
      } else {
        resolve();
      }
    }, 800);
  });
}

export function notifyProjectDeletionSuccess(projectName: string) {
  toast.success(`Project "${projectName}" deleted.`, {
    description: "All associated data has been permanently removed.",
  });
}

export function notifyProjectDeletionError(projectName: string, error?: unknown) {
  const detail =
    error instanceof Error
      ? error.message
      : "An unexpected error occurred. Please try again.";
  toast.error(`Failed to delete "${projectName}".`, {
    description: detail,
  });
}

export async function deleteProjectWithToast(projectName: string): Promise<boolean> {
  try {
    await mockDeleteProject(projectName);
    notifyProjectDeletionSuccess(projectName);
    return true;
  } catch (error) {
    notifyProjectDeletionError(projectName, error);
    return false;
  }
}

export function ProjectDeletionDemo() {
  const [projectName, setProjectName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!projectName.trim()) {
      toast.warning("Please enter a project name before deleting.");
      return;
    }
    setIsDeleting(true);
    await deleteProjectWithToast(projectName.trim());
    setIsDeleting(false);
  };

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="flex flex-col gap-6 p-8 max-w-md mx-auto">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Delete Project</h1>
          <p className="text-sm text-muted-foreground">
            Enter a project name and click delete. Type{" "}
            <span className="font-mono bg-muted px-1 py-0.5 rounded text-xs">
              fail
            </span>{" "}
            to simulate an error.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="project-name">Project name</Label>
          <Input
            id="project-name"
            placeholder="e.g. my-project"
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
          onClick={handleDelete}
          disabled={isDeleting}
          className="w-full"
        >
          {isDeleting ? "Deleting…" : "Delete project"}
        </Button>
      </div>
    </>
  );
}

export default ProjectDeletionDemo;