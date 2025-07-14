import Image from "next/image";

interface CardTitleProps {
  name: string;
  generalname: string;
}

export default function CardTitle({ name, generalname }: CardTitleProps) {
  return (
    <h3 className="mb-[5px] tabxl:mb-[10px] text-18bold tabxl:text-32bold deskxl:text-36med">
      <p className="text-white line-clamp-1">{generalname}&nbsp;</p>
      <p className="flex gap-x-4 items-center text-yellow line-clamp-1">
        <span>{name}</span>
        <Image
          src="/images/icons/link.svg"
          alt="link icon"
          width={32}
          height={32}
          className="inline-block size-[14px] tabxl:size-8"
        />
      </p>
    </h3>
  );
}
