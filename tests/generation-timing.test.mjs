import test from 'node:test';
import assert from 'node:assert/strict';
import {audioDurationIsValid,targetWordCount} from '../src/lib/generation-timing.mjs';

test('generation targets enough words for the five-minute audio minimum',()=>{
  assert.equal(targetWordCount(5),850);
  assert.equal(targetWordCount(10),1600);
  assert.equal(targetWordCount(25),4000);
  assert.throws(()=>targetWordCount(4),RangeError);
});

test('audio duration must meet requested range and tolerance',()=>{
  assert.equal(audioDurationIsValid(299,5),false);
  assert.equal(audioDurationIsValid(300,5),true);
  assert.equal(audioDurationIsValid(390,5),true);
  assert.equal(audioDurationIsValid(391,5),false);
  assert.equal(audioDurationIsValid(1500,25),true);
  assert.equal(audioDurationIsValid(1501,25),false);
});
