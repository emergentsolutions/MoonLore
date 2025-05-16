import { Env } from './index';
import { createLogger } from './logger';
import { AppError } from './errors';
import { DefenderRelaySigner, DefenderRelayProvider } from '@openzeppelin/defender-relay-client/lib/ethers';
import { ethers } from 'ethers';

const logger = createLogger('gasless-mint');

export interface GaslessConfig {
  apiKey: string;
  apiSecret: string;
  speed?: 'fast' | 'average' | 'slow';
}

export class GaslessMinter {
  private provider: DefenderRelayProvider;
  private signer: DefenderRelaySigner;
  private contract: ethers.Contract;

  constructor(
    config: GaslessConfig,
    contractAddress: string,
    abi: any[]
  ) {
    const credentials = {
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
    };

    this.provider = new DefenderRelayProvider(credentials);
    this.signer = new DefenderRelaySigner(credentials, this.provider, {
      speed: config.speed || 'fast',
    });

    this.contract = new ethers.Contract(contractAddress, abi, this.signer);
  }

  async mintGasless(
    to: string,
    tokenURI: string,
    signature?: string
  ): Promise<{
    txHash: string;
    tokenId: string;
  }> {
    try {
      logger.info('Starting gasless mint', { to });

      // If signature required, verify it first
      if (signature) {
        const isValid = await this.verifySignature(to, tokenURI, signature);
        if (!isValid) {
          throw new AppError('Invalid signature', 401);
        }
      }

      // Execute gasless mint
      const tx = await this.contract.safeMint(to, tokenURI);
      const receipt = await tx.wait();

      // Extract tokenId from event logs
      const mintEvent = receipt.events?.find(
        (event: any) => event.event === 'Transfer'
      );
      
      const tokenId = mintEvent?.args?.tokenId?.toString();
      
      if (!tokenId) {
        throw new Error('Failed to extract tokenId from transaction');
      }

      logger.info('Gasless mint successful', {
        txHash: receipt.transactionHash,
        tokenId,
      });

      return {
        txHash: receipt.transactionHash,
        tokenId,
      };
    } catch (error) {
      logger.error('Gasless mint failed', error);
      throw error;
    }
  }

  async verifySignature(
    address: string,
    tokenURI: string,
    signature: string
  ): Promise<boolean> {
    try {
      // Create the message to be signed
      const message = ethers.utils.solidityKeccak256(
        ['address', 'string'],
        [address, tokenURI]
      );

      // Recover signer from signature
      const recoveredAddress = ethers.utils.recoverAddress(
        ethers.utils.hashMessage(ethers.utils.arrayify(message)),
        signature
      );

      // Check if recovered address matches expected signer
      const expectedSigner = process.env.SIGNER_ADDRESS;
      return recoveredAddress.toLowerCase() === expectedSigner?.toLowerCase();
    } catch (error) {
      logger.error('Signature verification failed', error);
      return false;
    }
  }

  async estimateGas(to: string, tokenURI: string): Promise<string> {
    try {
      const gasLimit = await this.contract.estimateGas.safeMint(to, tokenURI);
      return gasLimit.toString();
    } catch (error) {
      logger.error('Gas estimation failed', error);
      throw error;
    }
  }
}

// NFT Contract ABI (simplified)
export const NFT_ABI = [
  {
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'uri', type: 'string' }
    ],
    name: 'safeMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: true, name: 'tokenId', type: 'uint256' }
    ],
    name: 'Transfer',
    type: 'event',
  },
];