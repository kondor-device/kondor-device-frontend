import React, { Dispatch, SetStateAction } from "react";
import SocialLinkItem from "./SocialLinkItem";
import { INSTAGRAM_URL, TELEGRAM_URL } from "@/constants/constants";

interface SocialLinksListProps {
  className?: string;
  setIsHeaderMenuOpened?: Dispatch<SetStateAction<boolean>>;
}

export default function SocialLinksList({
  className = "",
  setIsHeaderMenuOpened,
}: SocialLinksListProps) {
  const socialLinksList = [
    {
      name: "instagram",
      url: INSTAGRAM_URL,
    },
    {
      name: "telegram",
      url: TELEGRAM_URL,
    },
  ];

  return (
    <ul className={`flex items-center gap-8 ${className}`}>
      {socialLinksList.map((social, idx) => (
        <SocialLinkItem
          key={idx}
          social={social}
          setIsHeaderMenuOpened={setIsHeaderMenuOpened}
        />
      ))}
    </ul>
  );
}
