// simple password hashing using SHA-256
export async function hashPassword(password) {
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2,'0')).join('');
}

export function jsonResponse(obj, init={}){
  return new Response(JSON.stringify(obj), { headers: { 'Content-Type': 'application/json' }, ...init });
}
