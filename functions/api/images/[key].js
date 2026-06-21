export async function onRequestGet({ request, env, params }){
  const key = params.key;
  if (!key) return new Response('Not found', { status: 404 });
  try{
    const obj = await env.R2_IMAGES.get(key);
    if (!obj) return new Response('Not found', { status: 404 });
    const headers = new Headers();
    if (obj.httpMetadata && obj.httpMetadata.contentType) headers.set('Content-Type', obj.httpMetadata.contentType);
    return new Response(obj.body, { headers });
  }catch(e){
    return new Response('Error', { status: 500 });
  }
}
