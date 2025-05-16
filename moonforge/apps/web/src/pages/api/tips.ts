import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { from, to, amount, imageId, txHash } = data;

    // Validate input
    if (!from || !to || !amount || !imageId || !txHash) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Record tip in database (placeholder for now)
    const tipRecord = {
      id: crypto.randomUUID(),
      from,
      to,
      amount,
      imageId,
      txHash,
      timestamp: new Date().toISOString(),
    };

    // In a real implementation, this would save to a database
    console.log('Tip recorded:', tipRecord);

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        tipId: tipRecord.id,
        message: `Tip of ${amount} MOON recorded successfully` 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Tips API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to record tip' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const GET: APIRoute = async ({ url }) => {
  try {
    // Get query parameters
    const imageId = url.searchParams.get('imageId');
    const address = url.searchParams.get('address');

    // Mock data for tips
    const mockTips = [
      {
        id: '1',
        from: '0x111...111',
        to: '0x222...222',
        amount: '10',
        imageId: 'moonbird-1',
        txHash: '0xabc...def',
        timestamp: '2024-01-15T10:00:00Z',
      },
      {
        id: '2',
        from: '0x333...333',
        to: '0x222...222',
        amount: '25',
        imageId: 'moonbird-1',
        txHash: '0xghi...jkl',
        timestamp: '2024-01-15T11:00:00Z',
      },
    ];

    // Filter tips based on query parameters
    let filteredTips = mockTips;
    
    if (imageId) {
      filteredTips = filteredTips.filter(tip => tip.imageId === imageId);
    }
    
    if (address) {
      filteredTips = filteredTips.filter(
        tip => tip.from === address || tip.to === address
      );
    }

    return new Response(
      JSON.stringify({ 
        tips: filteredTips,
        total: filteredTips.length 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Get tips error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch tips' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};