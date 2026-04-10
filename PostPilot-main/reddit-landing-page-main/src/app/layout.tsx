import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space",
});

export const metadata: Metadata = {
  title: "PostPilot — Reddit Post Scheduler",
  description:
    "PostPilot lets you schedule and auto-publish Reddit posts at any time. Connect your Reddit account via OAuth, write your post, set a time, and PostPilot publishes it automatically. Free to start.",
  keywords: [
    "reddit scheduler", "schedule reddit posts", "reddit post automation",
    "auto publish reddit", "reddit content tool", "reddit marketing",
    "reddit post planner", "PostPilot"
  ],
  openGraph: {
    title: "PostPilot — Reddit Post Scheduler",
    description: "Schedule and auto-publish Reddit posts. Connect via Reddit OAuth, set a time, and PostPilot does the rest. Free to start.",
    type: "website",
    siteName: "PostPilot",
  },
  twitter: {
    card: "summary_large_image",
    title: "PostPilot — Reddit Post Scheduler",
    description: "Schedule and auto-publish Reddit posts automatically. Free to start, no credit card required.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body style={{ fontFamily: "var(--font-inter), sans-serif" }}>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            },
            error: {
              iconTheme: {
                primary: '#FF4500',
                secondary: '#fff',
              },
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
