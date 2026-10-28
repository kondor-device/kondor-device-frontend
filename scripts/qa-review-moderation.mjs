// Explicit Preview-build integration test. Credentials stay in Vercel.
// One disposable review references an existing product; products are never mutated.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createClient} from '@sanity/client';
import {moderateReview,ReviewConflictError} from './review-moderation-core.mjs';

assert.equal(process.env.VERCEL_ENV,'preview');
assert.ok(process.env.SANITY_WRITE_TOKEN,'Missing server-side Sanity credential');
const client=createClient({projectId:'qmszlzqu',dataset:'production',apiVersion:'2025-11-11',useCdn:false,token:process.env.SANITY_WRITE_TOKEN,perspective:'raw'});
const publicClient=client.withConfig({token:undefined,perspective:'published'});
assert.equal(publicClient.config().token,undefined);
const uiReview='qa-review-admin-ui-20261028';
if(process.argv.includes('--cleanup-ui-fixture')){
 const doc=await client.getDocument(uiReview);
 if(doc){
  assert.equal(doc.qaOwner,'codex-review-admin-20261028');
  const owned=await client.fetch(`*[_type=="reviewAudit" && reviewId==$id]{_id}`,{id:uiReview});
  assert.ok(owned.every(a=>/^reviewAudit\.[\w-]+$/.test(a._id)));
  await client.mutate([uiReview,...owned.map(a=>a._id)].map(id=>({delete:{id}})),{visibility:'sync'});
 }
 console.log('[review-ui-fixture]',JSON.stringify({cleaned:true}));
 process.exit(0);
}
const snapshotQuery=`*[_type=="review" && !(_id in path("drafts.**"))] | order(_id asc){_id,item,author,rating,text,status,submittedAt,reply}`;
const digest=data=>createHash('sha256').update(JSON.stringify(data)).digest('hex');
const before=await client.fetch(snapshotQuery);
if(process.argv.includes('--migrate-contacts')){
 const legacy=await client.fetch(`*[_type=="review" && defined(phone)]{_id,_rev,phone,item,submittedAt}`);
 assert.ok(legacy.length<=5,'Unexpected migration size');
 if(legacy.length){
  const mutations=[];
  for(const r of legacy){
   assert.match(r._id,/^[\w-]{1,100}$/);
   const id=`reviewContact.${r._id}`;
   const existing=await client.getDocument(id);
   assert.ok(!existing||existing.phone===r.phone,'Contact conflict; abort rather than overwrite');
   mutations.push({createIfNotExists:{_id:id,_type:'reviewContact',reviewId:r._id,item:r.item,phone:r.phone,submittedAt:r.submittedAt}});
   mutations.push({patch:{id:r._id,ifRevisionID:r._rev,unset:['phone']}});
  }
  await client.mutate(mutations,{visibility:'sync'});
 }
 assert.equal(await publicClient.fetch(`count(*[_type=="review" && defined(phone)])`),0);
 console.log('[review-contacts]',JSON.stringify({migrated:legacy.length,publicPhones:0}));
}
const product=await client.fetch('*[_type=="item" && slug=="kondor-orion-2" && !(_id in path("drafts.**"))][0]{_id}');
assert.ok(product?._id,'Existing product required');
const productId=product._id,reviewId=uiReview;
const productBefore=digest(await client.getDocument(productId));
const baseline=await publicClient.fetch('count(*[_type=="review" && item._ref==$id && status=="approved"])',{id:productId});
assert.equal(await client.getDocument(reviewId),undefined);
let keepFixture=false;
const actor={id:'automated-review-qa',name:'Automated QA'};
const audits=[];
let checks=0;
try{
 await client.mutate([{create:{_id:reviewId,_type:'review',item:{_type:'reference',_ref:productId},author:'QA MODERATION — тимчасовий запис',rating:3,text:'QA original <script>not executable</script>',status:'pending',submittedAt:new Date().toISOString(),qaOwner:'codex-review-admin-20261028'}}],{visibility:'sync'});
 const get=()=>client.getDocument(reviewId);
 const run=async(action,edits,undo)=>{const audit=await moderateReview(client,await get(),action,actor,edits,undo);audits.push(audit);return audit};
 assert.equal((await get()).status,'pending');checks++;
 const first=await run('publish',{text:'QA edited clean text',replyText:'QA store reply'});
 assert.equal((await get()).status,'approved');assert.equal((await get()).text,'QA edited clean text');checks++;
 assert.equal(await publicClient.fetch(`count(*[_type=="review" && item._ref==$id && status=="approved"])`,{id:productId}),baseline+1);checks++;
 await run('hide');assert.equal((await get()).status,'hidden');assert.equal(await publicClient.fetch(`count(*[_type=="review" && item._ref==$id && status=="approved"])`,{id:productId}),baseline);checks++;
 await run('publish');assert.equal((await get()).status,'approved');checks++;
 const changed=await run('publish',{text:'QA second edit',replyText:''});assert.equal((await get()).reply,undefined);checks++;
 await run('undo',undefined,changed);assert.equal((await get()).text,'QA edited clean text');assert.equal((await get()).reply.text,'QA store reply');checks++;
 const stale=await get();await run('hide');
 await assert.rejects(()=>moderateReview(client,stale,'publish',actor),ReviewConflictError);checks++;
 const anonymousAudit=await publicClient.fetch(`*[_id in $ids]{_id}`,{ids:audits.map(a=>a._id)});assert.equal(anonymousAudit.length,0);checks++;
 assert.equal((await client.getDocument(first._id)).before.text,'QA original <script>not executable</script>');checks++;
 const auditList=await client.fetch(`*[_type=="reviewAudit" && reviewId==$id] | order(_createdAt desc,_id desc)`,{id:reviewId});assert.equal(auditList.length,audits.length);checks++;
 const deny=await fetch('https://qmszlzqu.api.sanity.io/v2025-11-11/data/mutate/production',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mutations:[{patch:{id:reviewId,set:{text:'Unauthorized attempt'}}}]})});
 assert.ok([401,403].includes(deny.status));assert.equal((await get()).text,'QA edited clean text');checks++;
 if(process.argv.includes('--prepare-ui-fixture')){
  await client.patch(reviewId).set({status:'pending'}).commit({visibility:'sync'});
  keepFixture=true;
 }
 console.log('[review-admin-integration]',JSON.stringify({checks,privateHistory:true,anonymousWriteDenied:true,conflictProtection:true}));
}finally{
 // Delete only exact disposable IDs from this run, never other reviews/data.
 const extra=await client.fetch(`*[_type=="reviewAudit" && reviewId==$id]{_id}`,{id:reviewId});
 const ids=[reviewId,...extra.map(a=>a._id)];
 assert.ok(ids.every(id=>id===reviewId||/^reviewAudit\.[\w-]+$/.test(id)));
 if(!keepFixture) await client.mutate(ids.map(id=>({delete:{id}})),{visibility:'sync'});
}
const after=(await client.fetch(snapshotQuery)).filter(r=>r._id!==reviewId);
assert.equal(digest(await client.getDocument(productId)),productBefore,'Existing product changed');
assert.equal(digest(after),digest(before),'Existing review content or statuses changed');
console.log('[review-data-preserved]',JSON.stringify({reviews:after.length,sha256:digest(after),temporaryRecordsRemaining:await client.fetch(`count(*[_id==$id || (_type=="reviewAudit" && reviewId==$id)])`,{id:reviewId})}));
if(keepFixture) console.log('[review-ui-fixture]',JSON.stringify({reviewId,existingProduct:productId,prepared:true}));
