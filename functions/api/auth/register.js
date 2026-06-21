import { signToken } from '../_utils/token.js';
import { hashPassword, jsonResponse } from '../_utils/crypto.js';

export async function onRequestPost({ request, env }){
  const body = await request.json();
  const { username, password, hint } = body || {};
  if (!username || !password) return jsonResponse({ error: 'username and password required' }, { status: 400 });
  // check existing
  const existing = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
  if (existing) return jsonResponse({ error: 'username_taken' }, { status: 409 });
  const id = crypto.randomUUID();
  const password_hash = await hashPassword(password);
  const created_at = Date.now();
  await env.DB.prepare('INSERT INTO users (id, username, password_hash, hint, created_at) VALUES (?, ?, ?, ?, ?)')
    .bind(id, username, password_hash, hint || '', created_at).run();
  // create session token
  const token = await signToken({ uid: id, username, iat: Date.now() }, env.JWT_SECRET);
  const res = jsonResponse({ ok: true, user: { id, username } });
  res.headers.set('Set-Cookie', `${env.COOKIE_NAME || 'hc_session'}=${token}; HttpOnly; Path=/; SameSite=Lax`);
  return res;
}
