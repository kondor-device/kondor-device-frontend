import { ProductItem } from "@/types/productItem";

interface AddonsSlider {
  addons: ProductItem[];
}

export default function AddonsSlider({ addons }: AddonsSlider) {
  console.log(addons);
  return <section>AddonsSlider</section>;
}
