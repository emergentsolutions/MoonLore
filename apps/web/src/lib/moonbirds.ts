import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

// Moonbirds contract address on mainnet
const MOONBIRDS_CONTRACT = '0x23581767a106ae21c074b2276D25e5C3e136a68b' as const;

// Moonbirds ABI (simplified for ownership check)
const MOONBIRDS_ABI = [
  {
    inputs: [{ name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' }
    ],
    name: 'tokenOfOwnerByIndex',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Create public client for mainnet
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export async function checkMoonbirdOwnership(address: string): Promise<{
  isOwner: boolean;
  balance: number;
  tokenIds: number[];
}> {
  try {
    // Check balance first
    const balance = await publicClient.readContract({
      address: MOONBIRDS_CONTRACT,
      abi: MOONBIRDS_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    });

    const balanceNumber = Number(balance);
    
    if (balanceNumber === 0) {
      return { isOwner: false, balance: 0, tokenIds: [] };
    }

    // Get token IDs if owner
    const tokenIds: number[] = [];
    
    // Get first few token IDs (limit to 5 for performance)
    const limit = Math.min(balanceNumber, 5);
    
    for (let i = 0; i < limit; i++) {
      try {
        const tokenId = await publicClient.readContract({
          address: MOONBIRDS_CONTRACT,
          abi: MOONBIRDS_ABI,
          functionName: 'tokenOfOwnerByIndex',
          args: [address as `0x${string}`, BigInt(i)],
        });
        
        tokenIds.push(Number(tokenId));
      } catch (error) {
        console.error(`Error fetching token ${i}:`, error);
      }
    }

    return {
      isOwner: true,
      balance: balanceNumber,
      tokenIds,
    };
  } catch (error) {
    console.error('Error checking Moonbird ownership:', error);
    return { isOwner: false, balance: 0, tokenIds: [] };
  }
}

export async function getMoonbirdMetadata(tokenId: number): Promise<any> {
  try {
    const response = await fetch(`https://api.moonbirds.xyz/moonbirds/${tokenId}`);
    if (!response.ok) throw new Error('Failed to fetch metadata');
    return await response.json();
  } catch (error) {
    console.error('Error fetching Moonbird metadata:', error);
    return null;
  }
}