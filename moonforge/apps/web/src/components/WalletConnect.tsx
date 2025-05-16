import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi';
import { mainnet, sepolia } from 'viem/chains';
import { useAccount, useBalance, useConnect, useDisconnect } from 'wagmi';
import { useState, useEffect } from 'react';
import { checkMoonbirdOwnership } from '../lib/moonbirds';
import { getMOONBalance, formatMOONBalance } from '../lib/moon-token';

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

createWeb3Modal({ wagmiConfig, projectId, chains });

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const [moonbirdOwnership, setMoonbirdOwnership] = useState<{
    isOwner: boolean;
    balance: number;
    tokenIds: number[];
  } | null>(null);
  const [moonBalance, setMoonBalance] = useState<{
    formatted: string;
    symbol: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isConnected && address) {
      checkBalances();
    }
  }, [isConnected, address]);

  const checkBalances = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      // Check Moonbird ownership
      const ownership = await checkMoonbirdOwnership(address);
      setMoonbirdOwnership(ownership);
      
      // Check MOON token balance
      const moonTokenBalance = await getMOONBalance(address);
      if (moonTokenBalance) {
        setMoonBalance({
          formatted: formatMOONBalance(moonTokenBalance.raw, moonTokenBalance.decimals),
          symbol: moonTokenBalance.symbol,
        });
      }
    } catch (error) {
      console.error('Error checking balances:', error);
    } finally {
      setLoading(false);
    }
  };

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
          
          {/* ETH Balance */}
          {balance && (
            <div className="text-xs text-foreground/60">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </div>
          )}
          
          {/* MOON Balance */}
          {moonBalance && (
            <div className="text-xs text-accent">
              🌙 {moonBalance.formatted} {moonBalance.symbol}
            </div>
          )}
          
          {/* Loading indicator */}
          {loading && (
            <div className="text-xs text-foreground/60">Loading...</div>
          )}
          
          {/* Moonbird ownership */}
          {moonbirdOwnership && !loading && (
            <div className="text-xs">
              {moonbirdOwnership.isOwner ? (
                <span className="text-primary">
                  🦉 {moonbirdOwnership.balance} Moonbird{moonbirdOwnership.balance !== 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-foreground/60">No Moonbirds</span>
              )}
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