import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { generateWithFlux } from './flux';
import { generateWithDallE } from './dalle';

export interface Env {
  AI: any;
  GENERATED_IMAGES: KVNamespace;
  USE_DALLE_FALLBACK?: string;
}

const app = new Hono<{ Bindings: Env }>();

// Configure CORS
app.use('/*', cors());

// Hello world endpoint
app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Moonbirds Art Forge API!' });
});

// Generate endpoint with FLUX and DALL-E fallback
app.post('/api/generate', async (c) => {
  try {
    const { prompt, style } = await c.req.json();
    
    if (!prompt) {
      return c.json({ error: 'Prompt is required' }, 400);
    }
    
    let result;
    
    // Try FLUX first
    result = await generateWithFlux(c.env, { prompt, style });
    
    // If FLUX fails and fallback is enabled, try DALL-E
    if (result.error && c.env.USE_DALLE_FALLBACK === 'true') {
      console.log('FLUX failed, falling back to DALL-E:', result.error);
      result = await generateWithDallE(c.env, { prompt, style });
    }
    
    if (result.error) {
      return c.json({ error: result.error }, 500);
    }
    
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
    console.error('Generate error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Serve generated images from KV
app.get('/api/images/:id', async (c) => {
  const imageId = c.req.param('id');
  
  try {
    const base64 = await c.env.GENERATED_IMAGES.get(`image:${imageId}`);
    
    if (!base64) {
      return c.text('Image not found', 404);
    }
    
    // Convert base64 back to binary
    const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    
    return c.body(binary.buffer, 200, {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600'
    });
  } catch (error) {
    console.error('Image fetch error:', error);
    return c.text('Error fetching image', 500);
  }
});

// Get image metadata
app.get('/api/images/:id/metadata', async (c) => {
  const imageId = c.req.param('id');
  
  try {
    const { metadata } = await c.env.GENERATED_IMAGES.getWithMetadata(`image:${imageId}`);
    
    if (!metadata) {
      return c.json({ error: 'Image not found' }, 404);
    }
    
    return c.json(metadata);
  } catch (error) {
    console.error('Metadata fetch error:', error);
    return c.json({ error: 'Error fetching metadata' }, 500);
  }
});

// Health check
app.get('/api/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    features: {
      flux: true,
      dalle: c.env.USE_DALLE_FALLBACK === 'true'
    }
  });
});

export default app;