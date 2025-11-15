// src/lib/buildBetTx.ts

import { Transaction } from "@mysten/sui/transactions";
import {
  BET_TARGET,
  EVENT_ID,
  MIST_PER_SUI,
} from "../config/contract";

// フロント側で "A" / "B" を扱う前提
export type Side = "A" | "B";

export interface BuildBetTxParams {
  side: Side;        // どちらの選手にベットするか
  amountSui: number; // 何 SUI ベットするか（例: 0.1）
}

/**
 * charity_bet::bet を呼ぶための Transaction を組み立てる関数。
 *
 * 例：
 *   const tx = buildBetTx({ side: "A", amountSui: 0.1 });
 *   signAndExecuteTransaction({ transaction: tx, ... });
 */
export function buildBetTx(params: BuildBetTxParams): Transaction {
  const { side, amountSui } = params;

  const tx = new Transaction();

  // ===== 1. 送金額（SUI → MIST）を計算 =====
  // amountSui は 0.1 / 0.5 / 1 などの小さめの値を想定しています。
  // そのため number で扱って問題ない前提で、MIST に変換します。
  const amountMist = Math.floor(amountSui * MIST_PER_SUI); // number

  // ===== 2. ガスコインから指定量を切り出す =====
  // tx.splitCoins(tx.gas, [tx.pure('u64', ...)]) は
  // 「ガスコインから指定量の新しい Coin<SUI> を 1 個作る」という意味です。
  const [betCoin] = tx.splitCoins(tx.gas, [
    tx.pure("u64", amountMist),
  ]);

  // ===== 3. サイドを 0/1 の u8 に変換 =====
  // Move 側のシグネチャが
  //   fun bet(event: &mut Event, side: u8, bet_coin: Coin<SUI>, ctx: &mut TxContext)
  // という形を想定しています。
  const sideValue = side === "A" ? 0 : 1;

  // ===== 4. Move 関数呼び出しを組み立てる =====
  tx.moveCall({
    target: BET_TARGET, // `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`
    arguments: [
      tx.object(EVENT_ID),       // &mut Event (shared object)
      tx.pure("u8", sideValue),  // u8 サイド
      betCoin,                   // Coin<SUI>
      // ※ Move 側で他に引数がある場合はここに追加
    ],
  });

  // あとはウォレット側で sign & execute してもらう前提
  return tx;
}
