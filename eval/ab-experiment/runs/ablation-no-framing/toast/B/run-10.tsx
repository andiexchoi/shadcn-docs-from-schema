"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import { useState } from "react";

function deleteProject(name: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (name.trim().toLowerCase() === "fail") {
        reject(new Error("Server error: unable to delete project."));
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

    const name = projectName.trim();
    const toastId = toast.loading(`Deleting project "${name}"…`);
    setIsDeleting(true);

    try {
      await deleteProject(name);
      toast.success(`Project "${name}" deleted.`, {
        id: toastId,
        description: "All associated data has been permanently removed.",
        action: {
          label: "Undo",
          onClick: () => {
            toast.info(`Deletion of "${name}" undone.`, {
              description: "The project has been restored.",
            });
          },
        },
        duration: 6000,
      });
      setProjectName("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      toast.error(`Failed to delete "${name}".`, {
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

      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-card-foreground">
              Delete project
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter a project name and click delete. Type{" "}
              <span className="font-mono font-medium text-foreground">fail</span>{" "}
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
                if (e.key === "Enter" && !isDeleting) handleDelete();
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
    </>
  );
}