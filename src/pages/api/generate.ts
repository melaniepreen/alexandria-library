import {requestSchema} from '../../lib/domain.mjs';
import {makeRealtimeEpisode} from '../../lib/realtime-episode.mjs';
import {guard,authorized,configured,db,json,env,publicQuota,visitorHash} from '../../lib/server.mjs';

// Vercel runs this Node route synchronously. It never hands work to a durable worker.
export const maxDuration=300;

export async function POST({request}){
  let job;
  try{
    const input=requestSchema.parse(await request.json());
    if(input.minutes!==5)return json({error:'Real-time generation currently makes a five-minute episode so it can finish during this request.'},400);
    const owner=authorized(request);
    if(!configured()||!env('OPENAI_API_KEY'))return json({error:'The library owner has not connected podcast generation yet. You do not need your own database or API account.'},503);
    if(owner){const denied=await guard(request);if(denied)return denied;}
    else if(env('ALLOW_PUBLIC_GENERATION')==='false'||!visitorHash(request))return json({error:'The library owner has not enabled visitor generation yet.'},503);
    if(!owner&&!/^\d{4}\.\d{4,5}$/.test(input.paperId))return json({error:'Choose a paper from the shared arXiv catalogue.'},400);
    const papers=await db(`papers?id=eq.${encodeURIComponent(input.paperId)}&select=*`);
    if(!papers.length)return json({error:'The selected paper is not available in the shared catalogue.'},404);
    const dedup=`${input.paperId}:${input.minutes}`;
    const existing=await db(`jobs?dedup=eq.${encodeURIComponent(dedup)}&status=eq.ready&select=*`);
    if(existing.length)return json({id:existing[0].id,status:'ready'},200);
    if(!owner&&!await publicQuota(request,'generation'))return json({error:'The shared library has reached its generation allowance for today. Existing episodes remain available.'},429);
    const jobs=await db('jobs',{method:'POST',body:JSON.stringify({...input,dedup,status:'processing',visitor_hash:owner?null:visitorHash(request)})});
    job=jobs[0];
    const episode=await makeRealtimeEpisode({job,paper:papers[0],minutes:input.minutes});
    await db(`jobs?id=eq.${job.id}`,{method:'PATCH',body:JSON.stringify({status:'ready',...episode,finished_at:new Date().toISOString(),error:null})});
    return json({id:job.id,status:'ready'},200);
  }catch(error){
    console.error('Real-time podcast generation failed',error?.message);
    if(job)await db(`jobs?id=eq.${job.id}`,{method:'PATCH',body:JSON.stringify({status:'failed',error:String(error?.message||'Generation failed').slice(0,200),finished_at:new Date().toISOString()})}).catch(()=>{});
    return json({error:error?.name==='ZodError'?'Choose a paper and a five-minute duration.':'Unable to generate this episode right now. Please try again.'},error?.name==='ZodError'?400:502);
  }
}
