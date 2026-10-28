// Explicit Preview-build integration test. Credentials stay in Vercel.
// Temporary records reference a private non-catalog product and are cleaned up.
import assert from 'node:assert/strict';
import {randomUUID,createHash} from 'node:crypto';
import {createClient} from '@sanity/client';
import {moderateReview,ReviewConflictError} from './review-moderation-core.mjs';

assert.equal(process.env.VERCEL_ENV,'preview');
assert.ok(process.env.SANITY_WRITE_TOKEN,'Missing server-side Sanity credential');
const client=createClient({projectId:'qmszlzqu',dataset:'production',apiVersion:'2025-11-11',useCdn:false,token:process.env.SANITY_WRITE_TOKEN,perspective:'raw'});
const publicClient=client.withConfig({token:undefined,perspective:'published'});
const snapshotQuery=`*[_type=="review" && !(_id in path("drafts.**"))] | order(_id asc){_id,item,author,rating,text,status,submittedAt,reply}`;
const digest=data=>createHash('sha256').update(JSON.stringify(data)).digest('hex');
const before=await client.fetch(snapshotQuery);
if(process.argv.includes('--migrate-contacts')){
 const legacy=await client.fetch(`*[_type=="review" && defined(phone)]{_id,_rev,phone,item,submittedAt}`);
 assert.ok(legacy.length<=100,'Unexpected migration size');
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
const suffix=randomUUID(), productId=`qaReviewProduct.${suffix}`, reviewId=`qa-review-${suffix}`;
assert.equal(await client.getDocument(productId),undefined);assert.equal(await client.getDocument(reviewId),undefined);
const actor={id:'automated-review-qa',name:'Automated QA'};
const audits=[];
let checks=0;
try{
 await client.mutate([{create:{_id:productId,_type:'reviewTestProduct',name:'QA — не товар каталогу',slug:'qa-moderation'}},{create:{_id:reviewId,_type:'review',item:{_type:'reference',_ref:productId},author:'QA MODERATION — тимчасовий запис',rating:3,text:'QA original <script>not executable</script>',status:'pending',submittedAt:new Date().toISOString()}}],{visibility:'sync'});
 const get=()=>client.getDocument(reviewId);
 const run=async(action,edits,undo)=>{const audit=await moderateReview(client,await get(),action,actor,edits,undo);audits.push(audit);return audit};
 assert.equal((await get()).status,'pending');checks++;
 const first=await run('publish',{text:'QA edited clean text',replyText:'QA store reply'});
 assert.equal((await get()).status,'approved');assert.equal((await get()).text,'QA edited clean text');checks++;
 assert.equal(await publicClient.fetch(`count(*[_type=="review" && item._ref==$id && status=="approved"])`,{id:productId}),1);checks++;
 await run('hide');assert.equal((await get()).status,'hidden');assert.equal(await publicClient.fetch(`count(*[_type=="review" && item._ref==$id && status=="approved"])`,{id:productId}),0);checks++;
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
 console.log('[review-admin-integration]',JSON.stringify({checks,privateHistory:true,anonymousWriteDenied:true,conflictProtection:true}));
}finally{
 // Delete only exact disposable IDs from this run, never other reviews/data.
 const extra=await client.fetch(`*[_type=="reviewAudit" && reviewId==$id]{_id}`,{id:reviewId});
 const ids=[reviewId,...extra.map(a=>a._id),productId];
 assert.ok(ids.every(id=>id===reviewId||id===productId||/^reviewAudit\.[\w-]+$/.test(id)));
 await client.mutate(ids.map(id=>({delete:{id}})),{visibility:'sync'});
}
const after=await client.fetch(snapshotQuery);
assert.equal(digest(after),digest(before),'Existing review content or statuses changed');
console.log('[review-data-preserved]',JSON.stringify({reviews:after.length,sha256:digest(after),temporaryRecordsRemaining:await client.fetch(`count(*[_id==$id || _id==$product || (_type=="reviewAudit" && reviewId==$id)])`,{id:reviewId,product:productId})}));
