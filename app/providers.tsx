"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, useWalletClient } from "wagmi";
import { BringIDModal } from "bringid/react";
import { wagmiConfig } from "@/lib/wagmi";

const queryClient = new QueryClient();

function BringIDProviderInner({ children }: { children: React.ReactNode }) {
  const { data: walletClient } = useWalletClient();

  return (
    <>
      {walletClient && (
        <BringIDModal
          address={walletClient.account.address}
          generateSignature={(message: string) =>
            walletClient.signMessage({ message })
          }
        />
      )}
      {children}
    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <BringIDProviderInner>{children}</BringIDProviderInner>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
