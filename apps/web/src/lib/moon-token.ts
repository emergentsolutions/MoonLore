import { createPublicClient, http, formatEther } from 'viem';
import { mainnet } from 'viem/chains';

// MOON token contract address (example - use actual address)
const MOON_TOKEN_CONTRACT = '0x1234567890123456789012345678901234567890' as const;

// ERC20 ABI (simplified for balance check)
const MOON_TOKEN_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Create public client
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export interface MOONBalance {
  raw: bigint;
  formatted: string;
  symbol: string;
  decimals: number;
}

export async function getMOONBalance(address: string): Promise<MOONBalance | null> {
  try {
    // Get balance
    const balance = await publicClient.readContract({
      address: MOON_TOKEN_CONTRACT,
      abi: MOON_TOKEN_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    });

    // Get decimals
    const decimals = await publicClient.readContract({
      address: MOON_TOKEN_CONTRACT,
      abi: MOON_TOKEN_ABI,
      functionName: 'decimals',
    });

    // Get symbol
    const symbol = await publicClient.readContract({
      address: MOON_TOKEN_CONTRACT,
      abi: MOON_TOKEN_ABI,
      functionName: 'symbol',
    });

    return {
      raw: balance,
      formatted: formatEther(balance),
      symbol: symbol,
      decimals: Number(decimals),
    };
  } catch (error) {
    console.error('Error fetching MOON balance:', error);
    return null;
  }
}

// Function to format MOON balance with proper decimals
export function formatMOONBalance(balance: bigint, decimals: number = 18): string {
  const divisor = BigInt(10 ** decimals);
  const integerPart = balance / divisor;
  const decimalPart = balance % divisor;
  
  // Format with 4 decimal places
  const decimalStr = decimalPart.toString().padStart(decimals, '0');
  const significantDecimals = decimalStr.slice(0, 4);
  
  return `${integerPart}.${significantDecimals}`;
}

// Check if user has enough MOON for an action
export async function checkMOONAllowance(
  address: string,
  requiredAmount: bigint
): Promise<boolean> {
  try {
    const balance = await getMOONBalance(address);
    if (!balance) return false;
    
    return balance.raw >= requiredAmount;
  } catch (error) {
    console.error('Error checking MOON allowance:', error);
    return false;
  }
}