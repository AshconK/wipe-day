// app/layout.tsx
import type { Metadata } from "next";
import { Oswald, Inter, JetBrains_Mono, Jost } from "next/font/google";
import "./globals.css";
import Nav from "./Nav";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-brand",
});

export const metadata: Metadata = {
  title: "Wipe Day",
  description: "Base designs, costs, raid planning, and electricity help for Rust.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${inter.variable} ${jetbrains.variable} ${jost.variable} antialiased`}
      >
        <Nav />
        {children}
        <footer className="site-footer">
          Wipe Day is a fan-made tool and is not affiliated with or endorsed by
          Facepunch Studios. Rust is a trademark of Facepunch Studios.
        </footer>
      </body>
    </html>
  );
}