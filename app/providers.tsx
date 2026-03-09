"use client";

import { createContext, useContext, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, useWalletClient } from "wagmi";
import { BringIDModal } from "bringid/react";
import { wagmiConfig } from "@/lib/wagmi";

const queryClient = new QueryClient();

const BringIDContext = createContext({ iframeReady: false });

export function useBringIDContext() {
  return useContext(BringIDContext);
}

function BringIDProviderInner({ children }: { children: React.ReactNode }) {
  const { data: walletClient } = useWalletClient();
  const [iframeReady, setIframeReady] = useState(false);

  return (
    <BringIDContext.Provider value={{ iframeReady }}>
      <BringIDModal
        address={walletClient?.account.address}
        generateSignature={
          walletClient
            ? (message: string) => walletClient.signMessage({ message })
            : undefined
        }
        connectUrl="https://staging.widget.bringid.org"
        iframeOnLoad={() => setIframeReady(true)}
      />
      {children}
    </BringIDContext.Provider>
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
