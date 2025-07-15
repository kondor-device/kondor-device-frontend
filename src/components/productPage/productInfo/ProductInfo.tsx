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
  
  const { video, description, chars, complect } = product;

  const html = description
    // 1. Списки: перетворюємо рядки, що починаються з "* ", на <li>...</li>
    .replace(/(?:^|\n)\* (.+)/g, "<li>$1</li>")
    // 2. Обгортаємо всі <li> в один <ul> — якщо є, додаємо перенос перед списком
    .replace(/((?:<li>.*?<\/li>\n?)+)/g, "\n<ul class='list-disc pl-6'>$1</ul>")
    // 2.5 Видаляємо переноси після </ul>, щоб не було зайвих <br> після списку
    .replace(/<\/ul>\n+/g, "</ul>")
    // 3. Всі залишкові перенос рядків → <br>
    .replace(/\n/g, "<br>");

  return (
    <section className="container max-w-[1920px]">
      <ImagePicker />
      <ColorPicker />
      {description ? (
        <div className="mb-4 tab:mb-8 p-5 desk:py-[56px] desk:px-[76px] bg-white rounded-[20px] desk:rounded-[30px] shadow-catalogCard">
          <h3 className="mb-5 text-14bold desk:text-24bold">
            {t("description")}
          </h3>
          <div
            className="text-12med desk:text-18med"
            dangerouslySetInnerHTML={{ __html: html }}
          ></div>
        </div>
      ) : null}
      <Characteristics characteristics={chars} />
      {video ? (
        <div className="mb-4 tab:mb-0 p-5 desk:py-[56px] desk:px-[76px] bg-white rounded-[20px] desk:rounded-[30px] shadow-catalogCard">
          <h3 className="mb-5 text-14bold desk:text-24bold">{t("see")}</h3>
          <div className="rounded-[20px] overflow-hidden">
            <ReactPlayer src={video?.url} width="100%" height="auto" controls />
          </div>
        </div>
      ) : null}
      {complect ? <Complect complectation={complect} /> : null}
    </section>
  );
}
