import { Env } from './index';
import { createLogger } from './logger';
import { GenerationError } from './errors';

const logger = createLogger('dalle');

export interface DallEOptions {
  prompt: string;
  style?: string;
}

// Style mappings for DALL-E
const styleMap: Record<string, string> = {
  wizard: 'magical wizard style, mystical, fantasy art',
  cosmic: 'cosmic space art, nebula background, stars',
  cyber: 'cyberpunk style, neon, futuristic',
  default: 'digital art, high quality'
};

export async function generateWithDallE(
  env: Env,
  options: DallEOptions
): Promise<{ url?: string; error?: string }> {
  try {
    const styleEnhancement = styleMap[options.style || 'default'] || styleMap.default;
    const enhancedPrompt = `Moonbird character, ${options.prompt}, ${styleEnhancement}, highly detailed, professional artwork`;
    logger.info('Generating with DALL-E', { prompt: options.prompt, style: options.style });
    
    // Use Cloudflare AI Gateway for DALL-E
    logger.debug('Calling DALL-E API', { enhancedPrompt });
    const response = await env.AI.run('@cf/openai/dall-e-2', {
      prompt: enhancedPrompt,
      size: '1024x1024',
      n: 1
    });
    
    if (!response.images || response.images.length === 0) {
      throw new Error('No image generated');
    }
    
    // Get image data
    const imageData = response.images[0];
    const imageId = crypto.randomUUID();
    
    // Store in KV
    logger.debug('Storing image in KV', { imageId });
    await env.GENERATED_IMAGES.put(
      `image:${imageId}`,
      imageData,
      { 
        expirationTtl: 3600, // 1 hour
        metadata: {
          prompt: options.prompt,
          style: options.style,
          model: 'dall-e-2',
          createdAt: new Date().toISOString()
        }
      }
    );
    
    logger.info('DALL-E generation successful', { imageId });
    return { url: `/api/images/${imageId}` };
  } catch (error) {
    logger.error('DALL-E generation error', error);
    return { error: error.message };
  }
}