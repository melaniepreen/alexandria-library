import test from 'node:test';
import assert from 'node:assert/strict';
import {latestShelfPapers} from '../src/lib/catalogue.mjs';
import {readFileSync} from 'node:fs';
test('both shelves offer five real snapshot choices independently',()=>{
 const snapshot=JSON.parse(readFileSync(new URL('../public/data/catalogue-snapshot.json',import.meta.url)));
 for(const shelf of ['finance','quantum']){
  const papers=latestShelfPapers(snapshot.papers,shelf);
  assert.equal(papers.length,5);
  assert.ok(papers.every(p=>p.shelf===shelf));
  assert.ok(papers.every((p,i)=>!i||papers[i-1].published>=p.published));
 }
});
test('shelf selection excludes uploads, deduplicates versions, and takes latest five',()=>{
 const papers=Array.from({length:8},(_,i)=>({id:'id'+i,shelf:'finance',published:`2026-10-${String(i+1).padStart(2,'0')}`}));
 papers.push({id:'id7v2',shelf:'finance',published:'2026-10-09'},{id:'upload-private',shelf:'finance',published:'2026-11-01'},{id:'quantum',shelf:'quantum',published:'2026-11-01'});
 assert.deepEqual(latestShelfPapers(papers,'finance').map(p=>p.id),['id7v2','id6','id5','id4','id3']);
 assert.deepEqual(latestShelfPapers(papers,'quantum').map(p=>p.id),['quantum']);
});
