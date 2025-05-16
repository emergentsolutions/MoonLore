import { Env } from './index';

// Moonbird style prompt enhancement
const MOONBIRD_PROMPT_PREFIX = "wizard moonbird, digital art, magical creature, ";
const MOONBIRD_PROMPT_SUFFIX = ", high quality, detailed feathers, mystical atmosphere, fantasy art style";

export interface GenerateImageOptions {
  prompt: string;
  style?: string;
  model?: string;
}

export async function generateWithFlux(
  env: Env,
  options: GenerateImageOptions
): Promise<{ url?: string; error?: string }> {
  try {
    // Enhance prompt for Moonbird style
    const enhancedPrompt = `${MOONBIRD_PROMPT_PREFIX}${options.prompt}${MOONBIRD_PROMPT_SUFFIX}`;
    
    // Use Cloudflare AI to generate image
    const response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
      prompt: enhancedPrompt,
      num_inference_steps: 4,
    });
    
    // Convert response to blob and create URL
    const blob = new Blob([response], { type: 'image/png' });
    const buffer = await blob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    
    // Store in KV with expiration
    const imageId = crypto.randomUUID();
    await env.GENERATED_IMAGES.put(
      `image:${imageId}`,
      base64,
      { 
        expirationTtl: 3600, // 1 hour
        metadata: {
          prompt: options.prompt,
          style: options.style,
          model: 'flux-1-schnell',
          createdAt: new Date().toISOString()
        }
      }
    );
    
    return { url: `/api/images/${imageId}` };
  } catch (error) {
    console.error('Flux generation error:', error);
    return { error: `Failed to generate image: ${error.message}` };
  }
}