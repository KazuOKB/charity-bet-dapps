// src/config/contract.ts

// .env で定義している値を TypeScript から使いやすくするためのラッパです。
// 
// 期待している .env の内容：
//
// VITE_NETWORK=testnet
// VITE_PACKAGE_ID=0x234a1e1cf624f7d2...e7cc9
// VITE_MODULE_NAME=charity_bet
// VITE_FUNCTION_NAME=bet
// VITE_EVENT_ID=0x8ca35497fa86ad8fe58ffeb77578a91296ac0b3c7787c19efc

export const NETWORK =
  (import.meta.env.VITE_NETWORK as "devnet" | "testnet" | "mainnet") ?? "testnet";

export const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID as string;
export const MODULE_NAME = import.meta.env.VITE_MODULE_NAME as string;
export const FUNCTION_NAME = import.meta.env.VITE_FUNCTION_NAME as string;

// bet 対象の shared object（イベントなど）の ID
export const EVENT_ID = import.meta.env.VITE_EVENT_ID as string;

// SUI → MIST の変換（1 SUI = 10^9 MIST）
export const MIST_PER_SUI = 1_000_000_000;

// ついでに target 文字列を一発で組み立てられるようにしておきます
export const BET_TARGET = `${PACKAGE_ID}::${MODULE_NAME}::${FUNCTION_NAME}`;
