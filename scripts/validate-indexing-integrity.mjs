import fs from 'node:fs';
import path from 'node:path';

const origin = 'https://mycalendartools.net';
const expectedAds = 'google.com, pub-1904958390525375, DIRECT, f08c47fec0942fa0';
const fail = [];
const walk = p => fs.readdirSync(p, { withFileTypes: true }).flatMap(e =>
  e.name === '.git' || e.name === '.wrangler' ? [] : e.isDirectory() ? walk(path.join(p, e.name)) : e.name.endsWith('.html') ? [path.join(p, e.name)] : []);
const files = walk('.');
const routeFor = file => {
  const normalized = file.replaceAll('\\', '/').replace(/^\.\//, '');
  if (normalized === 'index.html') return '/';
  if (normalized === 'sitemap.html') return '/sitemap';
  return `/${normalized.replace(/\/index\.html$/, '/')}`;
};

const canonicalRoutes = new Map();
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  if (/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js/i.test(html)) fail.push(`${file}: AdSense library bypasses the consent gate`);
  if (/href=["'](?!https?:\/\/)[^"']*\.html(?:[?#][^"']*)?["']/i.test(html)) fail.push(`${file}: internal .html link`);
  const matches = [...html.matchAll(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/gi)];
  if (matches.length !== 1) { fail.push(`${file}: expected one canonical, found ${matches.length}`); continue; }
  const expected = `${origin}${routeFor(file)}`;
  if (matches[0][1] !== expected) fail.push(`${file}: canonical ${matches[0][1]} should be ${expected}`);
  if (!/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*index/i.test(html)) fail.push(`${file}: page is not explicitly indexable`);
  if (canonicalRoutes.has(expected)) fail.push(`${file}: duplicate canonical also used by ${canonicalRoutes.get(expected)}`);
  canonicalRoutes.set(expected, file);
}

const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const sitemapSet = new Set(sitemapUrls);
if (sitemapSet.size !== sitemapUrls.length) fail.push('sitemap.xml: duplicate URL');
for (const url of canonicalRoutes.keys()) if (!sitemapSet.has(url)) fail.push(`sitemap.xml: missing indexable canonical ${url}`);
for (const url of sitemapSet) if (!canonicalRoutes.has(url)) fail.push(`sitemap.xml: URL has no matching HTML page ${url}`);
if (sitemapUrls.some(url => url.includes('.html'))) fail.push('sitemap.xml: redirected .html URL');

const redirects = fs.readFileSync('_redirects', 'utf8');
for (const url of canonicalRoutes.keys()) {
  const route = new URL(url).pathname;
  const legacy = route === '/' ? '/index.html' : route === '/sitemap' ? '/sitemap.html' : `${route.replace(/\/$/, '')}.html`;
  const escaped = legacy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!new RegExp(`^${escaped}\\s+${route}\\s+301$`, 'm').test(redirects)) fail.push(`_redirects: missing Cloudflare-compatible permanent legacy redirect ${legacy}`);
}

if (fs.readFileSync('ads.txt', 'utf8').trim() !== expectedAds) fail.push('ads.txt: publisher line mismatch');
const consent = fs.readFileSync('cookie-consent.js', 'utf8');
if (!/data-consent-adsense|consentAdsense/.test(consent) || !/document\.head\.appendChild\(script\)/.test(consent)) fail.push('cookie-consent.js: consent-gated AdSense loader missing');
const components = fs.readFileSync('components.js', 'utf8');
if (!/ventraip\.com\.au\/affiliate\/uJmhYi4h/.test(components) || !/rel="sponsored noopener"/.test(components) || !/Affiliate disclosure:/.test(components)) fail.push('components.js: affiliate destination, sponsored relationship or visible disclosure missing');
const tidePage = fs.readFileSync('tides/index.html', 'utf8');
if (!tidePage.includes('nominatim.openstreetmap.org/search') || !tidePage.includes('marine-api.open-meteo.com/v1/marine') || !tidePage.includes('sea_level_height_msl')) fail.push('tides: browser-safe geocoding or global marine-data integration missing');
if (/User-Agent[^\n]*MyCalendarTools/.test(tidePage)) fail.push('tides: browser-forbidden User-Agent request header has returned');
if (/Norwegian Meteorological Institute|NOAA tide times/i.test(tidePage + fs.readFileSync('index.html', 'utf8'))) fail.push('tides: stale or inaccurate provider claim');
if (!fs.readFileSync('robots.txt', 'utf8').includes(`Sitemap: ${origin}/sitemap.xml`)) fail.push('robots.txt: canonical sitemap declaration missing');
const css = fs.readFileSync('style.css', 'utf8');
if (!/--card-edge/.test(css)) fail.push('style.css: coloured tool-card edge missing');
if (!/--countdown-glow/.test(css) || !/\.countdown-block:hover[\s\S]*rgba\(var\(--countdown-glow\)/.test(css)) fail.push('style.css: featured countdown card glow missing');

if (fail.length) { console.error(fail.join('\n')); process.exit(1); }
console.log(`MyCalendarTools integrity passed (${files.length} indexable HTML pages, ${sitemapUrls.length} sitemap URLs)`);
