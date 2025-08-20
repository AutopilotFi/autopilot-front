"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  createPublicClient,
  createWalletClient,
  http,
  custom,
  type PublicClient,
  type WalletClient,
  type Account,
  type Chain,
  type Address,
} from "viem";
import { mainnet, base, polygon, arbitrum, zkSync } from "viem/chains";

// ⬇️ Import your external RPC URLs (adjust path as needed)
import {
  MAINNET_URL,
  MATIC_URL,
  BASE_URL,
  ARBITRUM_URL,
  ZKSYNC_URL,
} from "@/consts/constants";

// ---- Types & constants ------------------------------------------------------

const CHAINS_BY_ID: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [arbitrum.id]: arbitrum,
  [base.id]: base,
  [polygon.id]: polygon,
  [zkSync.id]: zkSync,
};

const RPC_URLS_BY_ID: Record<number, string> = {
  [mainnet.id]: MAINNET_URL,
  [arbitrum.id]: ARBITRUM_URL,
  [base.id]: BASE_URL,
  [polygon.id]: MATIC_URL,
  [zkSync.id]: ZKSYNC_URL,
};

const DEFAULT_READONLY_CHAIN = base; // which chain your app should read from when disconnected

const hexChainId = (id: number) => `0x${id.toString(16)}`;

// ---- Context ----------------------------------------------------------------

interface WalletContextData {
  // Connection state
  isConnected: boolean;
  isConnecting: boolean;

  // Account & chain
  account: Account | null;
  chain: Chain | null;
  chainId: number | null;

  // Clients
  publicClient: PublicClient | null;
  walletClient: WalletClient | null;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  switchChain: (chainId: number) => Promise<void>;
  getBalance: (address?: Address) => Promise<bigint>;

  // Errors
  error: string | null;
  clearError: () => void;
}

const defaultWalletData: WalletContextData = {
  isConnected: false,
  isConnecting: false,
  account: null,
  chain: null,
  chainId: null,
  publicClient: null,
  walletClient: null,
  connect: async () => {},
  disconnect: async () => {},
  switchChain: async () => {},
  getBalance: async () => BigInt(0),
  error: null,
  clearError: () => {},
};

export const WalletContext = createContext<WalletContextData>(defaultWalletData);

// ---- Helpers ----------------------------------------------------------------

function makePublicClientFor(chain: Chain): PublicClient {
  const rpcUrl =
    RPC_URLS_BY_ID[chain.id] ??
    chain.rpcUrls?.default?.http?.[0] /* fallback to viem’s default if env missing */;

  return createPublicClient({
    chain,
    // keepAlive batching is on by default for http(); we pass our URL to ensure we use external RPC
    transport: http(rpcUrl),
  }) as PublicClient;
}

function isSupportedChainId(id: number): id is keyof typeof CHAINS_BY_ID {
  return Boolean(CHAINS_BY_ID[id]);
}

// ---- Provider ---------------------------------------------------------------

export default function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const [account, setAccount] = useState<Account | null>(null);
  const [chain, setChain] = useState<Chain | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);

  const [publicClient, setPublicClient] = useState<PublicClient | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Keep stable references to listeners so we can remove them
  const onAccountsChangedRef = useRef<((...args: unknown[]) => void) | undefined>(undefined);
  const onChainChangedRef = useRef<((...args: unknown[]) => void) | undefined>(undefined);
  const onDisconnectRef = useRef<(() => void) | undefined>(undefined);

  // Helper function to create wallet client when both account and chain are available
  const createWalletClientIfReady = useCallback((accountAddress?: Address, currentChain?: Chain | null) => {
    if (!accountAddress || !currentChain || !window?.ethereum) {
      setWalletClient(null);
      return;
    }

    try {
      const wc = createWalletClient({
        chain: currentChain,
        account: accountAddress,
        transport: custom(window.ethereum),
      }) as WalletClient;
      setWalletClient(wc);
      console.log('Wallet client created successfully', { 
        account: accountAddress, 
        chain: currentChain.name 
      });
    } catch (e) {
      console.error("Failed to create walletClient:", e);
      setWalletClient(null);
    }
  }, []);

  // 1) Always initialize a read-only public client (even if disconnected)
  useEffect(() => {
    setPublicClient(makePublicClientFor(DEFAULT_READONLY_CHAIN));
  }, []);

  // 2) Create wallet client whenever both account and chain are available
  useEffect(() => {
    if (isConnected && account?.address && chain) {
      createWalletClientIfReady(account.address, chain);
    } else {
      setWalletClient(null);
    }
  }, [isConnected, account?.address, chain, createWalletClientIfReady]);

  // 3) Check if the wallet is already connected on mount (e.g., page refresh)
  useEffect(() => {
    (async () => {
      try {
        if (!window?.ethereum) return;

        const accounts = (await window.ethereum.request({
          method: "eth_accounts",
        })) as string[];

        const chainHex = (await window.ethereum.request({
          method: "eth_chainId",
        })) as string;

        if (accounts?.length > 0) {
          setIsConnected(true);
          handleAccountsChanged(accounts);
          await handleChainChanged(chainHex);
          setupEventListeners();
        }
      } catch (e) {
        console.error("Initial connection check failed:", e);
      }
    })();

    // Cleanup on unmount
    return () => teardownEventListeners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Event listeners ------------------------------------------------------

  function setupEventListeners() {
    if (!window?.ethereum) return;

    const onAccountsChanged = (...args: unknown[]) => handleAccountsChanged(args[0] as string[]);
    const onChainChanged = (...args: unknown[]) => handleChainChanged(args[0] as string);
    const onDisconnect = () => {
      // Some wallets emit "disconnect" when user locks wallet or network goes away
      setIsConnected(false);
      setWalletClient(null);
      setAccount(null);
      // Keep publicClient alive for read-only
    };

    onAccountsChangedRef.current = onAccountsChanged;
    onChainChangedRef.current = onChainChanged;
    onDisconnectRef.current = onDisconnect;

    window.ethereum.on("accountsChanged", onAccountsChanged);
    window.ethereum.on("chainChanged", onChainChanged);
    window.ethereum.on("disconnect", onDisconnect);
  }

  function teardownEventListeners() {
    if (!window?.ethereum) return;
    if (onAccountsChangedRef.current)
      window.ethereum.removeListener("accountsChanged", onAccountsChangedRef.current);
    if (onChainChangedRef.current)
      window.ethereum.removeListener("chainChanged", onChainChangedRef.current);
    if (onDisconnectRef.current)
      window.ethereum.removeListener("disconnect", onDisconnectRef.current);
    onAccountsChangedRef.current = undefined;
    onChainChangedRef.current = undefined;
    onDisconnectRef.current = undefined;
  }

  // ---- Handlers -------------------------------------------------------------

  function handleAccountsChanged(accounts: string[]) {
    if (!accounts || accounts.length === 0) {
      // Treat as disconnect from the dapp perspective
      setIsConnected(false);
      setAccount(null);
      setWalletClient(null);
      return;
    }

    const addr = accounts[0] as Address;
    const newAccount: Account = { address: addr, type: "json-rpc" };
    setAccount(newAccount);

    // Create wallet client if we have both account and chain
    createWalletClientIfReady(addr, chain);
  }

  async function handleChainChanged(newChainIdHex: string) {
    try {
      const id = parseInt(newChainIdHex, 16);
      setChainId(id);

      if (!isSupportedChainId(id)) {
        setChain(null);
        setError("Unsupported chain. Please switch to Mainnet, Arbitrum, Base, Polygon, or zkSync.");
        // Keep read-only client on DEFAULT_READONLY_CHAIN so the app still works
        setPublicClient(makePublicClientFor(DEFAULT_READONLY_CHAIN));
        setWalletClient(null);
        return;
      }

      const nextChain = CHAINS_BY_ID[id];
      setChain(nextChain);

      // Refresh public client with *your* RPC URL for this chain
      setPublicClient(makePublicClientFor(nextChain));

      // Create wallet client if we have both account and chain
      if (isConnected && account?.address) {
        createWalletClientIfReady(account.address, nextChain);
      }
    } catch (e) {
      console.error("Error handling chainChanged:", e);
      setError("Failed to handle chain change.");
    }
  }

  // ---- Actions --------------------------------------------------------------

  const connect = async () => {
    if (!window?.ethereum) {
      setError("No wallet found. Please install MetaMask or another EIP‑1193 wallet.");
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      const chainHex = (await window.ethereum.request({
        method: "eth_chainId",
      })) as string;

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned by wallet.");
      }

      setIsConnected(true);
      handleAccountsChanged(accounts);
      await handleChainChanged(chainHex);
      setupEventListeners();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to connect wallet.";
      setError(msg);
      console.error("Connection error:", err);
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      // Most injected wallets don't support programmatic disconnection;
      // we clear app state & listeners.
      teardownEventListeners();
      setIsConnected(false);
      setAccount(null);
      setChain(null);
      setChainId(null);
      setWalletClient(null);

      // Keep a read-only public client alive for your default chain
      setPublicClient(makePublicClientFor(DEFAULT_READONLY_CHAIN));
    } catch (err) {
      console.error("Disconnect error:", err);
    }
  };

  const switchChain = async (targetChainId: number) => {
    if (!window?.ethereum) return;

    try {
      setError(null);
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexChainId(targetChainId) }],
      });
      // Wallet will emit 'chainChanged' which we handle
    } catch (err: unknown) {
      // 4902: chain not added to wallet yet
      if (err && typeof err === "object" && "code" in err && err.code === 4902) {
        const targetChain = CHAINS_BY_ID[targetChainId];
        if (!targetChain) {
          setError("Cannot add unsupported chain.");
          return;
        }

        const rpcUrl =
          RPC_URLS_BY_ID[targetChainId] ??
          targetChain.rpcUrls?.default?.http?.[0];

        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: hexChainId(targetChainId),
              chainName: targetChain.name,
              nativeCurrency: targetChain.nativeCurrency,
              rpcUrls: [rpcUrl],
              blockExplorerUrls: targetChain.blockExplorers
                ? [targetChain.blockExplorers.default.url]
                : [],
            },
          ],
        });

        // Try switching again after adding
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: hexChainId(targetChainId) }],
        });
      } else {
        const msg =
          err instanceof Error ? err.message : "Failed to switch chain.";
        setError(msg);
        console.error("Switch chain error:", err);
      }
    }
  };

  const getBalance = async (address?: Address): Promise<bigint> => {
    try {
      const client = publicClient;
      if (!client) return BigInt(0);

      const targetAddress = address ?? account?.address;
      if (!targetAddress) return BigInt(0);

      const bal = await client.getBalance({ address: targetAddress });
      return bal;
    } catch (err) {
      console.error("Get balance error:", err);
      return BigInt(0);
    }
  };

  const clearError = () => setError(null);

  const contextValue: WalletContextData = {
    isConnected,
    isConnecting,
    account,
    chain,
    chainId,
    publicClient,
    walletClient,
    connect,
    disconnect,
    switchChain,
    getBalance,
    error,
    clearError,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

// ---- Hook -------------------------------------------------------------------

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
