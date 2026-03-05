import type { Metadata } from "next";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "BringID Miniapp",
  description: "Farcaster miniapp powered by BringID",
  other: {
    "base:app_id": "69a9e6d0964308b7af99b1c2",
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
