import { ProductItem } from "@/types/productItem";
import ImagePicker from "./ImagePicker";
import ColorPicker from "./ColorPicker";
import Characteristics from "./Characteristics";
import Complect from "./Complect";
import ReactPlayer from "react-player";
import { useTranslations } from "next-intl";

interface ProductInfoProps {
  product: ProductItem;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const t = useTranslations("productPage");
  const { video } = product;

  console.log(product);

  return (
    <div className="container max-w-[1920px]">
      <ImagePicker />
      <ColorPicker />
      <Characteristics />
      {video ? (
        <div className="mb-4 tab:mb-0 p-5 desk:py-[56px] desk:px-[76px] bg-white rounded-[20px] desk:rounded-[30px] shadow-catalogCard">
          <h3 className="mb-5 text-14bold desk:text-24bold">{t("see")}</h3>
          <div className="rounded-[20px] overflow-hidden">
            <ReactPlayer src={video?.url} width="100%" height="auto" controls />
          </div>
        </div>
      ) : null}
      <Complect />
    </div>
  );
}
