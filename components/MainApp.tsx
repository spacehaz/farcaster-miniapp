"use client";

import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import sdk from "@farcaster/miniapp-sdk";
import { bringid } from "@/lib/bringid";

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
  const { address, isConnected } = useAccount();
  const { connect, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();

  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Signal to Farcaster that the miniapp is ready
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  function handleConnect() {
    connect({ connector: farcasterMiniApp() });
  }

  async function handleVerify() {
    setError(null);
    setIsVerifying(true);
    try {
      const result = await bringid.verifyHumanity();
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
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting…" : "Connect Wallet"}
        </button>
      ) : (
        <div style={styles.connectedBlock}>
          <p style={styles.address}>
            Connected: {address?.slice(0, 6)}…{address?.slice(-4)}
          </p>
          <button
            style={styles.button}
            onClick={handleVerify}
            disabled={isVerifying}
          >
            {isVerifying ? "Opening BringID…" : "Open BringID"}
          </button>
          <button
            style={{ ...styles.button, ...styles.disconnectButton }}
            onClick={() => disconnect()}
          >
            Disconnect
          </button>
        </div>
      )}

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
    color: "#888",
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
};
