/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PACKAGE_ID: string;
    readonly VITE_MODULE_NAME: string;
    readonly VITE_FUNCTION_NAME: string;
    readonly VITE_NETWORK: "mainnet" | "testnet" | "devnet";
    readonly VITE_EVENT_ID: string;  // 0x... 形式のID
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
