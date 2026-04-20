// Creates a self-contained scaffold directory for a component. Used by the
// agentic replication harness, which runs `claude -p` inside the dir.
// Each scaffold has:
//   package.json             Next.js + shadcn deps (component-specific)
//   tsconfig.json
//   lib/utils.ts             cn() helper
//   components/ui/button.tsx
//   components/ui/input.tsx
//   components/ui/label.tsx
//   CLAUDE.md                (condition B only)
//
// Deliberately absent: components/ui/<target>.tsx — so the agent must reach
// for the underlying primitives, matching the direct-API experiment setup.

import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLAUDE_MD_CACHE = join(__dirname, "claude-md");

const PACKAGE_JSON_BASE = {
  name: "scaffold",
  version: "0.1.0",
  private: true,
  type: "module",
  dependencies: {
    next: "^15.2.4",
    react: "^19.0.0",
    "react-dom": "^19.0.0",
    "class-variance-authority": "^0.7.1",
    clsx: "^2.1.1",
    "lucide-react": "^0.475.0",
    "tailwind-merge": "^3.0.2",
  },
};

const TSCONFIG = {
  compilerOptions: {
    target: "ES2017",
    lib: ["dom", "dom.iterable", "esnext"],
    allowJs: true,
    skipLibCheck: true,
    strict: true,
    noEmit: true,
    esModuleInterop: true,
    module: "esnext",
    moduleResolution: "bundler",
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: "preserve",
    baseUrl: ".",
    paths: { "@/*": ["./*"] },
  },
  include: ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  exclude: ["node_modules"],
};

const LIB_UTILS = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

const UI_BUTTON = `"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
`;

const UI_INPUT = `"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
`;

const UI_LABEL = `"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-sm font-medium leading-none", className)}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
`;

export function buildScaffold({ scaffoldDir, component, includeClaudeMd }) {
  mkdirSync(scaffoldDir, { recursive: true });
  mkdirSync(join(scaffoldDir, "lib"), { recursive: true });
  mkdirSync(join(scaffoldDir, "components", "ui"), { recursive: true });
  mkdirSync(join(scaffoldDir, "app"), { recursive: true });

  // package.json with component-specific deps merged in
  const pkg = JSON.parse(JSON.stringify(PACKAGE_JSON_BASE));
  Object.assign(pkg.dependencies, component.deps);
  writeFileSync(join(scaffoldDir, "package.json"), JSON.stringify(pkg, null, 2));

  writeFileSync(join(scaffoldDir, "tsconfig.json"), JSON.stringify(TSCONFIG, null, 2));
  writeFileSync(join(scaffoldDir, "lib", "utils.ts"), LIB_UTILS);
  writeFileSync(join(scaffoldDir, "components", "ui", "button.tsx"), UI_BUTTON);
  writeFileSync(join(scaffoldDir, "components", "ui", "input.tsx"), UI_INPUT);
  writeFileSync(join(scaffoldDir, "components", "ui", "label.tsx"), UI_LABEL);

  if (includeClaudeMd) {
    const claudeMdPath = join(CLAUDE_MD_CACHE, `${component.batchName}.md`);
    if (!existsSync(claudeMdPath)) {
      throw new Error(`CLAUDE.md cache missing: ${claudeMdPath}`);
    }
    const content = readFileSync(claudeMdPath, "utf8");
    writeFileSync(join(scaffoldDir, "CLAUDE.md"), content);
  }
}
