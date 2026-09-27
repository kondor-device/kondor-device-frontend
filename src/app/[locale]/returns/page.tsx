import Returns from "@/components/returnsPage/Returns";
import type { Metadata } from "next";
import { Locale } from "@/types/locale";
import { getPageAlternates } from "@/utils/getPageAlternates";

type PageProps = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: getPageAlternates(locale, "/returns"),
  };
}

export default function ReturnsPage() {
  return (
    <div className="pt-[60px] tabxl:pt-[113px]">
      <Returns />
    </div>
  );
}
