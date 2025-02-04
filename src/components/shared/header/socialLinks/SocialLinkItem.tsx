"use client";
import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";

interface SocialLinkItemProps {
  social: { name: string; url: string };
  className?: string;
  setIsHeaderMenuOpened?: Dispatch<SetStateAction<boolean>>;
}

export default function SocialLinkItem({
  social,
  className = "",
  setIsHeaderMenuOpened,
}: SocialLinkItemProps) {
  const { name, url } = social;

  const onSocialLinkClick = () => {
    if (setIsHeaderMenuOpened) {
      setIsHeaderMenuOpened(false);
    }
  };

  return (
    <li className={className} onClick={onSocialLinkClick}>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        aria-label={name}
        className="group outline-none"
      >
        <Image
          src={`/images/icons/${name}.svg`}
          alt={name}
          width="55"
          height="55"
          className="group-active:brightness-110 group-focus:brightness-110 laptop:group-hover:brightness-[115%] transition duration-300 ease-out"
        />
      </a>
    </li>
  );
}
