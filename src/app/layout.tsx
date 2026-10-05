import type { Metadata } from "next";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://andresblitz.com"),
  title: {
    default: "Home History — A Time-Capsule Timeline for a House | Andrés Blitz",
    template: "%s | Home History",
  },
  description:
    "Home History is a time-capsule web app by Andrés Blitz: past and present residents add photos and stories to a shared timeline for a home. Next.js, TypeScript MVP.",
  authors: [{ name: "Andrés Blitz", url: "https://andresblitz.com/" }],
  creator: "Andrés Blitz",
  themeColor: "#05070f",
  alternates: {
    canonical: "https://andresblitz.com/projects/home-history/",
  },
  openGraph: {
    type: "website",
    siteName: "Andrés Blitz",
    locale: "en_CA",
    url: "https://andresblitz.com/projects/home-history/",
    title: "Home History — A Time-Capsule Timeline for a House | Andrés Blitz",
    description:
      "Past and present residents add photos and stories to a shared timeline for a house. Next.js MVP by Andrés Blitz.",
    images: [
      {
        url: "https://andresblitz.com/assets/projects/home-history.png",
        width: 1200,
        height: 630,
        alt: "Home History — time capsule for a house",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@andresblitz",
    creator: "@andresblitz",
    title: "Home History — A Time-Capsule Timeline for a House | Andrés Blitz",
    description:
      "Past and present residents add photos and stories to a shared timeline for a house. Next.js MVP by Andrés Blitz.",
    images: ["https://andresblitz.com/assets/projects/home-history.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA">
      <body className={`${display.variable} ${body.variable} grain antialiased`}>
        {children}
      </body>
    </html>
  );
}
