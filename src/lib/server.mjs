import {createHmac} from 'node:crypto';
const env=(k)=>process.env[k] || import.meta.env?.[k];
export {env};
export function supabaseHeaders(key=env('SUPABASE_SERVICE_ROLE_KEY')){return {apikey:key,...(key?.startsWith('sb_secret_')?{}:{Authorization:`Bearer ${key}`})};}
export function configured(){return !!(env('SUPABASE_URL')&&env('SUPABASE_SERVICE_ROLE_KEY'));}
export async function db(path,options={}){if(!configured())throw new Error('Cloud storage is not configured');const r=await fetch(`${env('SUPABASE_URL')}/rest/v1/${path}`,{...options,headers:{...supabaseHeaders(),'Content-Type':'application/json',Prefer:'return=representation',...options.headers}});if(!r.ok)throw new Error(`Storage request failed (${r.status})`);const t=await r.text();return t?JSON.parse(t):null;}
export function authorized(request){const t=env('OWNER_TOKEN');return !!t&&request.headers.get('authorization')===`Bearer ${t}`;}
export function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});}
export async function guard(request){if(!authorized(request))return json({error:'This action is available to the library owner. Visitors use the shared library.'},401);if(!configured())return json({error:'The library owner has not connected the shared database yet. Saved reading and feedback remain available.'},503);const result=await db('rpc/take_request',{method:'POST',body:JSON.stringify({})});if(!result)return json({error:'Please wait: cloud request limit reached.'},429);}

export function visitorHash(request){const secret=env('RATE_LIMIT_SALT')||env('OWNER_TOKEN');if(!secret)return null;const ip=(request.headers.get('x-vercel-forwarded-for')||request.headers.get('x-forwarded-for')||'local').split(',')[0].trim();return createHmac('sha256',secret).update(ip).digest('hex');}
export async function publicQuota(request,kind){const visitor=visitorHash(request);if(!visitor)return false;return db('rpc/take_public_request',{method:'POST',body:JSON.stringify({visitor,kind,daily_limit:Math.max(1,Math.min(100,Number(env('PUBLIC_DAILY_GENERATION_LIMIT'))||10))})});}
export async function signAsset(key){const response=await fetch(`${env('SUPABASE_URL')}/storage/v1/object/sign/episodes/${key}`,{method:'POST',headers:{...supabaseHeaders(),'Content-Type':'application/json'},body:JSON.stringify({expiresIn:3600})});if(!response.ok)throw new Error('Asset access unavailable');return `${env('SUPABASE_URL')}/storage/v1${(await response.json()).signedURL}`;}
