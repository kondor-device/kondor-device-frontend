// Explicit disposable integration fixture. Never runs in a normal app build.
import assert from 'node:assert/strict';
import {createHash,randomUUID} from 'node:crypto';
import {createClient} from '@sanity/client';
import sharp from 'sharp';
assert.equal(process.env.VERCEL_ENV,'preview');
const client=createClient({projectId:'qmszlzqu',dataset:'production',apiVersion:'2025-11-11',useCdn:false,perspective:'raw',token:process.env.SANITY_WRITE_TOKEN});
assert.ok(client.config().token);
const id='qa-review-photos-20261028',manifestId='reviewPhotoQA.20261028',owner='codex-review-photos-20261028';
const digest=data=>createHash('sha256').update(JSON.stringify(data)).digest('hex');
const query=`*[_type=="review" && _id!=$id] | order(_id asc){_id,item,author,rating,text,status,submittedAt,reply,photos}`;
if(process.argv.includes('--cleanup')){
 const manifest=await client.getDocument(manifestId),doc=await client.getDocument(id);
 assert.ok(manifest&&manifest.owner===owner,'Expected QA manifest');
 assert.ok(!doc||doc.qaOwner===owner,'Unexpected review owner');
 const audits=await client.fetch(`*[_type=="reviewAudit" && reviewId==$id]{_id}`,{id});
 const ids=[id,...audits.map(a=>a._id),manifestId];
 const foreign=await client.fetch(`*[references($assets) && !(_id in $ids)]{_id}`,{assets:manifest.assets,ids});
 await client.mutate(ids.map(id=>({delete:{id}})),{visibility:'sync'});
 if(!foreign.length) await client.mutate(manifest.assets.map(id=>({delete:{id}})),{visibility:'sync'});
 const current=await client.fetch(query,{id});
 assert.equal(digest(current),manifest.beforeDigest,'Other reviews changed since QA began; inspect concurrent owner edits');
 console.log('[review-photo-cleanup]',JSON.stringify({reviewsPreserved:current.length,temporaryReviewDeleted:true,testPhotosDeleted:foreign.length?0:manifest.assets.length}));
 process.exit(0);
}
assert.equal(await client.getDocument(id),undefined);
assert.equal(await client.getDocument(manifestId),undefined);
const before=await client.fetch(query,{id});
const product=await client.fetch(`*[_type=="item" && slug=="kondor-orion-2" && !(_id in path("drafts.**"))][0]{_id}`,{});
assert.ok(product?._id);
const nonce=randomUUID(),assets=[];
for(let index=0;index<3;index++){
 const svg=Buffer.from(`<svg width="900" height="600" xmlns="http://www.w3.org/2000/svg"><rect width="900" height="600" fill="${['#ffe2a6','#cfedf5','#dce8d0'][index]}"/><text x="90" y="260" font-size="80">QA PHOTO ${index+1}</text><text x="90" y="350" font-size="24">Temporary test - ${nonce}</text></svg>`);
 const bytes=await sharp(svg).webp({quality:80}).toBuffer();
 const asset=await client.assets.upload('image',bytes,{contentType:'image/webp',filename:`qa-review-photo-${nonce}-${index}.webp`});
 assets.push(asset._id);
}
await client.mutate([{create:{_id:manifestId,_type:'reviewPhotoQA',owner,assets,beforeDigest:digest(before)}},{create:{_id:id,_type:'review',qaOwner:owner,item:{_type:'reference',_ref:product._id},author:'QA — тест фото (тимчасово)',rating:3,text:'Технічна перевірка фотографій. Тимчасовий запис буде видалено.',status:'pending',submittedAt:'2025-01-01T12:00:00Z',photos:assets.map((_ref,i)=>({_type:'image',_key:`qa-${i}`,asset:{_type:'reference',_ref}}))}}],{visibility:'sync'});
console.log('[review-photo-fixture]',JSON.stringify({id,photos:assets.length,existingProduct:product._id,otherReviewsUnchanged:true,telegramMessagesSent:0}));
