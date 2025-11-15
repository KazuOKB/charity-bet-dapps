// src/components/OnchainBetDebug.tsx

import { useState } from "react";
import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { buildBetTx } from "../lib/buildBetTx";

type Side = "A" | "B";

export function OnchainBetDebug() {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [side, setSide] = useState<Side | null>("A");
  const [amount, setAmount] = useState("0.1");
  const [message, setMessage] = useState<string | null>(null);
  const [digest, setDigest] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleBet = async () => {
    if (!currentAccount) {
      setMessage("ウォレットを接続してください。");
      return;
    }
    if (!side) {
      setMessage("A か B のどちらかを選択してください。");
      return;
    }
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setMessage("ベット額を正しく入力してください。");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const tx = buildBetTx({
        side,
        amountSui: numAmount,
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      setDigest(result.digest);
      setMessage(
        `オンチェーンに ${numAmount} SUI ベットしました！（tx: ${result.digest.slice(
          0,
          10,
        )}...）`,
      );
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setMessage(`トランザクションエラー: ${e.message}`);
      } else {
        setMessage(`トランザクションエラー: ${String(e)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      style={{
        marginTop: "2rem",
        padding: "1.5rem",
        borderRadius: "1rem",
        border: "1px solid #444",
        background: "#111",
      }}
    >
      <h2 style={{ marginBottom: "0.5rem" }}>On-chain ベット（デバッグ用）</h2>
      <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
        下の UI はデモ用とは独立した、オンチェーン接続のテスト用コンポーネントです。
      </p>

      <div style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
        <ConnectButton />
      </div>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
        <button
          onClick={() => setSide("A")}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "999px",
            border: side === "A" ? "1px solid #4af" : "1px solid #555",
            background: side === "A" ? "#123c" : "transparent",
          }}
        >
          サイド A
        </button>
        <button
          onClick={() => setSide("B")}
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "999px",
            border: side === "B" ? "1px solid #f55" : "1px solid #555",
            background: side === "B" ? "#311c" : "transparent",
          }}
        >
          サイド B
        </button>
      </div>

      <div style={{ marginTop: "0.5rem" }}>
        <label style={{ fontSize: "0.9rem" }}>
          ベット額（SUI）：
          <input
            type="number"
            value={amount}
            min={0}
            step={0.1}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              marginLeft: "0.5rem",
              padding: "0.2rem 0.4rem",
              borderRadius: "0.4rem",
              border: "1px solid #555",
              background: "#000",
              color: "#fff",
            }}
          />
        </label>
      </div>

      <button
        onClick={handleBet}
        disabled={isLoading}
        style={{
          marginTop: "0.8rem",
          padding: "0.5rem 1rem",
          borderRadius: "999px",
          border: "none",
          background: isLoading ? "#555" : "#0af",
          color: "#000",
          cursor: isLoading ? "default" : "pointer",
        }}
      >
        {isLoading ? "送信中..." : "オンチェーンにベットする"}
      </button>

      {message && (
        <div style={{ marginTop: "0.8rem", fontSize: "0.9rem" }}>{message}</div>
      )}
      {digest && (
        <div style={{ marginTop: "0.3rem", fontSize: "0.8rem", opacity: 0.8 }}>
          Tx Digest: <code>{digest}</code>
        </div>
      )}
    </section>
  );
}
