"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { prepareReviewPhoto } from "@/utils/prepareReviewPhoto";
import { REVIEW_PHOTO_LIMIT } from "@/lib/reviewPhotos";

export default function ReviewPhotoInput({ files, onChange, disabled, onBusyChange }: {
  files: File[]; onChange: (files: File[]) => void; disabled: boolean; onBusyChange: (busy: boolean) => void;
}) {
  const t = useTranslations("productPage.reviews");
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [preparing, setPreparing] = useState(false);
  const previews = useMemo(() => files.map(file => URL.createObjectURL(file)), [files]);
  useEffect(() => () => previews.forEach(url => URL.revokeObjectURL(url)), [previews]);
  return <div>
    <label htmlFor={id} className="mb-2 block text-[14px] font-medium">{t("photosLabel")}</label>
    <p id={`${id}-help`} className="mb-2 text-[12px] text-fg/65">{t("photosHelp")}</p>
    <input ref={input} id={id} type="file" accept="image/jpeg,image/png,image/webp" multiple
      disabled={disabled || preparing || files.length >= REVIEW_PHOTO_LIMIT} aria-describedby={`${id}-help ${id}-error`}
      className="hidden" tabIndex={-1} aria-hidden="true"
      onChange={async event => {
        const selected = Array.from(event.currentTarget.files || []);
        event.currentTarget.value = "";
        if (!selected.length) return;
        setError("");
        if (files.length + selected.length > REVIEW_PHOTO_LIMIT) { setError(t("photosLimit")); return; }
        setPreparing(true); onBusyChange(true);
        try { onChange([...files, ...await Promise.all(selected.map(prepareReviewPhoto))]); }
        catch { setError(t("photosError")); }
        finally { setPreparing(false); onBusyChange(false); }
      }} />
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={() => input.current?.click()} disabled={disabled || preparing || files.length >= REVIEW_PHOTO_LIMIT}
        aria-describedby={`${id}-help ${id}-error`}
        className="min-h-11 shrink-0 rounded-xl bg-yellow px-4 py-2 text-[14px] font-medium text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 disabled:opacity-50">
        {t("choosePhotos")}
      </button>
      <span aria-live="polite" className="text-[13px] text-fg/65">
        {files.length ? t("selectedPhotos", { count: files.length }) : t("noPhotosSelected")}
      </span>
    </div>
    {preparing ? <p role="status" className="mt-2 text-[12px]">{t("photosPreparing")}</p> : null}
    <ul className="mt-3 flex flex-wrap gap-3">
      {previews.map((url, index) => <li key={url} className="relative">
        <Image src={url} alt={t("photoNumber", { number: index + 1 })} unoptimized width={80} height={80} className="size-20 rounded-lg object-cover" />
        <button type="button" disabled={disabled || preparing} onClick={() => { onChange(files.filter((_, i) => i !== index)); setError(""); }}
          aria-label={t("removePhoto", { number: index + 1 })} className="absolute -right-2 -top-2 flex size-8 items-center justify-center rounded-full border border-fg/20 bg-surface font-bold">×</button>
      </li>)}
    </ul>
    <p id={`${id}-error`} role={error ? "alert" : undefined} className="mt-1 text-[12px] text-inputError">{error}</p>
  </div>;
}
