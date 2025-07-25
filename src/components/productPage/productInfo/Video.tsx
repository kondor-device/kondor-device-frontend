import { useTranslations } from "next-intl";
import ReactPlayer from "react-player";
import AnimationWrapper from "@/components/homePage/hero/AnimationWrapper";

interface VideoProps {
  video?: { url: string };
  className?: string;
}

const VIDEO_ID = "video";

export default function Video({ video, className = "" }: VideoProps) {
  const t = useTranslations();

  return (
    <>
      {video ? (
        <div
          id={VIDEO_ID}
          className={`mb-4 tab:mb-0 p-5 desk:py-[56px] desk:px-[76px]  scroll-mt-[142px] tabxl:scroll-mt-[173px] bg-white rounded-[20px] desk:rounded-[30px] shadow-catalogCard ${className}`}
        >
          <AnimationWrapper
            sectionId={VIDEO_ID}
            commonStyles={`transition duration-700 ease-slow `}
            visibleStyles="opacity-100 translate-x-0"
            unVisibleStyles="opacity-0 -translate-x-[50px]"
          >
            <h3 className="mb-5 text-14bold desk:text-24bold">
              {t("productPage.see")}
            </h3>
          </AnimationWrapper>
          <div className="rounded-[20px] overflow-hidden aspect-video">
            <ReactPlayer src={video?.url} width="100%" height="100%" controls />
          </div>
        </div>
      ) : null}
    </>
  );
}
