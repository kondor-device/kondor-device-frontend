import React from "react";
import SocialLinkItem from "./SocialLinkItem";

interface SocialLinksListProps {
  className?: string;
}

export default function SocialLinksList({
  className = "",
}: SocialLinksListProps) {
  const socialLinksList = [
    {
      name: "instagram",
      url: "https://www.instagram.com/kondor.ua",
    },
    {
      name: "telegram",
      url: "https://t.me/kondor_device",
    },
  ];

  return (
    <ul className={`flex items-center gap-8 ${className}`}>
      {socialLinksList.map((social, idx) => (
        <SocialLinkItem key={idx} social={social} />
      ))}
    </ul>
  );
}
