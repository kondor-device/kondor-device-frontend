import HeaderDesk from "./HeaderDesk";
import HeaderMob from "./headerMob/HeaderMob";
import { CategoryItem } from "@/types/categoryItem";

interface HeaderProps {
  categories: CategoryItem[];
}

export default function Header({ categories }: HeaderProps) {
  return (
    <header className="fixed z-[60] top-0 inset-x-0">
      <HeaderDesk categories={categories} />
      <HeaderMob categories={categories} />
    </header>
  );
}
