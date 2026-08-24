export async function onRequestGet(context) {
  const params = new URL(context.request.url).searchParams;
  const lat = Number(params.get('lat'));
  const lon = Number(params.get('lon'));
  if (!Number.isFinite(lat) || lat < -90 || lat > 90 || !Number.isFinite(lon) || lon < -180 || lon > 180) {
    return Response.json({ error: 'Valid latitude and longitude are required.' }, { status: 400 });
  }
  const upstream = new URL('https://marine-api.open-meteo.com/v1/marine');
  upstream.searchParams.set('latitude', String(lat));
  upstream.searchParams.set('longitude', String(lon));
  upstream.searchParams.set('hourly', 'sea_level_height_msl,sea_surface_temperature,wave_height');
  upstream.searchParams.set('forecast_days', '3');
  upstream.searchParams.set('cell_selection', 'sea');
  const response = await fetch(upstream, { headers: { Accept: 'application/json' } });
  if (!response.ok) return Response.json({ error: 'Marine forecast data is unavailable for this location.' }, { status: 502 });
  const data = await response.json();
  const hourly = data.hourly || {};
  const timeseries = (hourly.time || []).map((time, index) => ({
    time: `${time}:00Z`,
    data: { instant: { details: {
      sea_surface_height_above_mean_sea_level: hourly.sea_level_height_msl?.[index] ?? null,
      sea_water_temperature: hourly.sea_surface_temperature?.[index] ?? null,
      sea_surface_wave_significant_height: hourly.wave_height?.[index] ?? null
    } } }
  }));
  return Response.json({ properties: { timeseries } }, { headers: { 'Cache-Control': 'public, max-age=1800' } });
}
