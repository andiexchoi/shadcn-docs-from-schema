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
    throw new Error("Server error: could not delete the project.");
  }
}

export function ProjectDeletionToast() {
  const [projectName, setProjectName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const trimmed = projectName.trim();
    if (!trimmed) {
      toast.warning("Enter a project name before deleting.");
      return;
    }

    setIsDeleting(true);
    try {
      await simulateDeleteProject(trimmed);
      toast.success(`Project "${trimmed}" deleted.`, {
        description: "All associated data has been permanently removed.",
      });
      setProjectName("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error("Deletion failed.", {
        description: message,
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="flex flex-col gap-6 rounded-lg border border-border bg-background p-6 shadow-sm w-full max-w-md mx-auto mt-12">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground">
            Delete Project
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter the project name and confirm deletion. Type{" "}
            <span className="font-mono font-medium text-foreground">fail</span>{" "}
            to simulate a failure.
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