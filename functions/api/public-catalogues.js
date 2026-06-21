import { jsonResponse } from '../../_utils/crypto.js';
import { getUserFromRequest } from '../auth/me.js';

export async function onRequestGet({ request, env }){
  // public catalogues list
  const rows = await env.DB.prepare('SELECT id, username FROM users WHERE is_public = 1').all();
  return jsonResponse({ ok: true, users: rows.results || [] });
}
