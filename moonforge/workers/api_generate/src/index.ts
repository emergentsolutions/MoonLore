import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { generateWithFlux } from './flux';
import { generateWithDallE } from './dalle';
import { createLogger } from './logger';
import { AppError, ValidationError, NotFoundError, errorHandler } from './errors';

export interface Env {
  AI: any;
  GENERATED_IMAGES: KVNamespace;
  PROMPT_CACHE: KVNamespace;
  USE_DALLE_FALLBACK?: string;
}

const app = new Hono<{ Bindings: Env }>();
const logger = createLogger('api-generate');

// Configure CORS
app.use('/*', cors());

// Hello world endpoint
app.get('/api/hello', (c) => {
  logger.info('Hello endpoint called');
  return c.json({ message: 'Hello from Moonbirds Art Forge API!' });
});

// Generate endpoint with FLUX and DALL-E fallback
app.post('/api/generate', async (c) => {
  try {
    const body = await c.req.json();
    const { prompt, style } = body;
    
    logger.info('Generate request received', { prompt, style });
    
    if (!prompt) {
      throw new ValidationError('Prompt is required');
    }
    
    let result;
    
    // Try FLUX first
    result = await generateWithFlux(c.env, { prompt, style });
    
    // If FLUX fails and fallback is enabled, try DALL-E
    if (result.error && c.env.USE_DALLE_FALLBACK === 'true') {
      logger.warn('FLUX failed, falling back to DALL-E', { error: result.error });
      result = await generateWithDallE(c.env, { prompt, style });
    }
    
    if (result.error) {
      throw new AppError(result.error, 500, 'GENERATION_FAILED');
    }
    
    logger.info('Image generated successfully', { url: result.url });
    
    // Return HTML for HTMX swap
    const html = `
      <div class="w-full h-full">
        <img 
          src="${result.url}" 
          alt="Generated Moonbird" 
          class="w-full h-full object-contain rounded-lg"
          loading="lazy"
        />
        <div class="mt-4 text-center space-y-2">
          <button 
            class="btn btn-primary" 
            onclick="mintNFT('${result.url}')"
            data-image-url="${result.url}"
          >
            Mint as NFT
          </button>
          <button 
            class="btn btn-outline" 
            onclick="downloadImage('${result.url}')"
          >
            Download
          </button>
        </div>
      </div>
    `;
    
    return c.html(html);
  } catch (error) {
    logger.error('Generate error', error);
    return errorHandler(error);
  }
});

// Serve generated images from KV
app.get('/api/images/:id', async (c) => {
  const imageId = c.req.param('id');
  
  try {
    logger.debug('Fetching image', { imageId });
    const base64 = await c.env.GENERATED_IMAGES.get(`image:${imageId}`);
    
    if (!base64) {
      throw new NotFoundError('Image not found');
    }
    
    // Convert base64 back to binary
    const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    
    return c.body(binary.buffer, 200, {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600'
    });
  } catch (error) {
    logger.error('Image fetch error', error);
    return errorHandler(error);
  }
});

// Get image metadata
app.get('/api/images/:id/metadata', async (c) => {
  const imageId = c.req.param('id');
  
  try {
    logger.debug('Fetching metadata', { imageId });
    const { metadata } = await c.env.GENERATED_IMAGES.getWithMetadata(`image:${imageId}`);
    
    if (!metadata) {
      throw new NotFoundError('Image metadata not found');
    }
    
    return c.json(metadata);
  } catch (error) {
    logger.error('Metadata fetch error', error);
    return errorHandler(error);
  }
});

// Health check
app.get('/api/health', (c) => {
  const health = { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    features: {
      flux: true,
      dalle: c.env.USE_DALLE_FALLBACK === 'true'
    }
  };
  logger.debug('Health check', health);
  return c.json(health);
});

// Global error handler
app.onError((err, c) => {
  logger.error('Unhandled error', err);
  return errorHandler(err);
});

export default app;