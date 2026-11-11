import "./globals.css";
import "./custom.css";
import "./responsive.css";

// The real layout (with <html> and <body>) is app/[lang]/layout.tsx,
// because it needs to know the language. This one only passes through.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
