// Minimal client helper for API calls. Not used heavily in static pages above but included for future UI code.
export async function api(path, opts){
  const res = await fetch('/.netlify/functions' + path, { credentials: 'include', headers: { 'Content-Type':'application/json' }, ...opts });
  return res.json();
}
