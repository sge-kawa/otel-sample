import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    
    // リクエストのContent-Typeを確認
    const contentType = req.headers.get('content-type') || 'application/x-protobuf';
    
    // OTLP Collectorに転送
    const res = await fetch('http://localhost:4318/v1/traces', {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
      body,
    });

    const responseText = await res.text();
    
    return new Response(responseText, {
      status: res.status,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('[OTLP Proxy] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to proxy request to OTLP collector' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

