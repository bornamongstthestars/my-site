export default async (request, context) => {

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';

  const geo = context.geo ?? {};

  // Query ip-api for VPN/proxy detection
  let vpnData = {};
  try {
    const ipCheck = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,city,isp,org,as,proxy,vpn,hosting`
    ).then(r => r.json());
    vpnData = {
      isp:     ipCheck.isp,
      org:     ipCheck.org,
      isProxy: ipCheck.proxy,
      isVPN:   ipCheck.vpn,
      isHosting: ipCheck.hosting,
    };
  } catch(e) {}

  const entry = {
    time:      new Date().toISOString(),
    ip,
    city:      geo.city ?? null,
    country:   geo.country?.name ?? null,
    userAgent: request.headers.get('user-agent'),
    referrer:  request.headers.get('referer') ?? null,
    ...vpnData,
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
