import { verifyToken, signToken } from '../../_utils/token.js';
import { jsonResponse } from '../../_utils/crypto.js';

function parseCookie(req){
  const header = req.headers.get('cookie') || '';
  const parts = header.split(';').map(p => p.trim());
  const obj = {};
  for(const p of parts){
    const [k,v] = p.split('='); if (!k) continue; obj[k]=v;
  }
  return obj;
}

export async function getUserFromRequest(request, env){
  const cookies = parseCookie(request);
  const token = cookies[env.COOKIE_NAME || 'hc_session'];
  if (!token) return null;
  const payload = await verifyToken(token, env.JWT_SECRET);
  if (!payload) return null;
  const row = await env.DB.prepare('SELECT id, username, is_public FROM users WHERE id = ?').bind(payload.uid).first();
  return row || null;
}

export async function onRequestGet(context){
  const { request, env } = context;
  const user = await getUserFromRequest(request, env);
  return jsonResponse({ ok: true, user });
}
