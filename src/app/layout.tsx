import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chinese CHI 2026",
  description: "Chinese CHI 2026 Conference Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasSupabase = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute h-0 w-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id="advanced-texture" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence
                result="noise"
                numOctaves="3"
                baseFrequency="0.7"
                type="fractalNoise"
              />
              <feSpecularLighting
                result="specular"
                lightingColor="#fff"
                specularExponent="20"
                specularConstant="0.8"
                surfaceScale="2"
                in="noise"
              >
                <fePointLight z="100" y="50" x="50" />
              </feSpecularLighting>
              <feComposite
                result="litNoise"
                operator="in"
                in2="SourceGraphic"
                in="specular"
              />
              <feBlend mode="overlay" in2="litNoise" in="SourceGraphic" />
            </filter>
          </defs>
        </svg>
        <SiteShell hasSupabase={hasSupabase}>{children}</SiteShell>
      </body>
    </html>
  );
}
