"use client";

import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

async function simulateDeleteProject(projectName: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (projectName.toLowerCase() === "fail") {
    throw new Error("Deletion failed: project is locked or does not exist.");
  }
}

export function useProjectDeletionToast() {
  async function deleteProject(projectName: string): Promise<boolean> {
    try {
      await simulateDeleteProject(projectName);
      toast.success(`Project "${projectName}" deleted.`, {
        description: "The project and all its data have been permanently removed.",
      });
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      toast.error(`Failed to delete "${projectName}".`, {
        description: message,
      });
      return false;
    }
  }

  return { deleteProject };
}

export function ProjectDeletionToastProvider() {
  return <Toaster position="bottom-right" />;
}

export function ProjectDeletionDemo() {
  const [projectName, setProjectName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteProject } = useProjectDeletionToast();

  async function handleDelete() {
    const name = projectName.trim();
    if (!name) {
      toast.warning("Project name required.", {
        description: "Enter a project name before deleting.",
      });
      return;
    }
    setIsDeleting(true);
    await deleteProject(name);
    setIsDeleting(false);
    setProjectName("");
  }

  return (
    <div className="flex flex-col gap-4 max-w-sm p-6 border rounded-lg shadow-sm bg-white">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold">Delete project</h2>
        <p className="text-sm text-muted-foreground">
          Enter a project name to delete it. Type{" "}
          <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
            fail
          </span>{" "}
          to simulate a failure.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="project-name">Project name</Label>
        <Input
          id="project-name"
          placeholder="my-project"
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
        onClick={handleDelete}
        disabled={isDeleting}
        className="w-full"
      >
        {isDeleting ? "Deleting…" : "Delete project"}
      </Button>
    </div>
  );
}

export default function ProjectDeletionToast() {
  return (
    <>
      <ProjectDeletionToastProvider />
      <ProjectDeletionDemo />
    </>
  );
}