export { NFTRelayer, RelayerConfig } from './relayer';
export { uploadToIPFS, uploadJSONToIPFS, IPFSUploadResult } from './ipfs';

// Default configuration for Base L2
export const DEFAULT_CONFIG = {
  chainId: 8453, // Base mainnet
  rpcUrl: 'https://mainnet.base.org',
  nftContractAddress: '0x0000000000000000000000000000000000000000', // To be configured
};

// Testnet configuration
export const TESTNET_CONFIG = {
  chainId: 84531, // Base Goerli
  rpcUrl: 'https://goerli.base.org',
  nftContractAddress: '0x0000000000000000000000000000000000000000', // To be configured
};