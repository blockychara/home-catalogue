import { jsonResponse } from '../_utils/crypto.js';
import { getUserFromRequest } from './auth/me.js';

// accepts JSON: { filename, mime, data: base64 }
export async function onRequestPost({ request, env }){
  const user = await getUserFromRequest(request, env);
  if (!user) return jsonResponse({ error: 'unauthenticated' }, { status: 401 });
  const body = await request.json();
  const { filename, mime, data } = body || {};
  if (!data || !filename) return jsonResponse({ error: 'bad_request' }, { status: 400 });
  const bytes = Uint8Array.from(atob(data), c => c.charCodeAt(0));
  const key = `${user.id}/${crypto.randomUUID()}-${filename}`;
  await env.R2_IMAGES.put(key, bytes, { httpMetadata: { contentType: mime || 'application/octet-stream' } });
  return jsonResponse({ ok: true, key, url: `/api/images/${encodeURIComponent(key)}` });
}
