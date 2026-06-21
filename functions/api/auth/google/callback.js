import { signToken } from '../../_utils/token.js';
import { jsonResponse } from '../../_utils/crypto.js';

export async function onRequestGet({ request, env }){
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return jsonResponse({ error: 'no_code' }, { status: 400 });
  // exchange code for tokens
  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/google/callback`;
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    })
  });
  const tokenJson = await tokenRes.json();
  if (!tokenJson.id_token) return jsonResponse({ error: 'no_id_token', tokenJson }, { status: 400 });
  // decode id_token (JWT) payload
  const parts = tokenJson.id_token.split('.');
  const payload = JSON.parse(atob(parts[1]));
  const email = payload.email;
  const username = email ? email.split('@')[0] : `user_${Date.now()}`;
  // find or create user
  let user = await env.DB.prepare('SELECT id, username FROM users WHERE username = ?').bind(username).first();
  if (!user){
    const id = crypto.randomUUID();
    await env.DB.prepare('INSERT INTO users (id, username, password_hash, hint, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(id, username, '', '', Date.now()).run();
    user = { id, username };
  }
  const token = await signToken({ uid: user.id, username: user.username, iat: Date.now() }, env.JWT_SECRET);
  const res = new Response('Authentication successful; you may close this tab.', { status: 200 });
  res.headers.set('Set-Cookie', `${env.COOKIE_NAME || 'hc_session'}=${token}; HttpOnly; Path=/; SameSite=Lax`);
  return res;
}
