// Minimal client helper for API calls.
export async function api(path, opts){
  const res = await fetch('/api' + path, { credentials: 'include', headers: { 'Content-Type':'application/json' }, ...opts });
  return res.json();
}
