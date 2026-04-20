"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useState } from "react";

async function simulateDeleteProject(projectName: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  if (projectName.toLowerCase().includes("fail")) {
    throw new Error("Server rejected the deletion request.");
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

  async function handleDelete() {
    if (!projectName.trim()) {
      toast.warning("Project name required.", {
        description: "Enter a project name before deleting.",
      });
      return;
    }

    setIsDeleting(true);
    await deleteProject(crypto.randomUUID(), projectName.trim());
    setIsDeleting(false);
    setProjectName("");
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">
              Delete project
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter a project name to simulate deletion. Include &ldquo;fail&rdquo; to
              trigger an error.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              placeholder="e.g. my-project or fail-project"
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
    </>
  );
}

export default ProjectDeletionToastDemo;