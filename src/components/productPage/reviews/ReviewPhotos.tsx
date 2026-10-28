"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { reviewImageUrl } from "@/lib/reviewPhotos";
import type { Review } from "@/types/productItem";

function PhotoViewer({ photos, initial, onClose }: { photos: NonNullable<Review["photos"]>; initial: number; onClose: () => void }) {
  const t = useTranslations("productPage.reviews");
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(initial);
  useEffect(() => { dialog.current?.showModal(); }, []);
  return <dialog ref={dialog} onClose={onClose} onCancel={() => dialog.current?.close()}
    aria-label={t("photoNumber", { number: index + 1 })}
    onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}
    className="fixed m-auto w-[min(960px,95vw)] max-w-none rounded-2xl bg-surface p-4 text-fg shadow-xl backdrop:bg-black/75">
    <div className="mb-3 flex items-center justify-between gap-4">
      <span className="text-sm">{index + 1} / {photos.length}</span>
      <button type="button" autoFocus onClick={() => dialog.current?.close()} className="min-h-11 rounded-lg border border-fg/20 px-4">{t("closePhoto")}</button>
    </div>
    <Image key={photos[index].id} src={reviewImageUrl(photos[index].url, 1400)} alt={t("photoNumber", { number: index + 1 })}
      unoptimized width={1400} height={1000} className="max-h-[70dvh] w-full object-contain" />
    {photos.length > 1 ? <div className="mt-3 flex justify-between gap-3">
      <button type="button" disabled={index === 0} onClick={() => setIndex(i => i - 1)} className="min-h-11 rounded-lg border border-fg/20 px-4 disabled:opacity-40">{t("previousPhoto")}</button>
      <button type="button" disabled={index === photos.length - 1} onClick={() => setIndex(i => i + 1)} className="min-h-11 rounded-lg border border-fg/20 px-4 disabled:opacity-40">{t("nextPhoto")}</button>
    </div> : null}
  </dialog>;
}

export default function ReviewPhotos({ photos }: { photos: Review["photos"] }) {
  const t = useTranslations("productPage.reviews");
  const [selected, setSelected] = useState<number | null>(null);
  const valid = (photos || []).slice(0, 3).filter(p => { try { return !!reviewImageUrl(p.url, 160); } catch { return false; } });
  if (!valid.length) return null;
  return <>
    <ul className="mt-4 flex flex-wrap gap-2" aria-label={t("customerPhotos")}>
      {valid.map((photo, index) => <li key={photo.id}>
        <button type="button" onClick={() => setSelected(index)} aria-label={t("openPhoto", { number: index + 1 })}
          className="block overflow-hidden rounded-xl border border-fg/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">
          <Image src={reviewImageUrl(photo.url, 160, true)} alt={t("photoNumber", { number: index + 1 })}
            unoptimized loading="lazy" width={80} height={80} className="size-20 object-cover" />
        </button>
      </li>)}
    </ul>
    {selected !== null ? <PhotoViewer photos={valid} initial={selected} onClose={() => setSelected(null)} /> : null}
  </>;
}
