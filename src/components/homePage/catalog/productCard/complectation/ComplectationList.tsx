import React from "react";
import { ComplectItem } from "@/types/productItem";
import ComplectationItem from "./ComplectattionItem";

interface ComplectationListProps {
  complectation: ComplectItem[];
}

export default function ComplectationList({
  complectation,
}: ComplectationListProps) {
  return (
    <ul className="flex flex-col gap-y-5 laptop:gap-y-[8px]">
      {complectation.map((complectationItem, idx) => (
        <ComplectationItem key={idx} complectation={complectationItem} />
      ))}
    </ul>
  );
}
