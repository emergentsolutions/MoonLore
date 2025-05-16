import { Env } from './index';
import { NFTRelayer } from '@moonforge/nft-minting';
import { uploadToIPFS, uploadJSONToIPFS } from '@moonforge/nft-minting';
import { GaslessMinter, NFT_ABI } from './gasless';
import { createLogger } from './logger';
import { AppError } from './errors';

const logger = createLogger('mint-api');

interface MintRequest {
  imageUrl: string;
  address: string;
  name: string;
  description: string;
  attributes?: Array<{ trait_type: string; value: string | number }>;
  gasless?: boolean;
  signature?: string;
}

export async function mintNFT(env: Env, request: MintRequest): Promise<{
  success: boolean;
  tokenId?: string;
  txHash?: string;
  error?: string;
}> {
  try {
    logger.info('Mint request received', { address: request.address });
    
    // Validate inputs
    if (!request.imageUrl || !request.address || !request.name) {
      throw new AppError('Missing required fields', 400);
    }
    
    // Fetch image from URL
    const imageResponse = await fetch(request.imageUrl);
    if (!imageResponse.ok) {
      throw new AppError('Failed to fetch image', 400);
    }
    
    const imageBlob = await imageResponse.blob();
    
    // Upload image to IPFS
    logger.debug('Uploading image to IPFS');
    const imageUpload = await uploadToIPFS(
      imageBlob,
      'moonbird-art.png',
      env.THIRDWEB_SECRET_KEY
    );
    
    // Create metadata
    const metadata = {
      name: request.name,
      description: request.description,
      image: imageUpload.url,
      attributes: request.attributes || [
        { trait_type: 'Type', value: 'Moonbird Art' },
        { trait_type: 'Generator', value: 'Moonbirds Art Forge' },
        { trait_type: 'Created', value: new Date().toISOString() },
      ],
    };
    
    // Upload metadata to IPFS
    logger.debug('Uploading metadata to IPFS');
    const metadataUpload = await uploadJSONToIPFS(
      metadata,
      env.THIRDWEB_SECRET_KEY
    );
    
    // Check if gasless minting is requested
    if (request.gasless && env.DEFENDER_API_KEY && env.DEFENDER_API_SECRET) {
      logger.info('Using gasless minting');
      
      const gaslessMinter = new GaslessMinter(
        {
          apiKey: env.DEFENDER_API_KEY,
          apiSecret: env.DEFENDER_API_SECRET,
          speed: 'fast',
        },
        env.NFT_CONTRACT_ADDRESS,
        NFT_ABI
      );
      
      const { txHash, tokenId } = await gaslessMinter.mintGasless(
        request.address,
        metadataUpload.url,
        request.signature
      );
      
      // Store mint record
      await storeMintRecord(env, tokenId, {
        address: request.address,
        metadata,
        imageUrl: imageUpload.url,
        metadataUrl: metadataUpload.url,
        gasless: true,
        txHash,
      });
      
      return {
        success: true,
        tokenId,
        txHash,
      };
    }
    
    // Initialize relayer
    const relayer = new NFTRelayer({
      privateKey: env.RELAYER_PRIVATE_KEY,
      chainId: env.CHAIN_ID || 8453, // Base mainnet
      rpcUrl: env.RPC_URL || 'https://mainnet.base.org',
      nftContractAddress: env.NFT_CONTRACT_ADDRESS,
    });
    
    await relayer.initialize();
    
    // Mint NFT
    logger.info('Minting NFT', { to: request.address });
    const tokenId = await relayer.mintNFT(request.address, metadata);
    
    // Store mint record
    await storeMintRecord(env, tokenId, {
      address: request.address,
      metadata,
      imageUrl: imageUpload.url,
      metadataUrl: metadataUpload.url,
      gasless: false,
    });
    
    logger.info('NFT minted successfully', { tokenId });
    
    return {
      success: true,
      tokenId,
      txHash: tokenId, // In real implementation, would return actual tx hash
    };
  } catch (error) {
    logger.error('Mint failed', error);
    return {
      success: false,
      error: error.message || 'Failed to mint NFT',
    };
  }
}

async function storeMintRecord(
  env: Env,
  tokenId: string,
  data: any
): Promise<void> {
  await env.MINT_RECORDS.put(
    `mint:${tokenId}`,
    JSON.stringify({
      tokenId,
      ...data,
      createdAt: new Date().toISOString(),
    }),
    { expirationTtl: 86400 * 30 } // 30 days
  );
}

export async function getMintRecord(env: Env, tokenId: string): Promise<any> {
  try {
    const record = await env.MINT_RECORDS.get(`mint:${tokenId}`);
    if (!record) {
      throw new AppError('Mint record not found', 404);
    }
    
    return JSON.parse(record);
  } catch (error) {
    logger.error('Failed to get mint record', error);
    throw error;
  }
}