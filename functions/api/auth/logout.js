// logout: clear cookie
export async function onRequestPost({ request, env }){
  const res = new Response(JSON.stringify({ ok:true }), { headers: { 'Content-Type': 'application/json' } });
  res.headers.set('Set-Cookie', `${env.COOKIE_NAME || 'hc_session'}=deleted; HttpOnly; Path=/; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`);
  return res;
}
