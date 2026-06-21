import { jsonResponse } from '../../_utils/crypto.js';
import { getUserFromRequest } from '../auth/me.js';

export async function onRequestGet({ request, env }){
  const url = new URL(request.url);
  const userId = url.searchParams.get('user_id');
  const publicOnly = url.searchParams.get('public') === '1';
  if (!userId) return jsonResponse({ error: 'user_id required' }, { status: 400 });
  // check if user's catalogue is public (unless the requester is the same logged-in user)
  const requester = await getUserFromRequest(request, env);
  const owner = await env.DB.prepare('SELECT id, username, is_public FROM users WHERE id = ?').bind(userId).first();
  if (!owner) return jsonResponse({ error: 'not_found' }, { status: 404 });
  if (publicOnly && owner.is_public !== 1 && !(requester && requester.id === owner.id)){
    return jsonResponse({ error: 'not_public' }, { status: 403 });
  }
  // list items, exclude hidden if publicOnly
  let q = 'SELECT * FROM items WHERE user_id = ?';
  const params = [userId];
  if (publicOnly) { q += ' AND hidden = 0'; }
  q += ' ORDER BY name COLLATE NOCASE';
  const items = await env.DB.prepare(q).bind(...params).all();
  return jsonResponse({ ok: true, owner, items: items.results || [] });
}
