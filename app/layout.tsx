import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SAP CareerForge",
  description: "Learn SAP S/4HANA MM and SD through lessons, quizzes and practice. Independent training; not SAP certification.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
