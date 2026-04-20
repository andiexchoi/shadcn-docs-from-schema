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

export function useProjectDeletionToast() {
  async function deleteProject(projectId: string, projectName: string) {
    try {
      await simulateDeleteProject(projectName);
      toast.success("Project deleted.", {
        description: `"${projectName}" has been permanently removed.`,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error("Deletion failed.", {
        description: message,
      });
    }
  }

  return { deleteProject };
}

export function ProjectDeletionToastDemo() {
  const [projectName, setProjectName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteProject } = useProjectDeletionToast();

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    if (!projectName.trim()) return;
    setIsDeleting(true);
    await deleteProject("project-123", projectName.trim());
    setIsDeleting(false);
    setProjectName("");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <Toaster position="bottom-right" />
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight text-card-foreground">
            Delete project
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter a project name to simulate deletion. Type{" "}
            <span className="font-mono font-medium text-destructive">fail</span>{" "}
            to trigger an error toast.
          </p>
        </div>

        <form onSubmit={handleDelete} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              placeholder="e.g. my-app"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={isDeleting}
              autoComplete="off"
            />
          </div>

          <Button
            type="submit"
            variant="destructive"
            className="w-full"
            disabled={isDeleting || !projectName.trim()}
          >
            {isDeleting ? "Deleting…" : "Delete project"}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ProjectDeletionToastDemo;