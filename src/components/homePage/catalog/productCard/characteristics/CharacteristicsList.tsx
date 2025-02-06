import React from "react";
import { Characteristic } from "@/types/productItem";
import CharacteristicItem from "./CharacteristicItem";
import EmptyCharacteristics from "./EmptyCharacteristics";

interface CharacteristicsListProps {
  characteristics: Characteristic[];
}

export default function CharacteristicsList({
  characteristics,
}: CharacteristicsListProps) {
  return (
    <>
      {characteristics.length ? (
        <ul className="flex flex-col gap-y-5 laptop:gap-y-[8px]">
          {characteristics.map((characteristicItem, idx) => (
            <CharacteristicItem
              key={idx}
              characteristicItem={characteristicItem}
            />
          ))}
        </ul>
      ) : (
        <EmptyCharacteristics />
      )}
    </>
  );
}
