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
        reject(new Error("Server error: could not delete project."));
      } else {
        resolve();
      }
    }, 800);
  });
}

export function ProjectDeletionToast() {
  const [projectName, setProjectName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!projectName.trim()) {
      toast.warning("Enter a project name before deleting.");
      return;
    }

    setIsDeleting(true);
    try {
      await simulateDeleteProject(projectName.trim());
      toast.success(`Project "${projectName.trim()}" deleted.`);
      setProjectName("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Project deletion failed.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="flex flex-col gap-6 p-8 max-w-md mx-auto mt-16 rounded-xl border border-border bg-card shadow-sm">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">
            Delete project
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter the project name and confirm deletion. Type{" "}
            <span className="font-mono bg-muted px-1 py-0.5 rounded text-xs">
              fail
            </span>{" "}
            to simulate an error.
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
    </>
  );
}