// Tests for TypeScript prop extraction.
// No API calls — hardcoded source strings.
// Usage: node eval/extractProps.test.js

import { extractProps } from "../src/extractProps.js";

const cases = [
  {
    name: "Extracts component name from forwardRef",
    source: `export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
      ({ className, ...props }, ref) => <button ref={ref} {...props} />
    )
    Button.displayName = "Button"`,
    check: (s) => s.component === "Button",
  },
  {
    name: "Extracts props from interface",
    source: `interface ButtonProps {
      variant?: "default" | "destructive" | "outline";
      size?: "sm" | "lg";
      disabled?: boolean;
    }
    export function Button() { return null }`,
    check: (s) =>
      s.props.variant.type === "enum" &&
      s.props.variant.values.length === 3 &&
      s.props.variant.values.includes("destructive") &&
      s.props.size.type === "enum" &&
      s.props.disabled.type === "boolean",
  },
  {
    name: "Extracts cva variants with defaults",
    source: `const buttonVariants = cva("base", {
      variants: {
        variant: {
          default: "bg-primary",
          destructive: "bg-red",
          ghost: "hover:bg-accent",
        },
        size: {
          default: "h-10 px-4",
          sm: "h-9 px-3",
          lg: "h-11 px-8",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    })
    export function Button() { return null }`,
    check: (s) =>
      s.props.variant.type === "enum" &&
      s.props.variant.values.includes("ghost") &&
      !s.props.variant.values.includes("hover") &&
      s.props.variant.default === "default" &&
      s.props.size.default === "default",
  },
  {
    name: "Extracts defaults from destructuring",
    source: `interface Props {
      variant?: "default" | "outline";
      disabled?: boolean;
    }
    export const Button = React.forwardRef<HTMLButtonElement, Props>(
      ({ variant = "outline", disabled = false, ...props }, ref) => null
    )`,
    check: (s) =>
      s.props.variant.default === "outline" &&
      s.props.disabled.default === false,
  },
  {
    name: "Extracts element type from ComponentPropsWithoutRef",
    source: `interface ButtonProps extends React.ComponentPropsWithoutRef<"button"> {
      variant?: "default";
    }
    export function Button() { return null }`,
    check: (s) => s.element === "button",
  },
  {
    name: "Extracts element type from forwardRef generic",
    source: `export const Input = React.forwardRef<HTMLInputElement, InputProps>(
      (props, ref) => null
    )`,
    check: (s) => s.element === "input",
  },
  {
    name: "Filters out className, children, ref, asChild, style",
    source: `interface Props {
      className?: string;
      children?: React.ReactNode;
      ref?: React.Ref<HTMLElement>;
      asChild?: boolean;
      style?: React.CSSProperties;
      variant?: "default";
    }
    export function Component() { return null }`,
    check: (s) =>
      Object.keys(s.props).length === 1 &&
      s.props.variant,
  },
  {
    name: "Handles displayName extraction",
    source: `const MyComponent = React.forwardRef((props, ref) => null)
    MyComponent.displayName = "FancyButton"
    export { MyComponent }`,
    check: (s) => s.component === "FancyButton",
  },
];

function runTests() {
  let passed = 0;
  let failed = 0;

  console.log(`\nProp extraction — ${cases.length} cases\n${"=".repeat(40)}`);

  for (const c of cases) {
    const schema = extractProps(c.source);
    const ok = c.check(schema);

    if (ok) {
      passed++;
      console.log(`  PASS  ${c.name}`);
    } else {
      failed++;
      console.log(`  FAIL  ${c.name}`);
      console.log(`        schema: ${JSON.stringify(schema)}`);
    }
  }

  console.log(`\n${"=".repeat(40)}`);
  console.log(`${passed}/${cases.length} passed — ${failed === 0 ? "PASS" : "FAIL"}`);

  if (failed > 0) process.exit(1);
}

runTests();
