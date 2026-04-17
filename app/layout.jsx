import "./globals.css";

export const metadata = {
  title: "Component documentation for humans and AI agents · shadcn-docs-from-schema",
  description:
    "The documentation layer between your component library and everything that reads it. Generate readable markdown docs and structured agent context files (CLAUDE.md, AGENTS.md, llms.txt) from a JSON schema, a TSX file, or a live shadcn/ui component.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
