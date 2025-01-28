import React from "react";
import Image from "next/image";
import StagesList from "./StagesList";

export default function Stages() {
  return (
    <div className="flex gap-x-[14px] laptop:gap-x-[30px]">
      <Image
        src="/images/bgImages/homeOrderConditions/stages.svg"
        alt="stages"
        width="56"
        height="619"
        className="w-auto h-[320px] laptop:h-[500px] desk:h-[619px]"
      />
      <StagesList />
    </div>
  );
}
