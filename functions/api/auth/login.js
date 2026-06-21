import { signToken, verifyToken } from '../../_utils/token.js';
import { hashPassword, jsonResponse } from '../../_utils/crypto.js';

export async function onRequestPost({ request, env }){
  const body = await request.json();
  const { username, password } = body || {};
  if (!username || !password) return jsonResponse({ error: 'username and password required' }, { status: 400 });
  const row = await env.DB.prepare('SELECT id, password_hash FROM users WHERE username = ?').bind(username).first();
  if (!row) return jsonResponse({ error: 'invalid' }, { status: 401 });
  const hash = await hashPassword(password);
  if (hash !== row.password_hash) return jsonResponse({ error: 'invalid' }, { status: 401 });
  const token = await signToken({ uid: row.id, username, iat: Date.now() }, env.JWT_SECRET);
  const res = jsonResponse({ ok: true, user: { id: row.id, username } });
  res.headers.set('Set-Cookie', `${env.COOKIE_NAME || 'hc_session'}=${token}; HttpOnly; Path=/; SameSite=Lax`);
  return res;
}
