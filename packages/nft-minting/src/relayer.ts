import { ThirdwebSDK } from '@thirdweb-dev/sdk';
// Gasless configuration is part of SDK options
import { ethers } from 'ethers';

export interface RelayerConfig {
  privateKey: string;
  chainId: number;
  rpcUrl: string;
  nftContractAddress: string;
  gaslessConfig?: any; // SDK gasless configuration
}

export class NFTRelayer {
  private sdk: ThirdwebSDK;
  private nftContract: any;
  private config: RelayerConfig;

  constructor(config: RelayerConfig) {
    this.config = config;
    
    // Initialize SDK with private key
    this.sdk = ThirdwebSDK.fromPrivateKey(
      config.privateKey,
      config.rpcUrl,
      {
        gasless: config.gaslessConfig || undefined,
      }
    );
  }

  async initialize() {
    try {
      // Get NFT contract instance
      this.nftContract = await this.sdk.getContract(
        this.config.nftContractAddress,
        'nft-collection'
      );
      
      console.log('NFT Relayer initialized', {
        contract: this.config.nftContractAddress,
        chainId: this.config.chainId,
      });
    } catch (error) {
      console.error('Failed to initialize NFT relayer:', error);
      throw error;
    }
  }

  async mintNFT(
    to: string,
    metadata: {
      name: string;
      description: string;
      image: string;
      attributes?: Array<{ trait_type: string; value: string | number }>;
    }
  ): Promise<string> {
    try {
      // Mint NFT with metadata
      const tx = await this.nftContract.mintTo(to, metadata);
      
      // Get the tokenId from the receipt
      const receipt = tx.receipt;
      const tokenId = tx.id.toString();
      
      console.log('NFT minted successfully', {
        to,
        tokenId,
        txHash: receipt.transactionHash,
      });
      
      return tokenId;
    } catch (error) {
      console.error('Failed to mint NFT:', error);
      throw error;
    }
  }

  async mintBatch(
    recipients: string[],
    metadataList: Array<{
      name: string;
      description: string;
      image: string;
      attributes?: Array<{ trait_type: string; value: string | number }>;
    }>
  ): Promise<string[]> {
    try {
      if (recipients.length !== metadataList.length) {
        throw new Error('Recipients and metadata lists must have same length');
      }

      const txs = await this.nftContract.mintBatchTo(
        recipients.map((to, index) => ({
          to,
          metadata: metadataList[index],
        }))
      );

      const tokenIds = txs.map((tx: any) => tx.id.toString());
      
      console.log('Batch mint successful', {
        count: tokenIds.length,
        tokenIds,
      });
      
      return tokenIds;
    } catch (error) {
      console.error('Failed to batch mint NFTs:', error);
      throw error;
    }
  }

  async estimateGas(
    to: string,
    metadata: any
  ): Promise<ethers.BigNumber> {
    try {
      const gasEstimate = await this.nftContract.estimateGas.mintTo(to, metadata);
      return gasEstimate;
    } catch (error) {
      console.error('Failed to estimate gas:', error);
      throw error;
    }
  }

  async getTokenURI(tokenId: string): Promise<string> {
    try {
      const tokenURI = await this.nftContract.tokenURI(tokenId);
      return tokenURI;
    } catch (error) {
      console.error('Failed to get token URI:', error);
      throw error;
    }
  }
}