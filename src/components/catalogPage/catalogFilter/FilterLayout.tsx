import { ReactNode } from "react";

interface FilterLayoutProps {
  title?: string;
  children: ReactNode;
}

const FilterLayout = ({ title, children }: FilterLayoutProps) => {
  return (
    <div className="mb-8">
      {title && (
        <p className="text-[14px] desk:text-[24px] font-bold mb-6">{title}</p>
      )}
      {children}
    </div>
  );
};

export default FilterLayout;
