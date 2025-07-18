import { useTranslations } from "next-intl";
import ReactPlayer from "react-player";

interface VideoProps {
  video?: { url: string };
  className?: string;
}

export default function Video({ video, className = "" }: VideoProps) {
  const t = useTranslations();

  return (
    <>
      {video ? (
        <div
          id="video"
          className={`mb-4 tab:mb-0 p-5 desk:py-[56px] desk:px-[76px] scroll-mt-[82px] tabxl:scroll-mt-[113px] bg-white rounded-[20px] desk:rounded-[30px] shadow-catalogCard ${className}`}
        >
          <h3 className="mb-5 text-14bold desk:text-24bold">
            {t("productPage.see")}
          </h3>
          <div className="rounded-[20px] overflow-hidden aspect-video">
            <ReactPlayer src={video?.url} width="100%" height="100%" controls />
          </div>
        </div>
      ) : null}
    </>
  );
}
