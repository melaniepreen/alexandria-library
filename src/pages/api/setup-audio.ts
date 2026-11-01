import { createHash, timingSafeEqual } from 'node:crypto';
import { env, json } from '../../lib/server.mjs';

export const prerender = false;

export async function POST({ request, url }) {
  const token = env('ALEXANDRIA_SAMPLE_UPLOAD_TOKEN') || '';
  const expiry = Number(env('ALEXANDRIA_SAMPLE_UPLOAD_EXPIRES') || 0);
  const supplied = request.headers.get('authorization')?.replace(/^Bearer\\s+/i, '') || '';
  if (!token || !supplied || Date.now() > expiry) return json({ error: 'Upload window closed' }, 410);
  const valid = timingSafeEqual(createHash('sha256').update(supplied).digest(), createHash('sha256').update(token).digest());
  if (!valid) return json({ error: 'Unauthorized' }, 401);

  const name = url.searchParams.get('name') || '';
  if (!/^episode-[0-4]\\.mp3$/.test(name) || !request.headers.get('content-type')?.startsWith('audio/mpeg')) return json({ error: 'Invalid sample file' }, 400);
  const declared = Number(request.headers.get('content-length') || 0);
  if (declared > 5_700_000) return json({ error: 'File too large' }, 413);
  const bytes = Buffer.from(await request.arrayBuffer());
  if (!bytes.length || bytes.length > 5_700_000) return json({ error: 'Invalid file size' }, 413);

  const base = env('SUPABASE_URL');
  const key = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!base || !key) return json({ error: 'Storage is not configured' }, 503);
  const response = await fetch(`${base}/storage/v1/object/episodes/samples/${name}`, {
    method: 'POST',
    headers: { apikey: key, authorization: `Bearer ${key}`, 'content-type': 'audio/mpeg', 'x-upsert': 'true' },
    body: bytes,
  });
  if (!response.ok) return json({ error: `Storage upload failed (${response.status})` }, 502);
  return json({ uploaded: name, bytes: bytes.length });
}
