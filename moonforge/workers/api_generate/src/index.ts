import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { generateWithFlux } from './flux';

export interface Env {
  AI: any;
  GENERATED_IMAGES: KVNamespace;
}

const app = new Hono<{ Bindings: Env }>();

// Configure CORS
app.use('/*', cors());

// Hello world endpoint
app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Moonbirds Art Forge API!' });
});

// Generate endpoint with FLUX
app.post('/api/generate', async (c) => {
  try {
    const { prompt, style } = await c.req.json();
    
    if (!prompt) {
      return c.json({ error: 'Prompt is required' }, 400);
    }
    
    // Generate image using FLUX
    const result = await generateWithFlux(c.env, { prompt, style });
    
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
          hx-get="${result.url}"
          hx-trigger="error"
          hx-swap="innerHTML"
          hx-target="#image-preview"
        />
        <div class="mt-4 text-center">
          <button class="btn btn-primary" onclick="mintNFT('${result.url}')">
            Mint as NFT
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

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;