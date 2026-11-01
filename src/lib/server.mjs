const env=(k)=>process.env[k] || import.meta.env?.[k];
export {env};
export function configured(){return !!(env('SUPABASE_URL')&&env('SUPABASE_SERVICE_ROLE_KEY'));}
export async function db(path,options={}){if(!configured())throw new Error('Cloud storage is not configured');const r=await fetch(`${env('SUPABASE_URL')}/rest/v1/${path}`,{...options,headers:{apikey:env('SUPABASE_SERVICE_ROLE_KEY'),Authorization:`Bearer ${env('SUPABASE_SERVICE_ROLE_KEY')}`,'Content-Type':'application/json',Prefer:'return=representation',...options.headers}});if(!r.ok)throw new Error(`Storage request failed (${r.status})`);const t=await r.text();return t?JSON.parse(t):null;}
export function authorized(request){const t=env('OWNER_TOKEN');return !!t&&request.headers.get('authorization')===`Bearer ${t}`;}
export function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});}
export async function guard(request){if(!authorized(request))return json({error:'Enter the owner access token to use cloud services.'},401);if(!configured())return json({error:'Cloud database is not configured. Local reading and feedback remain available.'},503);const result=await db('rpc/take_request',{method:'POST',body:JSON.stringify({})});if(!result)return json({error:'Please wait: cloud request limit reached.'},429);}
