import React from "react";

interface PolicyItemProps {
  policyItem: {
    title: string;
    description: string;
  };
}

export default function PolicyItem({ policyItem }: PolicyItemProps) {
  const { title, description } = policyItem;

  return (
    <li>
      <h2 className="text-12bold laptop:text-24bold">{title}</h2>
      <p className="">{description}</p>
    </li>
  );
}
