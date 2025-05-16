import { ThirdwebStorage } from '@thirdweb-dev/storage';

export interface IPFSUploadResult {
  url: string;
  cid: string;
}

export async function uploadToIPFS(
  file: Buffer | Blob,
  fileName: string,
  sdkSecretKey?: string
): Promise<IPFSUploadResult> {
  try {
    // Initialize storage with optional secret key
    const storage = new ThirdwebStorage(
      sdkSecretKey ? { secretKey: sdkSecretKey } : undefined
    );

    // Upload file to IPFS
    const uploadUrl = await storage.upload(file, {
      uploadWithGatewayUrl: true,
      uploadWithoutDirectory: true,
    });

    // Extract CID from URL
    const cid = uploadUrl.replace('ipfs://', '');

    return {
      url: uploadUrl,
      cid,
    };
  } catch (error) {
    console.error('Failed to upload to IPFS:', error);
    throw error;
  }
}

export async function uploadJSONToIPFS(
  data: any,
  sdkSecretKey?: string
): Promise<IPFSUploadResult> {
  try {
    const jsonBlob = new Blob([JSON.stringify(data)], {
      type: 'application/json',
    });

    return uploadToIPFS(jsonBlob, 'metadata.json', sdkSecretKey);
  } catch (error) {
    console.error('Failed to upload JSON to IPFS:', error);
    throw error;
  }
}