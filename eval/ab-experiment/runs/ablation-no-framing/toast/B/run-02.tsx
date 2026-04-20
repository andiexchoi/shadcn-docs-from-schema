"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import { useState } from "react";

async function simulateDeleteProject(projectName: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  if (projectName.toLowerCase() === "fail") {
    throw new Error("Server error: could not delete project.");
  }
}

export function ProjectDeletionToast() {
  const [projectName, setProjectName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    const trimmed = projectName.trim();
    if (!trimmed) return;

    setIsDeleting(true);
    const toastId = toast.loading(`Deleting "${trimmed}"…`);

    try {
      await simulateDeleteProject(trimmed);
      toast.success(`"${trimmed}" deleted`, {
        id: toastId,
        description: "The project and all its data have been permanently removed.",
        action: {
          label: "Undo",
          onClick: () => {
            toast.info(`Undo requested for "${trimmed}"`, {
              description: "Restoring the project…",
              duration: 4000,
            });
          },
        },
        duration: 6000,
      });
      setProjectName("");
    } catch (err) {
      toast.error(`Failed to delete "${trimmed}"`, {
        id: toastId,
        description:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold tracking-tight">
              Delete project
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter a project name to delete it. Type{" "}
              <span className="font-mono font-medium text-foreground">fail</span>{" "}
              to simulate a failure.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              placeholder="e.g. my-project"
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
            disabled={isDeleting || projectName.trim() === ""}
          >
            {isDeleting ? "Deleting…" : "Delete project"}
          </Button>
        </div>
      </div>
    </>
  );
}