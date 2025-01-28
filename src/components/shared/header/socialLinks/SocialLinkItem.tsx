import Image from "next/image";
import React from "react";

interface SocialLinkItemProps {
  social: { name: string; url: string };
  className?: string;
}

export default function SocialLinkItem({
  social,
  className = "",
}: SocialLinkItemProps) {
  const { name, url } = social;

  return (
    <li className={className}>
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
