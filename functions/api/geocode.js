export async function onRequestGet(context) {
  const q = new URL(context.request.url).searchParams.get('q')?.trim() || '';
  if (q.length < 2 || q.length > 100) return Response.json({ error: 'Enter a location between 2 and 100 characters.' }, { status: 400 });
  const upstream = new URL('https://nominatim.openstreetmap.org/search');
  upstream.searchParams.set('format', 'json');
  upstream.searchParams.set('limit', '5');
  upstream.searchParams.set('q', q);
  const response = await fetch(upstream, { headers: { Accept: 'application/json', 'User-Agent': 'MyCalendarTools/1.0 (https://mycalendartools.net/contact/)' } });
  if (!response.ok) return Response.json({ error: 'Location search is temporarily unavailable.' }, { status: 502 });
  return new Response(await response.text(), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
}
