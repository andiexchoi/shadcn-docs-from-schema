"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import { useState } from "react";

async function simulateDeleteProject(
  projectName: string
): Promise<{ success: boolean; error?: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  if (projectName.toLowerCase() === "fail") {
    return { success: false, error: "Server error: could not delete project." };
  }
  return { success: true };
}

export function ProjectDeletionToast() {
  const [projectName, setProjectName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (!projectName.trim()) {
      return;
    }

    setIsDeleting(true);

    const toastId = toast.loading(`Deleting "${projectName}"…`);

    try {
      const result = await simulateDeleteProject(projectName.trim());

      if (result.success) {
        toast.success(`"${projectName}" deleted.`, {
          id: toastId,
          description: "The project and all its data have been removed.",
          action: {
            label: "Undo",
            onClick: () => {
              toast.info(`Undo requested for "${projectName}".`, {
                description:
                  "Restoring this project is not yet implemented in this demo.",
              });
            },
          },
          duration: 6000,
        });
        setProjectName("");
      } else {
        toast.error(`Failed to delete "${projectName}".`, {
          id: toastId,
          description:
            result.error ?? "An unexpected error occurred. Please try again.",
          duration: 5000,
        });
      }
    } catch {
      toast.error(`Failed to delete "${projectName}".`, {
        id: toastId,
        description: "An unexpected error occurred. Please try again.",
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
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight">
              Delete project
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter a project name to delete it. Type{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                fail
              </code>{" "}
              to simulate a failure.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              placeholder="e.g. my-app"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isDeleting) {
                  handleDelete();
                }
              }}
              disabled={isDeleting}
              aria-describedby="project-name-hint"
            />
            <p id="project-name-hint" className="text-xs text-muted-foreground">
              Press Enter or click the button below to proceed.
            </p>
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            disabled={isDeleting || !projectName.trim()}
            aria-busy={isDeleting}
          >
            {isDeleting ? "Deleting…" : "Delete project"}
          </Button>
        </div>
      </div>
    </>
  );
}