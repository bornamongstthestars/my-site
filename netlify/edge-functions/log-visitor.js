// netlify/edge-functions/log-visitor.js
// Runs server-side on every POST to /api/log-visitor
// Captures the raw IP before it ever reaches the browser

export default async (request, context) => {

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';

  const geo = context.geo ?? {};

  const entry = {
    time:      new Date().toISOString(),
    ip,
    city:      geo.city      ?? null,
    country:   geo.country?.name ?? null,
    userAgent: request.headers.get('user-agent'),
    referrer:  request.headers.get('referer') ?? null,
  };

  // Print to Netlify Function Logs (free, view in dashboard)
  console.log('VISITOR', JSON.stringify(entry));

  // ─── Optional: forward to a webhook (e.g. Pipedream / Make) ───
  // await fetch('https://your-webhook-url.com', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(entry),
  // });

  return new Response('ok', {
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
};

export const config = { path: '/api/log-visitor' };
