import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "BringID Miniapp",
  description: "Farcaster miniapp powered by BringID",
  other: {
    "base:app_id": "69a9e6d0964308b7af99b1c2",
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: "https://farcaster-miniapp-pi.vercel.app/image.png",
      button: {
        title: "Verify Humanity",
        action: {
          type: "launch_miniapp",
          name: "BringID",
          url: "https://farcaster-miniapp-pi.vercel.app",
        },
      },
    }),
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
