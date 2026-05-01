import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Historias de Vo",
  description: "AI bedtime story MVP"
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

