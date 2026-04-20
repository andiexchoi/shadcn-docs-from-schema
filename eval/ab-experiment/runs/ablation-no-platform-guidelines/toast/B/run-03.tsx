"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useState } from "react";

async function simulateDeleteProject(projectName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (projectName.toLowerCase() === "fail") {
        reject(new Error("Server error: unable to delete project."));
      } else {
        resolve();
      }
    }, 800);
  });
}

export function showProjectDeletionSuccess(projectName: string) {
  toast.success(`Project "${projectName}" deleted.`, {
    description: "All associated data has been permanently removed.",
  });
}

export function showProjectDeletionError(projectName: string, error?: string) {
  toast.error(`Failed to delete "${projectName}".`, {
    description: error ?? "An unexpected error occurred. Please try again.",
  });
}

export function ProjectDeletionToastDemo() {
  const [projectName, setProjectName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const name = projectName.trim();
    if (!name) {
      toast.warning("Enter a project name before deleting.");
      return;
    }

    setIsDeleting(true);
    try {
      await simulateDeleteProject(name);
      showProjectDeletionSuccess(name);
      setProjectName("");
    } catch (err) {
      const message = err instanceof Error ? err.message : undefined;
      showProjectDeletionError(name, message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm space-y-6 rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-card-foreground">
              Delete project
            </h2>
            <p className="text-sm text-muted-foreground">
              Type a project name and click delete. Use{" "}
              <span className="font-mono font-medium">fail</span> to simulate an
              error.
            </p>
          </div>

          <div className="space-y-2">
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
    </>
  );
}

export default ProjectDeletionToastDemo;