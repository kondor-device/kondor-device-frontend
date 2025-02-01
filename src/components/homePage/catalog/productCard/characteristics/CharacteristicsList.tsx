import React from "react";
import { Characteristic } from "@/types/productItem";
import CharacteristicItem from "./CharacteristicItem";

interface CharacteristicsListProps {
  characteristics: Characteristic[];
}

export default function CharacteristicsList({
  characteristics,
}: CharacteristicsListProps) {
  return (
    <ul className="flex flex-col gap-y-5 laptop:gap-y-[8px]">
      {characteristics.map((characteristicItem, idx) => (
        <CharacteristicItem key={idx} characteristicItem={characteristicItem} />
      ))}
    </ul>
  );
}
