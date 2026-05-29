export default async (request, context) => {

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';

  const geo = context.geo ?? {};

  const entry = {
    time:      new Date().toISOString(),
    ip,
    city:      geo.city ?? null,
    country:   geo.country?.name ?? null,
    userAgent: request.headers.get('user-agent'),
    referrer:  request.headers.get('referer') ?? null,
  };

  console.log('VISITOR', JSON.stringify(entry));

  await fetch('https://hook.us2.make.com/ry2glng24ez0lsifcrf9b31ovjcptk88', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });

  return new Response('ok', {
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
  });
};

export const config = { path: '/api/log-visitor' };
