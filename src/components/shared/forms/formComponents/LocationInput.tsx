"use client";

import Image from "next/image";
import CustomizedInput from "@/components/shared/forms/formComponents/CustomizedInput";
import { FormikProps } from "formik";
import { ValuesCheckoutFormType } from "@/components/homePage/catalog/checkout/CheckoutPopUp";

interface Option {
  key: string;
  description: string;
}

interface LocationInputProps {
  fieldName: string;
  label: string;
  placeholder: string;
  formik: FormikProps<ValuesCheckoutFormType>;
  options: Option[];
  isLoading: boolean;
  onSelect: (option: Option) => void;
}

export default function LocationInput({
  fieldName,
  label,
  placeholder,
  formik,
  options,
  isLoading,
  onSelect,
}: LocationInputProps) {
  return (
    <div className="relative w-full laptop:w-[49%] deskxl:w-[31.5%]">
      <CustomizedInput
        fieldName={fieldName}
        label={label}
        required
        placeholder={placeholder}
        errors={formik.errors}
        touched={formik.touched}
      />
      {isLoading && (
        <Image
          src="/images/icons/loader.svg"
          alt="loader"
          width={24}
          height={24}
          className="size-5 animate-rotation absolute right-3 top-1/2 transform -translate-y-1/2"
        />
      )}
      {options.length > 0 ? (
        <ul
          className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-grey rounded-lg max-h-[270px] overflow-auto z-10 
        text-12med laptop:text-14med deskxl:text-18med scrollbar scrollbar-w-[2px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full 
        scrollbar-thumb-yellow scrollbar-track-transparent popup-scroll"
        >
          {options.map((item) => (
            <li
              key={item.key}
              className="p-2 cursor-pointer hover:bg-lightGrey"
              onClick={() => onSelect(item)}
            >
              {item.description}
            </li>
          ))}
        </ul>
      ) : (
        <div
          className="absolute top-[calc(100%+4px)] left-0 z-10 w-full bg-white border border-grey rounded-lg py-5 px-2 text-grey text-center
        text-12med laptop:text-14med deskxl:text-18med"
        >
          Нічого не знайдено
        </div>
      )}
    </div>
  );
}
