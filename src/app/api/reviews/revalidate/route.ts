import { NextRequest, NextResponse } from "next/server";
import { writeClient } from "@/lib/sanityWriteClient";
import { revalidateProductWithRating } from "@/lib/revalidate";

export const runtime = "nodejs";
const MAX_AUDIT_AGE_MS = 15 * 60 * 1000;
// The Studio sends only the unpredictable ID of its private, atomically saved
// audit record. No Sanity session, write token, customer text or phone is sent.
// This endpoint can invalidate public cache only; it cannot edit a review.
function allowedOrigin(origin: string | null) {
  if (!origin) return false;
  if (origin === "https://kondor-device-admin.vercel.app") return true;
  if (process.env.VERCEL_ENV !== "production" && origin === "http://localhost:3333") return true;
  return /^https:\/\/kondor-device-admin-[a-z0-9-]+-kondor-devices-projects\.vercel\.app$/.test(origin);
}
function headers(origin: string) {
  return { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "300", Vary: "Origin", "Cache-Control": "no-store" };
}
export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return allowedOrigin(origin) ? new NextResponse(null, { status: 204, headers: headers(origin!) }) : NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!allowedOrigin(origin)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const respond = (body: object, status = 200) => NextResponse.json(body, { status, headers: headers(origin!) });
  const length = Number(request.headers.get("content-length") || "0");
  if (length > 256) return respond({ error: "Invalid request" }, 400);
  let auditId: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 256) return respond({ error: "Invalid request" }, 400);
    auditId = JSON.parse(raw).auditId;
  } catch { return respond({ error: "Invalid request" }, 400); }
  if (typeof auditId !== "string" || !/^reviewAudit\.[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(auditId)) return respond({ error: "Invalid request" }, 400);
  try {
    const audit = await writeClient.fetch<{ _type: string; _createdAt: string; reviewId: string; sourceRevision: string } | null>(
      `*[_id == $id && _type == "reviewAudit"][0]{_type,_createdAt,reviewId,sourceRevision}`,
      { id: auditId }, { cache: "no-store" },
    );
    const age = audit ? Date.now() - Date.parse(audit._createdAt) : NaN;
    if (!audit || !Number.isFinite(age) || age < -30000 || age > MAX_AUDIT_AGE_MS || !/^[A-Za-z0-9_-]{1,128}$/.test(audit.reviewId)) return respond({ error: "Invalid proof" }, 401);
    const review = await writeClient.fetch<{ _rev: string; slug?: string; categorySlug?: string } | null>(
      `*[_id == $id && _type == "review"][0]{_rev,"slug":item->slug,"categorySlug":item->cat->slug}`,
      { id: audit.reviewId }, { cache: "no-store" },
    );
    if (!review?.slug || review._rev === audit.sourceRevision) return respond({ error: "Invalid proof" }, 401);
    await revalidateProductWithRating(review.slug, review.categorySlug);
    return respond({ ok: true });
  } catch {
    console.error("[reviews] Studio cache invalidation failed");
    return respond({ error: "Temporary failure" }, 503);
  }
}
