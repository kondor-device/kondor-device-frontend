import React from "react";

interface CardTitleProps {
  name: string;
  generalname: string;
}

export default function CardTitle({ name, generalname }: CardTitleProps) {
  return (
    <h3 className="mb-[5px] tabxl:mb-[10px] text-18bold tabxl:text-32bold deskxl:text-36med">
      <p className="text-white line-clamp-1">{generalname}&nbsp;</p>
      <p className="text-yellow line-clamp-1">{name}</p>
    </h3>
  );
}
