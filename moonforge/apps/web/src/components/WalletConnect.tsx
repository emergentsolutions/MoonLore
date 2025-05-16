import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { mainnet, sepolia } from 'viem/chains';
import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';

// Web3Modal configuration
const projectId = 'YOUR_PROJECT_ID'; // Get from https://cloud.walletconnect.com

const metadata = {
  name: 'Moonbirds Art Forge',
  description: 'Create Moonbird-style artwork powered by AI',
  url: 'https://moonbirds.art',
  icons: ['https://moonbirds.art/icon.png']
};

const chains = [mainnet, sepolia];
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

createweb3Modal({ wagmiConfig, projectId, chains });

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const openModal = () => {
    // @ts-ignore
    window.Web3Modal?.open();
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <div className="text-foreground/70">Connected</div>
          <div className="font-medium">{formatAddress(address)}</div>
          {balance && (
            <div className="text-xs text-foreground/60">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </div>
          )}
        </div>
        <button
          onClick={() => disconnect()}
          className="btn btn-outline btn-sm"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={openModal}
      className="btn btn-primary"
    >
      Connect Wallet
    </button>
  );
}
