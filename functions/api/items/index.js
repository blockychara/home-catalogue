import { jsonResponse } from '../../_utils/crypto.js';
import { getUserFromRequest } from '../auth/me.js';

export async function onRequestPost({ request, env }){
  const user = await getUserFromRequest(request, env);
  if (!user) return jsonResponse({ error: 'unauthenticated' }, { status: 401 });
  const body = await request.json();
  const { name, type_id, location_id, details, photos } = body || {};
  const id = crypto.randomUUID();
  const created_at = Date.now();
  await env.DB.prepare('INSERT INTO items (id, user_id, name, type_id, location_id, details, photos, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, user.id, name || '', type_id || '', location_id || '', details || '', JSON.stringify(photos || []), created_at).run();
  return jsonResponse({ ok: true, id });
}

export async function onRequestGet({ request, env }){
  const user = await getUserFromRequest(request, env);
  const url = new URL(request.url);
  const userId = url.searchParams.get('user_id');
  const publicOnly = url.searchParams.get('public') === '1';
  if (!userId) return jsonResponse({ error: 'user_id required' }, { status: 400 });
  // only allow public access if owner is public or requester is owner
  const owner = await env.DB.prepare('SELECT id, is_public FROM users WHERE id = ?').bind(userId).first();
  if (!owner) return jsonResponse({ error: 'not_found' }, { status: 404 });
  if (publicOnly && owner.is_public !== 1 && !(user && user.id === owner.id)){
    return jsonResponse({ error: 'not_public' }, { status: 403 });
  }
  let q = 'SELECT * FROM items WHERE user_id = ?';
  const params = [userId];
  if (publicOnly) q += ' AND hidden = 0';
  q += ' ORDER BY name COLLATE NOCASE';
  const rows = await env.DB.prepare(q).bind(...params).all();
  return jsonResponse({ ok: true, items: rows.results || [] });
}
