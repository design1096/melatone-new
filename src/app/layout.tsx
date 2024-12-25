import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MELATONE",
  description: "眠れない夜にどうしてもスマホを見てしまうあなたに贈るおしゃべり寝落ちアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
