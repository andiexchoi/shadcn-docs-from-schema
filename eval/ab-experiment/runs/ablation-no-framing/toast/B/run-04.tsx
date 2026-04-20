"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import { useState } from "react";

async function simulateDeleteProject(projectName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (projectName.toLowerCase() === "fail") {
        reject(new Error("Server error: could not delete the project."));
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
      await simulateDeleteProject(projectName);
      toast.success(`"${projectName}" was deleted.`, {
        id: toastId,
        description: "The project and all its data have been removed.",
        action: {
          label: "Undo",
          onClick: () => {
            toast.info(`Deletion of "${projectName}" undone.`);
          },
        },
        duration: 6000,
      });
      setProjectName("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
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
      <div className="flex flex-col gap-4 p-6 max-w-sm rounded-xl border border-border bg-background shadow-sm">
        <div className="flex flex-col gap-1">
          <h2 className="text-base font-semibold text-foreground">
            Delete project
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter a project name and click Delete. Type{" "}
            <span className="font-mono font-medium text-foreground">fail</span>{" "}
            to simulate a failure.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
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
          disabled={isDeleting || !projectName.trim()}
          className="w-full"
        >
          {isDeleting ? "Deleting…" : "Delete project"}
        </Button>
      </div>
    </>
  );
}