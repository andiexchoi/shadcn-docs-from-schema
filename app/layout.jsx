import "./globals.css";

export const metadata = {
  title: "What does this shadcn/ui component do?",
  description:
    "Type a shadcn/ui component name and get structured documentation written for designers and product managers. Grounded in live source docs from the shadcn/ui, Radix UI, and Base UI repositories.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
