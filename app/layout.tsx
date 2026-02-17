import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata = { title: "Football Agent Web (Original)" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="mx-auto max-w-7xl p-4">
        <Nav />
        {children}
      </body>
    </html>
  );
}
