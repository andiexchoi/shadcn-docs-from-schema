"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useState } from "react";

function deleteProject(projectName: string): Promise<void> {
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
      await deleteProject(projectName.trim());
      toast.success(`Project "${projectName.trim()}" deleted.`, {
        description: "The project and all its data have been permanently removed.",
      });
      setProjectName("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred.";
      toast.error("Project deletion failed.", {
        description: message,
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Toaster position="bottom-right" />
      <div className="flex flex-col gap-4 max-w-sm p-6 rounded-lg border bg-white shadow-sm">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-gray-900">Delete project</h2>
          <p className="text-sm text-gray-500">
            Enter the project name to permanently delete it. Type{" "}
            <span className="font-mono font-medium text-gray-700">fail</span> to
            simulate a failure.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="project-name">Project name</Label>
          <Input
            id="project-name"
            type="text"
            placeholder="my-project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
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