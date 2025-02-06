import React from "react";
import { ComplectItem } from "@/types/productItem";
import ComplectationItem from "./ComplectattionItem";
import EmptyComplectation from "./EmptyComplectation";

interface ComplectationListProps {
  complectation: ComplectItem[];
}

export default function ComplectationList({
  complectation,
}: ComplectationListProps) {
  return (
    <>
      {complectation.length ? (
        <ul className="flex flex-col gap-y-5 laptop:gap-y-[8px]">
          {complectation.map((complectationItem, idx) => (
            <ComplectationItem key={idx} complectation={complectationItem} />
          ))}
        </ul>
      ) : (
        <EmptyComplectation />
      )}
    </>
  );
}
