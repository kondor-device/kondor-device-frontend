import React from "react";

interface CardTitleProps {
  name: string;
  generalname: string;
}

export default function CardTitle({ name, generalname }: CardTitleProps) {
  return (
    <h3 className="mb-[5px] tabxl:mb-[10px] text-12bold tabxl:text-32bold deskxl:text-36med">
      <p className="text-white">{generalname}&nbsp;</p>
      <p className="text-yellow">{name}</p>
    </h3>
  );
}
