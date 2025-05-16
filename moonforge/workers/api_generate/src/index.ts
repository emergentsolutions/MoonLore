import { Hono } from 'hono';
import { cors } from 'hono/cors';

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

// Generate endpoint placeholder
app.post('/api/generate', async (c) => {
  const { prompt, style } = await c.req.json();
  
  // For now, return a mock response
  return c.json({
    status: 'pending',
    message: 'Image generation endpoint - implementation coming soon',
    prompt,
    style
  });
});

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
