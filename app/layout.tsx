import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ocean Learner — An audio-first machine learning lesson",
  description: "Train and test a simple machine learning model in an accessible, keyboard-friendly ocean lesson.",
  openGraph: {
    title: "Ocean Learner",
    description: "Teach a machine. Protect an ocean.",
    images: [{ url: "https://ocean-learner-accessible-ml.brown-goby-8001.chatgpt.site/og.png", width: 1536, height: 1024, alt: "Ocean Learner: an underwater robot classifies a fish and a plastic bottle." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ocean Learner",
    description: "Teach a machine. Protect an ocean.",
    images: ["https://ocean-learner-accessible-ml.brown-goby-8001.chatgpt.site/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
