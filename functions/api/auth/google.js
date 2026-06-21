// Google OAuth start - build redirect URI using request origin (Cloudflare Pages Functions)
export async function onRequestGet({ request, env }){
  const origin = new URL(request.url).origin;
  const redirectUri = `${origin}/api/auth/google/callback`;
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  });
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return Response.redirect(url, 302);
}
