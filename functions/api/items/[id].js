import { jsonResponse } from '../../_utils/crypto.js';
import { getUserFromRequest } from '../auth/me.js';

export async function onRequestPut({ request, env, params }){
  // create or replace single item (not used)
  return jsonResponse({ error: 'not_implemented' }, { status: 501 });
}

export async function onRequestPatch({ request, env, params }){
  const user = await getUserFromRequest(request, env);
  if (!user) return jsonResponse({ error: 'unauthenticated' }, { status: 401 });
  const id = params.id;
  const body = await request.json();
  // allow editing name, details, photos, hidden, in_use, temp_location, location_id, type_id
  const fields = [];
  const values = [];
  const allowed = ['name','details','photos','hidden','in_use','temp_location','location_id','type_id'];
  for(const k of allowed){
    if (k in body){ fields.push(`${k} = ?`); values.push(k === 'photos' ? JSON.stringify(body[k]) : body[k]); }
  }
  if (fields.length === 0) return jsonResponse({ error: 'no_fields' }, { status: 400 });
  values.push(id);
  // ensure ownership
  const owner = await env.DB.prepare('SELECT user_id FROM items WHERE id = ?').bind(id).first();
  if (!owner) return jsonResponse({ error: 'not_found' }, { status: 404 });
  if (owner.user_id !== user.id) return jsonResponse({ error: 'forbidden' }, { status: 403 });
  const sql = `UPDATE items SET ${fields.join(', ')} WHERE id = ?`;
  await env.DB.prepare(sql).bind(...values).run();
  return jsonResponse({ ok: true });
}

export async function onRequestDel({ request, env, params }){
  const user = await getUserFromRequest(request, env);
  if (!user) return jsonResponse({ error: 'unauthenticated' }, { status: 401 });
  const id = params.id;
  const owner = await env.DB.prepare('SELECT user_id FROM items WHERE id = ?').bind(id).first();
  if (!owner) return jsonResponse({ error: 'not_found' }, { status: 404 });
  if (owner.user_id !== user.id) return jsonResponse({ error: 'forbidden' }, { status: 403 });
  await env.DB.prepare('DELETE FROM items WHERE id = ?').bind(id).run();
  return jsonResponse({ ok: true });
}

export async function onRequestGet({ request, env, params }){
  const id = params.id;
  const row = await env.DB.prepare('SELECT * FROM items WHERE id = ?').bind(id).first();
  if (!row) return new Response('Not found', { status: 404 });
  return jsonResponse({ ok: true, item: row });
}
