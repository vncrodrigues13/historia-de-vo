import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contos de Ninar",
  description: "MVP de histórias de ninar personalizadas"
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
