// src/components/BetButtons.tsx

import { useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { buildBetTx } from "../lib/buildBetTx";

// App.tsx 側の Side と同じ定義（別ファイルだが型としては互換）
type Side = "A" | "B";

type BetButtonsProps = {
  side: Side | null;
  amount: string; // 入力欄の文字列そのまま
  disabled?: boolean;
  onSuccess?: (digest: string, amountSui: number, side: Side) => void;
  onError?: (message: string) => void;
};

export function BetButtons({
  side,
  amount,
  disabled,
  onSuccess,
  onError,
}: BetButtonsProps) {
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    // 試合終了など親からの disable 指定
    if (disabled) return;

    if (!side) {
      onError?.("応援する側（ファイター）を選択してください");
      return;
    }

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      onError?.("ベット額を正しく入力してください");
      return;
    }

    if (!currentAccount) {
      onError?.("ウォレットを接続してください（右上の Connect ボタン）。");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Tx を組み立てる
      const tx = buildBetTx({
        side,
        amountSui: numAmount,
      });

      // 2. ウォレットに署名・実行してもらう
      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      onSuccess?.(result.digest, numAmount, side);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        onError?.(`トランザクションエラー: ${e.message}`);
      } else {
        onError?.(`トランザクションエラー: ${String(e)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="primary-button"
      onClick={handleClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? "送信中..." : "チャリティにベットする"}
    </button>
  );
}
