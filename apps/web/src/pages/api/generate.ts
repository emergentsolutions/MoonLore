import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { prompt, style } = data;

    // Forward request to worker API
    const response = await fetch(`${import.meta.env.WORKER_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, style }),
    });

    if (!response.ok) {
      throw new Error(`Worker API error: ${response.statusText}`);
    }

    // Get HTML response from worker
    const html = await response.text();

    // Return HTML for HTMX to swap
    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Generate API error:', error);
    
    // Return error HTML for HTMX
    const errorHtml = `
      <div class="text-center p-4">
        <div class="text-red-500 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-lg font-medium">Generation failed</p>
        <p class="text-sm text-foreground/60 mt-1">${error.message}</p>
        <button 
          class="btn btn-primary mt-4"
          onclick="resetGenerator()"
        >
          Try Again
        </button>
      </div>
    `;

    return new Response(errorHtml, {
      status: 500,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
};