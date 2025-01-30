import React from "react";
import CatalogSlider from "./CatalogSlider";

export default function Catalog() {
  return (
    <section
      id="catalog"
      className="pt-[60px] laptop:pt-[100px] scroll-mt-8 tabxl:scroll-mt-[63px]"
    >
      <CatalogSlider />
    </section>
  );
}
