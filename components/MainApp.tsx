"use client";

import { useEffect, useRef, useState } from "react";
import { useAccount, useConnect, useDisconnect, useWalletClient, useSwitchChain } from "wagmi";
import { injected } from "wagmi/connectors";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import sdk from "@farcaster/miniapp-sdk";
import { base } from "wagmi/chains";
import { createBringID } from "@/lib/bringid";
import { useBringIDContext } from "@/app/providers";

type Task = {
  id: string;
  label: string;
  completed: boolean;
};

type VerifyResult = {
  points: number;
  proofs: Task[];
};

export function MainApp() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: walletClient } = useWalletClient();
  const { switchChain } = useSwitchChain();
  const { iframeReady } = useBringIDContext();

  // Auto-switch to Base when connected on wrong chain (e.g. Coinbase dapp browser)
  useEffect(() => {
    if (isConnected && chainId !== undefined && chainId !== base.id) {
      switchChain({ chainId: base.id });
    }
  }, [isConnected, chainId, switchChain]);

  const bringidRef = useRef<ReturnType<typeof createBringID> | null>(null);
  const [isFarcaster, setIsFarcaster] = useState<boolean | null>(null);

  const signerReady = !!walletClient;
  const canVerify = iframeReady && signerReady;
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sdkContext, setSdkContext] = useState<string | null>(null);
  const queryParams = typeof window !== "undefined"
    ? Object.fromEntries(new URLSearchParams(window.location.search).entries())
    : {};

  // Detect Farcaster context and signal ready if applicable
  useEffect(() => {
    async function init() {
      try {
        const ctx = await Promise.race([
          sdk.context,
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 500)),
        ]);
        const inFarcaster = !!(ctx && (ctx as { user?: { fid?: number } }).user?.fid);
        setSdkContext(JSON.stringify(ctx, null, 2));
        const clientFid = (ctx as { client?: { clientFid?: number } })?.client?.clientFid;
        const detectedPlatform: 'farcaster' | 'base' | 'unknown' = clientFid === 9152 ? 'farcaster' : clientFid === 309857 ? 'base' : 'unknown';
        bringidRef.current = createBringID(detectedPlatform);
        setIsFarcaster(inFarcaster);
        if (inFarcaster) {
          sdk.actions.ready();
        }
      } catch {
        bringidRef.current = createBringID('unknown');
        setIsFarcaster(false);
      }
    }
    init();
  }, []);

  function handleConnect() {
    if (isFarcaster) {
      connect({ connector: farcasterMiniApp() });
    } else {
      connect({ connector: injected() });
    }
  }

  async function handleVerify() {
    setError(null);
    setIsVerifying(true);
    try {
      const result = await bringidRef.current!.verifyHumanity();
      setVerifyResult(result as VerifyResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>BringID</h1>
      <p style={styles.subtitle}>Verify your humanity on Farcaster</p>

      {!isConnected ? (
        <button
          style={styles.button}
          onClick={handleConnect}
          disabled={isConnecting || isFarcaster === null}
        >
          {isConnecting ? "Connecting…" : isFarcaster === null ? "Loading…" : "Connect Wallet"}
        </button>
      ) : (
        <div style={styles.connectedBlock}>
          <p style={styles.address}>
            Connected: {address?.slice(0, 6)}…{address?.slice(-4)}
          </p>
          <button
            style={{
              ...styles.button,
              ...(!canVerify || isVerifying ? styles.buttonDisabled : {}),
            }}
            onClick={handleVerify}
            disabled={!canVerify || isVerifying}
          >
            {isVerifying
              ? "Opening BringID…"
              : !iframeReady
              ? "Loading widget…"
              : !signerReady
              ? "Waiting for signer…"
              : "Open BringID"}
          </button>
          <button
            style={{ ...styles.button, ...styles.disconnectButton }}
            onClick={() => disconnect()}
          >
            Disconnect
          </button>
        </div>
      )}

      <button
        style={styles.button}
        onClick={() => sdk.actions.openUrl('https://google.com')}
      >
        test open external url
      </button>

      <a
        href="https://google.com"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.testLink}
      >
        test &lt;a&gt; tag link
      </a>

      <div style={styles.debugBlock}>
        <div style={styles.debugTitle}>SDK context:</div>
        <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
          {sdkContext ?? "loading…"}
        </pre>
      </div>

      <div style={styles.debugBlock}>
        <div style={styles.debugTitle}>Query params:</div>
        {Object.keys(queryParams).length === 0
          ? <div style={styles.debugRow}>none</div>
          : Object.entries(queryParams).map(([k, v]) => (
            <div key={k} style={styles.debugRow}>
              <b>{k}:</b> {v.length > 40 ? v.slice(0, 40) + '…' : v}
            </div>
          ))
        }
      </div>

      {error && <p style={styles.error}>{error}</p>}

      {verifyResult && (
        <div style={styles.resultsBlock}>
          <h2 style={styles.resultsTitle}>
            Points earned: {verifyResult.points}
          </h2>
          <ul style={styles.taskList}>
            {verifyResult.proofs?.map((task) => (
              <li key={task.id} style={styles.taskItem}>
                <span style={task.completed ? styles.taskDone : styles.taskPending}>
                  {task.completed ? "✓" : "○"}
                </span>{" "}
                {task.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "24px",
    fontFamily: "system-ui, sans-serif",
    background: "#0f0f0f",
    color: "#ffffff",
    gap: "16px",
  },
  title: {
    fontSize: "32px",
    fontWeight: 700,
    margin: 0,
  },
  subtitle: {
    fontSize: "16px",
    color: "#ffffff",
    margin: 0,
  },
  button: {
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: 600,
    borderRadius: "12px",
    border: "none",
    background: "#8b5cf6",
    color: "#fff",
    cursor: "pointer",
    width: "100%",
    maxWidth: "320px",
  },
  disconnectButton: {
    background: "#333",
    marginTop: "8px",
  },
  buttonDisabled: {
    background: "#4a3a6b",
    cursor: "not-allowed",
    opacity: 0.6,
  },
  connectedBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    width: "100%",
  },
  address: {
    fontSize: "14px",
    color: "#aaa",
    margin: 0,
  },
  error: {
    color: "#f87171",
    fontSize: "14px",
    textAlign: "center",
    maxWidth: "320px",
  },
  resultsBlock: {
    marginTop: "24px",
    width: "100%",
    maxWidth: "380px",
    background: "#1a1a1a",
    borderRadius: "16px",
    padding: "20px",
  },
  resultsTitle: {
    fontSize: "20px",
    fontWeight: 600,
    margin: "0 0 16px",
  },
  taskList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  taskItem: {
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  taskDone: {
    color: "#4ade80",
    fontWeight: 700,
  },
  taskPending: {
    color: "#888",
  },
  testLink: {
    fontSize: "13px",
    color: "#a78bfa",
    textDecoration: "underline",
    cursor: "pointer",
  },
  debugBlock: {
    width: "100%",
    maxWidth: "380px",
    background: "rgba(0,0,0,0.7)",
    border: "1px solid #333",
    borderRadius: "8px",
    padding: "10px",
    fontFamily: "monospace",
    fontSize: "11px",
    color: "#0f0",
  },
  debugTitle: {
    fontWeight: 700,
    marginBottom: "4px",
    color: "#aaa",
  },
  debugRow: {
    wordBreak: "break-all" as const,
    lineHeight: "1.6",
  },
};
