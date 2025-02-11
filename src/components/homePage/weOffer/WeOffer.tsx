import React from "react";
import WeOfferList from "./WeOfferList";

const SECTION_ID = "home-page-we-offer";

export default function WeOffer() {
  return (
    <section
      id={SECTION_ID}
      className="container w-full max-w-[1920px] laptop:pt-[50px]"
    >
      <WeOfferList />
    </section>
  );
}
